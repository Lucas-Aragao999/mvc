// Implementa o CRUD MVC de produtos com validação dos formulários e acesso pelo Sequelize.
const express = require('express');
const createError = require('http-errors');
const { Op } = require('sequelize');
const { Produto, Categoria } = require('../models');
const router = express.Router();
const { validar, buscar } = require('../services/produtos');

// Encaminha falhas assíncronas ao middleware de erros para toda requisição receber uma resposta.
function executar(acao) {
  return async function(req, res, next) {
    try {
      await acao(req, res);
    } catch (error) {
      next(error.status === 404 ? error : createError(500, 'Não foi possível acessar os produtos. Tente novamente.'));
    }
  };
}

// Lista os produtos em ordem de cadastro para permitir acessar edição e exclusão.
router.get('/', executar(async function(req, res) {
  const busca = typeof req.query.busca === 'string' ? req.query.busca.trim() : '';
  const where = busca ? { nome: { [Op.like]: `%${busca}%` } } : {};
  const produtos = await Produto.findAll({ where, include: 'Categoria', order: [['id', 'ASC']] });
  const categorias = await Categoria.findAll({ order: [['nome', 'ASC']] });
  res.render('produtos/index', { produtos, categorias, categoriaSelecionada: null, busca });
}));

// Valida a categoria e consulta somente seus produtos pela chave estrangeira, reutilizando a listagem.
router.get('/categoria/:categoriaId', executar(async function(req, res) {
  const id = req.params.categoriaId;
  if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) {
    throw createError(404, 'Categoria não encontrada.');
  }
  const categoriaSelecionada = await Categoria.findByPk(id);
  if (!categoriaSelecionada) throw createError(404, 'Categoria não encontrada.');
  const busca = typeof req.query.busca === 'string' ? req.query.busca.trim() : '';
  const where = { categoriaId: categoriaSelecionada.id };
  if (busca) where.nome = { [Op.like]: `%${busca}%` };
  const produtos = await Produto.findAll({ where, include: 'Categoria', order: [['id', 'ASC']] });
  const categorias = await Categoria.findAll({ order: [['nome', 'ASC']] });
  res.render('produtos/index', { produtos, categorias, categoriaSelecionada, busca });
}));

// Abre o formulário com quantidade zero para iniciar um cadastro.
router.get('/novo', executar(async function(req, res) {
  const categorias = await Categoria.findAll({ order: [['nome', 'ASC']] });
  res.render('produtos/novo', { produto: { nome: '', preco: '', quantidade: 0, categoriaId: '' }, categorias, erros: [] });
}));

// Salva somente dados válidos e redireciona para evitar repetição do envio do formulário.
router.post('/', executar(async function(req, res) {
  const { produto, erros } = await validar(req.body);
  if (erros.length) {
    const categorias = await Categoria.findAll({ order: [['nome', 'ASC']] });
    return res.status(422).render('produtos/novo', { produto, categorias, erros });
  }
  await Produto.create(produto);
  res.redirect(303, '/produtos');
}));

// Carrega o produto existente no formulário para permitir sua edição.
router.get('/:id/editar', executar(async function(req, res) {
  const produto = await buscar(req.params.id);
  const categorias = await Categoria.findAll({ order: [['nome', 'ASC']] });
  res.render('produtos/editar', { produto, categorias, erros: [] });
}));

// Atualiza os campos permitidos e preserva os valores enviados quando a validação falha.
router.post('/:id', executar(async function(req, res) {
  const existente = await buscar(req.params.id);
  const { produto, erros } = await validar(req.body);
  if (erros.length) {
    const categorias = await Categoria.findAll({ order: [['nome', 'ASC']] });
    return res.status(422).render('produtos/editar', { produto: { ...produto, id: existente.id }, categorias, erros });
  }
  await existente.update(produto);
  res.redirect(303, '/produtos');
}));

// Exclui o produto identificado por POST e retorna à listagem atualizada.
router.post('/:id/deletar', executar(async function(req, res) {
  const produto = await buscar(req.params.id);
  await produto.destroy();
  res.redirect(303, '/produtos');
}));

module.exports = router;
