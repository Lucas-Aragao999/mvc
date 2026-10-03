// Implementa o CRUD MVC de produtos com validação dos formulários e acesso pelo Sequelize.
const express = require('express');
const createError = require('http-errors');
const { Produto } = require('../models');
const router = express.Router();

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

// Seleciona apenas campos permitidos e valida números antes de qualquer gravação no banco.
function validar(body) {
  const produto = {
    nome: typeof body.nome === 'string' ? body.nome.trim() : '',
    preco: typeof body.preco === 'string' ? body.preco.trim() : '',
    quantidade: typeof body.quantidade === 'string' ? body.quantidade.trim() : ''
  };
  const erros = [];
  if (!produto.nome) erros.push('Informe o nome do produto.');
  if (!/^\d+(\.\d{1,2})?$/.test(produto.preco) || !Number.isFinite(Number(produto.preco))) {
    erros.push('Informe um preço não negativo com até duas casas decimais.');
  }
  if (!/^\d+$/.test(produto.quantidade) || !Number.isSafeInteger(Number(produto.quantidade))) {
    erros.push('Informe uma quantidade inteira não negativa.');
  }
  return { produto, erros };
}

// Busca um ID inteiro válido e responde 404 quando o produto não está disponível.
async function buscar(id) {
  if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) {
    throw createError(404, 'Produto não encontrado.');
  }
  const produto = await Produto.findByPk(id);
  if (!produto) throw createError(404, 'Produto não encontrado.');
  return produto;
}

// Lista os produtos em ordem de cadastro para permitir acessar edição e exclusão.
router.get('/', executar(async function(req, res) {
  const produtos = await Produto.findAll({ order: [['id', 'ASC']] });
  res.render('produtos/index', { produtos });
}));

// Abre o formulário com quantidade zero para iniciar um cadastro.
router.get('/novo', function(req, res) {
  res.render('produtos/novo', { produto: { nome: '', preco: '', quantidade: 0 }, erros: [] });
});

// Salva somente dados válidos e redireciona para evitar repetição do envio do formulário.
router.post('/', executar(async function(req, res) {
  const { produto, erros } = validar(req.body);
  if (erros.length) return res.status(422).render('produtos/novo', { produto, erros });
  await Produto.create(produto);
  res.redirect(303, '/produtos');
}));

// Carrega o produto existente no formulário para permitir sua edição.
router.get('/:id/editar', executar(async function(req, res) {
  const produto = await buscar(req.params.id);
  res.render('produtos/editar', { produto, erros: [] });
}));

// Atualiza os campos permitidos e preserva os valores enviados quando a validação falha.
router.post('/:id', executar(async function(req, res) {
  const existente = await buscar(req.params.id);
  const { produto, erros } = validar(req.body);
  if (erros.length) {
    return res.status(422).render('produtos/editar', { produto: { ...produto, id: existente.id }, erros });
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
