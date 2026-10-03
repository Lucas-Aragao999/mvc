// Mantém a rota de exemplo incluída pelo gerador Express.
var express = require('express');
var router = express.Router();

// Responde com o recurso de exemplo para preservar o scaffold inicial.
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
