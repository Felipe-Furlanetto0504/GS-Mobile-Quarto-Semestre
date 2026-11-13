import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { Pressionavel } from '../../../components/Pressionavel';
import { FotoProblema } from './FotoProblema';
import { GravidadeChip } from './GravidadeChip';
import { BotaoApoio } from './BotaoApoio';
import { situacaoDoProblema, tempoRelativo } from '../../../utils/formatos';
import { cores, fontes, raio } from '../../../theme';

export function ProblemaCard({ problema, indice = 0 }) {
  const situacao = situacaoDoProblema(problema);
  const abrir = () => router.push(`/problema/${problema.id}`);

  return (
    <Animated.View
      entering={FadeInDown.delay(Math.min(indice, 6) * 50)
        .springify()
        .damping(16)}
      style={estilos.card}
    >
      <Pressionavel onPress={abrir} escala={0.985} accessibilityLabel={`Abrir ${problema.titulo}`}>
        <View>
          <FotoProblema problema={problema} altura={170} analisando={!problema.gravidadeIa} />
          <GravidadeChip gravidade={problema.gravidadeIa} style={estilos.chipGravidade} />
          <View style={estilos.chipStatus}>
            <Text style={estilos.chipStatusTexto}>{situacao.rotulo}</Text>
          </View>
        </View>
        <View style={estilos.corpo}>
          <Text style={estilos.meta}>
            {problema.categoria?.nome ?? 'Sem categoria'} · {tempoRelativo(problema.criadoEm)}
          </Text>
          <Text style={estilos.titulo} numberOfLines={2}>
            {problema.titulo}
          </Text>
        </View>
      </Pressionavel>
      <View style={estilos.acoes}>
        <BotaoApoio problema={problema} />
        <Pressionavel
          onPress={abrir}
          accessibilityLabel={`${problema.totalObservacoes} observações`}
          style={estilos.obs}
        >
          <Feather name="message-circle" size={16} color={cores.tintaMedia} />
          <Text style={estilos.obsTexto}>{problema.totalObservacoes}</Text>
        </Pressionavel>
        {problema.souAutor ? (
          <View style={estilos.meu}>
            <Text style={estilos.meuTexto}>Seu relato</Text>
          </View>
        ) : null}
      </View>
    </Animated.View>
  );
}

const estilos = StyleSheet.create({
  card: {
    backgroundColor: cores.branco,
    borderRadius: raio.xl,
    borderWidth: 1.5,
    borderColor: cores.linha,
    overflow: 'hidden',
    marginBottom: 14,
  },
  chipGravidade: { position: 'absolute', left: 12, top: 12 },
  chipStatus: {
    position: 'absolute',
    right: 12,
    top: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(20,23,31,0.75)',
  },
  chipStatusTexto: { fontFamily: fontes.textoSemi, fontSize: 11, color: cores.papel },
  corpo: { paddingHorizontal: 16, paddingTop: 14, gap: 4 },
  meta: { fontFamily: fontes.textoSemi, fontSize: 12, color: cores.suave },
  titulo: { fontFamily: fontes.textoBold, fontSize: 16, lineHeight: 21, color: cores.tinta },
  acoes: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, paddingTop: 10 },
  obs: { height: 42, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 6 },
  obsTexto: { fontFamily: fontes.textoSemi, fontSize: 13, color: cores.tintaMedia },
  meu: {
    marginLeft: 'auto',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: cores.amareloClaro,
  },
  meuTexto: { fontFamily: fontes.textoBold, fontSize: 11, color: '#7A5A00' },
});
