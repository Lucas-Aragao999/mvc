# Regras globais para agentes de IA

Estas regras valem para qualquer IA que trabalhe neste repositório, inclusive
Codex e OpenCode.

1. Antes de editar, informe os arquivos afetados e a natureza da mudança.
   Aguarde a aprovação explícita do usuário, exceto quando o pedido do usuário
   já autorizar inequivocamente a edição.
2. Nunca leia, edite, exponha ou versiona arquivos `.env`. Consulte apenas os
   respectivos `.env.example`.
3. Arquivos e funções novos devem ter comentários em português: no topo do
   arquivo, explique seu propósito; em cada função ou método, descreva o que
   faz, por que existe e como funciona.
4. Use TDD: escreva testes unitários antes da implementação. Uma funcionalidade
   só está completa após passar em `npm run test:unit` no serviço aplicável.
   Mudanças apenas documentais ou de configuração devem ser validadas com os
   parsers, linters ou esquemas correspondentes.
5. Ao fim de cada sessão de IA, atualize ou crie
   `.AIs/docs/contexts/Context_dd_mm_aaaa.md` com o que foi feito, arquivos
   alterados e pendências.
6. `git log` é permitido.
7. Organize a entrega em pequenos commits, feitos pelo programador e não pela IA.
   Cada push deve representar uma funcionalidade pronta e verificável.
8. Planeje o desenvolvimento antes de aplicá-lo. Registre o plano em um arquivo
   Markdown dentro de `.AIs/docs/plans/`.
9. Quando solicitado, produza o RDA em texto corrido com no máximo 10 linhas.
   Faça o mesmo quando restarem aproximadamente 10% do limite de tokens.
10. Sempre que necessario, rebuildar e rerodar o docker.

11. O Plane e a estrutura local de trabalho seguem o contrato descrito em
    `.AIs/docs/plane.md`. Módulos ficam em `.AIs/modules/<modulo>/` e cada tarefa
    em `.AIs/modules/<modulo>/tasks/<identificador>.md`; não crie tarefas soltas
    em `.AIs/tasks/`.
12. A API do Plane deve ser usada em modo somente leitura durante a importação.
    Nunca registre tokens, chaves ou cabeçalhos de autenticação nos arquivos MD,
    logs ou commits.
13. Sempre que necessario durante o decorrer do projeto, faca perguntas sobre decisoes de escopo e de funcionalidaes, a AI nao decide nada sobre a parte operacional do sistema mas apenas da palpites e aguarda a decisao do programador, tambem e importante que as decisoes sejam tomadas e alteradas nos arquivos de documentacao. 

Consulte `.AIs/README.md` para o índice da documentação do projeto e
`.AIs/conf/.codex/AGENTS.md` para as configurações específicas do Codex.
