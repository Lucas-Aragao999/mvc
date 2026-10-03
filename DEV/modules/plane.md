<!-- Este documento define o contrato entre o Plane e a estrutura local dos agentes. -->

# Contrato de integração com o Plane

## Objetivo

Padronizar a importação de módulos e tarefas do Plane para arquivos locais, sem permitir que a importação altere o estado remoto.

## Segurança

A API do Plane deve ser usada somente para leitura. Não crie, edite, mova, arquive ou exclua dados remotos durante a importação. Tokens, chaves, cookies e cabeçalhos de autenticação não podem aparecer em Markdown, configurações, logs ou commits.

## Mapeamento local

```text
.AIs/modules/<modulo>/
├── README.md
└── tasks/
    └── <identificador>.md
```

- O módulo usa nome estável em `kebab-case`.
- A tarefa preserva o identificador legível do Plane quando disponível.
- Não use `.AIs/tasks/` nem crie tarefas soltas.
- O README do módulo registra objetivo, escopo, estado, dependências, fonte e última sincronização.
- A tarefa registra identificador, título, descrição, critérios de aceitação, estado, prioridade, responsáveis, dependências e origem.

## Sincronização

1. Consulte o Plane em modo somente leitura.
2. Normalize nomes sem perder identificadores remotos.
3. Atualize somente `.AIs/modules/`.
4. Preserve anotações locais separadas dos dados importados.
5. Registre a sincronização no contexto diário.
6. Em divergências, sinalize o conflito e não apague conteúdo automaticamente.
