import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ComunidadeCard } from '../../src/features/comunidades/components/ComunidadeCard';
import { useComunidadesProximas, useMinhasComunidades } from '../../src/features/comunidades/useComunidades';
import { useAuth } from '../../src/features/auth/AuthContext';
import { Mapa } from '../../src/components/Mapa';
import { Botao } from '../../src/components/Botao';
import { EstadoVazio, Esqueleto, MensagemErro } from '../../src/components/Estados';
import { mensagemDeErro } from '../../src/services/api';
import { cores, fontes } from '../../src/theme';

const RAIO_KM = 3;

export default function Comunidades() {
  const { usuario, ehGestor } = useAuth();
  const minhas = useMinhasComunidades();
  const proximas = useComunidadesProximas(!ehGestor);
  const consulta = ehGestor ? minhas : proximas;
  const lista = ehGestor ? minhas.data ?? [] : proximas.data?.content ?? [];

  const centro =
    usuario?.latitude != null ? { latitude: Number(usuario.latitude), longitude: Number(usuario.longitude) } : null;

  const topo = (
    <View style={estilos.topo}>
      <View style={{ gap: 4 }}>
        <Text style={estilos.titulo}>{ehGestor ? 'Suas comunidades' : 'Comunidades perto de você'}</Text>
        <Text style={estilos.subtitulo}>
          {ehGestor
            ? 'Toque em uma comunidade para ver o feed, os supervisionados e publicar comunicados.'
            : `Raio de ${RAIO_KM} km a partir de: ${usuario?.endereco ?? 'seu endereço'}`}
        </Text>
      </View>
      {ehGestor ? (
        <Botao titulo="Nova comunidade" icone="plus" variante="destaque" pequeno onPress={() => router.push('/comunidade/nova')} />
      ) : (
        <Mapa
          centro={centro}
          raioKm={RAIO_KM}
          altura={230}
          marcadores={lista.map((c) => ({
            id: c.id,
            latitude: c.latitude,
            longitude: c.longitude,
            titulo: c.nome,
            descricao: c.participo ? 'Você participa' : 'Toque no card para entrar',
            destaque: c.participo,
          }))}
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={estilos.tela} edges={['top']}>
      <FlatList
        data={lista}
        keyExtractor={(c) => String(c.id)}
        renderItem={({ item, index }) => <ComunidadeCard comunidade={item} indice={index} />}
        ListHeaderComponent={topo}
        ListEmptyComponent={
          consulta.isLoading ? (
            <View>
              <Esqueleto altura={130} />
              <Esqueleto altura={130} />
            </View>
          ) : consulta.error ? (
            <MensagemErro erro={mensagemDeErro(consulta.error)} aoTentarDeNovo={consulta.refetch} />
          ) : (
            <EstadoVazio
              icone="map-pin"
              titulo={ehGestor ? 'Nenhuma comunidade ainda' : 'Nenhuma comunidade a até 3 km'}
              texto={
                ehGestor
                  ? 'Crie uma comunidade para começar a receber problemas.'
                  : 'Quando um gestor criar uma comunidade perto de você, ela aparece aqui.'
              }
            />
          )
        }
        refreshControl={<RefreshControl refreshing={consulta.isRefetching} onRefresh={consulta.refetch} tintColor={cores.tinta} />}
        contentContainerStyle={estilos.conteudo}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.papel },
  conteudo: { padding: 20, paddingBottom: 32 },
  topo: { gap: 16, marginBottom: 16 },
  titulo: { fontFamily: fontes.titulo, fontSize: 26, letterSpacing: -0.5, color: cores.tinta },
  subtitulo: { fontFamily: fontes.texto, fontSize: 13, lineHeight: 19, color: cores.suave },
});
