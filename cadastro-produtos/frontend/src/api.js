// Centraliza requisições JSON e transforma falhas em mensagens utilizáveis pelos formulários.
export async function api(path, options = {}) {
  const response = await fetch('/api' + path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
    body: options.body === undefined ? undefined : JSON.stringify(options.body)
  });
  if (response.status === 204) return null;
  const body = await response.json();
  if (!response.ok) {
    const error = new Error(body.mensagem || 'Não foi possível concluir a operação.');
    error.campos = body.erros || {};
    throw error;
  }
  return body.dados;
}
