// Disponibiliza cadastro e listagem de categorias, sem edição ou exclusão nesta etapa.
const express = require('express');
const createError = require('http-errors');
const { Categoria } = require('../models');
const router = express.Router();

// Consulta as categorias e renderiza a página com o formulário e a listagem.
router.get('/', async function(req, res, next) {
  try {
    const categorias = await Categoria.findAll({ order: [['nome', 'ASC']] });
    res.render('categorias/index', { categorias, nome: '', erros: [] });
  } catch (error) {
    next(createError(500, 'Não foi possível acessar as categorias. Tente novamente.'));
  }
});

// Valida e salva apenas o nome informado, reapresentando o formulário em caso de erro.
router.post('/', async function(req, res, next) {
  try {
    const nome = typeof req.body.nome === 'string' ? req.body.nome.trim() : '';
    if (!nome) {
      const categorias = await Categoria.findAll({ order: [['nome', 'ASC']] });
      return res.status(422).render('categorias/index', { categorias, nome, erros: ['Informe o nome da categoria.'] });
    }
    await Categoria.create({ nome });
    res.redirect(303, '/categorias');
  } catch (error) {
    next(createError(500, 'Não foi possível salvar a categoria. Tente novamente.'));
  }
});

module.exports = router;
