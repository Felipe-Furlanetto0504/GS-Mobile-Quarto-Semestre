import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, {
  FadeInDown,
  FadeOutLeft,
  LinearTransition,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pressionavel } from '../../../components/Pressionavel';
import { useExcluirNotificacao, useMarcarComoLida } from '../useNotificacoes';
import { tempoRelativo } from '../../../utils/formatos';
import { cores, fontes, raio } from '../../../theme';

function AcaoExcluir({ arrasto }) {
  const estilo = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(-arrasto.value, [0, 90], [0.6, 1], 'clamp') }],
  }));
  return (
    <View style={estilos.acaoExcluir}>
      <Animated.View style={[estilos.acaoConteudo, estilo]}>
        <Feather name="trash-2" size={18} color={cores.branco} />
        <Text style={estilos.acaoTexto}>Excluir</Text>
      </Animated.View>
    </View>
  );
}

export function NotificacaoItem({ notificacao, indice = 0 }) {
  const marcar = useMarcarComoLida();
  const excluir = useExcluirNotificacao();
  const n = notificacao;
  const alta = n.prioridade === 'ALTA';

  const abrir = () => {
    if (!n.lida) marcar.mutate(n.id);
    if (n.problemaId) router.push(`/problema/${n.problemaId}`);
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(Math.min(indice, 8) * 40)}
      exiting={FadeOutLeft.duration(200)}
      layout={LinearTransition.springify().damping(18)}
      style={{ marginBottom: 10 }}
    >
      <ReanimatedSwipeable
        friction={2}
        rightThreshold={70}
        overshootRight={false}
        renderRightActions={(_p, arrasto) => <AcaoExcluir arrasto={arrasto} />}
        onSwipeableOpen={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
          excluir.mutate(n.id);
        }}
        containerStyle={estilos.container}
      >
        <Pressionavel
          onPress={abrir}
          escala={0.985}
          accessibilityLabel={`${alta ? 'Prioridade alta. ' : ''}${n.mensagem}. ${n.lida ? 'Lida' : 'Não lida'}`}
          accessibilityHint="Arraste para a esquerda para excluir"
          style={[estilos.item, !n.lida && estilos.naoLida]}
        >
          <View
            style={[estilos.icone, { backgroundColor: alta ? cores.asfalto : cores.amareloClaro }]}
          >
            <Feather
              name={alta ? 'alert-circle' : 'bell'}
              size={19}
              color={alta ? cores.amarelo : '#7A5A00'}
            />
          </View>
          <View style={{ flex: 1, gap: 3 }}>
            <View style={estilos.linhaTopo}>
              <Text style={[estilos.prioridade, alta && { color: '#A52A21' }]}>
                {alta ? 'Prioridade alta' : 'Aviso'}
              </Text>
              <Text style={estilos.quando}>{tempoRelativo(n.criadaEm)}</Text>
            </View>
            <Text
              style={[
                estilos.mensagem,
                n.lida && { fontFamily: fontes.texto, color: cores.tintaMedia },
              ]}
            >
              {n.mensagem}
            </Text>
          </View>
          {!n.lida ? <View style={estilos.pontoNaoLida} /> : null}
        </Pressionavel>
      </ReanimatedSwipeable>
    </Animated.View>
  );
}

const estilos = StyleSheet.create({
  container: { borderRadius: raio.lg, backgroundColor: cores.perigo },
  item: {
    flexDirection: 'row',
    gap: 12,
    padding: 14,
    alignItems: 'flex-start',
    backgroundColor: cores.papel,
    borderRadius: raio.lg,
    borderWidth: 1.5,
    borderColor: cores.linha,
  },
  naoLida: { backgroundColor: cores.branco, borderColor: cores.asfalto },
  icone: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linhaTopo: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  prioridade: {
    fontFamily: fontes.textoBold,
    fontSize: 11,
    letterSpacing: 0.6,
    color: cores.suave,
    textTransform: 'uppercase',
  },
  quando: { fontFamily: fontes.texto, fontSize: 12, color: cores.suave },
  mensagem: { fontFamily: fontes.textoSemi, fontSize: 14, lineHeight: 19, color: cores.tinta },
  pontoNaoLida: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: cores.perigo,
    marginTop: 6,
  },
  acaoExcluir: { width: 110, alignItems: 'center', justifyContent: 'center' },
  acaoConteudo: { alignItems: 'center', gap: 4 },
  acaoTexto: { fontFamily: fontes.textoBold, fontSize: 12, color: cores.branco },
});
