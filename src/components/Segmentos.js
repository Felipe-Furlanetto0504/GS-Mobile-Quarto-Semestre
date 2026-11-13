import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Pressionavel } from './Pressionavel';
import { cores, fontes, molas } from '../theme';

export function Segmentos({ opcoes, valor, aoMudar }) {
  const [largura, setLargura] = useState(0);
  const indice = Math.max(
    0,
    opcoes.findIndex((o) => o.valor === valor)
  );
  const larguraItem = largura / opcoes.length;

  const estiloIndicador = useAnimatedStyle(() => ({
    width: larguraItem,
    transform: [{ translateX: withSpring(indice * larguraItem, molas.suave) }],
  }));

  return (
    <View
      style={estilos.trilho}
      onLayout={(e) => setLargura(e.nativeEvent.layout.width - 8)}
      accessibilityRole="tablist"
    >
      {largura > 0 ? <Animated.View style={[estilos.indicador, estiloIndicador]} /> : null}
      {opcoes.map((o) => {
        const ativo = o.valor === valor;
        return (
          <Pressionavel
            key={o.valor}
            onPress={() => aoMudar(o.valor)}
            accessibilityRole="tab"
            accessibilityState={{ selected: ativo }}
            escala={0.98}
            style={estilos.opcao}
          >
            <Text style={[estilos.texto, ativo && estilos.textoAtivo]}>{o.rotulo}</Text>
          </Pressionavel>
        );
      })}
    </View>
  );
}

export function Chips({ opcoes, valor, aoMudar }) {
  return (
    <View style={estilos.chips}>
      {opcoes.map((o) => {
        const ativo = o.valor === valor;
        return (
          <Pressionavel
            key={o.valor}
            onPress={() => aoMudar(o.valor)}
            accessibilityState={{ selected: ativo }}
            style={[estilos.chip, ativo && estilos.chipAtivo]}
          >
            <Text style={[estilos.chipTexto, ativo && { color: cores.amarelo }]}>{o.rotulo}</Text>
          </Pressionavel>
        );
      })}
    </View>
  );
}

const estilos = StyleSheet.create({
  trilho: { flexDirection: 'row', backgroundColor: cores.papel2, borderRadius: 14, padding: 4 },
  indicador: {
    position: 'absolute',
    top: 4,
    left: 4,
    bottom: 4,
    borderRadius: 11,
    backgroundColor: cores.branco,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  opcao: { flex: 1, height: 38, alignItems: 'center', justifyContent: 'center' },
  texto: { fontFamily: fontes.textoSemi, fontSize: 14, color: cores.suave },
  textoAtivo: { fontFamily: fontes.textoBold, color: cores.tinta },
  chips: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: {
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: cores.linhaForte,
    backgroundColor: cores.branco,
    justifyContent: 'center',
  },
  chipAtivo: { backgroundColor: cores.asfalto, borderColor: cores.asfalto },
  chipTexto: { fontFamily: fontes.textoSemi, fontSize: 13, color: cores.tinta },
});
