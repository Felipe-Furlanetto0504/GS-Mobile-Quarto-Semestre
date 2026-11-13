import { Alert, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { Pressionavel } from '../../../components/Pressionavel';
import { useExcluirComunicado } from '../useComunicados';
import { mensagemDeErro } from '../../../services/api';
import { tempoRelativo } from '../../../utils/formatos';
import { cores, fontes, raio } from '../../../theme';

export function ComunicadoCard({ comunicado, indice = 0, podeGerenciar }) {
  const excluir = useExcluirComunicado();
  const destaque = comunicado.destacado;

  const confirmarExclusao = () =>
    Alert.alert('Excluir comunicado?', 'Os moradores deixam de ver este aviso.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () =>
          excluir.mutate(comunicado.id, { onError: (e) => Alert.alert('Não deu certo', mensagemDeErro(e)) }),
      },
    ]);

  return (
    <Animated.View
      entering={FadeInDown.delay(Math.min(indice, 6) * 50)}
      layout={LinearTransition}
      style={[estilos.card, destaque ? estilos.destaque : estilos.normal]}
    >
      <View style={[estilos.icone, { backgroundColor: destaque ? cores.amarelo : cores.papel2 }]}>
        <Feather name="volume-2" size={18} color={cores.asfalto} />
      </View>
      <View style={estilos.corpo}>
        <Text style={[estilos.rotulo, { color: destaque ? cores.amarelo : cores.suave }]}>
          {destaque ? 'Em destaque' : 'Comunicado'} · {tempoRelativo(comunicado.criadoEm)}
        </Text>
        <Text style={[estilos.titulo, destaque && { color: cores.papel }]}>{comunicado.titulo}</Text>
        <Text style={[estilos.texto, destaque && { color: cores.textoClaroSuave }]}>{comunicado.texto}</Text>
        {podeGerenciar ? (
          <View style={estilos.acoes}>
            <Pressionavel
              onPress={() => router.push({ pathname: '/comunicado/editar', params: { id: comunicado.id, comunidadeId: comunicado.comunidadeId } })}
              style={estilos.acao}
              accessibilityLabel="Editar comunicado"
            >
              <Feather name="edit-2" size={14} color={destaque ? cores.papel : cores.tinta} />
              <Text style={[estilos.acaoTexto, destaque && { color: cores.papel }]}>Editar</Text>
            </Pressionavel>
            <Pressionavel onPress={confirmarExclusao} style={estilos.acao} accessibilityLabel="Excluir comunicado">
              <Feather name="trash-2" size={14} color={destaque ? '#FF8A80' : cores.perigo} />
              <Text style={[estilos.acaoTexto, { color: destaque ? '#FF8A80' : cores.perigo }]}>Excluir</Text>
            </Pressionavel>
          </View>
        ) : null}
      </View>
    </Animated.View>
  );
}

const estilos = StyleSheet.create({
  card: { borderRadius: raio.lg, padding: 14, flexDirection: 'row', gap: 12, marginBottom: 12 },
  destaque: { backgroundColor: cores.asfalto },
  normal: { backgroundColor: cores.branco, borderWidth: 1.5, borderColor: cores.linha },
  icone: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  corpo: { flex: 1, gap: 3 },
  rotulo: { fontFamily: fontes.textoBold, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase' },
  titulo: { fontFamily: fontes.textoBold, fontSize: 15, color: cores.tinta },
  texto: { fontFamily: fontes.texto, fontSize: 14, lineHeight: 20, color: cores.tintaMedia },
  acoes: { flexDirection: 'row', gap: 16, marginTop: 6 },
  acao: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 32 },
  acaoTexto: { fontFamily: fontes.textoSemi, fontSize: 13, color: cores.tinta },
});
