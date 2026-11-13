import { StyleSheet, View } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import { cores, raio } from '../theme';


export function Mapa({ centro, marcadores = [], raioKm, altura = 200, aoMoverPino, aoTocarMarcador, style }) {
  if (!centro) return <View style={[estilos.caixa, { height: altura }, style]} />;

  const delta = raioKm ? (raioKm / 111) * 2.6 : 0.008;
  return (
    <View style={[estilos.caixa, { height: altura }, style]}>
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={{ latitude: centro.latitude, longitude: centro.longitude, latitudeDelta: delta, longitudeDelta: delta }}
        showsPointsOfInterest={false}
        toolbarEnabled={false}
        onPress={aoMoverPino ? (e) => aoMoverPino(e.nativeEvent.coordinate) : undefined}
      >
        {raioKm ? (
          <Circle
            center={centro}
            radius={raioKm * 1000}
            strokeColor={cores.asfalto}
            strokeWidth={2}
            fillColor="rgba(255,201,60,0.18)"
          />
        ) : null}
        {marcadores.map((m) => (
          <Marker
            key={m.id}
            coordinate={{ latitude: Number(m.latitude), longitude: Number(m.longitude) }}
            title={m.titulo}
            description={m.descricao}
            pinColor={m.destaque ? cores.amarelo : cores.asfalto}
            draggable={!!aoMoverPino}
            onDragEnd={aoMoverPino ? (e) => aoMoverPino(e.nativeEvent.coordinate) : undefined}
            onCalloutPress={aoTocarMarcador ? () => aoTocarMarcador(m) : undefined}
          />
        ))}
      </MapView>
    </View>
  );
}

const estilos = StyleSheet.create({
  caixa: { borderRadius: raio.xl, overflow: 'hidden', backgroundColor: '#E3E5DD' },
});
