import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import Constants from 'expo-constants';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../src/features/auth/AuthContext';
import { useMinhasComunidades } from '../../src/features/comunidades/useComunidades';
import { Botao } from '../../src/components/Botao';
import { API_URL } from '../../src/config';
import { cores, fontes, raio } from '../../src/theme';

function Linha({ icone, rotulo, valor }) {
  if (!valor) return null;
  return (
    <View style={estilos.linha}>
      <Feather name={icone} size={18} color={cores.suave} />
      <View style={{ flex: 1 }}>
        <Text style={estilos.linhaRotulo}>{rotulo}</Text>
        <Text style={estilos.linhaValor}>{valor}</Text>
      </View>
    </View>
  );
}

export default function Perfil() {
  const { usuario, ehGestor, sair } = useAuth();
  const minhas = useMinhasComunidades();
  const iniciais = (usuario?.nome ?? '?')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');

  const confirmarSaida = () =>
    Alert.alert('Sair da conta?', 'Você vai precisar entrar de novo com e-mail e senha.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: sair },
    ]);

  return (
    <SafeAreaView style={estilos.tela} edges={['top']}>
      <ScrollView contentContainerStyle={estilos.conteudo}>
        <View style={estilos.cartao}>
          <Animated.View entering={ZoomIn.springify().damping(12)} style={estilos.avatar}>
            <Text style={estilos.avatarTexto}>{iniciais}</Text>
          </Animated.View>
          <Text style={estilos.nome}>{usuario?.nome}</Text>
          <View style={estilos.perfil}>
            <Text style={estilos.perfilTexto}>{ehGestor ? 'Gestor' : 'Morador'}</Text>
          </View>
        </View>

        <Animated.View entering={FadeInDown.delay(100)} style={estilos.bloco}>
          <Linha icone="mail" rotulo="E-mail" valor={usuario?.email} />
          <Linha icone="briefcase" rotulo="Organização" valor={usuario?.organizacao} />
          <Linha icone="home" rotulo="Endereço" valor={usuario?.endereco} />
          <Linha
            icone="users"
            rotulo={
              ehGestor ? 'Comunidades que você gerencia' : 'Comunidades em que você participa'
            }
            valor={minhas.data ? String(minhas.data.length) : '…'}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(180)} style={estilos.bloco}>
          <Linha icone="server" rotulo="API" valor={API_URL} />
          <Linha icone="smartphone" rotulo="Versão do app" valor={Constants.expoConfig?.version} />
        </Animated.View>

        <Botao titulo="Sair da conta" variante="perigo" icone="log-out" onPress={confirmarSaida} />
        <Text style={estilos.rodape}>RootFix · Global Solution 2026/2 · FIAP</Text>
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
    gap: 10,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: cores.amarelo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTexto: { fontFamily: fontes.titulo, fontSize: 28, color: cores.asfalto },
  nome: { fontFamily: fontes.titulo, fontSize: 22, color: cores.papel, textAlign: 'center' },
  perfil: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: cores.asfalto3,
  },
  perfilTexto: {
    fontFamily: fontes.textoBold,
    fontSize: 12,
    color: cores.amarelo,
    letterSpacing: 0.6,
  },
  bloco: {
    backgroundColor: cores.branco,
    borderRadius: raio.xl,
    borderWidth: 1.5,
    borderColor: cores.linha,
    padding: 6,
  },
  linha: { flexDirection: 'row', gap: 12, padding: 12, alignItems: 'center' },
  linhaRotulo: { fontFamily: fontes.texto, fontSize: 12, color: cores.suave },
  linhaValor: { fontFamily: fontes.textoSemi, fontSize: 14, color: cores.tinta },
  rodape: { fontFamily: fontes.texto, fontSize: 12, color: cores.suave, textAlign: 'center' },
});
