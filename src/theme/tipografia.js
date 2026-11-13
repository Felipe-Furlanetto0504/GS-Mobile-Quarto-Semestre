
export const fontes = {
  titulo: 'Archivo_800ExtraBold',
  tituloBold: 'Archivo_700Bold',
  texto: 'Inter_400Regular',
  textoMedio: 'Inter_500Medium',
  textoSemi: 'Inter_600SemiBold',
  textoBold: 'Inter_700Bold',
};

export const texto = {
  display: { fontFamily: fontes.titulo, fontSize: 32, lineHeight: 36, letterSpacing: -0.8 },
  h1: { fontFamily: fontes.titulo, fontSize: 28, lineHeight: 32, letterSpacing: -0.6 },
  h2: { fontFamily: fontes.titulo, fontSize: 22, lineHeight: 26, letterSpacing: -0.4 },
  h3: { fontFamily: fontes.textoBold, fontSize: 16, lineHeight: 21 },
  corpo: { fontFamily: fontes.texto, fontSize: 15, lineHeight: 22 },
  corpoForte: { fontFamily: fontes.textoSemi, fontSize: 15, lineHeight: 22 },
  pequeno: { fontFamily: fontes.textoMedio, fontSize: 13, lineHeight: 18 },
  rotulo: { fontFamily: fontes.textoBold, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase' },
};
