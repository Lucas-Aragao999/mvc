<!-- Explica a execução da aplicação durante a preparação do projeto. -->
# Cadastro de Produtos — MVC

Aplicação Express com EJS, Sequelize e SQLite. O model Produto e a persistência estão configurados; o CRUD será implementado nas próximas etapas de `../DEV/ROADMAP.md`.

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

Os testes verificam renderização EJS, resposta 404, persistência real em SQLite, validação do Produto e falha de inicialização do banco.

## Banco de dados

Ao iniciar, o servidor conecta ao SQLite e cria tabelas ausentes antes de aceitar requisições. O arquivo `database.sqlite` fica na pasta da aplicação, independente do diretório de execução. A sincronização não apaga registros nem altera tabelas existentes.

Produto contém nome e preço obrigatórios, preço não negativo e quantidade inteira não negativa com padrão zero. Sequelize também cria id, createdAt e updatedAt. Ainda não há interface para cadastrar produtos.

`DATABASE_STORAGE` permite indicar outro arquivo SQLite ou `:memory:` para validações isoladas. O banco local não é versionado. Se a porta 3000 estiver ocupada, no PowerShell execute `$env:PORT='3001'` antes de `npm.cmd start`.
