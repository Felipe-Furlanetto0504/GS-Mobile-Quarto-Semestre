import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, { ZoomIn } from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';
import { TelaFormulario } from '../../src/components/TelaFormulario';
import { Campo } from '../../src/components/Campo';
import { Botao } from '../../src/components/Botao';
import { Pressionavel } from '../../src/components/Pressionavel';
import { FotoProblema } from '../../src/features/problemas/components/FotoProblema';
import { usePublicarProblema } from '../../src/features/problemas/useProblemas';
import { useComunidade } from '../../src/features/comunidades/useComunidades';
import { errosPorCampo, mensagemDeErro } from '../../src/services/api';
import { cores, fontes, raio } from '../../src/theme';

const OPCOES_FOTO = { mediaTypes: ['images'], quality: 0.5, allowsEditing: true, aspect: [4, 3] };
const LIMITE_BYTES = 5 * 1024 * 1024;

export default function PublicarProblema() {
  const { comunidadeId } = useLocalSearchParams();
  const comunidade = useComunidade(comunidadeId);
  const publicar = usePublicarProblema();

  const [foto, setFoto] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [erros, setErros] = useState({});

  async function escolherFoto(origem) {
    if (origem === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted')
        return Alert.alert('Câmera bloqueada', 'Permita o uso da câmera nas configurações.');
    }
    const resultado =
      origem === 'camera'
        ? await ImagePicker.launchCameraAsync(OPCOES_FOTO)
        : await ImagePicker.launchImageLibraryAsync(OPCOES_FOTO);
    if (resultado.canceled) return;
    const escolhida = resultado.assets[0];
    if (escolhida.fileSize && escolhida.fileSize > LIMITE_BYTES) {
      return Alert.alert('Foto muito grande', 'A foto pode ter no máximo 5 MB.');
    }
    Haptics.selectionAsync().catch(() => {});
    setFoto(escolhida);
  }

  function validar() {
    const e = {};
    if (!titulo.trim()) e.titulo = 'Informe o título.';
    if (!descricao.trim()) e.descricao = 'Descreva o problema.';
    const c = comunidade.data;
    if (c?.latitude == null || c?.longitude == null)
      e.titulo = e.titulo || 'Aguarde a comunidade carregar e tente de novo.';
    setErros(e);
    return Object.keys(e).length === 0;
  }

  function enviar() {
    if (!validar()) return;
    publicar.mutate(
      {
        comunidadeId,
        dados: {
          titulo: titulo.trim(),
          descricao: descricao.trim(),
          // Sem GPS: o problema é registrado no ponto central da comunidade.
          latitude: Number(comunidade.data.latitude),
          longitude: Number(comunidade.data.longitude),
          foto,
        },
      },
      {
        onSuccess: (criado) => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
          router.replace(`/problema/${criado.id}`);
        },
        onError: (e) => {
          setErros(errosPorCampo(e));
          Alert.alert('Não foi possível publicar', mensagemDeErro(e));
        },
      }
    );
  }

  const passo = !foto ? 1 : !titulo.trim() || !descricao.trim() ? 2 : 3;

  return (
    <TelaFormulario
      titulo="Novo problema"
      subtitulo={comunidade.data ? `em ${comunidade.data.nome}` : undefined}
      iconeVoltar="x"
      rodape={
        <>
          <View style={estilos.aviso}>
            <Feather name="info" size={15} color="#7A5A00" />
            <Text style={estilos.avisoTexto}>
              A IA define a categoria e a gravidade depois do envio.
            </Text>
          </View>
          <Botao
            titulo="Publicar na comunidade"
            icone="send"
            onPress={enviar}
            carregando={publicar.isPending}
          />
        </>
      }
    >
      <View style={estilos.progresso} accessible accessibilityLabel={`Passo ${passo} de 3`}>
        {[1, 2, 3].map((n) => (
          <View key={n} style={[estilos.barra, n <= passo && { backgroundColor: cores.asfalto }]} />
        ))}
      </View>

      {foto ? (
        <Animated.View entering={ZoomIn.springify().damping(14)} style={{ gap: 10 }}>
          <FotoProblema uriLocal={foto.uri} altura={210} arredondado={raio.xl} />
          <View style={estilos.linhaBotoes}>
            <Botao
              titulo="Tirar outra"
              icone="camera"
              variante="contorno"
              pequeno
              onPress={() => escolherFoto('camera')}
              style={{ flex: 1 }}
            />
            <Botao
              titulo="Remover"
              icone="trash-2"
              variante="perigo"
              pequeno
              onPress={() => setFoto(null)}
            />
          </View>
        </Animated.View>
      ) : (
        <View style={estilos.linhaFoto}>
          <Pressionavel
            onPress={() => escolherFoto('camera')}
            style={estilos.caixaFoto}
            accessibilityLabel="Tirar foto"
          >
            <Feather name="camera" size={26} color={cores.tinta} />
            <Text style={estilos.caixaFotoTexto}>Tirar foto</Text>
          </Pressionavel>
          <Pressionavel
            onPress={() => escolherFoto('galeria')}
            style={estilos.caixaFoto}
            accessibilityLabel="Escolher da galeria"
          >
            <Feather name="image" size={26} color={cores.tinta} />
            <Text style={estilos.caixaFotoTexto}>Da galeria</Text>
          </Pressionavel>
        </View>
      )}

      <Campo
        rotulo="Título"
        valor={titulo}
        aoMudar={setTitulo}
        maximo={120}
        erro={erros.titulo}
        placeholder="Ex.: Buraco grande na esquina"
      />
      <Campo
        rotulo="Descrição"
        valor={descricao}
        aoMudar={setDescricao}
        maximo={1000}
        multilinha
        erro={erros.descricao}
        placeholder="O que está acontecendo? Desde quando?"
      />
    </TelaFormulario>
  );
}

const estilos = StyleSheet.create({
  progresso: { flexDirection: 'row', gap: 6 },
  barra: { flex: 1, height: 5, borderRadius: 3, backgroundColor: cores.linhaForte },
  linhaFoto: { flexDirection: 'row', gap: 12 },
  caixaFoto: {
    flex: 1,
    height: 140,
    borderRadius: raio.xl,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#B9BBB1',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  caixaFotoTexto: { fontFamily: fontes.textoSemi, fontSize: 13, color: cores.tintaMedia },
  linhaBotoes: { flexDirection: 'row', gap: 10 },
  aviso: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: cores.amareloClaro,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  avisoTexto: { fontFamily: fontes.textoMedio, fontSize: 12, color: cores.tintaMedia, flex: 1 },
});