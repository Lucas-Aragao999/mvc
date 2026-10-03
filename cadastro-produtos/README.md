<!-- Explica a execução da aplicação durante a preparação do projeto. -->
# Cadastro de Produtos — MVC

Aplicação MVC com Express, EJS, Sequelize e SQLite. Inclui CRUD de produtos, cadastro/listagem de categorias e associação de produtos às categorias. O filtro por categoria é a próxima etapa de `../DEV/ROADMAP.md`.

## Execução

Requisito: Node.js 24 (versão usada na validação).

```sh
npm install
npm start
```

Abra http://localhost:3000. No PowerShell com scripts bloqueados, use `npm.cmd` no lugar de `npm`.

## Validação

```sh
npm run test:unit
```

Os testes verificam renderização EJS, resposta 404, CRUD por HTTP, persistência após reabrir SQLite, validação de dados, campos extras ignorados, falhas de banco, categorias e migração idempotente de bancos antigos.

## Banco de dados

Ao iniciar, o servidor conecta ao SQLite e cria tabelas ausentes antes de aceitar requisições. O arquivo `database.sqlite` fica na pasta da aplicação, independente do diretório de execução. A atualização adiciona `categoriaId` quando necessário, sem apagar registros ou reconstruir tabelas.

Produto contém nome e preço obrigatórios, preço não negativo e quantidade inteira não negativa com padrão zero. Sequelize também cria id, createdAt e updatedAt. Acesse `/produtos` para gerenciar os registros. Os formulários exigem quantidade preenchida e preço com até duas casas decimais.

## Rotas e fluxo MVC

| Método | URL | Ação |
| --- | --- | --- |
| GET | `/produtos` | Listar |
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
