<!-- Registra a reprodução da instalação usando apenas arquivos versionados. -->
# Instalação limpa — 03/10/2026

Copiados 27 arquivos versionados de `cadastro-produtos/` para `tmp/entrega-clean/`, sem node_modules, banco SQLite ou arquivos de ambiente.

- `npm.cmd ci`: concluído, 182 pacotes instalados conforme lockfile. Dois avisos moderados Sequelize/uuid permanecem.
- `npm.cmd run test:unit`: 9 testes aprovados, incluindo persistência após reinício real do processo.
- `npm.cmd start`, com PORT=3002: banco pronto e servidor iniciado.
- GET `/produtos`: HTTP 200 na cópia limpa.
- Consulta SQLite independente confirmou criação das tabelas Categorias e Produtos.
- Servidor temporário encerrado ao concluir; aplicação principal permanece na porta 3000. Diretório de validação ignorado pelo Git.

`origin` aponta para https://github.com/Lucas-Aragao999/mvc. `git ls-remote origin HEAD` respondeu; API GitHub sem autenticação confirmou `private: false` e branch padrão `master`.

README na raiz explica clone e execução a partir de `mvc/cadastro-produtos`. README da aplicação documenta funcionalidades reais, associação, rotas, pesquisa, banco automático e roteiro de demonstração com categorias e cinco produtos.

Pendências: preencher integrante/RM no README da raiz e versionar/publicar as alterações finais. Não foram realizados commits ou pushes, conforme regras do projeto. A disponibilidade pública do repositório foi confirmada; esta verificação não implica que as alterações locais finais já estejam publicadas.
