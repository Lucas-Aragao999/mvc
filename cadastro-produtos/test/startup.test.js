// Verifica que uma falha real de banco interrompe a inicialização do servidor.
const test = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const path = require('node:path');

// Usa um diretório como arquivo SQLite para provocar falha e confirmar a saída controlada.
test('servidor encerra quando não consegue inicializar o banco', { timeout: 15000 }, async (t) => {
  const child = spawn(process.execPath, ['bin/www'], {
    cwd: path.join(__dirname, '..'),
    env: { ...process.env, PORT: '0', DATABASE_STORAGE: __dirname }
  });
  t.after(() => child.kill());
  let output = '';
  child.stderr.on('data', chunk => { output += chunk; });
  try {
    const code = await new Promise((resolve, reject) => {
      child.once('error', reject);
      child.once('exit', resolve);
    });
    assert.equal(code, 1);
    assert.match(output, /Falha ao inicializar o banco/);
  } finally {
    child.kill();
  }
});
