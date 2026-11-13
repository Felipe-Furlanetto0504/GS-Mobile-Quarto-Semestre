import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { situacaoDoProblema } from '../../../utils/formatos';
import { cores, fontes } from '../../../theme';

const ETAPAS = ['Publicado', 'Adotado', 'Em andamento', 'Resolvido'];

// Andamento do problema. "Adotado" vem da API Java; os outros status vêm do painel .NET.
export function LinhaDoTempo({ problema }) {
  const { etapa } = situacaoDoProblema(problema);
  const atual = problema.adotado ? etapa : 0;

  return (
    <View style={estilos.caixa} accessible accessibilityLabel={`Andamento: ${ETAPAS[atual]}`}>
      <View style={estilos.linha}>
        {ETAPAS.flatMap((nome, i) => {
          const bolinha = (
            <View key={nome} style={[estilos.bolinha, i < atual && estilos.feita, i === atual && estilos.atual]}>
              {i < atual || (i === atual && i === ETAPAS.length - 1) ? (
                <Feather name="check" size={13} color={cores.amarelo} />
              ) : null}
            </View>
          );
          if (i === ETAPAS.length - 1) return [bolinha];
          return [bolinha, <View key={`${nome}-traco`} style={[estilos.traco, i < atual && { backgroundColor: cores.asfalto }]} />];
        })}
      </View>
      <View style={estilos.rotulos}>
        {ETAPAS.map((nome, i) => (
          <Text key={nome} style={[estilos.rotulo, i === atual && estilos.rotuloAtual]}>
            {nome}
          </Text>
        ))}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  caixa: { gap: 8 },
  linha: { flexDirection: 'row', alignItems: 'center' },
  bolinha: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: cores.linhaForte,
    backgroundColor: cores.branco,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feita: { backgroundColor: cores.asfalto, borderColor: cores.asfalto },
  atual: { backgroundColor: cores.amarelo, borderColor: cores.asfalto, borderWidth: 3 },
  traco: { flex: 1, height: 3, backgroundColor: cores.linhaForte },
  rotulos: { flexDirection: 'row', justifyContent: 'space-between' },
  rotulo: { fontFamily: fontes.textoSemi, fontSize: 11, color: cores.suave },
  rotuloAtual: { color: cores.tinta, fontFamily: fontes.textoBold },
});
