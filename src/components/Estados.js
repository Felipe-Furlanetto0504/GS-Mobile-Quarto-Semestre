import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { Botao } from './Botao';
import { cores, fontes, raio } from '../theme';

export function EstadoVazio({ icone = 'inbox', titulo, texto, acao, aoAcionar, escuro }) {
  return (
    <Animated.View entering={FadeIn.duration(250)} style={estilos.vazio}>
      <View style={[estilos.iconeVazio, escuro && { backgroundColor: cores.asfalto2 }]}>
        <Feather name={icone} size={26} color={escuro ? cores.amarelo : cores.tinta} />
      </View>
      <Text style={[estilos.tituloVazio, escuro && { color: cores.papel }]}>{titulo}</Text>
      {texto ? <Text style={[estilos.textoVazio, escuro && { color: cores.textoClaroSuave }]}>{texto}</Text> : null}
      {acao ? <Botao titulo={acao} onPress={aoAcionar} pequeno variante="destaque" style={{ marginTop: 8 }} /> : null}
    </Animated.View>
  );
}

export function MensagemErro({ erro, aoTentarDeNovo, escuro }) {
  return (
    <EstadoVazio
      icone="wifi-off"
      titulo="Não deu para carregar"
      texto={erro}
      acao={aoTentarDeNovo ? 'Tentar de novo' : undefined}
      aoAcionar={aoTentarDeNovo}
      escuro={escuro}
    />
  );
}

export function Esqueleto({ altura = 240, escuro }) {
  const opacidade = useSharedValue(0.5);
  useEffect(() => {
    opacidade.value = withRepeat(withTiming(1, { duration: 700 }), -1, true);
  }, [opacidade]);
  const estilo = useAnimatedStyle(() => ({ opacity: opacidade.value }));
  return (
    <Animated.View
      style={[estilos.esqueleto, { height: altura, backgroundColor: escuro ? cores.asfalto2 : cores.papel2 }, estilo]}
    />
  );
}

const estilos = StyleSheet.create({
  vazio: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: 24, gap: 8 },
  iconeVazio: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: cores.papel2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  tituloVazio: { fontFamily: fontes.textoBold, fontSize: 17, color: cores.tinta, textAlign: 'center' },
  textoVazio: { fontFamily: fontes.texto, fontSize: 14, color: cores.suave, textAlign: 'center', lineHeight: 20 },
  esqueleto: { borderRadius: raio.xl, marginBottom: 14 },
});
