// Desenha ícones consistentes sem adicionar uma biblioteca ao painel.
export default function Icon({ name, size = 20 }) {
  const paths = {
    box: 'M12 3 3 8v9l9 5 9-5V8l-9-5Zm0 10v9M3 8l9 5 9-5M7.5 5.5l9 5',
    grid: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
    folder: 'M3 7V5h7l2 2h9v13H3V7Z',
    plus: 'M12 5v14M5 12h14',
    search: 'M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',
    edit: 'm14 5 5 5M4 20l4-1L21 6l-4-4L4 15v5Z',
    trash: 'M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7',
    close: 'm6 6 12 12M6 18 18 6',
    arrow: 'M7 17 17 7M7 7h10v10',
    check: 'm5 12 4 4L19 6'
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name] || paths.box} /></svg>;
}
