// Expõe contratos JSON do catálogo para o painel React usando os mesmos models e validações do MVC.
const express = require('express');
const createError = require('http-errors');
const { Op } = require('sequelize');
const { Produto, Categoria } = require('../models');
const { validar, buscar } = require('../services/produtos');
const router = express.Router();

// Centraliza captura assíncrona para que falhas cheguem ao tratamento JSON do Express.
function executar(acao) {
  return async function(req, res, next) {
    try { await acao(req, res); } catch (error) { next(error); }
  };
}

// Consulta produtos por nome e categoria, verificando a existência do filtro informado.
router.get('/produtos', executar(async function(req, res) {
  const where = {};
  if (typeof req.query.busca === 'string' && req.query.busca.trim()) where.nome = { [Op.like]: `%${req.query.busca.trim()}%` };
  if (req.query.categoriaId !== undefined && req.query.categoriaId !== '') {
    const id = req.query.categoriaId;
    if (typeof id !== 'string' || !/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id)) || !await Categoria.findByPk(id)) throw createError(404, 'Categoria não encontrada.');
    where.categoriaId = id;
  }
  res.json({ dados: await Produto.findAll({ where, include: 'Categoria', order: [['id', 'ASC']] }) });
}));

// Recupera um produto existente para preencher o formulário de edição.
router.get('/produtos/:id', executar(async function(req, res) {
  res.json({ dados: await buscar(req.params.id) });
}));

// Valida os campos recebidos e cria um produto, ignorando atributos não permitidos.
router.post('/produtos', executar(async function(req, res) {
  const { produto, erros, campos } = await validar(req.body);
  if (erros.length) return res.status(422).json({ mensagem: 'Confira os dados informados.', erros: campos });
  res.status(201).json({ dados: await Produto.create(produto) });
}));

// Mescla alterações parciais com o registro e valida o resultado antes de persistir.
router.patch('/produtos/:id', executar(async function(req, res) {
  const existente = await buscar(req.params.id);
  const { produto, erros, campos } = await validar({ ...existente.get({ plain: true }), ...req.body });
  if (erros.length) return res.status(422).json({ mensagem: 'Confira os dados informados.', erros: campos });
  res.json({ dados: await existente.update(produto) });
}));

// Remove apenas o produto solicitado e retorna uma resposta sem corpo.
router.delete('/produtos/:id', executar(async function(req, res) {
  await (await buscar(req.params.id)).destroy();
  res.status(204).end();
}));

// Retorna categorias ordenadas para a navegação e o seletor dos formulários.
router.get('/categorias', executar(async function(req, res) {
  res.json({ dados: await Categoria.findAll({ order: [['nome', 'ASC']] }) });
}));

// Aceita somente nome preenchido para cadastrar uma categoria do catálogo.
router.post('/categorias', executar(async function(req, res) {
  const nome = typeof req.body?.nome === 'string' ? req.body.nome.trim() : '';
  if (!nome) return res.status(422).json({ mensagem: 'Confira os dados informados.', erros: { nome: 'Informe o nome da categoria.' } });
  res.status(201).json({ dados: await Categoria.create({ nome }) });
}));

// Mantém URLs desconhecidas da API em JSON, sem acionar páginas ou fallback do painel.
router.use(function(req, res) { res.status(404).json({ mensagem: 'Recurso não encontrado.' }); });
module.exports = router;
