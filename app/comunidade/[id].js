import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FeedDaComunidade } from '../../src/features/problemas/components/FeedDaComunidade';
import { useComunidade } from '../../src/features/comunidades/useComunidades';
import { Cabecalho } from '../../src/components/Cabecalho';
import { MensagemErro, Esqueleto } from '../../src/components/Estados';
import { mensagemDeErro } from '../../src/services/api';
import { plural } from '../../src/utils/formatos';
import { cores, fontes, raio } from '../../src/theme';

export default function ComunidadeDetalhe() {
  const { id } = useLocalSearchParams();
  const consulta = useComunidade(id);
  const c = consulta.data;

  return (
    <SafeAreaView style={estilos.tela} edges={['top']}>
      <Cabecalho
        titulo={c?.nome ?? 'Comunidade'}
        subtitulo={c ? plural(c.totalMembros, 'membro', 'membros') : undefined}
      />
      {consulta.isLoading ? (
        <View style={{ padding: 20 }}>
          <Esqueleto altura={90} />
          <Esqueleto />
        </View>
      ) : consulta.error ? (
        <MensagemErro erro={mensagemDeErro(consulta.error)} aoTentarDeNovo={consulta.refetch} />
      ) : (
        <FeedDaComunidade
          comunidade={c}
          cabecalho={
            c.descricao ? (
              <View style={estilos.descricao}>
                <Text style={estilos.descricaoTexto}>{c.descricao}</Text>
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.papel },
  descricao: {
    backgroundColor: cores.branco,
    borderRadius: raio.lg,
    borderWidth: 1.5,
    borderColor: cores.linha,
    padding: 14,
  },
  descricaoTexto: {
    fontFamily: fontes.texto,
    fontSize: 14,
    lineHeight: 20,
    color: cores.tintaMedia,
  },
});
