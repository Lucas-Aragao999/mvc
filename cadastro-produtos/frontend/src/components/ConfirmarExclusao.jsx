// Solicita confirmação antes de remover um produto e mostra falhas sem fechar a janela.
import { useState } from 'react';
import { api } from '../api.js';

// Exclui somente após confirmação explícita do usuário na interface.
export default function ConfirmarExclusao({ produto, onSaved, onCancel, onBusy }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  // Bloqueia ações duplicadas enquanto o backend realiza a exclusão.
  async function excluir() {
    if (busy) return;
    setBusy(true); onBusy(true);
    try { await api(`/produtos/${produto.id}`, { method: 'DELETE' }); onSaved(); }
    catch (error) { setError(error.message); }
    finally { setBusy(false); onBusy(false); }
  }
  return <div className="delete-content"><p>Excluir <strong>{produto.nome}</strong> do catálogo?</p><p className="muted">Esta ação remove o produto do banco de dados.</p>{error && <p role="alert" className="error-banner">{error}</p>}<footer className="dialog-actions"><button className="button secondary" disabled={busy} onClick={onCancel}>Cancelar</button><button className="button danger" disabled={busy} onClick={excluir}>{busy ? 'Excluindo…' : 'Excluir produto'}</button></footer></div>;
}
