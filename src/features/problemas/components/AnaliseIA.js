import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { cores, fontes, gravidades, molas, raio } from '../../../theme';

function Segmento({ aceso, cor, ordem }) {
  const progresso = useSharedValue(0);
  useEffect(() => {
    progresso.value = withDelay(ordem * 90, withSpring(aceso ? 1 : 0, molas.suave));
  }, [aceso, ordem, progresso]);
  const estilo = useAnimatedStyle(() => ({ transform: [{ scaleX: progresso.value }] }));
  return (
    <View style={estilos.trilho}>
      <Animated.View style={[estilos.preenchimento, { backgroundColor: cor }, estilo]} />
    </View>
  );
}

export function AnaliseIA({ problema }) {
  const g = gravidades[problema.gravidadeIa];
  const ordem = ['BAIXA', 'MEDIA', 'ALTA', 'CRITICA'];

  return (
    <View style={estilos.card}>
      <View style={estilos.topo}>
        <View style={estilos.titulo}>
          <Feather name="maximize" size={15} color={cores.amarelo} />
          <Text style={estilos.rotulo}>Análise da IA</Text>
        </View>
        <Text style={estilos.nivel}>{g ? g.rotulo : 'Analisando a foto…'}</Text>
      </View>
      <View
        style={estilos.medidor}
        accessible
        accessibilityLabel={g ? `Gravidade ${g.rotulo}, nível ${g.nivel} de 4` : 'Gravidade ainda em análise'}
      >
        {ordem.map((chave, i) => (
          <Segmento key={chave} ordem={i} aceso={!!g && i < g.nivel} cor={gravidades[chave].barra} />
        ))}
      </View>
      <Text style={estilos.justificativa}>
        {problema.justificativaIa ?? 'A IA está olhando a foto e a descrição. O resultado aparece aqui em alguns segundos.'}
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  card: { backgroundColor: cores.asfalto, borderRadius: raio.xl, padding: 16, gap: 12 },
  topo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  titulo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rotulo: { fontFamily: fontes.textoBold, fontSize: 12, letterSpacing: 1.2, color: cores.amarelo, textTransform: 'uppercase' },
  nivel: { fontFamily: fontes.textoSemi, fontSize: 13, color: cores.papel },
  medidor: { flexDirection: 'row', gap: 6 },
  trilho: { flex: 1, height: 8, borderRadius: 4, backgroundColor: cores.asfalto3, overflow: 'hidden' },
  preenchimento: { flex: 1, borderRadius: 4, transformOrigin: 'left' },
  justificativa: { fontFamily: fontes.texto, fontSize: 13, lineHeight: 20, color: '#D5D8DE' },
});
