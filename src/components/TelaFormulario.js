import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Cabecalho } from './Cabecalho';
import { cores, fontes } from '../theme';

export function TelaFormulario({ titulo, subtitulo, tituloGrande, descricao, iconeVoltar, rodape, children }) {
  return (
    <SafeAreaView style={estilos.tela} edges={['top', 'bottom']}>
      <Cabecalho titulo={titulo} subtitulo={subtitulo} icone={iconeVoltar} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled">
          {tituloGrande ? (
            <Animated.View entering={FadeInDown.duration(300)} style={{ gap: 6 }}>
              <Text style={estilos.tituloGrande}>{tituloGrande}</Text>
              {descricao ? <Text style={estilos.descricao}>{descricao}</Text> : null}
            </Animated.View>
          ) : null}
          <Animated.View entering={FadeInDown.delay(80).duration(300)} style={estilos.campos}>
            {children}
          </Animated.View>
        </ScrollView>
        {rodape ? <View style={estilos.rodape}>{rodape}</View> : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.papel },
  conteudo: { padding: 20, gap: 20, paddingBottom: 40 },
  campos: { gap: 16 },
  tituloGrande: { fontFamily: fontes.titulo, fontSize: 26, letterSpacing: -0.5, color: cores.tinta },
  descricao: { fontFamily: fontes.texto, fontSize: 14, lineHeight: 20, color: cores.suave },
  rodape: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 12, gap: 10, backgroundColor: cores.papel },
});
