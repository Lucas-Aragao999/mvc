// Verifica o armazenamento real e as restrições do Produto usando um banco temporário.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { Sequelize } = require('sequelize');

// Cria e recupera um produto após reabrir o SQLite para confirmar persistência em disco.
test('Produto persiste em SQLite e rejeita dados inválidos', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'mvc-produtos-'));
  process.env.DATABASE_STORAGE = path.join(directory, 'test.sqlite');
  const { sequelize, Produto } = require('../models');
  let reopened;
  try {
    await sequelize.sync();
    const produto = await Produto.create({ nome: 'Mouse', preco: 49.90 });
    assert.equal(produto.quantidade, 0);
    for (const dados of [
      { preco: 10 }, { nome: '', preco: 10 }, { nome: '  ', preco: 10 },
      { nome: 'Mouse' }, { nome: 'Mouse', preco: -1 },
      { nome: 'Mouse', preco: 'abc' },
      { nome: 'Mouse', preco: 10, quantidade: -1 },
      { nome: 'Mouse', preco: 10, quantidade: 1.5 }
    ]) {
      await assert.rejects(Produto.create(dados), /Validation|notNull/i);
    }
    await sequelize.close();
    reopened = new Sequelize({ dialect: 'sqlite', storage: process.env.DATABASE_STORAGE, logging: false });
    const [rows] = await reopened.query('SELECT nome, preco, quantidade FROM Produtos');
    assert.equal(rows.length, 1);
    assert.equal(rows[0].nome, 'Mouse');
    assert.equal(Number(rows[0].preco), 49.90);
    assert.equal(rows[0].quantidade, 0);
  } finally {
    if (reopened) await reopened.close();
    else await sequelize.close();
    await fs.rm(directory, { recursive: true, force: true });
  }
});
