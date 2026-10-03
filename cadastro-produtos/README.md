<!-- Explica a execução da aplicação durante a preparação do projeto. -->
# Cadastro de Produtos — MVC

Aplicação MVC com Express, EJS, Sequelize e SQLite. Inclui CRUD de produtos, cadastro/listagem de categorias, associação de produtos às categorias, filtro por categoria e pesquisa por nome.

O painel React/Vite usa tema escuro e roxo, fontes incluídas no build, CSS próprio e um SpotlightCard adaptado do React Bits. A versão EJS foi preservada para o requisito acadêmico.

## Execução

Requisito: Node.js 24 (versão usada na validação).

```sh
npm install
npm --prefix frontend install
npm run build
npm start
```

Abra http://localhost:3000. No PowerShell com scripts bloqueados, use `npm.cmd` no lugar de `npm`.

Painel: http://localhost:3000/painel/. Versão EJS: http://localhost:3000/produtos. Sem o build do frontend, o painel ainda não estará disponível. `frontend/dist` é gerado localmente e não é versionado.

## Validação

```sh
npm run test:unit
npm run test:frontend
npm run lint:frontend
```

Os testes verificam renderização EJS, resposta 404, CRUD por HTTP, persistência após reabrir SQLite, validação de dados, campos extras ignorados, falhas de banco, categorias e migração idempotente de bancos antigos.

## Banco de dados

Ao iniciar, o servidor conecta ao SQLite e cria tabelas ausentes antes de aceitar requisições. O arquivo `database.sqlite` fica na pasta da aplicação, independente do diretório de execução. A atualização adiciona `categoriaId` quando necessário, sem apagar registros ou reconstruir tabelas.

Produto contém nome e preço obrigatórios, preço não negativo e quantidade inteira não negativa com padrão zero. Sequelize também cria id, createdAt e updatedAt. Acesse `/produtos` para gerenciar os registros. Os formulários exigem quantidade preenchida e preço com até duas casas decimais.

## Rotas e fluxo MVC

| Método | URL | Ação |
| --- | --- | --- |
| GET | `/produtos` | Listar |
| GET | `/produtos/categoria/:categoriaId` | Listar produtos da categoria |
| GET | `/produtos/novo` | Formulário de cadastro |
| POST | `/produtos` | Cadastrar |
| GET | `/produtos/:id/editar` | Formulário de edição |
| POST | `/produtos/:id` | Atualizar |
| POST | `/produtos/:id/deletar` | Excluir |
| GET | `/categorias` | Listar categorias e abrir cadastro |
| POST | `/categorias` | Cadastrar categoria |

O formulário envia os dados às funções de controller em `routes/produtos.js`. Elas validam nome, preço e quantidade, acessam o model Produto pelo Sequelize e persistem no SQLite. A listagem consulta o model e renderiza os registros com EJS. Envios válidos redirecionam para a listagem; dados inválidos retornam o formulário com mensagens e HTTP 422. Produtos inexistentes retornam 404, e falhas inesperadas de banco retornam 500.

`DATABASE_STORAGE` permite indicar outro arquivo SQLite ou `:memory:` para validações isoladas. O banco local não é versionado. Se a porta 3000 estiver ocupada, no PowerShell execute `$env:PORT='3001'` antes de `npm.cmd start`.

## Categorias

Cadastre uma categoria em `/categorias` antes de criar produtos. Categoria contém id, nome obrigatório e os timestamps do Sequelize. Uma Categoria possui vários Produtos (`hasMany`), e cada Produto pertence a uma Categoria (`belongsTo`), usando `categoriaId` como chave estrangeira. A listagem carrega a associação e exibe seu nome; a edição permite trocar a categoria.

Novos cadastros e edições exigem uma categoria existente. Conforme decisão do programador, a inicialização associa produtos antigos sem vínculo à categoria “Sem categoria”, criando-a somente se necessária. A atualização pode ser executada novamente sem duplicar essa categoria. Edição e exclusão de categorias não fazem parte do escopo.

## Produtos por categoria

Na listagem de produtos, clique no nome de uma categoria em “Filtrar por categoria”. Também é possível abrir o filtro pela lista em `/categorias`. A rota GET `/produtos/categoria/:categoriaId` verifica se a categoria existe e consulta `Produto.findAll` com `where: { categoriaId }`, carregando o relacionamento Categoria e reutilizando a view de listagem.

