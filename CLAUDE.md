# CLAUDE.md — crm-demo

Falar sempre em **português do Brasil** com o Anderson (regra nº 1 do portfólio).

Demonstração pública do CRM Sistemi Dalessi para vender o sistema: o CRM genérico (`crm/` do repositório
`sistemi-dalessi`) em **modo local** (sem Supabase, sem login), com a base **fictícia** e a barra "Ver como".
Publicado pelo GitHub Pages (branch `main`, raiz): https://sistemidalessi.github.io/crm-demo/

- Peças próprias: `demo.js` (base fictícia que se recria todo dia com as datas de hoje, pedidos de exemplo gravados pelo
  próprio CRM, barra "Ver como" e "Recomeçar"), `demo.css`, `config.js` (modo local, "Distribuidora Exemplo").
  Cópia delas em `sistemi-dalessi/docs/crm-demo/`.
- **Nunca** pôr aqui dado de cliente de verdade, chave, `config.js` de instalação real nem logo de cliente.
- Para atualizar com o CRM novo: copiar o `crm/` do `sistemi-dalessi` (sem `supabase/`, `testes/`, `servico-fiscal/`,
  `CLAUDE.md`, `README.md`, `sair.*`), manter as três peças e as linhas do `index.html` (`demo.css` depois do `crm.css`,
  `demo.js` logo depois do `dados.js`, título "CRM · demonstração") e rodar `node ferramentas/carimba-versao.js`.
