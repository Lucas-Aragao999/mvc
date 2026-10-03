// Verifica a renderização inicial e o tratamento de rotas inexistentes.
const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('../app');

// Usa uma porta livre para verificar as respostas reais do Express sem ocupar a porta de desenvolvimento.
test('aplicação renderiza EJS e responde 404 para rota desconhecida', async () => {
  const server = app.listen(0, '127.0.0.1');
  try {
    await new Promise(resolve => server.once('listening', resolve));
    const base = `http://127.0.0.1:${server.address().port}`;
    const home = await fetch(base);
    assert.equal(home.status, 200);
    assert.match(home.headers.get('content-type'), /text\/html/);
    assert.match(await home.text(), /Cadastro de Produtos/);
    const missing = await fetch(`${base}/rota-inexistente`);
    assert.equal(missing.status, 404);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});
