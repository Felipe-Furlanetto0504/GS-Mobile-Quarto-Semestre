import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { cabecalhosAuth, urlFoto } from '../../../services/api';
import { cores, fontes } from '../../../theme';

// Linha amarela que "escaneia" a foto enquanto a IA classifica.
function LinhaDeScan({ altura }) {
  const reduzir = useReducedMotion();
  const posicao = useSharedValue(0);
  useEffect(() => {
    if (reduzir) return;
    posicao.value = withRepeat(withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.quad) }), -1, true);
  }, [posicao, reduzir]);
  const estilo = useAnimatedStyle(() => ({ transform: [{ translateY: posicao.value * (altura - 4) }] }));
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(20,23,31,0.25)' }]} />
      <Animated.View style={[estilos.scan, estilo]} />
    </View>
  );
}

// Foto do problema vinda da API (o endpoint exige o token, por isso os headers).
export function FotoProblema({ problema, altura = 160, uriLocal, analisando, arredondado = 0, style }) {
  const [falhou, setFalhou] = useState(false);
  const temFoto = uriLocal || (problema?.temFoto && !falhou);

  return (
    <View style={[estilos.caixa, { height: altura, borderRadius: arredondado }, style]}>
      {temFoto ? (
        <Image
          source={uriLocal ? { uri: uriLocal } : { uri: urlFoto(problema.id), headers: cabecalhosAuth() }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={250}
          cachePolicy="memory-disk"
          recyclingKey={uriLocal ?? String(problema?.id)}
          onError={() => setFalhou(true)}
          accessibilityLabel={`Foto do problema ${problema?.titulo ?? ''}`}
        />
      ) : (
        <View style={estilos.semFoto}>
          <Feather name="image" size={26} color="#9EA4B0" />
          <Text style={estilos.semFotoTexto}>Sem foto</Text>
        </View>
      )}
      {analisando ? <LinhaDeScan altura={altura} /> : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  caixa: { backgroundColor: cores.asfalto3, overflow: 'hidden' },
  semFoto: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6 },
  semFotoTexto: { fontFamily: fontes.textoSemi, fontSize: 12, color: '#9EA4B0' },
  scan: {
    height: 3,
    backgroundColor: cores.amarelo,
    shadowColor: cores.amarelo,
    shadowOpacity: 0.9,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
});
