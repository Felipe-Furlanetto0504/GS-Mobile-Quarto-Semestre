import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  FadeOut,
  LinearTransition,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
  Extrapolation,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import {
  useAdicionarObservacao,
  useAdotarProblema,
  useExcluirObservacao,
  useExcluirProblema,
  useObservacoes,
  useProblema,
} from '../../src/features/problemas/useProblemas';
import { FotoProblema } from '../../src/features/problemas/components/FotoProblema';
import { GravidadeChip } from '../../src/features/problemas/components/GravidadeChip';
import { AnaliseIA } from '../../src/features/problemas/components/AnaliseIA';
import { LinhaDoTempo } from '../../src/features/problemas/components/LinhaDoTempo';
import { BotaoApoio } from '../../src/features/problemas/components/BotaoApoio';
import { Pressionavel } from '../../src/components/Pressionavel';
import { Botao } from '../../src/components/Botao';
import { MensagemErro } from '../../src/components/Estados';
import { useAuth } from '../../src/features/auth/AuthContext';
import { mensagemDeErro } from '../../src/services/api';
import { tempoRelativo } from '../../src/utils/formatos';
import { cores, fontes, raio } from '../../src/theme';

const ALTURA_FOTO = 320;

function Observacao({ obs, problemaId, indice }) {
  const excluir = useExcluirObservacao(problemaId);
  const inicial = obs.autor?.nome?.[0]?.toUpperCase() ?? '?';
  return (
    <Animated.View
      entering={FadeInDown.delay(Math.min(indice, 5) * 40)}
      exiting={FadeOut}
      layout={LinearTransition}
      style={estilos.obs}
    >
      <View style={estilos.avatar}>
        <Text style={estilos.avatarTexto}>{inicial}</Text>
      </View>
      <View style={estilos.balao}>
        <View style={estilos.balaoTopo}>
          <Text style={estilos.obsAutor}>{obs.souAutor ? 'Você' : obs.autor?.nome}</Text>
          <Text style={estilos.obsQuando}>{tempoRelativo(obs.criadaEm)}</Text>
        </View>
        <Text style={estilos.obsTexto}>{obs.texto}</Text>
        {obs.souAutor ? (
          <Pressionavel
            onPress={() => excluir.mutate(obs.id)}
            accessibilityLabel="Excluir sua observação"
            style={{ alignSelf: 'flex-start', paddingVertical: 4 }}
          >
            <Text style={estilos.obsExcluir}>{excluir.isPending ? 'Excluindo…' : 'Excluir'}</Text>
          </Pressionavel>
        ) : null}
      </View>
    </Animated.View>
  );
}