A página identifica a categoria selecionada, mostra uma mensagem quando ela está vazia e oferece “Todos os produtos” para remover o filtro. Categorias inexistentes ou IDs inválidos retornam HTTP 404. Editar a categoria de um produto atualiza os resultados dos filtros.

## Pesquisa por nome

Use o campo “Pesquisar por nome” na listagem. O formulário GET envia `busca`, por exemplo `/produtos?busca=mouse`, e o Sequelize consulta nomes com `Op.like` e o padrão `%mouse%`. O SQLite interpreta `%` e `_` digitados como curingas LIKE.

O termo aparece na página e no campo de pesquisa. Quando não há correspondências, uma mensagem informa isso. Um termo vazio ou o link “Limpar pesquisa” restaura a listagem. Dentro de uma categoria, a busca combina o nome com categoriaId; limpar a pesquisa mantém a categoria selecionada. “Todos os produtos” remove ambos os filtros.

## Roteiro de demonstração

1. Inicie a aplicação e abra `/categorias`. Cadastre “Informática”, “Escritório” e “Vazia”.
2. Em `/produtos/novo`, cadastre os produtos abaixo e selecione a categoria correspondente.

| Nome | Preço | Quantidade | Categoria |
| --- | --- | --- | --- |
| Mouse USB | 25,90 | 5 | Informática |
| Teclado USB | 79,90 | 3 | Informática |
| Monitor | 899,90 | 2 | Informática |
| Caderno | 15,50 | 10 | Escritório |
| Caneta | 3,50 | 20 | Escritório |

3. Confira os cinco registros na listagem, edite o preço de Mouse USB e troque sua categoria para Escritório. Exclua Caneta.
4. Abra cada filtro de categoria. Mouse USB deve aparecer em Escritório; Vazia deve mostrar a mensagem sem produtos. Clique em “Todos os produtos”.
5. Pesquise `ouse`, depois um nome inexistente, e limpe a pesquisa. Repita a busca dentro de uma categoria.
6. Encerre o servidor com Ctrl+C e execute `npm start` novamente. Confira que a edição e a exclusão continuam aplicadas.

Formulários exigem nome, preço não negativo com até duas casas decimais, quantidade inteira não negativa e categoria existente. Os testes automatizados enviam dados inválidos diretamente ao servidor para conferir a validação independente do navegador.

## Instalação reproduzível

Em uma cópia limpa, `npm ci` instala as versões do `package-lock.json`. Depois, execute `npm run test:unit` e `npm start`. Não copie node_modules nem o banco de outro ambiente. Para a entrega acadêmica, o responsável ainda deve informar seu nome e RM.

Para incluir o painel na cópia limpa, execute também `npm --prefix frontend ci` e `npm run build` antes de `npm start`.

## Desenvolvimento React e API

Execute `npm start` no primeiro terminal e `npm run dev:frontend` no segundo, ambos nesta pasta. Abra http://localhost:5173/painel/. O proxy do Vite usa Express em 3000; para outra porta, ajuste o destino em `frontend/vite.config.js`. A navegação do painel usa hash (`#produtos` e `#categorias`).

| Método | Rota JSON | Ação |
| --- | --- | --- |
| GET | `/api/produtos?busca=mouse&categoriaId=1` | Consulta e filtros |
| GET | `/api/produtos/:id` | Produto existente |
| POST | `/api/produtos` | Cadastro |
| PATCH | `/api/produtos/:id` | Atualização parcial |
| DELETE | `/api/produtos/:id` | Exclusão |
| GET | `/api/categorias` | Lista de categorias |
| POST | `/api/categorias` | Cadastro de categoria |

A API retorna `{ dados }` em consultas/gravações, HTTP 201 na criação e 204 sem corpo na exclusão. Erros retornam `{ mensagem, erros? }`, com 422 para campos inválidos, 404 para registros ausentes e 500 com mensagem genérica para falha interna. Produto aceita nome, preco, quantidade e categoriaId; a validação é compartilhada com EJS.

A atribuição e licença do React Bits estão em `frontend/THIRD_PARTY_NOTICES.md`. As fontes locais são distribuídas pelos pacotes Fontsource com suas respectivas licenças.
