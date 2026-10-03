# Roadmap — Cadastro de Produtos MVC

## Objetivo

Construir uma aplicação web com **Node.js, Express, EJS, Sequelize e SQLite**, com CRUD de produtos, cadastro de categorias e consulta de produtos por categoria. Entregar o código no GitHub com um README que explique a execução e os desafios.

**Ordem de execução:** preparação → persistência → CRUD → categorias → filtro por categoria → validação → entrega. A pesquisa por nome é opcional e vem depois dos dois desafios obrigatórios.

## 1. Preparar o projeto

- [x] Criar a aplicação: `npx express-generator --view=ejs cadastro-produtos`.
- [x] Entrar na pasta e executar `npm install`.
- [x] Instalar o banco e ORM: `npm install sequelize sqlite3`.
- [x] Executar `npm start` e abrir a página inicial (validado em `http://localhost:3001`, pois a porta 3000 estava ocupada).
- [x] Iniciar o versionamento e configurar `.gitignore` para excluir `node_modules` e arquivos temporários (repositório Git já existente).

**Concluído quando:** a página inicial do Express abrir sem erros.

## 2. Criar o Model e a persistência

- [x] Criar `models/index.js` com a conexão SQLite em `database.sqlite`.
- [x] Definir o Model `Produto`: nome obrigatório, preço obrigatório e quantidade inteira com padrão zero.
- [x] Integrar a sincronização do Sequelize à inicialização da aplicação.
- [x] Garantir que o banco esteja pronto antes de atender às requisições e tratar falhas de inicialização.
- [x] Verificar se o arquivo SQLite e a tabela de produtos foram criados.

**Concluído quando:** o banco estiver acessível e os registros puderem ser armazenados e recuperados.

## 3. Implementar o CRUD de produtos

- [x] Criar `routes/produtos.js` e registrá-lo em `app.js` em `/produtos`.
- [x] Conferir o middleware `express.urlencoded` antes das rotas de formulário.
- [x] Implementar listagem, formulário de cadastro, criação, formulário de edição, atualização e exclusão.
- [x] Criar `views/produtos/index.ejs`, `novo.ejs` e `editar.ejs`.
- [x] Usar labels associados aos campos e entradas numéricas adequadas para preço e quantidade.
- [x] Validar no servidor nome preenchido, preço válido e quantidade inteira não negativa; aceitar somente os campos esperados.
- [x] Tratar produto inexistente e erros de banco sem deixar a requisição pendente.

### Rotas do CRUD

| Método | URL | Ação |
| --- | --- | --- |
| GET | `/produtos` | Listar produtos |
| GET | `/produtos/novo` | Abrir cadastro |
| POST | `/produtos` | Salvar produto |
| GET | `/produtos/:id/editar` | Abrir edição |
| POST | `/produtos/:id` | Atualizar produto |
| POST | `/produtos/:id/deletar` | Excluir produto |

**Concluído quando:** cadastrar pelo menos cinco produtos, editar um e excluir outro funcionar, com alterações persistidas após reiniciar a aplicação.

**Ponto de compreensão:** explicar o caminho formulário → rota/controller → Model → Sequelize → SQLite → View. No tutorial, as funções de controller ficam nas próprias rotas; uma pasta `controllers` separada é opcional.

## 4. Desafio 1 — Categorias e relacionamento

**Pré-requisito:** CRUD funcionando.

- [x] Consultar a documentação do Sequelize sobre associações e chaves estrangeiras.
- [x] Criar o Model `Categoria`, com `id` e `nome`.
- [x] Definir o relacionamento: uma categoria possui vários produtos; cada produto pertence a uma categoria.
- [x] Criar a chave estrangeira `categoriaId` em Produto.
- [x] Planejar a atualização do banco existente e a associação dos produtos já cadastrados, preservando os dados (categoria “Sem categoria” aprovada pelo programador).
- [x] Criar uma página e rotas para cadastrar e listar categorias.
- [x] Carregar as categorias nos formulários de cadastro e edição de produtos.
- [x] Permitir selecionar e alterar a categoria do produto.
- [x] Validar se a categoria informada existe.
- [x] Buscar o relacionamento e mostrar o nome da categoria na listagem de produtos.

**Concluído quando:** categorias puderem ser cadastradas, produtos estiverem associados a elas e a listagem mostrar essa associação persistida no banco.

> O enunciado exige cadastro de categorias; edição e exclusão de categorias não são requisitos.

