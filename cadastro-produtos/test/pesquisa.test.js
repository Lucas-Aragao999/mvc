// Verifica pesquisa por nome parcial e sua combinação com o filtro de categoria.
const test = require('node:test');
const assert = require('node:assert/strict');
process.env.DATABASE_STORAGE = ':memory:';
const app = require('../app');
const { sequelize, Produto, Categoria } = require('../models');

// Exercita a pesquisa GET, termo vazio e mensagens usando registros isolados em SQLite.
test('pesquisa encontra nomes parciais e respeita categoria', async () => {
  await sequelize.sync();
  const [a, b] = await Categoria.bulkCreate([{ nome: 'Categoria A' }, { nome: 'Categoria B' }]);
  await Produto.bulkCreate([
    { nome: 'Mouse sem fio', preco: 30, categoriaId: a.id },
    { nome: 'Teclado USB', preco: 50, categoriaId: a.id },
    { nome: 'Mouse gamer', preco: 90, categoriaId: b.id }
  ]);
  const server = app.listen(0, '127.0.0.1');
  try {
    await new Promise(resolve => server.once('listening', resolve));
    const base = `http://127.0.0.1:${server.address().port}/produtos`;
    const response = await fetch(base + '?busca=ouse');
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, /Mouse sem fio/);
    assert.match(html, /Mouse gamer/);
    assert.doesNotMatch(html, /Teclado USB/);
    assert.match(html, /name="busca"/);
    assert.match(html, /value="ouse"/);
    const vazio = await (await fetch(base + '?busca=inexistente')).text();
    assert.match(vazio, /Nenhum produto encontrado para esta pesquisa/);
    for (const query of ['?busca=', '?busca=%20%20', '?busca[]=mouse']) {
      const todos = await (await fetch(base + query)).text();
      assert.match(todos, /Teclado USB/);
      assert.match(todos, /Mouse gamer/);
    }
    const categoria = await (await fetch(`${base}/categoria/${a.id}?busca=mouse`)).text();
    assert.match(categoria, /Mouse sem fio/);
    assert.doesNotMatch(categoria, /Mouse gamer/);
    assert.doesNotMatch(categoria, /Teclado USB/);
    assert.match(categoria, new RegExp(`action="/produtos/categoria/${a.id}"`));
    const semBusca = await (await fetch(`${base}/categoria/${a.id}?busca=`)).text();
    assert.match(semBusca, /Teclado USB/);
    const especial = await fetch(base + '?busca=' + encodeURIComponent("' OR 1=1 --"));
    assert.equal(especial.status, 200);
    assert.match(await especial.text(), /Nenhum produto encontrado/);
  } finally {
    await new Promise(resolve => server.close(resolve));
    await sequelize.close();
  }
});
