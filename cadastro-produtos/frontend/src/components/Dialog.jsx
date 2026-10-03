// Oferece diálogo nativo com foco preso, Escape e restauração de foco pelo navegador.
import { useEffect, useRef } from 'react';
import Icon from './Icon.jsx';

// Abre o diálogo ao montar e respeita o bloqueio de fechamento durante uma gravação.
export default function Dialog({ title, children, onClose, busy = false }) {
  const ref = useRef(null);
  useEffect(() => {
    const element = ref.current;
    element.showModal();
    return () => element.close();
  }, []);
  return <dialog ref={ref} aria-labelledby="dialog-title" onCancel={event => { event.preventDefault(); if (!busy) onClose(); }}>
    <header className="dialog-header"><div><span className="eyebrow">SEU CATÁLOGO</span><h2 id="dialog-title">{title}</h2></div><button className="icon-button" aria-label="Fechar janela" disabled={busy} onClick={onClose}><Icon name="close" /></button></header>
    {children}
  </dialog>;
}
