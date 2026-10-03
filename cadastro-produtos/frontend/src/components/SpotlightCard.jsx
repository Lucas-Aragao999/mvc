// Adapta SpotlightCard do React Bits para um brilho discreto, sem dependências extras.
// Origem: https://github.com/DavidHDev/react-bits — licença em THIRD_PARTY_NOTICES.md.
import { useRef } from 'react';

// Posiciona o brilho acompanhando o ponteiro e mantém o conteúdo independente do efeito.
export default function SpotlightCard({ children, className = '' }) {
  const ref = useRef(null);
  // Atualiza variáveis CSS sem renderizações React para tornar o movimento leve.
  function mover(event) {
    const bounds = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--mouse-x', `${event.clientX - bounds.left}px`);
    ref.current.style.setProperty('--mouse-y', `${event.clientY - bounds.top}px`);
  }
  return <div ref={ref} onMouseMove={mover} className={`spotlight ${className}`}>{children}</div>;
}
