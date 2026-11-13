import { Linking, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Image } from 'expo-image';
import Constants from 'expo-constants';
import { Feather } from '@expo/vector-icons';
import { Cabecalho } from '../src/components/Cabecalho';
import { Pressionavel } from '../src/components/Pressionavel';
import { API_URL } from '../src/config';
import { cores, fontes, raio } from '../src/theme';

const REPOSITORIO = 'https://github.com/Felipe-Furlanetto0504/GS-Mobile-Quarto-Semestre';

const INTEGRANTES = [
  { nome: 'Felipe Furlanetto', rm: 'RM562766' },
  { nome: 'João Victor Caetano Alves da Silva', rm: 'RM562074' },
  { nome: 'João Victor Bueno Castelini da Silva', rm: 'RM564115' },
  { nome: 'Raul Rezende Iemini Aguiar', rm: 'RM564002' },
  { nome: 'Ryan Victor da Silva Vetoriano', rm: 'RM565667' },
];

function Linha({ icone, rotulo, valor, mono }) {
  return (
    <View style={estilos.linha}>
      <Feather name={icone} size={18} color={cores.suave} />
      <View style={{ flex: 1 }}>
        <Text style={estilos.linhaRotulo}>{rotulo}</Text>
        <Text style={[estilos.linhaValor, mono && estilos.mono]} selectable>
          {valor}
        </Text>
      </View>
    </View>
  );
}

export default function Sobre() {
  const commitHash = Constants.expoConfig?.extra?.commitHash;
  const commitCurto = commitHash ? commitHash.slice(0, 7) : 'indisponível';

  const abrirCommit = () => {
    if (commitHash) Linking.openURL(`${REPOSITORIO}/commit/${commitHash}`);
  };

  return (
    <SafeAreaView style={estilos.tela} edges={['top']}>
      <Cabecalho titulo="Sobre o App" />
      <ScrollView contentContainerStyle={estilos.conteudo}>
        <View style={estilos.cartao}>
          <Image
            source={require('../assets/images/logo.png')}
            style={estilos.logo}
            contentFit="contain"
            accessibilityIgnoresInvertColors
          />
          <Text style={estilos.nome}>RootFix</Text>
          <Text style={estilos.descricao}>
            Zeladoria urbana por comunidade: o morador relata, a vizinhança apoia, a IA classifica e
            o gestor resolve.
          </Text>
        </View>

        <Animated.View entering={FadeInDown.delay(80)} style={estilos.bloco}>
          <Text style={estilos.blocoTitulo}>Versão publicada</Text>
          <Linha icone="smartphone" rotulo="Versão do app" valor={Constants.expoConfig?.version} />
          <Linha icone="git-commit" rotulo="Commit de referência" valor={commitCurto} mono />
          {commitHash ? (
            <Linha icone="hash" rotulo="Hash completo" valor={commitHash} mono />
          ) : null}
          {commitHash ? (
            <Pressionavel
              onPress={abrirCommit}
              accessibilityRole="link"
              accessibilityLabel="Ver este commit no GitHub"
              style={estilos.link}
            >
              <Feather name="github" size={16} color={cores.azul} />
              <Text style={estilos.linkTexto}>Ver este commit no GitHub</Text>
            </Pressionavel>
          ) : null}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(160)} style={estilos.bloco}>
          <Text style={estilos.blocoTitulo}>Projeto</Text>
          <Linha icone="book-open" rotulo="Disciplina" valor="Mobile Application Development" />
          <Linha icone="award" rotulo="Entrega" valor="Global Solution 2026/2 · CitizenTech" />
          <Linha icone="server" rotulo="API" valor={API_URL} mono />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(240)} style={estilos.bloco}>
          <Text style={estilos.blocoTitulo}>Grupo Rooted</Text>
          {INTEGRANTES.map((pessoa) => (
            <Linha key={pessoa.rm} icone="user" rotulo={pessoa.rm} valor={pessoa.nome} />
          ))}
        </Animated.View>

        <Text style={estilos.rodape}>FIAP · 2º ano de Análise e Desenvolvimento de Sistemas</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.papel },
  conteudo: { padding: 20, gap: 16, paddingBottom: 40 },
  cartao: {
    backgroundColor: cores.asfalto,
    borderRadius: raio.xl,
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  logo: { width: 64, height: 64 },
  nome: { fontFamily: fontes.titulo, fontSize: 24, color: cores.papel },
  descricao: {
    fontFamily: fontes.texto,
    fontSize: 14,
    lineHeight: 20,
    color: cores.textoClaroSuave,
    textAlign: 'center',
  },
  bloco: {
    backgroundColor: cores.branco,
    borderRadius: raio.xl,
    borderWidth: 1.5,
    borderColor: cores.linha,
    padding: 6,
  },
  blocoTitulo: {
    fontFamily: fontes.textoBold,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: cores.suave,
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  linha: { flexDirection: 'row', gap: 12, padding: 12, alignItems: 'center' },
  linhaRotulo: { fontFamily: fontes.texto, fontSize: 12, color: cores.suave },
  linhaValor: { fontFamily: fontes.textoSemi, fontSize: 14, color: cores.tinta },
  mono: { fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }), fontSize: 13 },
  link: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12 },
  linkTexto: { fontFamily: fontes.textoSemi, fontSize: 14, color: cores.azul },
  rodape: { fontFamily: fontes.texto, fontSize: 12, color: cores.suave, textAlign: 'center' },
});
