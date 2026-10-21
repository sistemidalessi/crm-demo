# CRM Sistemi Dalessi — demonstração

Demonstração do CRM com **dados fictícios**: clientes, equipe, produtos, notas, pedidos e entregas inventados.
Roda inteira no navegador, sem banco e sem login. Use a barra **Ver como** (embaixo, à esquerda) para ver o sistema
como gestora, vendedora, comprador, logística, motorista (melhor no celular) ou administrador. **Recomeçar** volta
tudo ao início; a base se recria sozinha a cada dia, com as datas de hoje.

O que se faz aqui fica só neste navegador. Funções que dependem do banco ou de serviços externos (WhatsApp da Meta,
e-mail, nota fiscal, IA) não funcionam na demonstração.

Feito pela Sistemi Dalessi — sistemas sob medida.

## Como atualizar

O código é a cópia do `crm/` do repositório `sistemi-dalessi` (sem `supabase/`, `testes/`, `servico-fiscal/`), com
`config.js` em modo local, `demo.js` (base fictícia + barra) e `demo.css`. Depois de copiar de novo:
`node ferramentas/carimba-versao.js` e conferir que o `index.html` carrega `demo.css` e `demo.js` (logo depois de `dados.js`).
