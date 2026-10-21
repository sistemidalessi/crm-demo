/* Demonstração do CRM (21/10/2026): o CRM roda no modo local (sem banco), com uma base fictícia que se recria todo dia
   (as datas acompanham o dia de hoje) e uma barra "Ver como" para trocar de papel. Nada aqui é cliente de verdade. */
(function () {
  'use strict';
  const R = window.CRMRegras;
  const VERSAO = 'demo-1';
  const ls = { le: k => { try { return localStorage.getItem(k); } catch (e) { return null; } }, grava: (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* sem armazenamento */ } } };
const COR = { QUIMICOS: ['#e3f4f7', '#03baca', '#0f6f7d'], HIGIENE: ['#eef6e2', '#8fbf3a', '#4c6d14'], PAPEIS: ['#f4f1ea', '#ffffff', '#9a8c6c'],
  'SACOS P/ LIXO': ['#ececf1', '#2d2f36', '#14151a'], DESCARTAVEIS: ['#fbf1e6', '#ffffff', '#c98a3c'], EPI: ['#e7eefb', '#2f6fd6', '#1d4594'], UTENSILIOS: ['#fdf3d9', '#f2b705', '#8a6a00'] };
function svg(linha, rotulo) {
  const [fundo, a, b] = COR[linha] || COR.QUIMICOS;
  let corpo = '';
  if (linha === 'QUIMICOS' || linha === 'HIGIENE') corpo = `<rect x="120" y="70" width="160" height="200" rx="26" fill="${a}" stroke="${b}" stroke-width="6"/><rect x="170" y="40" width="60" height="40" rx="8" fill="${b}"/><path d="M280 110 q50 10 40 70" fill="none" stroke="${b}" stroke-width="16" stroke-linecap="round"/><rect x="140" y="140" width="120" height="70" rx="10" fill="#fff"/>`;
  else if (linha === 'PAPEIS') corpo = `<ellipse cx="200" cy="90" rx="90" ry="28" fill="#fff" stroke="${b}" stroke-width="6"/><rect x="110" y="90" width="180" height="170" fill="#fff" stroke="${b}" stroke-width="6"/><ellipse cx="200" cy="260" rx="90" ry="28" fill="#fff" stroke="${b}" stroke-width="6"/><ellipse cx="200" cy="90" rx="26" ry="9" fill="${b}"/><rect x="130" y="150" width="140" height="56" rx="8" fill="${fundo}"/>`;
  else if (linha === 'SACOS P/ LIXO') corpo = `<path d="M130 100 q70 -60 140 0 l20 160 q-90 30 -180 0 z" fill="${a}" stroke="${b}" stroke-width="6"/><path d="M175 75 q25 -40 50 0" fill="none" stroke="${a}" stroke-width="14"/><rect x="150" y="160" width="100" height="50" rx="8" fill="#fff" opacity=".9"/>`;
  else if (linha === 'DESCARTAVEIS') corpo = `<path d="M140 80 h120 l-18 190 h-84 z" fill="#fff" stroke="${b}" stroke-width="6"/><path d="M160 80 h120 l-18 190" fill="none" stroke="${b}" stroke-width="3" opacity=".5"/><rect x="152" y="150" width="96" height="46" rx="8" fill="${fundo}"/>`;
  else if (linha === 'EPI') corpo = `<path d="M150 270 v-120 q0 -20 16 -20 v-60 q0 -16 14 -16 t14 16 v50 v-66 q0 -16 14 -16 t14 16 v66 v-56 q0 -16 14 -16 t14 16 v66 v-40 q0 -14 14 -14 t14 14 v90 q0 50 -40 70 z" fill="${a}" stroke="${b}" stroke-width="6" stroke-linejoin="round"/>`;
  else corpo = `<rect x="110" y="120" width="180" height="110" rx="22" fill="${a}" stroke="${b}" stroke-width="6"/><rect x="110" y="150" width="180" height="22" fill="${b}" opacity=".35"/><rect x="190" y="40" width="20" height="90" rx="6" fill="${b}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 320"><rect width="400" height="320" fill="${fundo}"/>${corpo}<text x="200" y="305" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="${b}">${rotulo}</text></svg>`;
}
const ilustra = (linha, rotulo) => 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg(linha, rotulo))));

