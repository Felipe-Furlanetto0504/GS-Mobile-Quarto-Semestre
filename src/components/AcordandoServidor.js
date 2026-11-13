import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Botao } from './Botao';
import { cores, fontes } from '../theme';

const ESPACO_FAIXA = 70;

export function AcordandoServidor({ falhou, aoTentarDeNovo, aoContinuar }) {
  const reduzir = useReducedMotion();
  const estrada = useSharedValue(0);
  const pino = useSharedValue(0);

  useEffect(() => {
    if (reduzir) return;
    estrada.value = withRepeat(withTiming(1, { duration: 700, easing: Easing.linear }), -1);
    pino.value = withRepeat(
      withSequence(withTiming(-14, { duration: 380 }), withTiming(0, { duration: 380 })),
      -1
    );
  }, [estrada, pino, reduzir]);

  const estiloEstrada = useAnimatedStyle(() => ({
    transform: [{ translateY: estrada.value * ESPACO_FAIXA }],
  }));
  const estiloPino = useAnimatedStyle(() => ({ transform: [{ translateY: pino.value }] }));

  return (
    <View style={estilos.tela}>
      <View style={estilos.rua}>
        <Animated.View style={[estilos.faixas, estiloEstrada]}>
          {Array.from({ length: 8 }).map((_, i) => (
            <View key={i} style={estilos.faixa} />
          ))}
        </Animated.View>
        <Animated.View style={[estilos.pinoPosicao, estiloPino]}>
          <View style={estilos.pino}>
            <View style={estilos.pinoMiolo} />
          </View>
        </Animated.View>
      </View>
      <Animated.View entering={FadeIn.delay(200)} style={estilos.textos}>
        <Text style={estilos.titulo}>
          {falhou ? 'Servidor fora do ar' : 'Acordando o servidor…'}
        </Text>
        <Text style={estilos.texto}>
          {falhou
            ? 'Não conseguimos falar com a API do RootFix. Confira a internet e tente de novo.'
            : 'A API fica em um servidor gratuito que dorme quando ninguém usa. Pode levar até 1 minuto.'}
        </Text>
        {falhou ? (
          <View style={estilos.botoes}>
            <Botao titulo="Tentar de novo" variante="destaque" onPress={aoTentarDeNovo} />
            <Botao titulo="Continuar assim mesmo" variante="contornoEscuro" onPress={aoContinuar} />
          </View>
        ) : null}
      </Animated.View>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.asfalto,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
    gap: 36,
  },
  rua: {
    width: 120,
    height: 260,
    backgroundColor: cores.asfalto3,
    borderRadius: 24,
    overflow: 'hidden',
    alignItems: 'center',
  },
  faixas: { position: 'absolute', top: -ESPACO_FAIXA, gap: 26 },
  faixa: { width: 8, height: 44, borderRadius: 4, backgroundColor: cores.amarelo },
  pinoPosicao: { position: 'absolute', top: 96 },
  pino: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderBottomLeftRadius: 4,
    backgroundColor: cores.amarelo,
    transform: [{ rotate: '-45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: cores.asfalto,
  },
  pinoMiolo: { width: 16, height: 16, borderRadius: 8, backgroundColor: cores.asfalto },
  textos: { alignItems: 'center', gap: 10, alignSelf: 'stretch' },
  titulo: { fontFamily: fontes.titulo, fontSize: 24, color: cores.papel, textAlign: 'center' },
  texto: {
    fontFamily: fontes.texto,
    fontSize: 14,
    lineHeight: 21,
    color: cores.textoClaroSuave,
    textAlign: 'center',
  },
  botoes: { alignSelf: 'stretch', gap: 10, marginTop: 12 },
});
