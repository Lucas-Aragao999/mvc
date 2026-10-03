// Verifica cadastro de categorias, associação e troca de categoria por formulários HTTP.
const test = require('node:test');
const assert = require('node:assert/strict');
process.env.DATABASE_STORAGE = ':memory:';
const app = require('../app');
const { sequelize, Produto, Categoria } = require('../models');

// Exercita categorias válidas e inválidas e garante que alterações persistem no relacionamento.
test('categorias são cadastradas e selecionadas nos produtos', async () => {
  await sequelize.sync();
  const server = app.listen(0, '127.0.0.1');
  try {
    await new Promise(resolve => server.once('listening', resolve));
    const base = `http://127.0.0.1:${server.address().port}`;
    // Envia os campos como um formulário sem seguir o redirecionamento da resposta.
    const enviar = (url, dados) => fetch(base + url, { method: 'POST', redirect: 'manual', body: new URLSearchParams(dados) });
    assert.equal((await fetch(base + '/categorias')).status, 200);
    assert.equal((await enviar('/categorias', { nome: '  ' })).status, 422);
    assert.equal((await enviar('/categorias', { nome: ' Informática ', id: '900' })).status, 303);
    assert.equal((await enviar('/categorias', { nome: 'Escritório' })).status, 303);
    const categorias = await Categoria.findAll({ order: [['id', 'ASC']] });
    assert.equal(categorias.length, 2);
    assert.equal(categorias[0].nome, 'Informática');
    assert.equal(await Categoria.findByPk(900), null);
    const form = await (await fetch(base + '/produtos/novo')).text();
    assert.match(form, /name="categoriaId"/);
    assert.match(form, /Informática/);
    const dados = { nome: 'Mouse', preco: '20', quantidade: '1', categoriaId: String(categorias[0].id) };
    for (const categoriaId of ['', 'abc', '-1', '99999', '1x']) {
      assert.equal((await enviar('/produtos', { ...dados, categoriaId })).status, 422);
    }
    assert.equal(await Produto.count(), 0);
    assert.equal((await enviar('/produtos', dados)).status, 303);
    const produto = await Produto.findOne();
    assert.equal(produto.categoriaId, categorias[0].id);
    assert.match(await (await fetch(base + '/produtos')).text(), /Informática/);
    const editar = await (await fetch(`${base}/produtos/${produto.id}/editar`)).text();
    assert.match(editar, new RegExp(`value="${categorias[0].id}" selected`));
    assert.equal((await enviar(`/produtos/${produto.id}`, { ...dados, categoriaId: '99999' })).status, 422);
    assert.equal((await Produto.findByPk(produto.id)).categoriaId, categorias[0].id);
    assert.equal((await enviar(`/produtos/${produto.id}`, { ...dados, categoriaId: String(categorias[1].id) })).status, 303);
    const atualizado = await Produto.findByPk(produto.id, { include: 'Categoria' });
    assert.equal(atualizado.Categoria.nome, 'Escritório');
    await assert.rejects(Produto.create({ ...dados, categoriaId: 99999 }), /FOREIGN KEY/);
  } finally {
    await new Promise(resolve => server.close(resolve));
    await sequelize.close();
  }
});
