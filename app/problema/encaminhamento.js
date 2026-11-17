import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Cabecalho } from '../../src/components/Cabecalho';
import { Botao } from '../../src/components/Botao';
import { MensagemErro } from '../../src/components/Estados';
import { useProblema } from '../../src/features/problemas/useProblemas';
import { useEncaminhamento } from '../../src/features/encaminhamento/useEncaminhamento';
import { ResultadoEncaminhamento } from '../../src/features/encaminhamento/components/ResultadoEncaminhamento';
import { mensagemDeErro } from '../../src/services/api';
import { cores, fontes, raio } from '../../src/theme';

// Erros em que tentar de novo não muda nada: problema não adotado, sem permissão, inexistente.
const SEM_NOVA_TENTATIVA = [403, 404, 409];

function Carregando() {
  const [segundos, setSegundos] = useState(0);
  useEffect(() => {
    const relogio = setInterval(() => setSegundos((s) => s + 1), 1000);
    return () => clearInterval(relogio);
  }, []);

  return (
    <Animated.View entering={FadeIn.duration(250)} style={estilos.carregando}>
      <ActivityIndicator color={cores.tinta} size="large" />
      <Text style={estilos.carregandoTitulo}>
        Procurando o serviço da prefeitura e escrevendo a solicitação…
      </Text>
      <Text style={estilos.carregandoTexto}>
        {segundos < 25
          ? 'A IA lê o problema e as observações, busca nas fichas oficiais do SP156 e monta o texto. Leva cerca de 15 segundos.'
          : 'Está demorando mais que o normal: o serviço de IA e a API ficam em servidores gratuitos que dormem quando ninguém usa. Pode levar até 2 minutos.'}
      </Text>
    </Animated.View>
  );
}

export default function Encaminhamento() {
  const { id } = useLocalSearchParams();
  const problema = useProblema(id).data;
  const consulta = useEncaminhamento(id);
  const voltar = () => (router.canGoBack() ? router.back() : router.replace('/'));

  let conteudo;
  if (consulta.isFetching) {
    conteudo = <Carregando />;
  } else if (consulta.error) {
    const status = consulta.error.response?.status;
    const podeTentar = !SEM_NOVA_TENTATIVA.includes(status);
    conteudo = (
      <View style={{ gap: 12 }}>
        <MensagemErro
          erro={mensagemDeErro(consulta.error)}
          aoTentarDeNovo={podeTentar ? () => consulta.refetch() : undefined}
        />
        {!podeTentar ? (
          <Botao titulo="Voltar ao problema" variante="contorno" pequeno onPress={voltar} />
        ) : null}
      </View>
    );
  } else if (consulta.data) {
    conteudo = (
      <ResultadoEncaminhamento
        resultado={consulta.data}
        aoGerarDeNovo={() => consulta.refetch()}
        aoVoltar={voltar}
      />
    );
  }

  return (
    <SafeAreaView style={estilos.tela} edges={['top']}>
      <Cabecalho titulo="Encaminhamento" subtitulo={problema?.titulo} aoVoltar={voltar} />
      <ScrollView contentContainerStyle={estilos.conteudo}>{conteudo}</ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.papel },
  conteudo: { padding: 20, paddingBottom: 40 },
  carregando: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 48,
    paddingHorizontal: 16,
    backgroundColor: cores.branco,
    borderRadius: raio.xl,
    borderWidth: 1,
    borderColor: cores.linha,
  },
  carregandoTitulo: {
    fontFamily: fontes.textoBold,
    fontSize: 16,
    lineHeight: 22,
    color: cores.tinta,
    textAlign: 'center',
  },
  carregandoTexto: {
    fontFamily: fontes.texto,
    fontSize: 14,
    lineHeight: 20,
    color: cores.suave,
    textAlign: 'center',
  },
});
