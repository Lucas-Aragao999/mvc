// Verifica a evolução de um banco anterior às categorias sem perder os produtos existentes.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { Sequelize } = require('sequelize');

// Cria o esquema antigo e executa a migração duas vezes para conferir preservação e idempotência.
test('migração associa produtos antigos a Sem categoria e preserva os dados', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'mvc-migracao-'));
  const storage = path.join(directory, 'test.sqlite');
  const antigo = new Sequelize({ dialect: 'sqlite', storage, logging: false });
  await antigo.query('CREATE TABLE Produtos (id INTEGER PRIMARY KEY AUTOINCREMENT, nome VARCHAR(255) NOT NULL, preco DECIMAL(10,2) NOT NULL, quantidade INTEGER NOT NULL DEFAULT 0, createdAt DATETIME NOT NULL, updatedAt DATETIME NOT NULL)');
  await antigo.query('INSERT INTO Produtos (nome, preco, quantidade, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)', { replacements: ['Produto antigo', 42.50, 9, '2026-10-02 00:00:00', '2026-10-02 00:00:00'] });
  await antigo.close();
  process.env.DATABASE_STORAGE = storage;
  const { sequelize, Produto, Categoria, inicializarBanco } = require('../models');
  try {
    await inicializarBanco();
    await inicializarBanco();
    const produto = await Produto.findByPk(1, { include: 'Categoria' });
    assert.equal(produto.nome, 'Produto antigo');
    assert.equal(Number(produto.preco), 42.50);
    assert.equal(produto.quantidade, 9);
    assert.equal(produto.Categoria.nome, 'Sem categoria');
    assert.equal(await Categoria.count(), 1);
    assert.equal(await Produto.count(), 1);
    const keys = await sequelize.getQueryInterface().getForeignKeyReferencesForTable('Produtos');
    assert.ok(keys.some(key => key.columnName === 'categoriaId' && key.referencedTableName === 'Categorias'));
  } finally {
    await sequelize.close();
    await fs.rm(directory, { recursive: true, force: true });
  }
});
