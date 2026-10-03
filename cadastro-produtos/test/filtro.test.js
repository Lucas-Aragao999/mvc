// Verifica a consulta por categoria e sua atualização após editar o vínculo de um produto.
const test = require('node:test');
const assert = require('node:assert/strict');
process.env.DATABASE_STORAGE = ':memory:';
const app = require('../app');
const { sequelize, Produto, Categoria } = require('../models');

// Testa conjuntos distintos, categoria vazia, IDs inválidos e navegação pelos filtros.
test('filtro retorna somente produtos da categoria escolhida', async () => {
  await sequelize.sync();
  const categorias = await Categoria.bulkCreate([{ nome: 'Informática' }, { nome: 'Escritório' }, { nome: 'Vazia' }]);
  const mouse = await Produto.create({ nome: 'Mouse USB', preco: 20, quantidade: 1, categoriaId: categorias[0].id });
  await Produto.create({ nome: 'Caderno pautado', preco: 10, quantidade: 2, categoriaId: categorias[1].id });
  const server = app.listen(0, '127.0.0.1');
  try {
    await new Promise(resolve => server.once('listening', resolve));
    const base = `http://127.0.0.1:${server.address().port}`;
    // Consulta uma página filtrada como um navegador para conferir status e conteúdo renderizado.
    const filtrar = id => fetch(`${base}/produtos/categoria/${id}`);
    const response = await filtrar(categorias[0].id);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, /Produtos da categoria: Informática/);
    assert.match(html, /Mouse USB/);
    assert.doesNotMatch(html, /Caderno pautado/);
    assert.match(html, /href="\/produtos">Todos os produtos/);
    const segunda = await (await filtrar(categorias[1].id)).text();
    assert.match(segunda, /Caderno pautado/);
    assert.doesNotMatch(segunda, /Mouse USB/);
    const vazia = await filtrar(categorias[2].id);
    assert.equal(vazia.status, 200);
    assert.match(await vazia.text(), /Nenhum produto nesta categoria/);
    for (const id of ['99999', 'abc', '1xyz', '-1', '0']) {
      assert.equal((await filtrar(id)).status, 404);
    }
    const lista = await (await fetch(`${base}/produtos`)).text();
    assert.match(lista, /Mouse USB/);
    assert.match(lista, /Caderno pautado/);
    assert.match(lista, new RegExp(`href="/produtos/categoria/${categorias[0].id}"`));
    const paginaCategorias = await (await fetch(`${base}/categorias`)).text();
    assert.match(paginaCategorias, new RegExp(`href="/produtos/categoria/${categorias[1].id}"`));
    const alteracao = await fetch(`${base}/produtos/${mouse.id}`, {
      method: 'POST', redirect: 'manual', body: new URLSearchParams({ nome: mouse.nome, preco: '20', quantidade: '1', categoriaId: String(categorias[1].id) })
    });
    assert.equal(alteracao.status, 303);
    assert.doesNotMatch(await (await filtrar(categorias[0].id)).text(), /Mouse USB/);
    assert.match(await (await filtrar(categorias[1].id)).text(), /Mouse USB/);
  } finally {
    await new Promise(resolve => server.close(resolve));
    await sequelize.close();
  }
});
