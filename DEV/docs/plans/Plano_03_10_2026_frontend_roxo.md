<!-- Planeja um painel React/Vite escuro e roxo integrado ao cadastro MVC existente. -->
# Frontend simples — tema escuro e roxo

## Objetivo e situação

Criar uma interface mais bonita para gerenciar produtos e categorias, usando React com Vite. O painel deve continuar simples, rápido e fácil de demonstrar no trabalho acadêmico.

Pedido autorizado nesta sessão: elaborar o plano. Implementação, instalação de dependências e alterações nas rotas ficam para uma próxima execução.

Atualização: o programador autorizou a execução posteriormente. Implementado em 03/10/2026; evidências em `DEV/docs/problems/Validacao_frontend_03_10_2026.md`.

Hoje o Express retorna HTML EJS, e não uma API JSON. O banco, o CRUD, categorias, filtros e pesquisa já funcionam, com nove testes aprovados. O roadmap original exige EJS; a proposta é manter a versão acadêmica e adicionar o painel em `/painel/`, usando o mesmo Express, models e SQLite. Isso amplia o escopo visual a pedido do programador e não muda as funcionalidades do cadastro.

## Direção visual

Uma ferramenta de catálogo, com foco na lista de produtos. Tema escuro fixo, roxo nas ações e seleção, superfícies discretas e boa separação entre linhas. A assinatura visual será uma faixa roxa no item de navegação ativo e nos filtros selecionados, repetida no cabeçalho do formulário.

| Token | Cor | Aplicação |
| --- | --- | --- |
| Fundo | `#100D18` | Fundo geral |
| Superfície | `#1B1628` | Tabela, formulários e navegação |
| Borda | `#373047` | Separação discreta |
| Roxo | `#7C3AED` | Botão principal, foco e seleção |
| Texto | `#F5F2FA` | Títulos e conteúdo |
| Texto secundário | `#B5ADC6` | Labels auxiliares e descrições |

Tipografia: Space Grotesk nos títulos, Source Sans 3 no conteúdo, com fallback sans-serif. Preferir fontes locais quando incorporadas; valores numéricos usam algarismos tabulares. Títulos entre 24–32px, corpo 16px; raios de 10–12px, espaçamento em passos de 4px.

Revisão da proposta: uma tabela útil será o centro da tela. Não acrescentar gráficos ou métricas que dependam de novas regras de negócio. O efeito decorativo ficará restrito a uma superfície, para não competir com a leitura dos produtos.

## Telas e comportamento

Desktop: navegação lateral compacta com Produtos e Categorias, cabeçalho com título e ação principal, área de pesquisa/filtro e conteúdo. Mobile: navegação no topo e controles empilhados; tabela em área de rolagem própria, sem alargar a página.

```text
┌──────────────┬──────────────────────────────────────────┐
│ Cadastro     │ Produtos                  + Novo produto │
│              │                                          │
│ ▌Produtos    │ Pesquisar por nome…       Categoria ▾    │
│  Categorias  │                                          │
│              │ Nome       Preço    Qtd.  Categoria Ações│
│ Versão EJS   │ Mouse USB  R$25,90  5     Informática …  │
└──────────────┴──────────────────────────────────────────┘
```

- **Produtos:** tabela com nome, preço em reais, quantidade, categoria e botões Editar/Excluir. Pesquisa e categoria combinadas; limpar filtros retorna a lista completa. Mostrar contexto do filtro e estado vazio com ação de cadastro.
- **Cadastro/edição:** formulário em dialog nativo com nome, preço, quantidade e categoria. Erros junto aos campos; manter dados ao falhar; bloquear envio repetido; fechar e atualizar a lista após sucesso. Sem categorias, orientar o usuário a cadastrar uma primeiro.
- **Exclusão:** dialog de confirmação com nome do produto e ações Cancelar/Excluir. Atualizar lista somente após sucesso.
- **Categorias:** lista simples e formulário de cadastro. Não adicionar edição ou exclusão de categorias.
- **Estados:** carregamento discreto, falha com ação Tentar novamente, lista vazia e feedback de sucesso em região aria-live. Labels sempre visíveis, foco de teclado claro, foco restaurado ao fechar dialogs, Escape funcionando e animações respeitando prefers-reduced-motion.

## Stack e React Bits

- Vite + React em JavaScript, coerente com o backend atual.
- CSS próprio com variáveis de tema como primeira escolha. Tailwind é opcional: se reduzir a repetição no layout responsivo, usar `tailwindcss` e `@tailwindcss/vite`, sem manter duas definições concorrentes dos tokens.
- React Bits: no máximo um componente nesta primeira versão, candidato **SpotlightCard**, com brilho roxo suave em uma superfície de destaque. Conferir código, dependências e licença antes de incorporar; manter atribuição quando exigida. Se exigir dependência pesada para um efeito pequeno, usar CSS simples.
- Sem biblioteca de estado global: hooks React, fetch nativo e componentes pequenos. Dois itens de navegação podem usar hash da URL, sem adicionar roteador só para alternar telas.

## Integração com o backend

