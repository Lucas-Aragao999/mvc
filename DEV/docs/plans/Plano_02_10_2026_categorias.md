<!-- Planeja o cadastro de categorias e a evolução do banco existente. -->
# Categorias e relacionamento

Objetivo: executar etapa 4 com Categoria, relacionamento 1:N, cadastro/listagem e seletor nos produtos.

Arquivos: models, inicialização, rotas, views, testes, README, roadmap e contexto.

Etapas: escrever testes HTTP de categorias e associação; consultar documentação Sequelize; implementar hasMany/belongsTo com categoriaId; adicionar coluna ausente sem force/alter; validar categoria existente no cadastro e edição; conferir reabertura do banco e inicialização repetida.

Banco local consultado: zero produtos, tabela antiga sem categoriaId. Decisão do programador: associar automaticamente produtos legados à categoria “Sem categoria”. Novos cadastros e edições exigem seleção de categoria existente.

Critérios: categoria com nome preenchido; produtos novos associados a categoria existente; edição troca associação; listagem exibe nome; migração mantém campos e dados antigos. Sem edição/exclusão de categorias ou filtro nesta etapa.

Riscos: sync simples não altera tabelas antigas. Evolução será explícita e idempotente, sem reconstruir tabelas ou apagar dados. Testar em banco temporário, preservar banco local e não realizar commits.
