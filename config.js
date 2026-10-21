// Instalação do CRM (um arquivo destes por cliente).
// supabaseUrl/supabaseAnonKey vazios = MODO LOCAL: os dados ficam só neste
// navegador (bom para experimentar, não serve para a equipe).
// Preenchidos = modo Supabase, com login. A chave anon é pública por natureza;
// quem protege os dados é a RLS de crm/supabase/schema.sql.
window.CRM_CONFIG = {
  nomeEmpresa: 'Distribuidora Exemplo',        // aparece no login, no topo e nas propostas (ex.: 'OneClean')
  logo: '',               // caminho da imagem (vazio = logo da Sistemi Dalessi)
  logoIcone: '',          // versão quadrada do logo para o menu e a aba do navegador (vazio = usa o logo)
  logoNoMenu: '',         // 'completo' = logo inteiro num cartão branco no alto do menu
  cores: null,            // paleta da empresa: { principal: '#rrggbb', destaque: '#rrggbb' } (vazio = azul e dourado)
  supabaseUrl: '',
  supabaseAnonKey: ''
};
