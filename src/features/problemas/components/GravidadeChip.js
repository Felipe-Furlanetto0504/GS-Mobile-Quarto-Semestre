import { StyleSheet, Text } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { cores, fontes, gravidades } from '../../../theme';

export function GravidadeChip({ gravidade, prefixo = 'IA · ', escuro, style }) {
  const g = gravidades[gravidade];
  if (!g) {
    return (
      <Animated.View
        style={[
          estilos.chip,
          { backgroundColor: escuro ? cores.asfalto3 : 'rgba(20,23,31,0.75)' },
          style,
        ]}
      >
        <Text style={[estilos.texto, { color: cores.papel }]}>IA analisando…</Text>
      </Animated.View>
    );
  }
  return (
    <Animated.View
      entering={ZoomIn.springify().damping(12)}
      style={[estilos.chip, { backgroundColor: g.fundo }, style]}
    >
      <Text style={[estilos.texto, { color: g.texto }]}>
        {prefixo}
        {g.rotulo.toUpperCase()}
      </Text>
    </Animated.View>
  );
}

const estilos = StyleSheet.create({
  chip: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  texto: { fontFamily: fontes.textoBold, fontSize: 11, letterSpacing: 0.4 },
});
