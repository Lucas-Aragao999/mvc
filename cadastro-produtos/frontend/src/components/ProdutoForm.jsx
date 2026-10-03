// Mantém dados e erros de campo no formulário compartilhado de cadastro e edição.
import { useState } from 'react';
import { api } from '../api.js';

// Envia campos ao backend e reapresenta os erros sem perder os valores informados.
export default function ProdutoForm({ produto, categorias, onSaved, onCancel, onBusy = () => {} }) {
  const [values, setValues] = useState(produto ? { nome: produto.nome, preco: produto.preco, quantidade: produto.quantidade, categoriaId: produto.categoriaId } : { nome: '', preco: '', quantidade: '0', categoriaId: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  // Atualiza apenas o campo editado para preservar os demais valores do formulário.
  function alterar(event) { setValues({ ...values, [event.target.name]: event.target.value }); }
  // Aguarda a gravação e informa ao diálogo quando o fechamento deve ficar bloqueado.
  async function salvar(event) {
    event.preventDefault();
    if (busy) return;
    setBusy(true); onBusy(true); setErrors({}); setMessage('');
    try {
      await api(produto?.id ? `/produtos/${produto.id}` : '/produtos', { method: produto?.id ? 'PATCH' : 'POST', body: values });
      onSaved();
    } catch (error) { setErrors(error.campos || {}); setMessage(error.message); }
    finally { setBusy(false); onBusy(false); }
  }
  return <form onSubmit={salvar} className="product-form">
    <p className="muted">Organize os detalhes do produto no seu catálogo.</p>
    {message && <p className="error-banner" role="alert">{message}</p>}
    <label htmlFor="nome">Nome do produto</label>
    <input id="nome" name="nome" value={values.nome} onChange={alterar} required disabled={busy} placeholder="Ex.: Mouse sem fio" aria-invalid={!!errors.nome} aria-describedby={errors.nome ? 'erro-nome' : undefined} />
    {errors.nome && <small id="erro-nome" className="field-error">{errors.nome}</small>}
    <div className="form-columns">
      <div><label htmlFor="preco">Preço (R$)</label><input id="preco" name="preco" type="number" min="0" step="0.01" value={values.preco} onChange={alterar} required disabled={busy} placeholder="0,00" aria-invalid={!!errors.preco} aria-describedby={errors.preco ? 'erro-preco' : undefined} />{errors.preco && <small id="erro-preco" className="field-error">{errors.preco}</small>}</div>
      <div><label htmlFor="quantidade">Quantidade</label><input id="quantidade" name="quantidade" type="number" min="0" step="1" value={values.quantidade} onChange={alterar} required disabled={busy} aria-invalid={!!errors.quantidade} aria-describedby={errors.quantidade ? 'erro-quantidade' : undefined} />{errors.quantidade && <small id="erro-quantidade" className="field-error">{errors.quantidade}</small>}</div>
    </div>
    <label htmlFor="categoriaId">Categoria</label>
    <select id="categoriaId" name="categoriaId" value={values.categoriaId} onChange={alterar} required disabled={busy} aria-invalid={!!errors.categoriaId} aria-describedby={errors.categoriaId ? 'erro-categoria' : undefined}><option value="">Selecione uma categoria</option>{categorias.map(categoria => <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>)}</select>
    {errors.categoriaId && <small id="erro-categoria" className="field-error">{errors.categoriaId}</small>}
    {!categorias.length && <p className="error-banner">Cadastre uma categoria antes de criar o produto.</p>}
    <footer className="dialog-actions"><button type="button" className="button secondary" onClick={onCancel} disabled={busy}>Cancelar</button><button className="button primary" disabled={busy || !categorias.length}>{busy ? 'Salvando…' : produto ? 'Salvar alterações' : 'Cadastrar produto'}</button></footer>
  </form>;
}
