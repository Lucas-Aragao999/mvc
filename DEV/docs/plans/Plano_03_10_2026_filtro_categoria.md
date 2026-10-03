<!-- Planeja a consulta por categoria antes da implementação. -->
# Filtro de produtos por categoria

Objetivo: concluir etapa 5 com GET `/produtos/categoria/:categoriaId`, links de seleção e retorno à lista completa.

Arquivos afetados: rota de produtos, views de produtos e categorias, teste HTTP, README, roadmap e contexto diário.

Etapas: testar duas categorias com produtos e uma vazia; implementar consulta findAll com where categoriaId; reutilizar listagem; testar ID inexistente/inválido e troca de categoria por edição.

Aceitação: cada categoria exibe somente seus produtos e seu nome; categoria vazia retorna 200 com mensagem; categoria inexistente retorna 404; interface oferece filtros e lista completa. Banco local permanece sem dados de teste.

Sem pesquisa por nome nesta etapa. Reversão: remover rota e links sem modificar banco. Executar testes unitários do serviço, conferir sintaxe e respostas HTTP após reiniciar servidor.
