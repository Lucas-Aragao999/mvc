// Disponibiliza a página inicial da aplicação MVC.
var express = require('express');
var router = express.Router();

// Renderiza a página inicial com o nome do projeto para identificar a aplicação.
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Cadastro de Produtos' });
});

module.exports = router;
