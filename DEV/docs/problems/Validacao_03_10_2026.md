<!-- Registra evidências da validação consolidada sem modificar o banco de uso local. -->
# Validação do sistema — 03/10/2026

Resultado: requisitos funcionais passaram. Executado `npm.cmd run test:unit` com 9 testes aprovados.

| Verificação | Evidência |
| --- | --- |
| Cinco produtos, listagem, edição e exclusão | Testes CRUD e reinício enviam formulários HTTP reais |
| Persistência após reiniciar | Processo encerrado e iniciado novamente; quatro registros restantes recuperados |
| Registros e relacionamento SQLite | SELECT com JOIN em conexão independente confirma preço, quantidade e categoria |
| Categorias e troca de vínculo | Categoria existente exigida; troca pela edição refletida no filtro |
| Filtros | Duas categorias com conjuntos distintos, categoria vazia com 200 e IDs inexistentes/inválidos com 404 |
| Dados inválidos | HTTP 422, sem criação ou alteração indevida; nomes escapados na renderização |
| Falhas de banco | HTTP 500 em requisições e saída 1 quando a inicialização falha |
| Pesquisa | Nome parcial, ausência de correspondência, termo vazio e pesquisa por categoria |
| Migração | Banco antigo preservado e associado a “Sem categoria”; segunda execução não duplica registros |
| Navegação e rótulos | HTML EJS inspecionado: links de início/produtos/categorias, filtro, retorno, limpeza da busca e labels associados aos campos |

Dados recuperados após o reinício do processo de teste:

| ID | Nome | Preço | Quantidade | Categoria |
| --- | --- | --- | --- | --- |
| 1 | Mouse atualizado | 25,90 | 7 | Escritório |
| 2 | Produto 2 | 15,50 | 2 | Informática |
| 3 | Produto 3 | 15,50 | 2 | Informática |
| 4 | Produto 4 | 15,50 | 2 | Escritório |

O quinto produto foi excluído antes do reinício. Os testes usam bancos temporários removidos ao concluir. O banco local permaneceu vazio; sua chave estrangeira categoriaId → Categorias.id foi inspecionada em leitura.

Páginas `/`, `/produtos`, `/produtos/novo` e `/categorias` retornaram HTTP 200 na aplicação local. O cadastro informa a necessidade de uma categoria e desabilita o envio quando nenhuma existe.

Limitação: não foi possível revisar visualmente em navegador ou abrir um visualizador SQLite gráfico. A sessão não disponibiliza navegador e a tentativa de abrir o navegador integrado retornou “Browser is not available: iab”. Conferência da interface feita pelo HTML renderizado e pelos testes HTTP; conferência SQLite feita por consultas diretas e inspeção da chave estrangeira.

Pendências de entrega: nome/RM do integrante, instalação limpa e publicação/verificação do repositório no GitHub. Os dois avisos moderados Sequelize/uuid registrados anteriormente continuam pendentes.
