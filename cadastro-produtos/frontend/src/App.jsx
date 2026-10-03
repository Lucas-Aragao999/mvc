// Coordena navegação, consultas e operações do catálogo com estados locais do React.
import { useEffect, useState } from 'react';
import { api } from './api.js';
import Icon from './components/Icon.jsx';
import SpotlightCard from './components/SpotlightCard.jsx';
import Dialog from './components/Dialog.jsx';
import ProdutoForm from './components/ProdutoForm.jsx';
import ConfirmarExclusao from './components/ConfirmarExclusao.jsx';

const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

// Renderiza o painel e recarrega dados reais após operações, pesquisa ou mudança de categoria.
export default function App() {
  const [page, setPage] = useState(window.location.hash === '#categorias' ? 'categorias' : 'produtos');
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [busca, setBusca] = useState('');
  const [termo, setTermo] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [revision, setRevision] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [modal, setModal] = useState(null);
  const [modalBusy, setModalBusy] = useState(false);
  const [nomeCategoria, setNomeCategoria] = useState('');
  const [categoryBusy, setCategoryBusy] = useState(false);
  const [categoryError, setCategoryError] = useState('');

  useEffect(() => {
    // Sincroniza os botões de navegação e o histórico de voltar/avançar do navegador.
    function navegar() { setPage(window.location.hash === '#categorias' ? 'categorias' : 'produtos'); }
    window.addEventListener('hashchange', navegar);
    return () => window.removeEventListener('hashchange', navegar);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const query = new URLSearchParams({ busca: termo, categoriaId });
    // Aguarda listas de produtos e categorias e cancela consultas antigas ao mudar filtros.
    async function carregar() {
      setLoading(true); setError('');
      try {
        const [items, groups] = await Promise.all([api(`/produtos?${query}`, { signal: controller.signal }), api('/categorias', { signal: controller.signal })]);
        setProdutos(items); setCategorias(groups);
      } catch (error) { if (error.name !== 'AbortError') setError(error.message); }
      finally { if (!controller.signal.aborted) setLoading(false); }
    }
    carregar();
    return () => controller.abort();
  }, [termo, categoriaId, revision]);

  // Fecha a janela após sucesso e invalida as listas para recuperar o estado persistido.
  function concluido(message) { setModal(null); setModalBusy(false); setFeedback(message); setRevision(value => value + 1); }
  // Limpa a pesquisa e a categoria para restaurar a listagem completa.
  function limpar() { setBusca(''); setTermo(''); setCategoriaId(''); }
  // Salva uma categoria com feedback localizado e preserva o nome quando houver falha.
  async function criarCategoria(event) {
    event.preventDefault();
    if (categoryBusy) return;
    setCategoryBusy(true); setCategoryError('');
    try { await api('/categorias', { method: 'POST', body: { nome: nomeCategoria } }); setNomeCategoria(''); setFeedback('Categoria cadastrada.'); setRevision(value => value + 1); }
    catch (error) { setCategoryError(error.campos?.nome || error.message); }
    finally { setCategoryBusy(false); }
  }

  const categoriaAtual = categorias.find(item => String(item.id) === categoriaId);
  return <div className="app-shell">
    <aside className="sidebar">
      <a className="brand" href="#produtos"><span className="brand-mark"><Icon name="box" size={26} /></span><span>catálogo<span className="brand-subtitle">CADASTRO DE PRODUTOS</span></span></a>
      <span className="nav-label">ORGANIZAR</span>
      <nav aria-label="Navegação principal"><a href="#produtos" className={page === 'produtos' ? 'nav-item active' : 'nav-item'} aria-current={page === 'produtos' ? 'page' : undefined}><Icon name="grid" />Produtos</a><a href="#categorias" className={page === 'categorias' ? 'nav-item active' : 'nav-item'} aria-current={page === 'categorias' ? 'page' : undefined}><Icon name="folder" />Categorias</a></nav>
      <div className="sidebar-bottom"><span className="status-dot" />Seu catálogo, organizado.<a href="/produtos">Abrir versão EJS <Icon name="arrow" size={16} /></a></div>
    </aside>
    <main className="workspace">
      <div className="topbar"><span>Workspace <span className="separator">/</span> <strong>{page === 'produtos' ? 'Produtos' : 'Categorias'}</strong></span><span className="topbar-note">Cadastro de Produtos <span className="version-badge">MVC</span></span></div>
      <div className="content">
        <SpotlightCard className="page-header"><div><span className="eyebrow">{page === 'produtos' ? 'UM LUGAR PARA CADA PRODUTO' : 'MAIS ORDEM NO CATÁLOGO'}</span><h1>{page === 'produtos' ? 'Seu catálogo.' : 'Suas categorias.'}</h1><p>{page === 'produtos' ? 'Organize produtos, ajuste detalhes e encontre o que precisa.' : 'Agrupe seus produtos do seu jeito. Comece por uma categoria.'}</p></div>{page === 'produtos' && <button className="button primary" onClick={() => { setModal({ type: 'produto' }); setFeedback(''); }}><Icon name="plus" />Novo produto</button>}</SpotlightCard>
        <div className="feedback" role="status" aria-live="polite">{feedback && <><Icon name="check" size={16} />{feedback}</>}</div>
        {error && <div role="alert" className="error-banner error-panel">{error}<button className="button secondary" onClick={() => setRevision(value => value + 1)}>Tentar novamente</button></div>}
        {page === 'produtos' ? <section className="panel" aria-label="Lista de produtos">
          <div className="panel-toolbar"><div className="section-title"><Icon name="box" /><h2>Produtos</h2>{!loading && !error && <span className="count-badge">{produtos.length}</span>}</div><span className="muted small">{categoriaAtual ? categoriaAtual.nome : 'Todas as categorias'}</span></div>
          <div className="filters"><form className="search-form" onSubmit={event => { event.preventDefault(); setTermo(busca.trim()); }}><label className="sr-only" htmlFor="busca">Pesquisar por nome</label><Icon name="search" size={18} /><input id="busca" type="search" placeholder="Pesquisar produtos…" value={busca} onChange={event => setBusca(event.target.value)} /><button type="submit">Buscar</button></form><label className="sr-only" htmlFor="filtro-categoria">Filtrar por categoria</label><select id="filtro-categoria" value={categoriaId} onChange={event => setCategoriaId(event.target.value)}><option value="">Todas as categorias</option>{categorias.map(item => <option key={item.id} value={item.id}>{item.nome}</option>)}</select>{(termo || categoriaId) && <button className="text-button" onClick={limpar}>Limpar filtros</button>}</div>
          {termo && <p className="search-context">Resultados para <strong>“{termo}”</strong></p>}
          {loading ? <div className="empty-state" role="status"><span className="loader" /><p>Carregando produtos…</p></div> : error ? <p className="empty-state muted">A lista está indisponível. Tente novamente acima.</p> : produtos.length ? <div className="table-scroll"><table><caption className="sr-only">Produtos cadastrados</caption><thead><tr><th scope="col">Produto</th><th scope="col">Preço</th><th scope="col">Quantidade</th><th scope="col">Categoria</th><th scope="col" className="align-right">Ações</th></tr></thead><tbody>{produtos.map(item => <tr key={item.id}><td><div className="product-name"><span className="product-symbol"><Icon name="box" size={18} /></span><div><strong>{item.nome}</strong><span className="product-id">#{String(item.id).padStart(3, '0')}</span></div></div></td><td className="numeric">{moeda.format(Number(item.preco))}</td><td className="numeric">{item.quantidade}<span className="unit"> un.</span></td><td><span className="category-badge">{item.Categoria?.nome || 'Sem categoria'}</span></td><td><div className="row-actions"><button className="icon-button" aria-label={`Editar ${item.nome}`} title="Editar produto" onClick={() => setModal({ type: 'produto', produto: item })}><Icon name="edit" size={18} /></button><button className="icon-button delete-button" aria-label={`Excluir ${item.nome}`} title="Excluir produto" onClick={() => setModal({ type: 'delete', produto: item })}><Icon name="trash" size={18} /></button></div></td></tr>)}</tbody></table></div> : <div className="empty-state"><div className="empty-icon"><Icon name="box" size={32} /></div><h3>{termo || categoriaId ? 'Nenhum produto encontrado' : 'Seu catálogo começa aqui'}</h3><p>{termo || categoriaId ? 'Experimente outro nome ou remova os filtros.' : 'Cadastre seu primeiro produto e deixe tudo organizado.'}</p><button className="button secondary" onClick={termo || categoriaId ? limpar : () => setModal({ type: 'produto' })}>{termo || categoriaId ? 'Limpar filtros' : 'Cadastrar primeiro produto'}</button></div>}
          <footer className="panel-footer"><span>{!loading && !error ? `${produtos.length} produto${produtos.length === 1 ? '' : 's'} nesta lista` : 'Catálogo de produtos'}</span><span>Feito para manter tudo em ordem.</span></footer>
        </section> : <div className="categories-layout"><section className="panel"><div className="panel-toolbar"><div className="section-title"><Icon name="folder" /><h2>Categorias</h2><span className="count-badge">{categorias.length}</span></div></div>{loading ? <p className="empty-state">Carregando categorias…</p> : error ? <p className="empty-state muted">A lista está indisponível.</p> : categorias.length ? <ul className="category-list">{categorias.map(item => <li key={item.id}><span className="category-symbol"><Icon name="folder" /></span><span>{item.nome}</span><a href="#produtos" className="icon-button" aria-label={`Ver produtos de ${item.nome}`} onClick={() => { setCategoriaId(String(item.id)); setBusca(''); setTermo(''); }}><Icon name="arrow" size={18} /></a></li>)}</ul> : <div className="empty-state"><Icon name="folder" size={32} /><h3>Cada produto no seu lugar</h3><p>Crie uma categoria para começar a organizar.</p></div>}</section><section className="panel category-form-panel"><span className="eyebrow">ORGANIZE DO SEU JEITO</span><h2>Nova categoria</h2><p className="muted">Um nome simples para agrupar seus produtos.</p><form onSubmit={criarCategoria}><label htmlFor="nome-categoria">Nome da categoria</label><input id="nome-categoria" value={nomeCategoria} onChange={event => setNomeCategoria(event.target.value)} placeholder="Ex.: Informática" required disabled={categoryBusy} aria-invalid={!!categoryError} aria-describedby={categoryError ? 'category-error' : undefined} />{categoryError && <p id="category-error" role="alert" className="field-error">{categoryError}</p>}<button className="button primary" disabled={categoryBusy}><Icon name="plus" />{categoryBusy ? 'Salvando…' : 'Cadastrar categoria'}</button></form></section></div>}
        <p className="workspace-footer">Cadastro de Produtos <span>·</span> Um catálogo simples, do seu jeito.</p>
      </div>
    </main>
    {modal && <Dialog title={modal.type === 'delete' ? 'Excluir produto' : modal.produto ? 'Editar produto' : 'Novo produto'} busy={modalBusy} onClose={() => setModal(null)}>{modal.type === 'delete' ? <ConfirmarExclusao produto={modal.produto} onCancel={() => setModal(null)} onBusy={setModalBusy} onSaved={() => concluido('Produto excluído.')} /> : <ProdutoForm produto={modal.produto} categorias={categorias} onBusy={setModalBusy} onCancel={() => setModal(null)} onSaved={() => concluido(modal.produto ? 'Produto atualizado.' : 'Produto cadastrado.')} />}</Dialog>}
  </div>;
}
