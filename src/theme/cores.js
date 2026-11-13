export const cores = {
  asfalto: '#14171F',
  asfalto2: '#1F2430',
  asfalto3: '#2A303D',
  linhaEscura: '#3A4150',
  textoClaroSuave: '#B9BDC7',

  papel: '#F4F4EF',
  papel2: '#E8E8E1',
  branco: '#FFFFFF',
  linha: '#E2E3DC',
  linhaForte: '#D9DAD2',

  tinta: '#14171F',
  tintaMedia: '#3F4552',
  suave: '#5A6170',

  amarelo: '#FFC93C',
  amareloClaro: '#FFF3C9',
  azul: '#2357C6',

  perigo: '#C4352B',
  sucesso: '#17694F',
};

// Cores por gravidade (mesmo da API Java: BAIXA, MEDIA, ALTA, CRITICA).
export const gravidades = {
  CRITICA: { rotulo: 'Crítica', fundo: '#FCE3E0', texto: '#A52A21', barra: '#F0574B', nivel: 4 },
  ALTA: { rotulo: 'Alta', fundo: '#FDE8DA', texto: '#A5481A', barra: '#F08A4B', nivel: 3 },
  MEDIA: { rotulo: 'Média', fundo: '#FFF3C9', texto: '#7A5A00', barra: '#FFC93C', nivel: 2 },
  BAIXA: { rotulo: 'Baixa', fundo: '#DDF2EA', texto: '#17694F', barra: '#7DD3A8', nivel: 1 },
};
