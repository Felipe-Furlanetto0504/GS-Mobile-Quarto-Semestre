import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { Campo } from './Campo';
import { Botao } from './Botao';
import { Mapa } from './Mapa';
import { useLocalizacao } from '../hooks/useLocalizacao';
import { cores, fontes, raio } from '../theme';

export function SeletorDeLocal({ rotulo = 'Endereço', local, aoMudar, erro, ajuda }) {
  const { obterAtual, buscarEndereco, buscando, erro: erroGps } = useLocalizacao();
  const temCoordenadas = local.latitude != null && local.longitude != null;

  const usarGps = async () => {
    const r = await obterAtual();
    if (r) aoMudar({ endereco: r.endereco || local.endereco, latitude: r.latitude, longitude: r.longitude });
  };

  const buscar = async () => {
    if (!local.endereco?.trim()) return;
    const r = await buscarEndereco(local.endereco.trim());
    if (r) aoMudar({ ...local, latitude: r.latitude, longitude: r.longitude });
  };

  return (
    <View style={estilos.grupo}>
      <Campo
        rotulo={rotulo}
        valor={local.endereco}
        aoMudar={(endereco) => aoMudar({ endereco, latitude: null, longitude: null })}
        placeholder="Rua, número, bairro, cidade"
        maximo={255}
        erro={erro}
        returnKeyType="search"
        onSubmitEditing={buscar}
      />
      {ajuda ? <Text style={estilos.ajuda}>{ajuda}</Text> : null}
      <View style={estilos.botoes}>
        <Botao titulo="Usar meu GPS" icone="crosshair" variante="contorno" pequeno onPress={usarGps} carregando={buscando} style={{ flex: 1 }} />
        <Botao titulo="Buscar endereço" icone="search" variante="contorno" pequeno onPress={buscar} desabilitado={buscando} style={{ flex: 1 }} />
      </View>
      {erroGps ? <Text style={estilos.erro}>{erroGps}</Text> : null}
      {temCoordenadas ? (
        <Animated.View entering={FadeInDown} style={{ gap: 8 }}>
          <View style={estilos.ok}>
            <Feather name="check-circle" size={16} color={cores.sucesso} />
            <Text style={estilos.okTexto}>
              Localização definida ({Number(local.latitude).toFixed(4)}, {Number(local.longitude).toFixed(4)})
            </Text>
          </View>
          <Animated.View entering={FadeIn.delay(100)}>
            <Mapa
              key={`${local.latitude},${local.longitude}`}
              centro={{ latitude: Number(local.latitude), longitude: Number(local.longitude) }}
              marcadores={[{ id: 'eu', latitude: local.latitude, longitude: local.longitude, destaque: true }]}
              altura={150}
              aoMoverPino={(c) => aoMudar({ ...local, latitude: c.latitude, longitude: c.longitude })}
            />
          </Animated.View>
        </Animated.View>
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  grupo: { gap: 10 },
  botoes: { flexDirection: 'row', gap: 10 },
  ajuda: { fontFamily: fontes.texto, fontSize: 12, color: cores.suave },
  erro: { fontFamily: fontes.textoMedio, fontSize: 12, color: cores.perigo },
  ok: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#DDF2EA',
    borderRadius: raio.sm,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  okTexto: { fontFamily: fontes.textoSemi, fontSize: 12, color: cores.sucesso, flex: 1 },
});
