<!-- Planeja a conexão SQLite e o model Produto antes da implementação. -->
# Model e persistência

Objetivo: concluir a etapa 2 do roadmap sem implementar rotas CRUD.

Arquivos: `cadastro-produtos/models/index.js`, `bin/www`, testes, README, `.gitignore`, roadmap e contexto.

Etapas: escrever testes de persistência, validação e falha de inicialização; definir Produto e conexão; aguardar sincronização antes de escutar HTTP; validar com SQLite temporário e banco local.

Critérios: nome e preço obrigatórios; quantidade inteira não negativa com padrão zero; dados recuperáveis após reabrir conexão; falha de banco encerra o servidor sem aceitar requisições.

Usar `sync()` sem `force` ou `alter`, preservando registros existentes. Banco local ignorado pelo Git. `DATABASE_STORAGE` permite isolar testes sem ler arquivos de ambiente. Reversão: restaurar código de inicialização preservando qualquer banco existente.
