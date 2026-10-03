# Template de integração para agentes de IA

Este repositório é a fonte do diretório `.AIs/` usado nos projetos. Ele centraliza regras, configurações, planos, contextos e tarefas para que diferentes agentes trabalhem com o mesmo contrato operacional.

Consulte `manual_DEV.pdf` para o guia visual completo deste pacote.

Ao instalar o template, copie este conteúdo para `<projeto>/.AIs/` e mantenha o `AGENTS.MD` na raiz do projeto. Os caminhos abaixo consideram essa estrutura instalada.

## Estrutura

```text
.AIs/
├── conf/              # Modelos de configuração por ferramenta
├── docs/
│   ├── contexts/     # Registro das sessões de IA
│   ├── initialDocs/  # Handoff e documentação inicial
│   ├── plans/        # Planos anteriores à implementação
│   ├── problems/     # Problemas e respectivas soluções
│   └── plane.md     # Contrato de integração com o Plane
└── modules/           # Módulos e tarefas importadas ou locais
```

## Fluxo de trabalho

1. Leia o `AGENTS.MD` da raiz e as instruções específicas da ferramenta.
2. Consulte `docs/initialDocs/` e o contexto mais recente em `docs/contexts/`.
3. Crie um plano em `docs/plans/` antes de implementar mudanças.
4. Organize tarefas em `modules/<modulo>/tasks/`, conforme `docs/plane.md`.
5. Execute os testes aplicáveis e registre o resultado no contexto diário.

## Configurações

Os arquivos em `conf/` são modelos seguros e versionáveis. Copie-os para os caminhos reconhecidos na raiz do projeto:

| Ferramenta | Modelo | Destino |
| --- | --- | --- |
| Codex | `conf/.codex/config.toml` | `.codex/config.toml` |
| Codex | `conf/.codex/AGENTS.md` | `.codex/AGENTS.md` |
| Claude Code | `conf/.claude/settings.json` | `.claude/settings.json` |
| Gemini CLI | `conf/.gemini/settings.json` | `.gemini/settings.json` |
| OpenCode | `conf/.opencode/opencode.json` | `.opencode/opencode.json` |

Credenciais, tokens e segredos nunca devem ser incluídos. Arquivos `.env` não podem ser lidos ou alterados por agentes; use somente `.env.example` como referência.

## Antes do desenvolvimento

Para descobrir requisitos e definir dados, banco, arquitetura, infraestrutura, stack, estrutura e roadmap, use primeiro o pacote separado `Arquiteture`. Este pacote `DEV` deve ser adotado depois que o projeto estiver aprovado para iniciar.
