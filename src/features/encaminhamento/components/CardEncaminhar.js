import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Botao } from '../../../components/Botao';
import { useEncaminhamentoGuardado } from '../useEncaminhamento';
import { cores, fontes, raio } from '../../../theme';

// Aparece na tela do problema só para o gestor, depois que ele adota o problema.
export function CardEncaminhar({ problemaId }) {
  const guardado = useEncaminhamentoGuardado(problemaId);
  const abrir = () =>
    router.push({ pathname: '/problema/encaminhamento', params: { id: problemaId } });

  return (
    <View style={estilos.card}>
      <View style={estilos.topo}>
        <Feather name="send" size={15} color={cores.azul} />
        <Text style={estilos.rotulo}>Encaminhar à prefeitura</Text>
      </View>
      <Text style={estilos.texto}>
        {guardado?.encontrado
          ? `Serviço indicado: ${guardado.servico}. O texto da solicitação está pronto para revisar.`
          : 'A IA procura o serviço certo do SP156 nas fichas oficiais da prefeitura e escreve a solicitação para você revisar e enviar.'}
      </Text>
      <Botao
        titulo={guardado ? 'Ver encaminhamento' : 'Encaminhar com IA'}
        icone="arrow-right"
        variante="primario"
        pequeno
        onPress={abrir}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  card: {
    backgroundColor: cores.branco,
    borderRadius: raio.xl,
    borderWidth: 1,
    borderColor: cores.linha,
    padding: 16,
    gap: 12,
  },
  topo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rotulo: {
    fontFamily: fontes.textoBold,
    fontSize: 12,
    letterSpacing: 1.2,
    color: cores.azul,
    textTransform: 'uppercase',
  },
  texto: { fontFamily: fontes.texto, fontSize: 14, lineHeight: 20, color: cores.tintaMedia },
});
