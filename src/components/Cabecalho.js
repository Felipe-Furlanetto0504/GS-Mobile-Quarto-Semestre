import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Pressionavel } from './Pressionavel';
import { cores, fontes } from '../theme';

// Barra do topo para telas empilhadas (voltar + título + ação opcional à direita).
export function Cabecalho({ titulo, subtitulo, icone = 'chevron-left', aoVoltar, direita, escuro }) {
  const corIcone = escuro ? cores.papel : cores.tinta;
  return (
    <View style={estilos.barra}>
      <Pressionavel
        onPress={aoVoltar ?? (() => (router.canGoBack() ? router.back() : router.replace('/')))}
        accessibilityLabel="Voltar"
        style={[estilos.botao, escuro ? estilos.botaoEscuro : estilos.botaoClaro]}
      >
        <Feather name={icone} size={20} color={corIcone} />
      </Pressionavel>
      <View style={estilos.centro}>
        {titulo ? <Text style={[estilos.titulo, escuro && { color: cores.papel }]}>{titulo}</Text> : null}
        {subtitulo ? <Text style={[estilos.subtitulo, escuro && { color: cores.textoClaroSuave }]}>{subtitulo}</Text> : null}
      </View>
      <View style={estilos.lado}>{direita}</View>
    </View>
  );
}

const estilos = StyleSheet.create({
  barra: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 8 },
  botao: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  botaoClaro: { backgroundColor: cores.branco, borderWidth: 1.5, borderColor: cores.linha },
  botaoEscuro: { backgroundColor: 'rgba(20,23,31,0.7)' },
  centro: { flex: 1, alignItems: 'center' },
  lado: { width: 44, alignItems: 'flex-end' },
  titulo: { fontFamily: fontes.textoBold, fontSize: 16, color: cores.tinta },
  subtitulo: { fontFamily: fontes.texto, fontSize: 12, color: cores.suave },
});