## 5. Desafio 2 — Produtos por categoria

**Pré-requisito:** categorias e associação funcionando.

- [x] Definir uma rota GET, por exemplo `/produtos/categoria/:categoriaId`.
- [x] Disponibilizar links ou um seletor para escolher a categoria.
- [x] Consultar os produtos no banco com `findAll` e uma condição pela chave estrangeira.
- [x] Mostrar a categoria selecionada e somente os produtos vinculados a ela.
- [x] Reutilizar a View de listagem se ela atender à necessidade.
- [x] Mostrar uma mensagem quando a categoria estiver vazia e tratar categoria inexistente.
- [x] Disponibilizar uma opção para voltar à listagem completa.

**Concluído quando:** selecionar duas categorias diferentes retornar conjuntos corretos de produtos por meio de uma rota acessível na interface.

## 6. Desafio extra — Pesquisa por nome (opcional)

**Pré-requisito:** os dois desafios obrigatórios concluídos.

- [x] Adicionar um formulário de pesquisa com método GET.
- [x] Receber o termo, por exemplo em `/produtos?busca=mouse`.
- [x] Consultar nomes que contenham o termo usando as condições de busca do Sequelize, como `LIKE`.
- [x] Mostrar os resultados e uma mensagem quando não houver correspondências.
- [x] Retornar à listagem completa quando a busca estiver vazia.

**Concluído quando:** pesquisar parte do nome retornar os produtos correspondentes a partir do banco.

## 7. Validar o sistema

- [x] Cadastrar pelo menos cinco produtos.
- [x] Confirmar listagem, edição e exclusão.
- [x] Reiniciar o servidor e conferir a persistência dos dados.
- [x] Conferir registros e relacionamentos de `database.sqlite` por consultas SQLite diretas (visualizador gráfico indisponível; evidências em `docs/problems/Validacao_03_10_2026.md`).
- [x] Cadastrar categorias diferentes e associar produtos a elas.
- [x] Alterar a categoria de um produto e conferir o resultado nos filtros.
- [x] Testar categoria com produtos, categoria vazia e ID inexistente.
- [x] Testar formulários com dados inválidos e confirmar que não gravam registros incorretos.
- [x] Conferir navegação, mensagens e rótulos dos formulários (HTML renderizado e testes HTTP; revisão visual pendente por indisponibilidade de navegador).
- [x] Se houver pesquisa, testar correspondência parcial, ausência de resultados e termo vazio.

**Concluído quando:** todos os requisitos obrigatórios funcionarem sem erros e os dados permanecerem consistentes.

## 8. Documentar e entregar no GitHub

- [ ] Criar `README.md` com o nome **Cadastro de Produtos — MVC**.
- [ ] Informar nome do integrante e RM.
- [ ] Explicar instalação e execução com `npm install` e `npm start`.
- [ ] Informar a URL inicial da aplicação.
- [ ] Listar somente as funcionalidades realmente implementadas.
- [ ] Explicar como o relacionamento entre Produto e Categoria foi feito.
- [ ] Explicar a rota e a consulta de produtos por categoria.
- [ ] Explicar a pesquisa por nome, caso implementada.
- [ ] Documentar como o banco é criado e como preparar categorias e produtos para testar.
- [ ] Enviar código-fonte, configurações, `package.json`, arquivo de lock, Models, rotas e Views ao GitHub.
- [ ] Conferir a instalação a partir de uma cópia limpa do repositório.
- [ ] Conferir o link e a acessibilidade do repositório para a entrega.

**Concluído quando:** outra pessoa conseguir instalar, executar e testar os requisitos seguindo apenas o README.

## Checklist dos critérios de avaliação

| Critério do enunciado | Evidência de conclusão |
| --- | --- |
| Estrutura e Express | Aplicação executa e arquivos estão organizados |
| Model e persistência | Dados armazenados e recuperados do SQLite |
| CRUD de produtos | Cadastro, listagem, edição e exclusão funcionam |
| Views e EJS | Páginas renderizam dados e formulários corretamente |
| Desafio 1 | Categorias cadastradas e relacionadas aos produtos |
| Desafio 2 | Consulta por categoria retorna somente os produtos corretos |
| GitHub e README | Repositório completo e instruções reproduzíveis |

## Limites do escopo

Priorizar o CRUD e os dois desafios obrigatórios. Pesquisa por nome é extra. Login, deploy, API separada, frontend em React e CRUD completo de categorias não são pedidos no enunciado.
