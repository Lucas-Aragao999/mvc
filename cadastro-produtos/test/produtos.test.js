// Exercita o CRUD por HTTP com SQLite isolado para validar formulários e gravações.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { Sequelize } = require('sequelize');

// Verifica cadastro, listagem, edição, exclusão e erros sem modificar o banco local.
test('CRUD de produtos valida dados e trata falhas', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'mvc-crud-'));
  process.env.DATABASE_STORAGE = path.join(directory, 'test.sqlite');
  const app = require('../app');
  const { sequelize, Produto } = require('../models');
  let fechado = false;
  await sequelize.sync();
  const server = app.listen(0, '127.0.0.1');
  try {
    await new Promise(resolve => server.once('listening', resolve));
    const base = `http://127.0.0.1:${server.address().port}/produtos`;
    // Envia formulários como o navegador, sem seguir redirects para conferir o resultado da operação.
    const enviar = (url, dados) => fetch(url, {
      method: 'POST', redirect: 'manual', body: new URLSearchParams(dados)
    });
    assert.match(await (await fetch(base)).text(), /Nenhum produto cadastrado/);
    assert.equal((await fetch(`${base}/novo`)).status, 200);
    for (let i = 1; i <= 5; i++) {
      const response = await enviar(base, { nome: `Produto ${i}`, preco: '12.50', quantidade: '2', id: '900', inesperado: 'ignorar' });
      assert.equal(response.status, 303);
      assert.equal(response.headers.get('location'), '/produtos');
    }
    assert.equal(await Produto.count(), 5);
    assert.equal(await Produto.findByPk(900), null);
    const primeiro = await Produto.findOne({ order: [['id', 'ASC']] });
    assert.match(await (await fetch(base)).text(), /Produto 5/);
    assert.match(await (await fetch(`${base}/${primeiro.id}/editar`)).text(), /Produto 1/);
    for (const dados of [
      { nome: ' ', preco: '1', quantidade: '1' },
      { nome: 'Inválido', preco: '', quantidade: '1' },
      { nome: 'Inválido', preco: '-1', quantidade: '1' },
      { nome: 'Inválido', preco: 'Infinity', quantidade: '1' },
      { nome: 'Inválido', preco: '1', quantidade: '1.5' },
      { nome: 'Inválido', preco: '1', quantidade: '-1' },
      { nome: 'Inválido', preco: '1', quantidade: '' }
    ]) {
      assert.equal((await enviar(base, dados)).status, 422);
      assert.equal((await enviar(`${base}/${primeiro.id}`, dados)).status, 422);
    }
    assert.equal(await Produto.count(), 5);
    assert.equal((await Produto.findByPk(primeiro.id)).nome, 'Produto 1');
    assert.equal((await enviar(`${base}/${primeiro.id}`, { nome: '<script>nome</script>', preco: '20.75', quantidade: '3' })).status, 303);
    assert.equal((await Produto.findByPk(primeiro.id)).quantidade, 3);
    const html = await (await fetch(base)).text();
    assert.match(html, /&lt;script&gt;/);
    assert.doesNotMatch(html, /<script>nome/);
    assert.equal((await enviar(`${base}/${primeiro.id}/deletar`, {})).status, 303);
    assert.equal(await Produto.count(), 4);
    const segundo = await Produto.findOne({ order: [['id', 'ASC']] });
    assert.equal((await enviar(`${base}/${segundo.id}`, { nome: 'Produto atualizado', preco: '30.25', quantidade: '7' })).status, 303);
    for (const id of ['99999', 'abc', '1xyz', '-1']) {
      assert.equal((await fetch(`${base}/${id}/editar`)).status, 404);
      assert.equal((await enviar(`${base}/${id}`, {})).status, 404);
      assert.equal((await enviar(`${base}/${id}/deletar`, {})).status, 404);
    }
    await sequelize.close();
    fechado = true;
    const reaberto = new Sequelize({ dialect: 'sqlite', storage: process.env.DATABASE_STORAGE, logging: false });
    try {
      const [rows] = await reaberto.query('SELECT nome, preco, quantidade FROM Produtos ORDER BY id');
      assert.equal(rows.length, 4);
      assert.equal(rows[0].nome, 'Produto atualizado');
      assert.equal(Number(rows[0].preco), 30.25);
      assert.equal(rows[0].quantidade, 7);
    } finally {
      await reaberto.close();
    }
    assert.equal((await fetch(base)).status, 500);
    assert.equal((await enviar(base, { nome: 'Mouse', preco: '10', quantidade: '0' })).status, 500);
  } finally {
    await new Promise(resolve => server.close(resolve));
    if (!fechado) await sequelize.close();
    await fs.rm(directory, { recursive: true, force: true });
  }
});
