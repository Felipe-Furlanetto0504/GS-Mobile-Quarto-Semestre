import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOutDown,
  FadeOutUp,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pressionavel } from '../../../components/Pressionavel';
import { useAlternarApoio } from '../useProblemas';
import { cores, fontes, molas } from '../../../theme';

export function BotaoApoio({ problema, compacto }) {
  const [apoiado, setApoiado] = useState(problema.apoiadoPorMim);
  const [total, setTotal] = useState(problema.totalApoios);
  const [subindo, setSubindo] = useState(true);
  const mutacao = useAlternarApoio();
  const pulo = useSharedValue(1);

  // Quando o servidor devolve números novos, troca os valores otimistas pelos reais.
  const [doServidor, setDoServidor] = useState({
    apoiado: problema.apoiadoPorMim,
    total: problema.totalApoios,
  });
  if (doServidor.apoiado !== problema.apoiadoPorMim || doServidor.total !== problema.totalApoios) {
    setDoServidor({ apoiado: problema.apoiadoPorMim, total: problema.totalApoios });
    setApoiado(problema.apoiadoPorMim);
    setTotal(problema.totalApoios);
  }

  const estiloIcone = useAnimatedStyle(() => ({
    transform: [{ scale: pulo.value }, { rotate: `${(pulo.value - 1) * -40}deg` }],
  }));

  const alternar = () => {
    const novo = !apoiado;
    setSubindo(novo);
    setApoiado(novo);
    setTotal((t) => t + (novo ? 1 : -1));
    pulo.set(withSequence(withSpring(1.35, molas.pulo), withSpring(1, molas.pulo)));
    Haptics.impactAsync(
      novo ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Soft
    ).catch(() => {});
    mutacao.mutate(problema.id, {
      onSuccess: (r) => {
        setApoiado(r.apoiadoPorMim);
        setTotal(r.totalApoios);
      },
      onError: () => {
        setApoiado(!novo);
        setTotal((t) => t + (novo ? -1 : 1));
      },
    });
  };

  const fundo = apoiado ? cores.asfalto : cores.branco;
  const cor = apoiado ? cores.amarelo : cores.tinta;

  return (
    <Pressionavel
      onPress={alternar}
      escala={0.92}
      accessibilityLabel={
        apoiado
          ? `Retirar apoio, ${total} apoios`
          : `Apoiar, também sofri com isso, ${total} apoios`
      }
      accessibilityState={{ selected: apoiado }}
      style={[
        estilos.botao,
        compacto && estilos.compacto,
        { backgroundColor: fundo, borderColor: apoiado ? cores.asfalto : cores.linhaForte },
      ]}
    >
      <Animated.View style={estiloIcone}>
        <Feather name="thumbs-up" size={16} color={cor} />
      </Animated.View>
      {!compacto ? (
        <Text style={[estilos.texto, { color: cor }]}>{apoiado ? 'Apoiado' : 'Também sofri'}</Text>
      ) : null}
      <View style={estilos.numeroCaixa}>
        <Animated.Text
          key={total}
          entering={(subindo ? FadeInDown : FadeInUp).duration(180)}
          exiting={(subindo ? FadeOutUp : FadeOutDown).duration(180)}
          style={[estilos.texto, { color: cor }]}
        >
          {total}
        </Animated.Text>
      </View>
    </Pressionavel>
  );
}

const estilos = StyleSheet.create({
  botao: {
    height: 42,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  compacto: { height: 48, paddingHorizontal: 16, borderRadius: 14 },
  texto: { fontFamily: fontes.textoBold, fontSize: 13 },
  numeroCaixa: { height: 18, minWidth: 14, overflow: 'hidden', justifyContent: 'center' },
});
