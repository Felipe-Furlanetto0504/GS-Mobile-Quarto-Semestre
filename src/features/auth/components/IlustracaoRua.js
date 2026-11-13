import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeInLeft,
  FadeInRight,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { cores, fontes } from '../../../theme';

function Faixa({ ordem }) {
  const altura = useSharedValue(0);
  useEffect(() => {
    altura.value = withDelay(ordem * 110, withTiming(44, { duration: 260 }));
  }, [altura, ordem]);
  const estilo = useAnimatedStyle(() => ({ height: altura.value }));
  return (
    <View style={estilos.slotFaixa}>
      <Animated.View style={[estilos.faixa, estilo]} />
    </View>
  );
}

export function IlustracaoRua() {
  const reduzir = useReducedMotion();
  const queda = useSharedValue(reduzir ? 0 : -220);
  const sombra = useSharedValue(reduzir ? 1 : 0);

  useEffect(() => {
    if (reduzir) return;
    queda.value = withDelay(500, withSpring(0, { damping: 9, stiffness: 140 }));
    sombra.value = withDelay(650, withTiming(1, { duration: 400 }));
  }, [queda, sombra, reduzir]);

  const estiloPino = useAnimatedStyle(() => ({ transform: [{ translateY: queda.value }] }));
  const estiloSombra = useAnimatedStyle(() => ({
    opacity: sombra.value,
    transform: [{ scaleX: sombra.value }],
  }));

  return (
    <View
      style={estilos.caixa}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <View style={estilos.calcada} />
      <View style={estilos.rua}>
        {[0, 1, 2, 3, 4].map((i) => (
          <Faixa key={i} ordem={i} />
        ))}
      </View>
      <Animated.View style={[estilos.buraco, estiloSombra]} />
      <Animated.View style={[estilos.pinoPosicao, estiloPino]}>
        <View style={estilos.pino}>
          <View style={estilos.pinoMiolo} />
        </View>
      </Animated.View>
      <Animated.View
        entering={FadeInLeft.delay(1100).springify()}
        style={[estilos.balao, { left: 20, top: 40 }]}
      >
        <Feather name="thumbs-up" size={14} color={cores.asfalto} />
        <Text style={estilos.balaoTexto}>Vizinhos apoiam</Text>
      </Animated.View>
      <Animated.View
        entering={FadeInRight.delay(1350).springify()}
        style={[estilos.balao, { right: 20, top: 200, backgroundColor: '#FCE3E0' }]}
      >
        <Text style={[estilos.balaoTexto, { color: '#A52A21', fontFamily: fontes.textoBold }]}>
          GRAVIDADE ALTA · IA
        </Text>
      </Animated.View>
    </View>
  );
}

const estilos = StyleSheet.create({
  caixa: { height: 330, alignItems: 'center' },
  calcada: {
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: cores.asfalto2,
  },
  rua: {
    position: 'absolute',
    top: 30,
    bottom: 0,
    width: 120,
    backgroundColor: cores.asfalto3,
    alignItems: 'center',
    paddingTop: 14,
    gap: 20,
  },
  slotFaixa: { height: 44, justifyContent: 'flex-start' },
  faixa: { width: 6, borderRadius: 3, backgroundColor: cores.amarelo },
  buraco: {
    position: 'absolute',
    top: 186,
    width: 46,
    height: 24,
    borderRadius: 23,
    backgroundColor: '#0D0F14',
    borderWidth: 2,
    borderColor: cores.linhaEscura,
  },
  pinoPosicao: { position: 'absolute', top: 104 },
  pino: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderBottomLeftRadius: 4,
    backgroundColor: cores.amarelo,
    transform: [{ rotate: '-45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: cores.amarelo,
    shadowOpacity: 0.4,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  pinoMiolo: { width: 18, height: 18, borderRadius: 9, backgroundColor: cores.asfalto },
  balao: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: cores.papel,
  },
  balaoTexto: { fontFamily: fontes.textoSemi, fontSize: 12, color: cores.asfalto },
});
