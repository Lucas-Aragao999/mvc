// Compartilha validação e busca entre a API JSON e os controllers EJS.
const createError = require('http-errors');
const { Produto, Categoria } = require('../models');

// Normaliza apenas números e textos para aceitar JSON e formulários sem transformar vazio em zero.
function texto(valor) {
  return typeof valor === 'string' ? valor.trim() : typeof valor === 'number' && Number.isFinite(valor) ? String(valor) : '';
}

// Valida campos permitidos e devolve mensagens por campo para ambas as interfaces.
async function validar(body = {}) {
  body = body || {};
  const produto = { nome: typeof body.nome === 'string' ? body.nome.trim() : '', preco: texto(body.preco), quantidade: texto(body.quantidade), categoriaId: texto(body.categoriaId) };
  const campos = {};
  if (!produto.nome) campos.nome = 'Informe o nome do produto.';
  if (!/^\d+(\.\d{1,2})?$/.test(produto.preco) || !Number.isFinite(Number(produto.preco))) campos.preco = 'Informe um preço não negativo com até duas casas decimais.';
  if (!/^\d+$/.test(produto.quantidade) || !Number.isSafeInteger(Number(produto.quantidade))) campos.quantidade = 'Informe uma quantidade inteira não negativa.';
  if (!/^[1-9]\d*$/.test(produto.categoriaId) || !Number.isSafeInteger(Number(produto.categoriaId)) || !await Categoria.findByPk(produto.categoriaId)) campos.categoriaId = 'Selecione uma categoria existente.';
  if (!Object.keys(campos).length) {
    produto.quantidade = Number(produto.quantidade);
    produto.categoriaId = Number(produto.categoriaId);
  }
  return { produto, erros: Object.values(campos), campos };
}

// Rejeita IDs inválidos antes da consulta e sinaliza 404 para produtos ausentes.
async function buscar(id) {
  if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) throw createError(404, 'Produto não encontrado.');
  const produto = await Produto.findByPk(id);
  if (!produto) throw createError(404, 'Produto não encontrado.');
  return produto;
}

module.exports = { validar, buscar };
