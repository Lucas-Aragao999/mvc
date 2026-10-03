# Roadmap — Cadastro de Produtos MVC

## Objetivo

Construir uma aplicação web com **Node.js, Express, EJS, Sequelize e SQLite**, com CRUD de produtos, cadastro de categorias e consulta de produtos por categoria. Entregar o código no GitHub com um README que explique a execução e os desafios.

**Ordem de execução:** preparação → persistência → CRUD → categorias → filtro por categoria → validação → entrega. A pesquisa por nome é opcional e vem depois dos dois desafios obrigatórios.

## 1. Preparar o projeto

- [ ] Criar a aplicação: `npx express-generator --view=ejs cadastro-produtos`.
- [ ] Entrar na pasta e executar `npm install`.
- [ ] Instalar o banco e ORM: `npm install sequelize sqlite3`.
- [ ] Executar `npm start` e abrir `http://localhost:3000`.
- [ ] Iniciar o versionamento e configurar `.gitignore` para excluir `node_modules` e arquivos temporários.

**Concluído quando:** a página inicial do Express abrir sem erros.

## 2. Criar o Model e a persistência

- [ ] Criar `models/index.js` com a conexão SQLite em `database.sqlite`.
- [ ] Definir o Model `Produto`: nome obrigatório, preço obrigatório e quantidade inteira com padrão zero.
- [ ] Integrar a sincronização do Sequelize à inicialização da aplicação.
- [ ] Garantir que o banco esteja pronto antes de atender às requisições e tratar falhas de inicialização.
- [ ] Verificar se o arquivo SQLite e a tabela de produtos foram criados.

**Concluído quando:** o banco estiver acessível e os registros puderem ser armazenados e recuperados.

## 3. Implementar o CRUD de produtos

- [ ] Criar `routes/produtos.js` e registrá-lo em `app.js` em `/produtos`.
- [ ] Conferir o middleware `express.urlencoded` antes das rotas de formulário.
- [ ] Implementar listagem, formulário de cadastro, criação, formulário de edição, atualização e exclusão.
- [ ] Criar `views/produtos/index.ejs`, `novo.ejs` e `editar.ejs`.
- [ ] Usar labels associados aos campos e entradas numéricas adequadas para preço e quantidade.
- [ ] Validar no servidor nome preenchido, preço válido e quantidade inteira não negativa; aceitar somente os campos esperados.
- [ ] Tratar produto inexistente e erros de banco sem deixar a requisição pendente.

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

- [ ] Consultar a documentação do Sequelize sobre associações e chaves estrangeiras.
- [ ] Criar o Model `Categoria`, com `id` e `nome`.
- [ ] Definir o relacionamento: uma categoria possui vários produtos; cada produto pertence a uma categoria.
- [ ] Criar a chave estrangeira `categoriaId` em Produto.
- [ ] Planejar a atualização do banco existente e a associação dos produtos já cadastrados, preservando os dados.
- [ ] Criar uma página e rotas para cadastrar e listar categorias.
- [ ] Carregar as categorias nos formulários de cadastro e edição de produtos.
- [ ] Permitir selecionar e alterar a categoria do produto.
- [ ] Validar se a categoria informada existe.
- [ ] Buscar o relacionamento e mostrar o nome da categoria na listagem de produtos.

**Concluído quando:** categorias puderem ser cadastradas, produtos estiverem associados a elas e a listagem mostrar essa associação persistida no banco.

> O enunciado exige cadastro de categorias; edição e exclusão de categorias não são requisitos.

## 5. Desafio 2 — Produtos por categoria

**Pré-requisito:** categorias e associação funcionando.

- [ ] Definir uma rota GET, por exemplo `/produtos/categoria/:categoriaId`.
- [ ] Disponibilizar links ou um seletor para escolher a categoria.
- [ ] Consultar os produtos no banco com `findAll` e uma condição pela chave estrangeira.
- [ ] Mostrar a categoria selecionada e somente os produtos vinculados a ela.
- [ ] Reutilizar a View de listagem se ela atender à necessidade.
- [ ] Mostrar uma mensagem quando a categoria estiver vazia e tratar categoria inexistente.
- [ ] Disponibilizar uma opção para voltar à listagem completa.

**Concluído quando:** selecionar duas categorias diferentes retornar conjuntos corretos de produtos por meio de uma rota acessível na interface.

## 6. Desafio extra — Pesquisa por nome (opcional)

**Pré-requisito:** os dois desafios obrigatórios concluídos.

- [ ] Adicionar um formulário de pesquisa com método GET.
- [ ] Receber o termo, por exemplo em `/produtos?busca=mouse`.
- [ ] Consultar nomes que contenham o termo usando as condições de busca do Sequelize, como `LIKE`.
- [ ] Mostrar os resultados e uma mensagem quando não houver correspondências.
- [ ] Retornar à listagem completa quando a busca estiver vazia.

**Concluído quando:** pesquisar parte do nome retornar os produtos correspondentes a partir do banco.

## 7. Validar o sistema

- [ ] Cadastrar pelo menos cinco produtos.
- [ ] Confirmar listagem, edição e exclusão.
- [ ] Reiniciar o servidor e conferir a persistência dos dados.
- [ ] Abrir `database.sqlite` em uma ferramenta de visualização SQLite e conferir registros e relacionamentos.
- [ ] Cadastrar categorias diferentes e associar produtos a elas.
- [ ] Alterar a categoria de um produto e conferir o resultado nos filtros.
- [ ] Testar categoria com produtos, categoria vazia e ID inexistente.
- [ ] Testar formulários com dados inválidos e confirmar que não gravam registros incorretos.
- [ ] Conferir navegação, mensagens e rótulos dos formulários.
- [ ] Se houver pesquisa, testar correspondência parcial, ausência de resultados e termo vazio.

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
