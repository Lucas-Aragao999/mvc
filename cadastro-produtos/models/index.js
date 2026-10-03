// Define a conexão SQLite e o Produto compartilhados pela aplicação MVC.
const path = require('node:path');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DATABASE_STORAGE || path.join(__dirname, '..', 'database.sqlite'),
  logging: false
});

const Produto = sequelize.define('Produto', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      // Rejeita nomes compostos apenas de espaços para manter o cadastro identificável.
      preenchido(value) {
        if (!value.trim()) throw new Error('O nome é obrigatório.');
      }
    }
  },
  preco: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { isDecimal: true, min: 0 }
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: { isInt: true, min: 0 }
  }
});

module.exports = { sequelize, Produto };
