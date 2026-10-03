# Módulos de trabalho

Este diretório organiza o trabalho por módulo funcional ou componente do projeto. Cada módulo mantém sua documentação e suas tarefas, alinhando o roadmap local ao Plane.

```text
modules/<modulo>/
├── README.md
└── tasks/
    └── <identificador>.md
```

- Use `kebab-case` para o nome do módulo.
- Preserve o identificador estável do Plane no nome da tarefa importada.
- Registre no README do módulo seu escopo, dependências e limites.
- Não crie tarefas fora de `modules/<modulo>/tasks/`.
- Siga o contrato de `docs/plane.md`.
