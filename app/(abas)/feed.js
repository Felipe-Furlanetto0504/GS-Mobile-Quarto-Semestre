import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { FeedDaComunidade } from '../../src/features/problemas/components/FeedDaComunidade';
import { useComunidadeAtual } from '../../src/features/comunidades/ComunidadeAtualContext';
import { useNaoLidas } from '../../src/features/notificacoes/useNotificacoes';
import { Pressionavel } from '../../src/components/Pressionavel';
import { EstadoVazio, Esqueleto } from '../../src/components/Estados';
import { cores, fontes, raio } from '../../src/theme';

// Folha de baixo para trocar de comunidade.
function TrocarComunidade({ aberto, aoFechar }) {
  const { comunidades, atual, escolher } = useComunidadeAtual();
  return (
    <Modal visible={aberto} transparent animationType="none" onRequestClose={aoFechar}>
      <Animated.View entering={FadeIn.duration(150)} style={estilos.fundoModal}>
        <Pressable style={StyleSheet.absoluteFill} onPress={aoFechar} accessibilityLabel="Fechar" />
        <Animated.View entering={SlideInDown.springify().damping(18)} style={estilos.folha}>
          <View style={estilos.alca} />
          <Text style={estilos.folhaTitulo}>Suas comunidades</Text>
          {comunidades.map((c) => (
            <Pressionavel
              key={c.id}
              onPress={() => {
                escolher(c.id);
                aoFechar();
              }}
              accessibilityState={{ selected: c.id === atual?.id }}
              style={[estilos.opcao, c.id === atual?.id && estilos.opcaoAtiva]}
            >
              <Text style={estilos.opcaoTexto}>{c.nome}</Text>
              {c.id === atual?.id ? <Feather name="check" size={18} color={cores.tinta} /> : null}
            </Pressionavel>
          ))}
          <Pressionavel
            onPress={() => {
              aoFechar();
              router.navigate('/comunidades');
            }}
            style={estilos.opcao}
          >
            <Text style={[estilos.opcaoTexto, { color: cores.azul }]}>Encontrar outras comunidades</Text>
            <Feather name="arrow-right" size={18} color={cores.azul} />
          </Pressionavel>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

export default function Feed() {
  const { atual, carregando, comunidades } = useComunidadeAtual();
  const naoLidas = useNaoLidas();
  const [trocando, setTrocando] = useState(false);

  if (carregando) {
    return (
      <SafeAreaView style={estilos.tela} edges={['top']}>
        <View style={{ padding: 20 }}>
          <Esqueleto altura={60} />
          <Esqueleto />
          <Esqueleto />
        </View>
      </SafeAreaView>
    );
  }

  if (!atual) {
    return (
      <SafeAreaView style={[estilos.tela, { justifyContent: 'center' }]} edges={['top']}>
        <EstadoVazio
          icone="map"
          titulo="Você ainda não está em nenhuma comunidade"
          texto="Entre em uma comunidade a até 3 km de casa para ver e publicar problemas."
          acao="Ver comunidades próximas"
          aoAcionar={() => router.navigate('/comunidades')}
        />
      </SafeAreaView>
    );
  }

  const cabecalho = (
    <View style={estilos.cabecalho}>
      <Pressionavel
        onPress={() => setTrocando(true)}
        disabled={comunidades.length === 0}
        accessibilityLabel={`Comunidade ${atual.nome}. Toque para trocar`}
        style={{ flex: 1 }}
      >
        <Text style={estilos.sobrelinha}>COMUNIDADE</Text>
        <View style={estilos.nomeLinha}>
          <Text style={estilos.nome} numberOfLines={1}>
            {atual.nome}
          </Text>
          <Feather name="chevron-down" size={18} color={cores.tinta} />
        </View>
      </Pressionavel>
      <Pressionavel
        onPress={() => router.navigate('/avisos')}
        accessibilityLabel={naoLidas ? `Avisos, ${naoLidas} não lidos` : 'Avisos'}
        style={estilos.sino}
      >
        <Feather name="bell" size={20} color={cores.tinta} />
        {naoLidas ? <View style={estilos.pontoSino} /> : null}
      </Pressionavel>
    </View>
  );

  return (
    <SafeAreaView style={estilos.tela} edges={['top']}>
      <FeedDaComunidade comunidade={atual} cabecalho={cabecalho} />
      <TrocarComunidade aberto={trocando} aoFechar={() => setTrocando(false)} />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.papel },
  cabecalho: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 8 },
  sobrelinha: { fontFamily: fontes.textoSemi, fontSize: 12, letterSpacing: 0.4, color: cores.suave },
  nomeLinha: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  nome: { fontFamily: fontes.titulo, fontSize: 21, letterSpacing: -0.3, color: cores.tinta, flexShrink: 1 },
  sino: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: cores.branco,
    borderWidth: 1.5,
    borderColor: cores.linha,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pontoSino: {
    position: 'absolute',
    top: 8,
    right: 9,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: cores.perigo,
    borderWidth: 2,
    borderColor: cores.branco,
  },
  fundoModal: { flex: 1, backgroundColor: 'rgba(20,23,31,0.45)', justifyContent: 'flex-end' },
  folha: { backgroundColor: cores.papel, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, paddingBottom: 36, gap: 8 },
  alca: { alignSelf: 'center', width: 40, height: 5, borderRadius: 3, backgroundColor: cores.linhaForte, marginBottom: 6 },
  folhaTitulo: { fontFamily: fontes.titulo, fontSize: 20, color: cores.tinta, marginBottom: 6 },
  opcao: {
    minHeight: 52,
    borderRadius: raio.md,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: cores.branco,
    borderWidth: 1.5,
    borderColor: cores.linha,
  },
  opcaoAtiva: { borderColor: cores.asfalto },
  opcaoTexto: { fontFamily: fontes.textoSemi, fontSize: 15, color: cores.tinta, flex: 1 },
});