export default function DetalheProblema() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { ehGestor } = useAuth();
  const consulta = useProblema(id);
  const observacoes = useObservacoes(id);
  const adicionar = useAdicionarObservacao(id);
  const excluir = useExcluirProblema();
  const adotar = useAdotarProblema();
  const [texto, setTexto] = useState('');

  const refRolagem = useAnimatedRef();
  const rolagem = useScrollViewOffset(refRolagem);
  const estiloFoto = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          rolagem.value,
          [-ALTURA_FOTO, 0, ALTURA_FOTO],
          [-ALTURA_FOTO / 2, 0, ALTURA_FOTO * 0.6]
        ),
      },
      {
        scale: interpolate(
          rolagem.value,
          [-ALTURA_FOTO, 0, ALTURA_FOTO],
          [2, 1, 1],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  const p = consulta.data;

  if (consulta.isLoading) {
    return (
      <View style={[estilos.tela, estilos.centro]}>
        <ActivityIndicator color={cores.tinta} size="large" />
      </View>
    );
  }
  if (consulta.error || !p) {
    return (
      <View style={[estilos.tela, estilos.centro, { paddingTop: insets.top }]}>
        <MensagemErro erro={mensagemDeErro(consulta.error)} aoTentarDeNovo={consulta.refetch} />
        <Botao titulo="Voltar" variante="contorno" pequeno onPress={() => router.back()} />
      </View>
    );
  }

  const podeEditar = p.souAutor && !p.adotado;

  const abrirMenu = () =>
    Alert.alert('Seu relato', 'Você pode editar ou excluir até o gestor adotar o problema.', [
      {
        text: 'Editar',
        onPress: () => router.push({ pathname: '/problema/editar', params: { id: p.id } }),
      },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () =>
          Alert.alert('Excluir problema?', 'Os apoios e as observações também serão apagados.', [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Excluir',
              style: 'destructive',
              onPress: () =>
                excluir.mutate(p.id, {
                  onSuccess: () => router.back(),
                  onError: (e) => Alert.alert('Não deu certo', mensagemDeErro(e)),
                }),
            },
          ]),
      },
      { text: 'Cancelar', style: 'cancel' },
    ]);

  const enviarObservacao = () => {
    const limpo = texto.trim();
    if (!limpo) return;
    adicionar.mutate(limpo, {
      onSuccess: () => {
        setTexto('');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      },
      onError: (e) => Alert.alert('Não deu certo', mensagemDeErro(e)),
    });
  };

  return (
    <KeyboardAvoidingView
      style={estilos.tela}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="light" />
      <Animated.ScrollView
        ref={refRolagem}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <Animated.View style={[{ height: ALTURA_FOTO }, estiloFoto]}>
          <FotoProblema problema={p} altura={ALTURA_FOTO} analisando={!p.gravidadeIa} />
        </Animated.View>

        <View style={estilos.folha}>
          <Animated.View entering={FadeInDown.duration(300)} style={{ gap: 10 }}>
            <View style={estilos.chips}>
              <GravidadeChip gravidade={p.gravidadeIa} />
              {p.categoria ? (
                <View style={estilos.chipCategoria}>
                  <Text style={estilos.chipCategoriaTexto}>{p.categoria.nome}</Text>
                </View>
              ) : null}
            </View>
            <Text style={estilos.titulo}>{p.titulo}</Text>
            <Text style={estilos.meta}>
              {p.souAutor ? 'Você' : p.autor?.nome} · {p.comunidade?.nome} ·{' '}
              {tempoRelativo(p.criadoEm)}
            </Text>
            <Text style={estilos.descricao}>{p.descricao}</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(80).duration(300)}>
            <AnaliseIA problema={p} />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(140).duration(300)} style={{ gap: 10 }}>
            <Text style={estilos.secao}>Andamento</Text>
            <LinhaDoTempo problema={p} />
          </Animated.View>

          {p.souGestor && !p.adotado ? (
            <Botao
              titulo="Adotar este problema"
              icone="check"
              variante="destaque"
              carregando={adotar.isPending}
              onPress={() =>
                adotar.mutate(p.id, {
                  onSuccess: () =>
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
                      () => {}
                    ),
                  onError: (e) => Alert.alert('Não foi possível adotar', mensagemDeErro(e)),
                })
              }
            />
          ) : null}

          <View style={{ gap: 12 }}>
            <Text style={estilos.secao}>
              Observações dos vizinhos · {observacoes.data?.length ?? p.totalObservacoes}
            </Text>
            {observacoes.isLoading ? <ActivityIndicator color={cores.tinta} /> : null}
            {(observacoes.data ?? []).map((obs, i) => (
              <Observacao key={obs.id} obs={obs} problemaId={p.id} indice={i} />
            ))}
            {observacoes.data?.length === 0 ? (
              <Text style={estilos.semObs}>
                Ninguém comentou ainda. Viu algo a mais? Conte aqui embaixo.
              </Text>
            ) : null}
          </View>
        </View>
      </Animated.ScrollView>

      {/* Botões flutuando sobre a foto */}
      <View style={[estilos.barraTopo, { top: insets.top + 8 }]} pointerEvents="box-none">
        <Pressionavel
          onPress={() => router.back()}
          accessibilityLabel="Voltar"
          style={estilos.botaoFoto}
        >
          <Feather name="chevron-left" size={22} color={cores.papel} />
        </Pressionavel>
        {podeEditar ? (
          <Pressionavel
            onPress={abrirMenu}
            accessibilityLabel="Editar ou excluir seu relato"
            style={estilos.botaoFoto}
          >
            <Feather name="more-horizontal" size={22} color={cores.papel} />
          </Pressionavel>
        ) : null}
      </View>

      <View style={[estilos.rodape, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TextInput
          value={texto}
          onChangeText={setTexto}
          placeholder="Adicionar observação…"
          placeholderTextColor="#8A8F99"
          maxLength={1000}
          accessibilityLabel="Adicionar observação"
          style={estilos.input}
          returnKeyType="send"
          onSubmitEditing={enviarObservacao}
        />
        {texto.trim() ? (
          <Pressionavel
            onPress={enviarObservacao}
            disabled={adicionar.isPending}
            accessibilityLabel="Enviar observação"
            style={estilos.enviar}
          >
            {adicionar.isPending ? (
              <ActivityIndicator color={cores.amarelo} />
            ) : (
              <Feather name="send" size={18} color={cores.amarelo} />
            )}
          </Pressionavel>
        ) : !ehGestor ? (
          <BotaoApoio problema={p} compacto />
        ) : null}
      </View>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.papel },
  centro: { alignItems: 'center', justifyContent: 'center', gap: 12, padding: 20 },
  folha: {
    marginTop: -28,
    backgroundColor: cores.papel,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    gap: 22,
  },
  chips: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chipCategoria: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: cores.papel2,
  },
  chipCategoriaTexto: { fontFamily: fontes.textoBold, fontSize: 11, color: cores.tintaMedia },
  titulo: {
    fontFamily: fontes.titulo,
    fontSize: 25,
    lineHeight: 29,
    letterSpacing: -0.5,
    color: cores.tinta,
  },
  meta: { fontFamily: fontes.textoMedio, fontSize: 13, color: cores.suave },
  descricao: { fontFamily: fontes.texto, fontSize: 15, lineHeight: 22, color: cores.tintaMedia },
  secao: { fontFamily: fontes.textoBold, fontSize: 14, color: cores.tinta },
  obs: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: cores.papel2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTexto: { fontFamily: fontes.textoBold, fontSize: 13, color: cores.tinta },
  balao: {
    flex: 1,
    backgroundColor: cores.branco,
    borderRadius: 16,
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: cores.linha,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 3,
  },
  balaoTopo: { flexDirection: 'row', justifyContent: 'space-between' },
  obsAutor: { fontFamily: fontes.textoBold, fontSize: 13, color: cores.tinta },
  obsQuando: { fontFamily: fontes.texto, fontSize: 12, color: cores.suave },
  obsTexto: { fontFamily: fontes.texto, fontSize: 14, lineHeight: 20, color: cores.tintaMedia },
  obsExcluir: { fontFamily: fontes.textoSemi, fontSize: 12, color: cores.perigo },
  semObs: { fontFamily: fontes.texto, fontSize: 13, color: cores.suave },
  barraTopo: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  botaoFoto: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(20,23,31,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rodape: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: cores.branco,
    borderTopWidth: 1,
    borderTopColor: cores.linha,
  },
  input: {
    flex: 1,
    minHeight: 48,
    borderRadius: raio.md,
    borderWidth: 1.5,
    borderColor: cores.linhaForte,
    backgroundColor: cores.papel,
    paddingHorizontal: 14,
    fontFamily: fontes.texto,
    fontSize: 14,
    color: cores.tinta,
  },
  enviar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: cores.asfalto,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
