import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pressionavel } from './Pressionavel';
import { cores, fontes, raio } from '../theme';

const variantes = {
  primario: {
    fundo: cores.asfalto,
    texto: cores.papel,
    icone: cores.amarelo,
    borda: cores.asfalto,
  },
  destaque: {
    fundo: cores.amarelo,
    texto: cores.asfalto,
    icone: cores.asfalto,
    borda: cores.amarelo,
  },
  contorno: {
    fundo: cores.branco,
    texto: cores.tinta,
    icone: cores.tinta,
    borda: cores.linhaForte,
  },
  contornoEscuro: {
    fundo: 'transparent',
    texto: cores.papel,
    icone: cores.papel,
    borda: cores.linhaEscura,
  },
  perigo: { fundo: '#FCE3E0', texto: '#A52A21', icone: '#A52A21', borda: '#FCE3E0' },
};

export function Botao({
  titulo,
  onPress,
  variante = 'primario',
  icone,
  carregando,
  desabilitado,
  pequeno,
  style,
}) {
  const v = variantes[variante];
  const inativo = desabilitado || carregando;

  return (
    <Pressionavel
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress?.();
      }}
      disabled={inativo}
      accessibilityLabel={titulo}
      style={[
        estilos.base,
        pequeno && estilos.pequeno,
        { backgroundColor: v.fundo, borderColor: v.borda, opacity: desabilitado ? 0.5 : 1 },
        style,
      ]}
    >
      {carregando ? (
        <ActivityIndicator color={v.texto} />
      ) : (
        <View style={estilos.conteudo}>
          <Text style={[estilos.texto, pequeno && estilos.textoPequeno, { color: v.texto }]}>
            {titulo}
          </Text>
          {icone ? <Feather name={icone} size={pequeno ? 16 : 18} color={v.icone} /> : null}
        </View>
      )}
    </Pressionavel>
  );
}

const estilos = StyleSheet.create({
  base: {
    height: 56,
    borderRadius: raio.lg,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  pequeno: { height: 46, borderRadius: raio.md, paddingHorizontal: 14 },
  conteudo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  texto: { fontFamily: fontes.textoBold, fontSize: 16 },
  textoPequeno: { fontSize: 14 },
});
