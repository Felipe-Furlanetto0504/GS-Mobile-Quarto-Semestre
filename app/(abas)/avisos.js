import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NotificacaoItem } from '../../src/features/notificacoes/components/NotificacaoItem';
import { useExcluirLidas, useNotificacoes } from '../../src/features/notificacoes/useNotificacoes';
import { Botao } from '../../src/components/Botao';
import { EstadoVazio, Esqueleto, MensagemErro } from '../../src/components/Estados';
import { mensagemDeErro } from '../../src/services/api';
import { paraData } from '../../src/utils/formatos';
import { cores, fontes } from '../../src/theme';

// Separa em "Hoje" e "Antes", com um item de título entre os grupos.
function agrupar(lista) {
  const hoje = new Date().toDateString();
  const deHoje = lista.filter((n) => paraData(n.criadaEm)?.toDateString() === hoje);
  const antes = lista.filter((n) => paraData(n.criadaEm)?.toDateString() !== hoje);
  const itens = [];
  if (deHoje.length) itens.push({ tipo: 'titulo', id: 't-hoje', texto: 'Hoje' }, ...deHoje);
  if (antes.length) itens.push({ tipo: 'titulo', id: 't-antes', texto: 'Antes' }, ...antes);
  return itens;
}

export default function Avisos() {
  const consulta = useNotificacoes();
  const limpar = useExcluirLidas();
  const lista = consulta.data?.content ?? [];
  const naoLidas = lista.filter((n) => !n.lida).length;
  const temLidas = lista.some((n) => n.lida);

  return (
    <SafeAreaView style={estilos.tela} edges={['top']}>
      <View style={estilos.topo}>
        <View>
          <Text style={estilos.sobrelinha}>{naoLidas ? `${naoLidas} não lidas` : 'Tudo em dia'}</Text>
          <Text style={estilos.titulo}>Avisos</Text>
        </View>
        <Botao
          titulo="Limpar lidas"
          variante="contorno"
          pequeno
          desabilitado={!temLidas}
          carregando={limpar.isPending}
          onPress={() => limpar.mutate()}
        />
      </View>
      <FlatList
        data={agrupar(lista)}
        keyExtractor={(n) => String(n.id)}
        renderItem={({ item, index }) =>
          item.tipo === 'titulo' ? (
            <Text style={estilos.grupo}>{item.texto}</Text>
          ) : (
            <NotificacaoItem notificacao={item} indice={index} />
          )
        }
        ListEmptyComponent={
          consulta.isLoading ? (
            <View>
              <Esqueleto altura={80} />
              <Esqueleto altura={80} />
              <Esqueleto altura={80} />
            </View>
          ) : consulta.error ? (
            <MensagemErro erro={mensagemDeErro(consulta.error)} aoTentarDeNovo={consulta.refetch} />
          ) : (
            <EstadoVazio icone="bell-off" titulo="Nenhum aviso" texto="Quando algo mudar nos seus problemas, você fica sabendo aqui." />
          )
        }
        ListFooterComponent={lista.length ? <Text style={estilos.dica}>Arraste um aviso para a esquerda para excluir</Text> : null}
        refreshControl={<RefreshControl refreshing={consulta.isRefetching} onRefresh={consulta.refetch} tintColor={cores.tinta} />}
        contentContainerStyle={estilos.conteudo}
      />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.papel },
  topo: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  sobrelinha: { fontFamily: fontes.textoSemi, fontSize: 12, letterSpacing: 0.4, color: cores.suave, textTransform: 'uppercase' },
  titulo: { fontFamily: fontes.titulo, fontSize: 28, letterSpacing: -0.6, color: cores.tinta },
  conteudo: { paddingHorizontal: 20, paddingBottom: 32 },
  grupo: { fontFamily: fontes.textoBold, fontSize: 12, letterSpacing: 1, color: cores.suave, textTransform: 'uppercase', marginVertical: 10 },
  dica: { fontFamily: fontes.texto, fontSize: 12, color: cores.suave, textAlign: 'center', marginTop: 12 },
});
