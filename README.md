
# Cadastro de Produtos — MVC

## Integrante

| Informação | resposta|
| --- | --- |
| Nome completo | Lucas Aragão |
| RM | 20240404|


Aplicação web acadêmica com Node.js, Express, EJS, Sequelize e SQLite. As páginas são renderizadas pelo Express; os formulários e as rotas compõem o fluxo MVC.

## Instalação e execução

Requisito: Node.js 24, versão utilizada na validação, e npm.

```sh
git clone https://github.com/Lucas-Aragao999/mvc.git
cd mvc/cadastro-produtos
npm install
npm --prefix frontend install
npm run build
npm start
```

Abra http://localhost:3000. O banco SQLite e as tabelas são preparados automaticamente antes de o servidor atender requisições. Não é necessário configurar um serviço de banco ou Docker.

O novo painel escuro e roxo está em **http://localhost:3000/painel/**. A versão acadêmica EJS continua em http://localhost:3000/produtos. O painel React/Vite usa a mesma aplicação Express e o mesmo banco SQLite.

No PowerShell com execução de scripts bloqueada, use `npm.cmd install` e `npm.cmd start`. Se a porta 3000 estiver ocupada, execute `$env:PORT='3001'` antes de iniciar e acesse http://localhost:3001.

## Funcionalidades

- Cadastro, listagem, edição e exclusão de produtos.
- Cadastro e listagem de categorias, com seleção nos produtos.
- Consulta de produtos por categoria, incluindo mensagem para categoria vazia.
- Pesquisa por parte do nome, também dentro de uma categoria.
- Validação no servidor e mensagens para dados inválidos e registros inexistentes.
- Painel React responsivo com tema escuro/roxo, diálogos de cadastro/edição e confirmação de exclusão.

## Organização

| Caminho | Responsabilidade |
| --- | --- |
| `cadastro-produtos/app.js` | Configuração Express, EJS e rotas |
| `cadastro-produtos/bin/www` | Inicialização do banco e servidor HTTP |
| `cadastro-produtos/models/index.js` | Models, associação e evolução SQLite |
| `cadastro-produtos/routes/` | Rotas e funções de controller |
| `cadastro-produtos/views/` | Páginas EJS e formulários |
| `cadastro-produtos/test/` | Testes automatizados com bancos isolados |
| `DEV/` | Roadmap, planos, contextos e evidências de validação |

O fluxo é formulário → rota/controller → model → Sequelize → SQLite. As consultas retornam dados às views EJS. A descrição das rotas, do relacionamento e da pesquisa está no [README da aplicação](cadastro-produtos/README.md).

## Testar e demonstrar

Dentro de `cadastro-produtos/`, execute:

```sh
npm run test:unit
npm run test:frontend
npm run lint:frontend
```

A suíte cobre CRUD, validações, categorias, filtros, pesquisa, migração de banco antigo e persistência após reiniciar o processo. Os bancos de teste são isolados do banco local.

Para demonstrar pela interface, siga o [roteiro de teste manual](cadastro-produtos/README.md#roteiro-de-demonstração).

## Banco e entrega

Os dados ficam em `cadastro-produtos/database.sqlite`, ignorado pelo Git. Categorias e produtos de demonstração devem ser cadastrados pela interface. A primeira execução cria as tabelas; bancos antigos recebem `categoriaId`, e seus produtos sem vínculo são associados à categoria “Sem categoria”.

Nome e RM do integrante ainda precisam ser informados pelo responsável antes da entrega acadêmica. Os registros de validação estão em [DEV/docs/problems](DEV/docs/problems/).

## Desenvolvimento do painel

Em `cadastro-produtos/`, mantenha `npm start` em um terminal e `npm run dev:frontend` em outro. Abra http://localhost:5173/painel/. O Vite encaminha `/api` para o Express na porta 3000. Para atualizar a versão servida pelo Express, execute `npm run build` novamente.
