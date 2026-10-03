<!-- Define a implementação e a validação do CRUD antes de alterar a aplicação. -->
# CRUD de produtos

Objetivo: concluir a etapa 3 com as seis rotas previstas, páginas EJS e validação no servidor.

Arquivos afetados: app, rota inicial, nova rota produtos, views de produtos, testes, README, roadmap e contexto.

Etapas: testar fluxo HTTP completo com SQLite isolado; implementar rotas e views; aceitar somente nome, preço e quantidade; verificar campos inválidos, IDs inexistentes e falhas de banco; reiniciar servidor e validar páginas reais.

Aceitação: criar cinco produtos, listar, editar e excluir; verificar registros pelo model; mostrar erros sem perder dados do formulário; devolver 404 para produto inexistente e 500 para falha inesperada. Persistência após reabertura já coberta pelo teste do model.

Limites: sem categorias e sem pesquisa nesta etapa. Não alterar o banco existente de forma destrutiva nem realizar commits. Reversão: remover registro da rota preservando os produtos armazenados.
