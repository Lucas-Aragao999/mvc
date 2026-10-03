<!-- Explica a execução da aplicação durante a preparação do projeto. -->
# Cadastro de Produtos — MVC

Base Express com EJS, Sequelize e SQLite. O CRUD e os models serão implementados nas próximas etapas de `../DEV/ROADMAP.md`.

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

O teste verifica a renderização EJS da página inicial e a resposta 404 para uma rota inexistente. A persistência SQLite ainda não foi configurada.
