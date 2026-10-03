<!-- Este arquivo complementa as regras globais com orientações específicas para o Codex. -->

# Instruções específicas do Codex

- Trate o `AGENTS.MD` da raiz como a fonte principal de regras do projeto.
- Use `rg` e `rg --files` para localizar arquivos e conteúdo.
- Use `apply_patch` em alterações manuais e preserve mudanças do programador.
- Não execute commits, pushes ou comandos destrutivos sem solicitação explícita.
- Nunca leia arquivos `.env`; consulte somente `.env.example`.
- Registre o plano em `.AIs/docs/plans/` antes de implementar.
- Ao concluir, valide a mudança e atualize `.AIs/docs/contexts/Context_dd_mm_aaaa.md`.
