import { useState } from 'react';
import * as Location from 'expo-location';

function montarEndereco(lugar) {
  if (!lugar) return '';
  const rua = [lugar.street, lugar.streetNumber].filter(Boolean).join(', ');
  return [rua || lugar.name, lugar.district, lugar.city || lugar.subregion].filter(Boolean).join(' - ');
}


export function useLocalizacao() {
  const [buscando, setBuscando] = useState(false);
  const [erro, setErro] = useState(null);

  async function pedirPermissao() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') throw new Error('Permita o acesso à localização para continuar.');
  }

  async function executar(tarefa) {
    setBuscando(true);
    setErro(null);
    try {
      return await tarefa();
    } catch (e) {
      setErro(e.message || 'Não foi possível obter a localização.');
      return null;
    } finally {
      setBuscando(false);
    }
  }


  const obterAtual = () =>
    executar(async () => {
      await pedirPermissao();
      const posicao = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const { latitude, longitude } = posicao.coords;
      let endereco = '';
      try {
        const [lugar] = await Location.reverseGeocodeAsync({ latitude, longitude });
        endereco = montarEndereco(lugar);
      } catch {
       
      }
      return { latitude, longitude, endereco };
    });

  const buscarEndereco = (texto) =>
    executar(async () => {
      await pedirPermissao();
      const [resultado] = await Location.geocodeAsync(texto);
      if (!resultado) throw new Error('Endereço não encontrado. Tente incluir número e cidade.');
      return { latitude: resultado.latitude, longitude: resultado.longitude, endereco: texto };
    });

  return { obterAtual, buscarEndereco, buscando, erro };
}
