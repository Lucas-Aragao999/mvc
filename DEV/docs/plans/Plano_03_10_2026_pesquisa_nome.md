<!-- Planeja a pesquisa por nome antes da alteração das rotas. -->
# Pesquisa por nome

Objetivo: executar etapa opcional 6 após os desafios obrigatórios, autorizada pelo pedido de continuar o roadmap.

Arquivos: rota de produtos, view de listagem, teste HTTP, README, roadmap e contexto.

Etapas: testar nome parcial, resultado vazio e termo vazio; implementar condição LIKE pelo Sequelize; adicionar formulário GET; combinar pesquisa com categoria atual; validar e reiniciar aplicação.

Aceitação: `/produtos?busca=mouse` consulta o banco; termo vazio lista tudo; categoria limita a pesquisa; página mantém termo e exibe ausência de resultados. Parâmetros não textuais são tratados como busca vazia. Nenhuma alteração no banco local.
