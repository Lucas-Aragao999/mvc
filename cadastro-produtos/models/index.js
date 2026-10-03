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

const Categoria = sequelize.define('Categoria', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      // Impede nomes compostos apenas por espaços para identificar cada categoria.
      preenchido(value) {
        if (!value.trim()) throw new Error('O nome da categoria é obrigatório.');
      }
    }
  }
}, { tableName: 'Categorias' });

Categoria.hasMany(Produto, { as: 'Produtos', foreignKey: 'categoriaId', onDelete: 'RESTRICT' });
Produto.belongsTo(Categoria, { as: 'Categoria', foreignKey: 'categoriaId', onDelete: 'RESTRICT' });

// Prepara tabelas e evolui bancos antigos adicionando a associação sem reconstruir ou apagar registros.
async function inicializarBanco() {
  await sequelize.authenticate();
  await sequelize.sync();
  await sequelize.transaction(async function(transaction) {
    const query = sequelize.getQueryInterface();
    const colunas = await query.describeTable('Produtos', { transaction });
    if (!colunas.categoriaId) {
      await query.addColumn('Produtos', 'categoriaId', {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'Categorias', key: 'id' },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      }, { transaction });
    }
    if (await Produto.count({ where: { categoriaId: null }, transaction })) {
      const [categoria] = await Categoria.findOrCreate({ where: { nome: 'Sem categoria' }, transaction });
      await Produto.update({ categoriaId: categoria.id }, { where: { categoriaId: null }, transaction });
    }
  });
}

module.exports = { sequelize, Produto, Categoria, inicializarBanco };