const baseFicticia = function (HOJE) {
  let seq = 0;
  const id = p => (p || 'x') + '-' + String(++seq).padStart(4, '0') + '-4000-8000-000000000000'.slice(0, 0) + Math.random().toString(16).slice(2, 10);
  const dia = n => { const d = new Date(HOJE + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
  const quando = (n, h) => dia(n) + 'T' + (h || '10:00') + ':00-03:00';
  const agora = quando(0, '08:00');
  // CNPJ com dígito verificador certo, a partir de 8 números + filial
  const cnpj = (raiz, fil) => {
    const b = String(raiz).padStart(8, '0') + String(fil || 1).padStart(4, '0');
    const dv = s => { const p = s.length === 12 ? [5,4,3,2,9,8,7,6,5,4,3,2] : [6,5,4,3,2,9,8,7,6,5,4,3,2]; const t = s.split('').reduce((a, c, i) => a + Number(c) * p[i], 0) % 11; return t < 2 ? 0 : 11 - t; };
    const d1 = dv(b), d2 = dv(b + d1); return b + d1 + d2;
  };
  const ADMIN = '00000000-0000-4000-8000-000000000001';
  const U = (user_id, nome, papel, extra) => Object.assign({ user_id, nome, papel, ativo: true, recebe_leads: papel === 'vendedor', criado_em: agora }, extra || {});
  const usuarios = [
    U(ADMIN, 'Administrador', 'admin'),
    U('u-gestora', 'Carla Mendes', 'gestor', { email: 'carla@exemplo.com.br' }),
    U('u-bruna', 'Bruna Alves', 'vendedor', { telefone: '11990000001' }),
    U('u-diego', 'Diego Rocha', 'vendedor', { telefone: '11990000002' }),
    U('u-fernanda', 'Fernanda Lima', 'vendedor', { telefone: '11990000003' }),
    U('u-gustavo', 'Gustavo Prado', 'comprador'),
    U('u-helena', 'Helena Souza', 'logistica'),
    U('u-joao', 'João Batista', 'motorista'),
    U('u-marcos', 'Marcos Vieira', 'motorista')
  ];
  const vend = ['u-bruna', 'u-diego', 'u-fernanda'];
  const nomeU = i => usuarios.find(u => u.user_id === i).nome;
  // ---------------------------------------------------------------- produtos (listagem do sistema de gestão, fictícia)
  const P = (codigo, descricao, unidade, linha, preco, custo, atual, min, max, forn, pend, extra) => Object.assign({ codigo, descricao, unidade, linha, situacao: 'ATIVO',
    preco_venda: preco, custo_unit: custo, custo_compra: custo, estoque_atual: atual, quantidade: atual, estoque_min: min, estoque_max: max, pend_cliente: 0,
    pend_fornecedor: pend || 0, fornecedor_cod: forn[0], fornecedor: forn[1], ult_entrada: dia(-12), ult_saida: dia(-1),
    custo_total: atual > 0 ? Math.round(atual * custo * 100) / 100 : 0, atualizado_em: quando(0, '13:05') }, extra || {});
  const F1 = ['00101', 'QUIMICA BOA LIMPEZA LTDA'], F2 = ['00102', 'PAPEIS DO VALE IND. E COM.'], F3 = ['00103', 'PLASTICOS ABC EMBALAGENS'], F4 = ['00104', 'PROTEGE EPI DISTRIBUIDORA'];
  const estoque = [
    P('100010', 'DETERGENTE NEUTRO 5 LTS', 'GL', 'QUIMICOS', 32.9, 19.8, 46, 30, 120, F1),
    P('100011', 'DESINFETANTE LAVANDA 5 LTS', 'GL', 'QUIMICOS', 27.5, 15.9, 12, 40, 150, F1),
    P('100012', 'AGUA SANITARIA 5 LTS', 'GL', 'QUIMICOS', 18.4, 10.2, 85, 50, 200, F1),
    P('100013', 'LIMPA VIDROS 500 ML', 'UN', 'QUIMICOS', 9.8, 5.1, 7, 24, 96, F1),
    P('100014', 'ALCOOL 70% 5 LTS', 'GL', 'QUIMICOS', 49.9, 31.5, 22, 20, 80, F1),
    P('100015', 'SABONETE LIQUIDO ERVA DOCE 5 LTS', 'GL', 'HIGIENE', 39.9, 22.4, 18, 25, 90, F1, 30),
    P('200020', 'PAPEL HIGIENICO ROLAO 300 M C/8', 'FD', 'PAPEIS', 54.9, 36.2, 140, 80, 300, F2),
    P('200021', 'PAPEL TOALHA INTERFOLHA 1000 FLS', 'FD', 'PAPEIS', 26.9, 16.8, 31, 60, 240, F2, 120),
    P('200022', 'GUARDANAPO 30X30 C/50', 'PT', 'PAPEIS', 4.2, 2.3, 260, 100, 500, F2),
    P('200023', 'PAPEL HIGIENICO FOLHA DUPLA 30 M C/16', 'FD', 'PAPEIS', 38.5, 25.9, -6, 40, 160, F2),
    P('300030', 'SACO P/ LIXO 100 LTS PRETO C/100', 'PT', 'SACOS P/ LIXO', 49.7, 30.4, 64, 40, 150, F3),
    P('300031', 'SACO P/ LIXO 60 LTS AZUL C/100', 'PT', 'SACOS P/ LIXO', 36.9, 21.7, 15, 40, 150, F3),
    P('300032', 'COPO DESCARTAVEL 200 ML C/100', 'PT', 'DESCARTAVEIS', 6.9, 3.8, 410, 200, 800, F3),
    P('300033', 'MARMITEX ALUMINIO N9 C/100', 'CX', 'DESCARTAVEIS', 58.0, 37.6, 9, 15, 60, F3),
    P('400040', 'LUVA NITRILICA AZUL M C/100', 'CX', 'EPI', 34.9, 21.0, 52, 30, 120, F4),
    P('400041', 'LUVA LATEX AMARELA G (PAR)', 'PR', 'EPI', 5.9, 3.1, 120, 60, 240, F4),
    P('400042', 'MASCARA DESCARTAVEL TRIPLA C/50', 'CX', 'EPI', 14.9, 7.9, 4, 20, 80, F4),
    P('500050', 'PANO MULTIUSO AZUL ROLO 300 PANOS', 'RL', 'UTENSILIOS', 79.9, 49.0, 11, 8, 30, F2),
    P('500051', 'ESPONJA DUPLA FACE C/10', 'PT', 'UTENSILIOS', 8.9, 4.4, 95, 50, 200, F3),
    P('500052', 'MOP UMIDO COMPLETO', 'UN', 'UTENSILIOS', 69.0, 41.0, 6, 5, 20, F3)
  ];
  const prod = c => estoque.find(p => p.codigo === c);
  const fornecedores = [
    { codigo: F1[0], nome: F1[1], prazo_dias: 7, pedido_minimo: 1500, frete: 'cif', dias_pedido: [1, 3], pagamento: '28 dias', contato: 'Rafael · (11) 4000-1001', ativo: true },
    { codigo: F2[0], nome: F2[1], prazo_dias: 10, pedido_minimo: 2500, frete: 'cif', dias_pedido: [2], pagamento: '28/42 dias', contato: 'Luciana · (11) 4000-1002', ativo: true },
    { codigo: F3[0], nome: F3[1], prazo_dias: 5, pedido_minimo: 800, frete: 'fob', dias_pedido: [1, 2, 3, 4, 5], pagamento: '21 dias', contato: 'Paulo · (11) 4000-1003', ativo: true },
    { codigo: F4[0], nome: F4[1], prazo_dias: 3, pedido_minimo: 500, frete: 'cif', dias_pedido: [4], pagamento: 'boleto 14 dias', contato: 'Sônia · (11) 4000-1004', ativo: true }
  ];
  // ---------------------------------------------------------------- clientes fictícios
  const EMP = [
    ['Condomínio Residencial Jardim das Acácias', 'Condomínio', 'Rua das Acácias', '210', 'Jardim do Mar', 'São Bernardo do Campo', '09750-210', 'Sra. Regina (síndica)'],
    ['Restaurante Sabor da Casa', 'Restaurante', 'Av. Kennedy', '900', 'Jardim do Mar', 'São Bernardo do Campo', '09726-251', 'Sr. Paulo'],
    ['Padaria Pão Quente', 'Padaria', 'Rua Marechal Deodoro', '1250', 'Centro', 'São Bernardo do Campo', '09710-002', 'Márcia'],
    ['Colégio Novo Horizonte', 'Escola', 'Rua Joaquim Nabuco', '415', 'Centro', 'Santo André', '09020-030', 'Roberto (compras)'],
    ['Clínica Bem Viver', 'Clínica', 'Av. Portugal', '1500', 'Centro', 'Santo André', '09040-001', 'Dra. Juliana'],
    ['Academia Corpo em Forma', 'Academia', 'Rua Oratório', '880', 'Parque das Nações', 'Santo André', '09280-000', 'Thiago'],
    ['Hotel Estrela do ABC', 'Hotel', 'Av. Industrial', '600', 'Jardim', 'Santo André', '09080-510', 'Sandra (governança)'],
    ['Condomínio Edifício Primavera', 'Condomínio', 'Rua Tiradentes', '77', 'Santa Terezinha', 'São Bernardo do Campo', '09780-000', 'Sr. Antônio (zelador)'],
    ['Lanchonete Ponto Certo', 'Restaurante', 'Rua Jurubatuba', '1020', 'Centro', 'São Bernardo do Campo', '09725-000', 'Edu'],
    ['Escritório Contábil Exato', 'Escritório', 'Av. Senador Vergueiro', '2000', 'Anchieta', 'São Bernardo do Campo', '09600-000', 'Patrícia'],
    ['Supermercado Bom Preço', 'Varejo', 'Av. Goiás', '3100', 'Barcelona', 'São Caetano do Sul', '09550-050', 'Wilson (compras)'],
    ['Igreja Comunidade Esperança', 'Instituição', 'Rua Alegre', '45', 'Santa Paula', 'São Caetano do Sul', '09541-000', 'Pastor Daniel'],
    ['Pet Shop Amigo Fiel', 'Varejo', 'Rua Manoel Coelho', '300', 'Centro', 'São Caetano do Sul', '09510-100', 'Aline'],
    ['Indústria Metalúrgica Forte', 'Indústria', 'Av. Piraporinha', '1800', 'Planalto', 'Diadema', '09950-000', 'Sr. Carlos (facilities)'],
    ['Lar dos Idosos Recanto Feliz', 'Instituição', 'Rua das Flores', '120', 'Centro', 'Diadema', '09910-000', 'Irmã Lúcia'],
    ['Buffet Festa Boa', 'Eventos', 'Av. Lucas Nogueira Garcez', '410', 'Jardim do Mar', 'São Bernardo do Campo', '09750-600', 'Simone'],
    ['Condomínio Parque dos Ipês', 'Condomínio', 'Rua Kara', '1500', 'Jardim do Mar', 'São Bernardo do Campo', '09750-300', 'Sr. Mário (síndico)'],
    ['Auto Posto Via Rápida', 'Comércio', 'Via Anchieta', 'km 21', 'Batistini', 'São Bernardo do Campo', '09842-000', 'Renato'],
    ['Faculdade Saber ABC', 'Escola', 'Av. Pereira Barreto', '1200', 'Paraíso', 'Santo André', '09190-610', 'Larissa (facilities)'],
    ['Hospital Veterinário Patas', 'Clínica', 'Rua Gertrudes de Lima', '350', 'Centro', 'Santo André', '09020-100', 'Dr. Felipe']
  ];
  const empresas = [], contatos = [];
  EMP.forEach((e, i) => {
    const eid = 'emp-' + String(i + 1).padStart(2, '0');
    const resp = i % 5 < 3 ? 'u-bruna' : i % 5 === 3 ? 'u-diego' : 'u-fernanda';
    empresas.push({ id: eid, nome: e[0], razao_social: e[0].toUpperCase() + ' LTDA', cnpj: cnpj(40100000 + i * 137, 1), situacao: i < 15 ? 'cliente' : 'lead', segmento: e[1], origem: i % 4 === 0 ? 'Indicação' : i % 4 === 1 ? 'Site' : i % 4 === 2 ? 'Prospecção' : 'Carteira antiga',
      qualificacao: 3 + (i % 3), responsavel_id: resp, telefone: '11' + (40000000 + i * 111), whatsapp: '119' + (80000000 + i * 1234), email: 'compras@' + e[0].toLowerCase().normalize('NFD').replace(/[^a-z]/g, '').slice(0, 14) + '.com.br',
      cep: e[6], logradouro: e[2], numero: e[3], bairro: e[4], cidade: e[5], uf: 'SP', tags: [], observacoes: i === 1 ? 'Entrega pela porta dos fundos, antes das 11h.' : '', criado_em: i < 15 ? quando(-200 + i) : quando(-(i - 14), '1' + (i % 8) + ':20'), atualizado_em: agora });
    contatos.push({ id: 'cont-' + (i + 1), empresa_id: eid, nome: e[7], cargo: 'Compras', celular: '119' + (80000000 + i * 1234), whatsapp: '119' + (80000000 + i * 1234), email: 'contato' + (i + 1) + '@exemplo.com.br', principal: true, tags: [], criado_em: quando(-200 + i), atualizado_em: agora });
  });
  // ---------------------------------------------------------------- notas (os últimos 4 meses) e itens
  const notas = [], nota_itens = [], titulos = [];
  let numNF = 3100;
  const cesta = [['100010', 6], ['200020', 10], ['300030', 4], ['100012', 8], ['300032', 20], ['400040', 3], ['200021', 12], ['500051', 5], ['100011', 6], ['200022', 30]];
  for (let i = 0; i < 15; i++) {
    const e = empresas[i], ritmo = [14, 21, 30, 28, 15][i % 5];
    for (let d = -120 + (i % 7); d <= -1; d += ritmo) {
      if (i === 6 && d > -60) break; // o hotel parou de comprar (aparece na recompra como atrasado)
      if ((i === 0 || i === 7 || i === 9) && d > -(ritmo + 1)) break; // passaram do ritmo de compra (aparecem na Recompra)
      const nid = 'nf-' + numNF;
      const itens = cesta.slice(i % 4, (i % 4) + 3 + (i % 3)).map(([c, q], k) => { const p = prod(c); const qt = q + (i % 3); return { id: 'it-' + numNF + '-' + k, nota_id: nid, ordem: k + 1, codigo: c, descricao: p.descricao, unidade: p.unidade, ncm: '34022000', cfop: '5102', quantidade: qt, valor_unitario: p.preco_venda, valor_total: Math.round(qt * p.preco_venda * 100) / 100, criado_em: quando(d) }; });
      const total = Math.round(itens.reduce((a, x) => a + x.valor_total, 0) * 100) / 100;
      const direto = i === 13;
      notas.push({ id: nid, chave: '3526' + String(numNF).padStart(40, '0'), numero: numNF, serie: 1, emitida_em: quando(d, '09:' + String(10 + (i * 3) % 50).padStart(2, '0')), empresa_id: e.id, cliente_doc: e.cnpj, cliente_nome: e.razao_social,
        cidade: e.cidade, uf: 'SP', natureza: 'VENDA DE MERCADORIA', valor_produtos: total, valor_total: total, cancelada: false, vendedor_id: direto ? ADMIN : e.responsavel_id, vendedor_nome: direto ? 'DIRETO' : nomeU(e.responsavel_id).split(' ')[0].toUpperCase(),
        itens, criado_em: quando(d), atualizado_em: quando(d) });
      itens.forEach(x => nota_itens.push(Object.assign({}, x)));
      const venc = dia(d + 28);
      if (d + 28 >= 0 || (i === 6 && d > -100)) titulos.push({ id: 'tit-' + numNF, nota_id: nid, empresa_id: e.id, documento: String(numNF) + '/1', parcela: 1, vencimento: venc, valor: total, abono: false, origem: 'nfe', criado_em: quando(d) });
      numNF++;
    }
  }
  // as notas de hoje (para a rota) — emitidas de manhã
  const hojeNF = [2, 3, 4, 8, 1, 14, 11].map((i, k) => {
    const e = empresas[i], nid = 'nf-' + numNF, c = cesta[k % cesta.length], p = prod(c[0]);
    const it = { id: 'it-' + numNF, nota_id: nid, ordem: 1, codigo: c[0], descricao: p.descricao, unidade: p.unidade, ncm: '34022000', cfop: '5102', quantidade: c[1], valor_unitario: p.preco_venda, valor_total: Math.round(c[1] * p.preco_venda * 100) / 100, criado_em: agora };
    notas.push({ id: nid, chave: '3526' + String(numNF).padStart(40, '0'), numero: numNF, serie: 1, emitida_em: quando(0, '0' + (7 + (k % 2)) + ':' + String(5 + k * 6).padStart(2, '0')), empresa_id: e.id, cliente_doc: e.cnpj, cliente_nome: e.razao_social, cidade: e.cidade, uf: 'SP',
      natureza: 'VENDA DE MERCADORIA', valor_produtos: it.valor_total, valor_total: it.valor_total, cancelada: false, vendedor_id: e.responsavel_id, vendedor_nome: nomeU(e.responsavel_id).split(' ')[0].toUpperCase(), itens: [it], criado_em: agora, atualizado_em: agora });
    nota_itens.push(Object.assign({}, it));
    numNF++;
    return nid;
  });
  // ---------------------------------------------------------------- negócios, tarefas e metas
  const etapasNomes = ['Prospecção', 'Contato feito', 'Qualificação', 'Proposta enviada', 'Negociação'];
  const NEG = [
    [15, 'Contrato mensal de limpeza — condomínio', 0, 4800], [16, 'Kit descartáveis para eventos', 1, 2350], [17, 'Reposição mensal do posto', 2, 1890], [18, 'Material de limpeza do semestre', 4, 12600],
    [19, 'Higiene e EPI do hospital', 3, 3700], [3, 'Volta às aulas — papel e sabonete', 4, 5400], [5, 'Academia: toalha e álcool', 3, 980], [10, 'Supermercado: sacos de lixo', 3, 2150],
    [12, 'Pet shop: limpeza das baias', 2, 760], [6, 'Hotel: retomar as compras', 1, 6900], [11, 'Igreja: copos e guardanapos', 2, 640], [8, 'Lanchonete: marmitex', 4, 1320], [1, 'Restaurante: descartáveis de delivery', 3, 2780], [2, 'Padaria: embalagens e luvas', 2, 1150]
  ];
  const negocios = NEG.map((n, k) => ({ id: 'neg-' + (k + 1), empresa_id: empresas[n[0]].id, contato_id: 'cont-' + (n[0] + 1), titulo: n[1], etapaNome: etapasNomes[n[2]], status: 'aberto', valor: n[3],
    responsavel_id: empresas[n[0]].responsavel_id, origem: empresas[n[0]].origem, previsao_fechamento: dia(5 + k * 2), etapa_desde: quando(-3 - k * 2), criado_em: quando(-20 - k), atualizado_em: quando(-2) }));
  // ganhos e perdidos do mês
  [[0, 'Pedido de outubro', 1840.5, 'ganho', -12], [2, 'Reposição quinzenal', 920.3, 'ganho', -8], [4, 'Pedido da clínica', 1475, 'ganho', -5], [9, 'Material do escritório', 610.4, 'ganho', -3],
    [1, 'Contrato anual do restaurante', 8900, 'perdido', -6], [7, 'Condomínio: troca de fornecedor', 2300, 'ganho', -2]].forEach((g, k) => negocios.push({ id: 'neg-g' + k, empresa_id: empresas[g[0]].id,
    titulo: g[1], etapaNome: etapasNomes[4], status: g[3], valor: g[2], responsavel_id: empresas[g[0]].responsavel_id, fechado_em: quando(g[4], '15:00'), motivo_perda: g[3] === 'perdido' ? 'Preço' : null,
    etapa_desde: quando(g[4] - 5), criado_em: quando(g[4] - 20), atualizado_em: quando(g[4]) }));
  const atividades = [];
  const T = (emp, tipo, descricao, n, h, resp, negId, feita) => atividades.push({ id: 'atv-' + (atividades.length + 1), empresa_id: empresas[emp].id, negocio_id: negId || null, tipo, descricao, data_hora: quando(n, h),
    concluida: !!feita, concluida_em: feita ? quando(n, h) : null, responsavel_id: resp || empresas[emp].responsavel_id, automatica: false, criado_em: quando(n - 3), atualizado_em: quando(n - 1) });
  T(15, 'ligacao', 'Ligar para a síndica e apresentar a proposta de contrato mensal', 0, '09:30', null, 'neg-1');
  T(18, 'reuniao', 'Visita à faculdade: levar amostras do papel toalha', 0, '14:00', null, 'neg-4');
  T(3, 'whatsapp', 'Confirmar o pedido da volta às aulas', 0, '10:00', null, 'neg-6');
  T(6, 'ligacao', 'Hotel parou de comprar: perguntar o que aconteceu', -2, '11:00');
  T(16, 'email', 'Mandar a tabela de descartáveis para eventos', -1, '16:00', null, 'neg-2');
  T(10, 'tarefa', 'Conferir a amostra de saco de lixo entregue', 1, '09:00', null, 'neg-8');
  T(19, 'reuniao', 'Apresentar a linha de EPI no hospital', 2, '10:30', null, 'neg-5');
  T(0, 'ligacao', 'Pós-venda do pedido de outubro', -12, '15:00', null, null, true);
  T(2, 'whatsapp', 'Combinar a próxima reposição', -8, '10:00', null, null, true);
  const mes = HOJE.slice(0, 7);
  const metas = [['u-bruna', 18000], ['u-diego', 15000], ['u-fernanda', 16000]].map(([u, v]) => ({ id: 'meta-' + u, usuario_id: u, mes, valor: v, criado_em: agora }));
  // ---------------------------------------------------------------- rota de hoje: 4 com o João (2 já feitas), 2 com o Marcos, 1 sem motorista
  const entregas = hojeNF.slice(0, 6).map((nid, k) => {
    const n = notas.find(x => x.id === nid);
    const joao = k < 4, feita = k < 2;
    return { id: 'ent-' + (k + 1), dia: HOJE, nota_id: nid, empresa_id: n.empresa_id, motorista_id: joao ? 'u-joao' : 'u-marcos', ordem: joao ? k + 1 : k - 3, liberada: true,
      situacao: feita ? (k === 1 ? 'problema' : 'entregue') : 'pendente', obs: k === 1 ? 'Faltou 1 fardo de papel: o cliente aceitou receber amanhã.' : null,
      canhoto: feita ? 'canhotos/' + HOJE + '/ent-' + (k + 1) + '.jpg' : null, entregue_em: feita ? quando(0, k === 0 ? '08:42' : '09:15') : null,
      cli_status: feita ? (k === 0 ? 'lido' : 'entregue') : null, cli_proximo_em: k === 0 ? quando(0, '08:50') : null, criado_em: agora };
  });
  const sd = { usuarios, empresas, contatos, negocios, atividades, notas, nota_itens, titulos, metas, config: [{ id: 1, dados: { nome_empresa: 'Distribuidora Exemplo' } }] };
  const pedidos = [
    ['emp-01', [['100010', 6], ['200020', 10], ['300030', 4]]], ['emp-03', [['300032', 20], ['200022', 30]]],
    ['emp-06', [['100014', 5, 36]]], ['emp-12', [['300033', 20]]], ['emp-11', [['300031', 10], ['400040', 5]]]
  ].map(([e, its]) => ({ empresa_id: e, vendedor_id: 'u-bruna', dados: { pagamento: '28 dias', tabela: 'A' }, entrega: dia(1),
    itens: its.map(([c, q, pr]) => ({ codigo: c, quantidade: q, preco: pr || prod(c).preco_venda })) }));
  const fotos = {};
  estoque.forEach(p => { fotos[p.codigo] = { codigo: p.codigo, caminho: ilustra(p.linha, p.codigo), fonte: 'ilustração', atualizado_em: agora }; });
  return { sd, etapasNomes, pedidos, chaves: { crm_estoque: estoque, crm_fornecedores: fornecedores, crm_entregas: entregas, crm_produto_fotos: fotos }, ADMIN, HOJE };
};

  function semeia() {
    const hoje = R.hojeISO(), B = baseFicticia(hoje), agora = new Date().toISOString();
    const etapas = R.ETAPAS_PADRAO.map((e, i) => ({ id: 'etp-' + (i + 1), funil: 'Vendas', nome: e[0], probabilidade: e[1], ordem: i + 1, criado_em: agora }));
    const porNome = Object.fromEntries(etapas.map(e => [e.nome, e.id]));
    const sd = Object.assign({}, B.sd, { etapas, negocios: B.sd.negocios.map(n => { const x = Object.assign({}, n, { etapa_id: porNome[n.etapaNome] }); delete x.etapaNome; return x; }) });
    try { Object.keys(localStorage).filter(k => /^(sd-crm|crm_)/.test(k)).forEach(k => localStorage.removeItem(k)); } catch (e) { /* ok */ }
    ls.grava('sd-crm-v2', JSON.stringify(sd));
    Object.entries(B.chaves).forEach(([k, v]) => ls.grava(k, JSON.stringify(v)));
    const c = {}; B.chaves.crm_entregas.filter(x => x.canhoto).forEach(x => { c[x.canhoto] = 'assets/exemplo-canhoto.jpg'; });
    ls.grava('crm_canhotos', JSON.stringify(c));
    ls.grava('crm_local_eu', JSON.stringify(ls.le('demo_papel') ? JSON.parse(ls.le('demo_papel')) : 'u-gestora'));
    ls.grava('crm_analise_tentada', hoje);
    ls.grava('demo_pedidos', JSON.stringify(B.pedidos));
    ls.grava('demo_semeada', hoje + ':' + VERSAO);
    try { sessionStorage.clear(); } catch (e) { /* ok */ }
  }
  if (ls.le('demo_semeada') !== R.hojeISO() + ':' + VERSAO) semeia();

  const QUEM = [['u-gestora', 'Gestora de vendas'], ['u-bruna', 'Vendedora'], ['u-gustavo', 'Comprador'], ['u-helena', 'Logística'], ['u-joao', 'Motorista (celular)'], ['00000000-0000-4000-8000-000000000001', 'Administrador']];
  function troca(id) { ls.grava('crm_local_eu', JSON.stringify(id)); ls.grava('demo_papel', JSON.stringify(id)); try { sessionStorage.clear(); } catch (e) { /* ok */ } location.reload(); }
  function barra() {
    const eu = (() => { try { return JSON.parse(ls.le('crm_local_eu')); } catch (e) { return null; } })();
    const b = document.createElement('div');
    b.className = 'demo-barra'; b.setAttribute('role', 'region'); b.setAttribute('aria-label', 'Demonstração');
    b.innerHTML = '<span class="demo-selo">Demonstração</span><span class="demo-txt">dados fictícios</span>' +
      '<label class="demo-ver"><span>Ver como</span><select id="demoQuem">' + QUEM.map(q => '<option value="' + q[0] + '"' + (q[0] === eu ? ' selected' : '') + '>' + q[1] + '</option>').join('') + '</select></label>' +
      '<button type="button" id="demoRecomecar">Recomeçar</button>';
    document.body.appendChild(b); document.body.classList.add('com-demo');
    b.querySelector('#demoQuem').addEventListener('change', e => troca(e.target.value));
    b.querySelector('#demoRecomecar').addEventListener('click', () => { ls.grava('demo_semeada', ''); location.reload(); });
  }
  // pedidos de exemplo: gravados pelo próprio CRM (reserva, bloqueios) assim que ele abre
  async function pedidos() {
    const l = (() => { try { return JSON.parse(ls.le('demo_pedidos') || '[]'); } catch (e) { return []; } })();
    if (!l.length) return;
    for (let i = 0; i < 100 && !(window.CRM && CRM.estado && CRM.estado.eu && CRM.store && CRM.store()); i++) await new Promise(r => setTimeout(r, 100));
    if (!(window.CRM && CRM.store && CRM.store())) return;
    ls.grava('demo_pedidos', '[]');
    for (const p of l) { try { await CRM.store().pedidoGravar(p); } catch (e) { console.warn('pedido de exemplo', e); } }
  }
  document.addEventListener('DOMContentLoaded', () => { barra(); pedidos(); });
})();