Adicionar rotas JSON sob `/api`, sem analisar HTML EJS no frontend. Compartilhar validação e consultas entre controllers EJS e JSON para não criar regras diferentes. Aceitar campos JSON numéricos ou strings de formulário, normalizando tipos antes da validação; nunca converter campo vazio em zero.

| Método | Rota | Resultado esperado |
| --- | --- | --- |
| GET | `/api/produtos?busca=mouse&categoriaId=1` | Lista filtrada com categoria associada |
| GET | `/api/produtos/:id` | Produto para edição |
| POST | `/api/produtos` | Criação, HTTP 201 |
| PATCH | `/api/produtos/:id` | Atualização dos campos permitidos |
| DELETE | `/api/produtos/:id` | Exclusão, HTTP 204 |
| GET | `/api/categorias` | Categorias ordenadas por nome |
| POST | `/api/categorias` | Criação, HTTP 201 |

Respostas: lista em `{ dados: [...] }`, item em `{ dados: {...} }`; falhas em `{ mensagem, erros? }`. Usar 422 para dados inválidos, 404 para item/categoria inexistente e 500 com mensagem genérica para falha inesperada. Filtrar uma categoria inexistente continua sendo 404; busca vazia continua listando todos no escopo atual. Preservar os contratos e redirects das rotas EJS.

Desenvolvimento: Express na porta 3000; Vite na 5173 com proxy `/api` para Express. Não será necessário liberar CORS para o desenvolvimento com proxy.

Build: Vite com base `/painel/`; Express serve `frontend/dist` nessa URL, antes do middleware 404. Arquivos de assets inexistentes retornam 404; fallback do HTML limitado às navegações do painel, nunca às rotas `/api`. Após build, painel e versão EJS funcionam no mesmo servidor com `npm start`.

## Estrutura e arquivos previstos

```text
cadastro-produtos/
├── frontend/
│   ├── package.json / package-lock.json
│   ├── vite.config.js / index.html
│   └── src/
│       ├── main.jsx / App.jsx / styles.css
│       ├── api.js
│       ├── pages/Produtos.jsx / Categorias.jsx
│       └── components/ProdutoForm.jsx / ConfirmarExclusao.jsx
├── routes/api.js
├── services/produtos.js
└── test/api.test.js
```

Arquivos existentes afetados: `app.js` para JSON e arquivos estáticos; `routes/produtos.js` para reutilizar regras; `package.json` para comandos do frontend/build; `.gitignore` para dist; READMEs e documentação DEV. Reutilizar models e inicialização do banco. Todos os novos arquivos e funções terão comentários em português.

## Ordem de execução

1. **Contrato JSON e testes:** escrever testes de criação, edição, exclusão, filtros, categoria inexistente e validação; implementar API com regras compartilhadas; confirmar os nove testes EJS existentes.
2. **Base Vite:** criar React e comandos de dev/build; configurar proxy e caminho `/painel/`; definir tokens visuais e navegação.
3. **Fluxos reais:** implementar listagem, filtro, pesquisa, cadastro/edição, confirmação de exclusão e categorias, consumindo o banco pelo backend.
4. **Acabamento:** responsividade, foco, feedback e estados; avaliar SpotlightCard só depois de os fluxos funcionarem.
5. **Entrega:** build, testes, instalação limpa e documentação dos comandos. Conferir visualmente no navegador quando disponível e registrar limitações caso indisponível.

## Critérios de aceitação

- Interface escura/roxa consistente e utilizável a partir de 360px de largura, com foco visível e contraste conferido.
- CRUD e categorias funcionam pela API e persistem no mesmo SQLite; pesquisa e filtros produzem resultados reais.
- Dados inválidos não gravam nem apagam registros; erros são claros e não expõem stack traces.
- Rotas EJS e testes atuais continuam funcionando, atendendo ao requisito acadêmico.
- `npm run test:unit` no backend, lint do frontend e build passam. Testes de interação cobrem envio inválido, sucesso e cancelamento de exclusão quando a ferramenta disponível permitir.
- Após build, `http://localhost:3000/painel/` funciona; URL desconhecida da API não retorna HTML do painel.
- READMEs explicam instalação dos dois pacotes, dev em dois terminais, build e execução integrada.

## Riscos e reversão

Principais riscos: duplicação de validação, mudança acidental das rotas acadêmicas, assets fora da base correta e efeito visual aumentar dependências sem benefício. Mitigar com compartilhamento de regras, testes de regressão e conferência do build real.

A reversão remove o registro das rotas JSON e o serviço do painel, preservando páginas EJS e banco. Não são previstas mudanças de schema ou migrações para esse frontend. Sem commits, push ou deploy pela IA nesta etapa.

## Referências consultadas

- [Vite — início e templates](https://vite.dev/guide/).
- [Vite — proxy de desenvolvimento](https://vite.dev/config/server-options.html#server-proxy).
- [Tailwind — integração com Vite](https://tailwindcss.com/docs/installation/using-vite).
- [React Bits — componentes e código](https://github.com/DavidHDev/react-bits).
- [SpotlightCard — candidato para efeito discreto](https://reactbits.dev/components/spotlight-card).
