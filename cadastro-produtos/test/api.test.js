// Verifica os contratos JSON usados pelo painel sem alterar o banco local.
const test = require('node:test');
const assert = require('node:assert/strict');
process.env.DATABASE_STORAGE = ':memory:';
const app = require('../app');
const { sequelize, Produto } = require('../models');

// Exercita CRUD JSON, filtros, validação, erros e isolamento em relação às páginas EJS.
test('API JSON mantém CRUD e validações do painel', async () => {
  await sequelize.sync();
  const server = app.listen(0, '127.0.0.1');
  try {
    await new Promise(resolve => server.once('listening', resolve));
    const base = `http://127.0.0.1:${server.address().port}`;
    // Envia JSON e preserva a resposta original para conferir status e corpo.
    const enviar = (url, method, body) => fetch(base + url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    let response = await enviar('/api/categorias', 'POST', { nome: '  ' });
    assert.equal(response.status, 422);
    response = await enviar('/api/categorias', 'POST', { nome: 'Informática', id: 99 });
    assert.equal(response.status, 201);
    const categoria = (await response.json()).dados;
    assert.notEqual(categoria.id, 99);
    assert.equal((await (await fetch(base + '/api/categorias')).json()).dados.length, 1);
    for (const body of [
      { nome: '', preco: 10, quantidade: 1, categoriaId: categoria.id },
      { nome: 'Mouse', preco: '', quantidade: 1, categoriaId: categoria.id },
      { nome: 'Mouse', preco: 10, quantidade: 1.5, categoriaId: categoria.id },
      { nome: 'Mouse', preco: 10, quantidade: 1, categoriaId: 99999 }
    ]) {
      response = await enviar('/api/produtos', 'POST', body);
      assert.equal(response.status, 422);
      assert.ok((await response.json()).erros);
    }
    assert.equal(await Produto.count(), 0);
    response = await enviar('/api/produtos', 'POST', { nome: 'Mouse USB', preco: 25.90, quantidade: 5, categoriaId: categoria.id, id: 99 });
    assert.equal(response.status, 201);
    const produto = (await response.json()).dados;
    assert.notEqual(produto.id, 99);
    assert.equal((await (await fetch(`${base}/api/produtos/${produto.id}`)).json()).dados.nome, 'Mouse USB');
    const lista = await (await fetch(`${base}/api/produtos?busca=ouse&categoriaId=${categoria.id}`)).json();
    assert.equal(lista.dados[0].Categoria.nome, 'Informática');
    assert.equal((await (await fetch(base + '/api/produtos?busca=semresultado')).json()).dados.length, 0);
    assert.equal((await fetch(base + '/api/produtos?categoriaId=99999')).status, 404);
    response = await enviar(`/api/produtos/${produto.id}`, 'PATCH', { quantidade: 7, id: 999 });
    assert.equal(response.status, 200);
    assert.equal((await response.json()).dados.quantidade, 7);
    assert.equal((await Produto.findByPk(produto.id)).nome, 'Mouse USB');
    assert.equal((await enviar(`/api/produtos/${produto.id}`, 'PATCH', { preco: -1 })).status, 422);
    assert.equal((await enviar(`/api/produtos/${produto.id}`, 'DELETE')).status, 204);
    assert.equal(await Produto.count(), 0);
    for (const url of ['/api/produtos/abc', '/api/produtos/99999', '/api/desconhecida']) {
      response = await fetch(base + url);
      assert.equal(response.status, 404);
      assert.match(response.headers.get('content-type'), /application\/json/);
      assert.ok((await response.json()).mensagem);
    }
    response = await fetch(base + '/api/produtos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' });
    assert.equal(response.status, 400);
    assert.match(response.headers.get('content-type'), /application\/json/);
  } finally {
    await new Promise(resolve => server.close(resolve));
    await sequelize.close();
  }
});
