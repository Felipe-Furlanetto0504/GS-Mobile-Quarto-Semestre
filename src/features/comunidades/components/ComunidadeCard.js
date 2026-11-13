import { Alert, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Botao } from '../../../components/Botao';
import { Pressionavel } from '../../../components/Pressionavel';
import { useEntrarNaComunidade, useSairDaComunidade } from '../useComunidades';
import { useComunidadeAtual } from '../ComunidadeAtualContext';
import { mensagemDeErro } from '../../../services/api';
import { distancia, plural } from '../../../utils/formatos';
import { cores, fontes, raio } from '../../../theme';

export function ComunidadeCard({ comunidade, indice = 0 }) {
  const entrar = useEntrarNaComunidade();
  const sair = useSairDaComunidade();
  const contexto = useComunidadeAtual();
  const c = comunidade;

  const aoEntrar = () =>
    entrar.mutate(c.id, {
      onSuccess: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        contexto?.escolher(c.id);
      },
      onError: (e) => Alert.alert('Não foi possível entrar', mensagemDeErro(e)),
    });

  const aoSair = () =>
    Alert.alert(`Sair de ${c.nome}?`, 'Você deixa de ver o feed e de receber avisos desta comunidade.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => sair.mutate(c.id, { onError: (e) => Alert.alert('Não deu certo', mensagemDeErro(e)) }),
      },
    ]);

  const abrir = () => {
    if (c.souGestor) return router.push(`/comunidade/${c.id}`);
    contexto?.escolher(c.id);
    router.navigate('/feed');
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(Math.min(indice, 6) * 60).springify().damping(16)}
      layout={LinearTransition.springify()}
      style={[estilos.card, (c.participo || c.souGestor) && estilos.cardAtivo]}
    >
      <Pressionavel onPress={c.participo || c.souGestor ? abrir : undefined} disabled={!c.participo && !c.souGestor} escala={0.985}>
        <View style={estilos.topo}>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={estilos.nome}>{c.nome}</Text>
            <Text style={estilos.meta}>
              {c.gestor?.organizacao || c.gestor?.nome} · {plural(c.totalMembros, 'membro', 'membros')}
            </Text>
          </View>
          {c.distanciaKm != null ? (
            <View style={estilos.distancia}>
              <Text style={estilos.distanciaTexto}>{distancia(c.distanciaKm)}</Text>
            </View>
          ) : null}
        </View>
        {c.descricao ? (
          <Text style={estilos.descricao} numberOfLines={2}>
            {c.descricao}
          </Text>
        ) : null}
      </Pressionavel>

      {c.souGestor ? (
        <Botao titulo="Gerenciar" icone="arrow-right" pequeno onPress={abrir} />
      ) : c.participo ? (
        <View style={estilos.linhaBotoes}>
          <Botao titulo="Abrir feed" pequeno onPress={abrir} style={{ flex: 1 }} />
          <Botao titulo="Sair" variante="contorno" pequeno onPress={aoSair} carregando={sair.isPending} />
        </View>
      ) : (
        <Botao titulo="Entrar na comunidade" variante="destaque" icone="plus" pequeno onPress={aoEntrar} carregando={entrar.isPending} />
      )}
      {c.participo ? (
        <View style={estilos.participa}>
          <Feather name="check" size={14} color={cores.sucesso} />
          <Text style={estilos.participaTexto}>Você participa</Text>
        </View>
      ) : null}
    </Animated.View>
  );
}

const estilos = StyleSheet.create({
  card: {
    backgroundColor: cores.branco,
    borderRadius: raio.xl,
    padding: 16,
    gap: 12,
    borderWidth: 1.5,
    borderColor: cores.linha,
    marginBottom: 12,
  },
  cardAtivo: { borderColor: cores.asfalto },
  topo: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  nome: { fontFamily: fontes.textoBold, fontSize: 16, color: cores.tinta },
  meta: { fontFamily: fontes.texto, fontSize: 13, color: cores.suave },
  descricao: { fontFamily: fontes.texto, fontSize: 13, lineHeight: 19, color: cores.tintaMedia, marginTop: 8 },
  distancia: { backgroundColor: cores.asfalto, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  distanciaTexto: { fontFamily: fontes.textoBold, fontSize: 12, color: cores.amarelo },
  linhaBotoes: { flexDirection: 'row', gap: 10 },
  participa: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  participaTexto: { fontFamily: fontes.textoSemi, fontSize: 12, color: cores.sucesso },
});
