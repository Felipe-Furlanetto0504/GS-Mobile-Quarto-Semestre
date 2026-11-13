import { useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { ProblemaCard } from './ProblemaCard';
import { ComunicadoCard } from '../../comunicados/components/ComunicadoCard';
import { useFeed } from '../useProblemas';
import { useComunicados } from '../../comunicados/useComunicados';
import { Chips, Segmentos } from '../../../components/Segmentos';
import { Botao } from '../../../components/Botao';
import { EstadoVazio, Esqueleto, MensagemErro } from '../../../components/Estados';
import { mensagemDeErro } from '../../../services/api';
import { cores } from '../../../theme';

const ORDENS = [
  { valor: 'recentes', rotulo: 'Recentes' },
  { valor: 'apoiados', rotulo: 'Mais apoiados' },
  { valor: 'gravidade', rotulo: 'Mais graves' },
];

export function FeedDaComunidade({ comunidade, cabecalho, espacoInferior = 24 }) {
  const [aba, setAba] = useState('problemas');
  const [ordem, setOrdem] = useState('recentes');
  const feed = useFeed(comunidade?.id, ordem);
  const comunicados = useComunicados(comunidade?.id);
  const podeGerenciar = !!comunidade?.souGestor;

  const listaComunicados = comunicados.data?.content ?? [];
  const destaque = listaComunicados.find((c) => c.destacado);
  const problemas = feed.data?.pages.flatMap((p) => p.content) ?? [];

  const atualizando = aba === 'problemas' ? feed.isRefetching && !feed.isFetchingNextPage : comunicados.isRefetching;
  const atualizar = () => (aba === 'problemas' ? feed.refetch() : comunicados.refetch());

  const topo = (
    <View style={estilos.topo}>
      {cabecalho}
      <Segmentos
        valor={aba}
        aoMudar={setAba}
        opcoes={[
          { valor: 'problemas', rotulo: 'Problemas' },
          { valor: 'comunicados', rotulo: 'Comunicados' },
        ]}
      />
      {aba === 'problemas' ? (
        <>
          {destaque ? <ComunicadoCard comunicado={destaque} /> : null}
          <Chips opcoes={ORDENS} valor={ordem} aoMudar={setOrdem} />
        </>
      ) : podeGerenciar ? (
        <Botao
          titulo="Novo comunicado"
          icone="plus"
          variante="destaque"
          pequeno
          onPress={() => router.push({ pathname: '/comunicado/novo', params: { comunidadeId: comunidade.id } })}
        />
      ) : null}
    </View>
  );

  const carregando = aba === 'problemas' ? feed.isLoading : comunicados.isLoading;
  const erro = aba === 'problemas' ? feed.error : comunicados.error;

  const vazio = carregando ? (
    <View>
      <Esqueleto />
      <Esqueleto />
    </View>
  ) : erro ? (
    <MensagemErro erro={mensagemDeErro(erro)} aoTentarDeNovo={atualizar} />
  ) : aba === 'problemas' ? (
    <EstadoVazio
      icone="map-pin"
      titulo="Nenhum problema por aqui"
      texto="Viu algo na rua? Publique com uma foto e a vizinhança apoia."
      acao={podeGerenciar ? undefined : 'Publicar problema'}
      aoAcionar={() => router.push({ pathname: '/problema/novo', params: { comunidadeId: comunidade.id } })}
    />
  ) : (
    <EstadoVazio icone="volume-2" titulo="Sem comunicados" texto="Os avisos do gestor aparecem aqui." />
  );

  return (
    <FlatList
      data={aba === 'problemas' ? problemas : listaComunicados}
      keyExtractor={(item) => `${aba}-${item.id}`}
      renderItem={({ item, index }) =>
        aba === 'problemas' ? (
          <ProblemaCard problema={item} indice={index} />
        ) : (
          <ComunicadoCard comunicado={item} indice={index} podeGerenciar={podeGerenciar} />
        )
      }
      ListHeaderComponent={topo}
      ListEmptyComponent={vazio}
      ListFooterComponent={
        feed.isFetchingNextPage ? <ActivityIndicator color={cores.tinta} style={{ marginVertical: 16 }} /> : null
      }
      onEndReached={() => aba === 'problemas' && feed.hasNextPage && !feed.isFetchingNextPage && feed.fetchNextPage()}
      onEndReachedThreshold={0.4}
      refreshControl={
        <RefreshControl refreshing={!!atualizando} onRefresh={atualizar} tintColor={cores.tinta} colors={[cores.asfalto]} />
      }
      contentContainerStyle={[estilos.conteudo, { paddingBottom: espacoInferior }]}
      showsVerticalScrollIndicator={false}
    />
  );
}

const estilos = StyleSheet.create({
  conteudo: { paddingHorizontal: 20 },
  topo: { gap: 14, marginBottom: 14 },
});
