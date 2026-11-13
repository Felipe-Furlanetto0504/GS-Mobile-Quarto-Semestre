import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { Campo } from '../../src/components/Campo';
import { Botao } from '../../src/components/Botao';
import { Cabecalho } from '../../src/components/Cabecalho';
import { Pressionavel } from '../../src/components/Pressionavel';
import { useAuth } from '../../src/features/auth/AuthContext';
import { mensagemDeErro } from '../../src/services/api';
import { cores, fontes, raio } from '../../src/theme';

// Contas criadas automaticamente pela API Java (DadosIniciais).
const DEMO = {
  morador: { email: 'morador@rootfix.com', senha: 'Rootfix@2026' },
  gestor: { email: 'gestor@rootfix.com', senha: 'Rootfix@2026' },
};

export default function Login() {
  const insets = useSafeAreaInsets();
  const { entrar } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState(null);
  const [enviando, setEnviando] = useState(null);
  const campoSenha = useRef(null);

  // Formulário "balança" quando a senha está errada.
  const tremor = useSharedValue(0);
  const estiloTremor = useAnimatedStyle(() => ({ transform: [{ translateX: tremor.value }] }));

  async function fazerLogin(credenciais, origem) {
    setErro(null);
    if (!credenciais.email || !credenciais.senha) {
      setErro('Preencha e-mail e senha.');
      return;
    }
    setEnviando(origem);
    try {
      await entrar(credenciais.email.trim(), credenciais.senha);
      // O Stack.Protected do _layout troca de tela sozinho quando o login dá certo.
    } catch (e) {
      setErro(e.response?.status === 401 ? 'E-mail ou senha incorretos.' : mensagemDeErro(e));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      tremor.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-6, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
      setEnviando(null);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar style="light" />
      <ScrollView
        style={{ flex: 1, backgroundColor: cores.papel }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[estilos.topo, { paddingTop: insets.top }]}>
          <View style={estilos.faixas}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <View key={i} style={estilos.faixa} />
            ))}
          </View>
          <Cabecalho escuro />
          <View style={estilos.marca}>
            <Image source={require('../../assets/images/logo.png')} style={{ width: 34, height: 34 }} contentFit="contain" />
            <Text style={estilos.marcaTexto}>RootFix</Text>
          </View>
        </View>

        <Animated.View entering={FadeInDown.duration(350)} style={[estilos.conteudo, estiloTremor]}>
          <View style={{ gap: 6 }}>
            <Text style={estilos.titulo}>Entrar</Text>
            <Text style={estilos.subtitulo}>Use sua conta de morador ou de gestor.</Text>
          </View>

          <Campo
            rotulo="E-mail"
            valor={email}
            aoMudar={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            returnKeyType="next"
            onSubmitEditing={() => campoSenha.current?.focus()}
          />
          <Campo
            ref={campoSenha}
            rotulo="Senha"
            valor={senha}
            aoMudar={setSenha}
            senha
            autoComplete="password"
            returnKeyType="go"
            onSubmitEditing={() => fazerLogin({ email, senha }, 'form')}
          />
          {erro ? (
            <Animated.Text entering={FadeInDown} style={estilos.erro}>
              {erro}
            </Animated.Text>
          ) : null}

          <Botao titulo="Entrar" icone="arrow-right" carregando={enviando === 'form'} onPress={() => fazerLogin({ email, senha }, 'form')} />

          <View style={estilos.divisor}>
            <View style={estilos.linha} />
            <Text style={estilos.divisorTexto}>ACESSO RÁPIDO PARA A DEMO</Text>
            <View style={estilos.linha} />
          </View>

          <View style={estilos.demo}>
            {[
              ['morador', 'Morador', 'Bela Vista'],
              ['gestor', 'Gestor', 'Fila de triagem'],
            ].map(([chave, titulo, sub]) => (
              <Pressionavel
                key={chave}
                onPress={() => fazerLogin(DEMO[chave], chave)}
                disabled={!!enviando}
                style={estilos.cartaoDemo}
                accessibilityLabel={`Entrar como ${titulo}`}
              >
                <Text style={estilos.cartaoTitulo}>{enviando === chave ? 'Entrando…' : titulo}</Text>
                <Text style={estilos.cartaoSub}>{sub}</Text>
              </Pressionavel>
            ))}
          </View>

          <View style={estilos.cadastro}>
            <Text style={estilos.cadastroTexto}>Ainda não tem conta?</Text>
            <View style={{ flexDirection: 'row', gap: 16 }}>
              <Link href="/cadastro-morador" style={estilos.link}>
                Sou morador
              </Link>
              <Link href="/cadastro-gestor" style={estilos.link}>
                Sou gestor
              </Link>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  topo: {
    backgroundColor: cores.asfalto,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingBottom: 24,
    overflow: 'hidden',
  },
  faixas: {
    position: 'absolute',
    left: -40,
    top: 130,
    flexDirection: 'row',
    gap: 22,
    transform: [{ rotate: '-12deg' }],
  },
  faixa: { width: 56, height: 8, borderRadius: 4, backgroundColor: cores.amarelo, opacity: 0.9 },
  marca: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 24, marginTop: 48 },
  marcaTexto: { fontFamily: fontes.titulo, fontSize: 22, color: cores.papel },
  conteudo: { paddingHorizontal: 24, paddingTop: 28, gap: 18 },
  titulo: { fontFamily: fontes.titulo, fontSize: 28, color: cores.tinta, letterSpacing: -0.6 },
  subtitulo: { fontFamily: fontes.texto, fontSize: 14, color: cores.suave },
  erro: { fontFamily: fontes.textoSemi, fontSize: 13, color: cores.perigo },
  divisor: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  linha: { flex: 1, height: 1, backgroundColor: cores.linhaForte },
  divisorTexto: { fontFamily: fontes.textoSemi, fontSize: 11, color: cores.suave, letterSpacing: 0.4 },
  demo: { flexDirection: 'row', gap: 12 },
  cartaoDemo: {
    flex: 1,
    height: 74,
    borderRadius: raio.lg,
    borderWidth: 1.5,
    borderColor: cores.linha,
    backgroundColor: cores.branco,
    paddingHorizontal: 14,
    justifyContent: 'center',
    gap: 2,
  },
  cartaoTitulo: { fontFamily: fontes.textoBold, fontSize: 14, color: cores.tinta },
  cartaoSub: { fontFamily: fontes.texto, fontSize: 12, color: cores.suave },
  cadastro: { alignItems: 'center', gap: 8, marginTop: 4 },
  cadastroTexto: { fontFamily: fontes.texto, fontSize: 14, color: cores.suave },
  link: { fontFamily: fontes.textoBold, fontSize: 14, color: cores.tinta, textDecorationLine: 'underline', padding: 6 },
});
