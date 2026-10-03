// Configura o Express, as páginas EJS, os arquivos estáticos e o tratamento de erros.
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var produtosRouter = require('./routes/produtos');
var categoriasRouter = require('./routes/categorias');

var app = express();

// Define onde ficam as páginas e usa EJS para renderizá-las.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', require('./routes/api'));
app.use('/painel', express.static(path.join(__dirname, 'frontend', 'dist')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/produtos', produtosRouter);
app.use('/categorias', categoriasRouter);

// Encaminha URLs sem rota para o tratamento centralizado de erros.
app.use(function(req, res, next) {
  next(createError(404));
});

// Renderiza os erros para encerrar a requisição e restringe detalhes ao desenvolvimento.
app.use(function(err, req, res, next) {
  // Responde falhas da API em JSON e limita mensagens internas e detalhes de diagnóstico.
  if (req.path === '/api' || req.path.startsWith('/api/')) {
    const status = err.status || 500;
    return res.status(status).json({ mensagem: status >= 500 ? 'Não foi possível concluir a operação. Tente novamente.' : status === 400 ? 'JSON inválido.' : err.message });
  }
  // Expõe o diagnóstico completo somente no ambiente de desenvolvimento.
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Responde com o código HTTP adequado e a página de erro.
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
