// Verifica persistência após reiniciar o processo real da aplicação com SQLite temporário.
const test = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { Sequelize } = require('sequelize');

// Inicia o servidor em porta livre e resolve somente após a mensagem de banco pronto.
function iniciar(storage) {
  const child = spawn(process.execPath, ['bin/www'], {
    cwd: path.join(__dirname, '..'), env: { ...process.env, PORT: '0', DATABASE_STORAGE: storage }
  });
  const pronto = new Promise((resolve, reject) => {
    let output = '';
    child.stdout.on('data', chunk => {
      output += chunk;
      const match = output.match(/Servidor escutando em port (\d+)/);
      if (match) resolve(`http://127.0.0.1:${match[1]}`);
    });
    child.once('error', reject);
    child.once('exit', code => reject(new Error(`Servidor encerrou antes de iniciar: ${code}`)));
    child.stderr.on('data', chunk => { output += chunk; });
  });
  return { child, pronto };
}

// Encerra somente o processo criado pelo teste e aguarda a liberação do arquivo SQLite.
async function parar(child) {
  if (child.exitCode !== null || child.signalCode !== null) return;
  const terminou = once(child, 'exit');
  child.kill();
  await terminou;
}

// Executa CRUD por HTTP, reinicia o servidor e inspeciona os dados gravados com uma conexão independente.
test('CRUD e categorias permanecem corretos após reiniciar o servidor', { timeout: 20000 }, async (t) => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'mvc-reinicio-'));
  const storage = path.join(directory, 'database.sqlite');
  let processo;
  t.after(async () => {
    if (processo) await parar(processo.child);
    await fs.rm(directory, { recursive: true, force: true });
  });
  processo = iniciar(storage);
  let base = await processo.pronto;
  // Envia formulários ao servidor atual para validar operações persistidas por rotas reais.
  const enviar = (url, dados) => fetch(base + url, { method: 'POST', redirect: 'manual', body: new URLSearchParams(dados) });
  for (const nome of ['Informática', 'Escritório', 'Vazia']) {
    assert.equal((await enviar('/categorias', { nome })).status, 303);
  }
  for (let i = 1; i <= 5; i++) {
    assert.equal((await enviar('/produtos', { nome: `Produto ${i}`, preco: '15.50', quantidade: '2', categoriaId: i <= 3 ? '1' : '2' })).status, 303);
  }
  assert.equal((await enviar('/produtos/1', { nome: 'Mouse atualizado', preco: '25.90', quantidade: '7', categoriaId: '2' })).status, 303);
  assert.equal((await enviar('/produtos/5/deletar', {})).status, 303);
  await parar(processo.child);
  processo = iniciar(storage);
  base = await processo.pronto;
  const html = await (await fetch(base + '/produtos')).text();
  assert.match(html, /Mouse atualizado/);
  assert.match(html, /Produto 4/);
  assert.doesNotMatch(html, /Produto 5/);
  assert.doesNotMatch(await (await fetch(base + '/produtos/categoria/1')).text(), /Mouse atualizado/);
  assert.match(await (await fetch(base + '/produtos/categoria/2?busca=mouse')).text(), /Mouse atualizado/);
  assert.match(await (await fetch(base + '/produtos/categoria/3')).text(), /Nenhum produto nesta categoria/);
  const db = new Sequelize({ dialect: 'sqlite', storage, logging: false });
  try {
    const [rows] = await db.query('SELECT p.id, p.nome, p.preco, p.quantidade, c.nome AS categoria FROM Produtos p JOIN Categorias c ON c.id = p.categoriaId ORDER BY p.id');
    assert.equal(rows.length, 4);
    assert.equal(rows[0].categoria, 'Escritório');
    assert.equal(Number(rows[0].preco), 25.90);
    assert.equal(rows[0].quantidade, 7);
    assert.equal(rows[1].categoria, 'Informática');
    console.log('SQLite após reinício:', JSON.stringify(rows));
  } finally {
    await db.close();
  }
});
