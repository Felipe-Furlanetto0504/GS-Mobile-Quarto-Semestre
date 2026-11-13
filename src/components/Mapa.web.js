import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { cores, fontes, raio } from '../theme';

export function Mapa({ centro, altura = 200, style }) {
  return (
    <View style={[estilos.caixa, { height: altura }, style]}>
      <Feather name="map" size={24} color={cores.suave} />
      <Text style={estilos.texto}>
        {centro ? `${Number(centro.latitude).toFixed(5)}, ${Number(centro.longitude).toFixed(5)}` : 'Sem localização'}
      </Text>
      <Text style={estilos.pequeno}>O mapa aparece no celular (Expo Go).</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  caixa: { borderRadius: raio.xl, backgroundColor: '#E3E5DD', alignItems: 'center', justifyContent: 'center', gap: 6 },
  texto: { fontFamily: fontes.textoSemi, fontSize: 13, color: cores.tinta },
  pequeno: { fontFamily: fontes.texto, fontSize: 12, color: cores.suave },
});
