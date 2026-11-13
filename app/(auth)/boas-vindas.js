import { useRef, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  Extrapolation,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { IlustracaoRua } from '../../src/features/auth/components/IlustracaoRua';
import { Botao } from '../../src/components/Botao';
import { Pressionavel } from '../../src/components/Pressionavel';
import { cores, fontes } from '../../src/theme';

const { width: LARGURA } = Dimensions.get('window');

const PAGINAS = [
  {
    sobrelinha: 'Zeladoria por comunidade',
    titulo: 'Viu um problema na rua? O bairro resolve junto.',
    texto: 'Buraco, poste apagado, bueiro entupido: registre com foto e localização.',
  },
  {
    sobrelinha: 'Sem relatos repetidos',
    titulo: 'Apoie o que já foi publicado.',
    texto: 'Em vez de publicar de novo, diga "também sofri com isso" e deixe uma observação.',
  },
  {
    sobrelinha: 'A IA prioriza',
    titulo: 'O mais grave chega primeiro ao gestor.',
    texto: 'A IA olha a foto, estima a gravidade e o gestor da comunidade adota o problema.',
  },
];

function Ponto({ indice, rolagem }) {
  const estilo = useAnimatedStyle(() => {
    const p = rolagem.value / LARGURA;
    const ativo = interpolate(Math.abs(p - indice), [0, 1], [1, 0], Extrapolation.CLAMP);
    return { width: 6 + ativo * 18, opacity: 0.35 + ativo * 0.65 };
  });
  return <Animated.View style={[estilos.ponto, estilo]} />;
}

export default function BoasVindas() {
  const rolagem = useSharedValue(0);
  const lista = useRef(null);
  const [pagina, setPagina] = useState(0);

  const aoRolar = useAnimatedScrollHandler((e) => {
    rolagem.value = e.contentOffset.x;
  });

  const ultima = pagina === PAGINAS.length - 1;
  const avancar = () => {
    if (ultima) return router.push('/login');
    lista.current?.scrollToOffset({ offset: (pagina + 1) * LARGURA, animated: true });
  };

  return (
    <SafeAreaView style={estilos.tela} edges={['top', 'bottom']}>
      <StatusBar style="light" />
      <View style={estilos.topo}>
        <View style={estilos.marca}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={estilos.logo}
            contentFit="contain"
          />
          <Text style={estilos.marcaTexto}>RootFix</Text>
        </View>
        <Pressionavel
          onPress={() => router.push('/login')}
          style={estilos.pular}
          accessibilityLabel="Pular apresentação"
        >
          <Text style={estilos.pularTexto}>Pular</Text>
        </Pressionavel>
      </View>

      <IlustracaoRua />

      <Animated.FlatList
        ref={lista}
        data={PAGINAS}
        keyExtractor={(p) => p.titulo}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={aoRolar}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) => setPagina(Math.round(e.nativeEvent.contentOffset.x / LARGURA))}
        renderItem={({ item }) => (
          <View style={estilos.pagina}>
            <Text style={estilos.sobrelinha}>{item.sobrelinha}</Text>
            <Text style={estilos.titulo}>{item.titulo}</Text>
            <Text style={estilos.texto}>{item.texto}</Text>
          </View>
        )}
      />

      <View style={estilos.rodape}>
        <View style={estilos.pontos}>
          {PAGINAS.map((p, i) => (
            <Ponto key={p.titulo} indice={i} rolagem={rolagem} />
          ))}
        </View>
        <View style={estilos.botoes}>
          <Botao
            titulo="Já tenho conta"
            variante="contornoEscuro"
            onPress={() => router.push('/login')}
            style={{ flex: 1 }}
          />
          <Botao
            titulo={ultima ? 'Começar' : 'Próximo'}
            variante="destaque"
            icone="arrow-right"
            onPress={avancar}
            style={{ flex: 1 }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.asfalto },
  topo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  marca: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logo: { width: 30, height: 30 },
  marcaTexto: { fontFamily: fontes.titulo, fontSize: 20, color: cores.papel },
  pular: { padding: 12 },
  pularTexto: { fontFamily: fontes.textoSemi, fontSize: 14, color: cores.textoClaroSuave },
  pagina: { width: LARGURA, paddingHorizontal: 24, paddingTop: 28, gap: 10 },
  sobrelinha: {
    fontFamily: fontes.textoBold,
    fontSize: 12,
    letterSpacing: 1.6,
    color: cores.amarelo,
    textTransform: 'uppercase',
  },
  titulo: {
    fontFamily: fontes.titulo,
    fontSize: 30,
    lineHeight: 34,
    letterSpacing: -0.7,
    color: cores.papel,
  },
  texto: { fontFamily: fontes.texto, fontSize: 15, lineHeight: 22, color: cores.textoClaroSuave },
  rodape: { paddingHorizontal: 24, paddingBottom: 16, gap: 18 },
  pontos: { flexDirection: 'row', gap: 6 },
  ponto: { height: 6, borderRadius: 3, backgroundColor: cores.amarelo },
  botoes: { flexDirection: 'row', gap: 12 },
});
