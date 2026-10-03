<!-- Define a verificação integrada da aplicação sem modificar dados locais. -->
# Validação completa

Objetivo: executar etapa 7 do roadmap com evidências reproduzíveis.

Arquivos afetados: teste de reinicialização, relatório de validação, roadmap e contexto. Correções somente se uma falha concreta for encontrada.

Etapas: executar suíte existente; iniciar processo real com SQLite temporário; cadastrar cinco produtos e categorias por HTTP, editar e excluir; encerrar e iniciar novamente; conferir registros e chave estrangeira pelo SQLite; conferir páginas e navegação no navegador disponível.

Aceitação: CRUD persistido após reinicialização, filtros/pesquisa corretos, formulários inválidos sem gravações, rotas com respostas previstas e rótulos acessíveis. Banco local preservado. Usar diretório temporário próprio e encerrar somente processos iniciados pela validação.
