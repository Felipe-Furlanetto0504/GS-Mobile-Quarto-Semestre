import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import * as Linking from 'expo-linking';
import { Botao } from '../../../components/Botao';
import { Pressionavel } from '../../../components/Pressionavel';
import { cores, fontes, raio } from '../../../theme';

// "2026-11-10" → "10/11/2026"
function dataBR(iso) {
  const [ano, mes, dia] = String(iso ?? '').split('-');
  return dia ? `${dia}/${mes}/${ano}` : iso;
}

function Linha({ icone, rotulo, valor }) {
  if (!valor) return null;
  return (
    <View style={estilos.linha}>
      <Feather name={icone} size={16} color={cores.suave} style={{ marginTop: 2 }} />
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={estilos.linhaRotulo}>{rotulo}</Text>
        <Text style={estilos.linhaValor}>{valor}</Text>
      </View>
    </View>
  );
}

function Aviso({ texto }) {
  return (
    <View style={estilos.aviso}>
      <Feather name="alert-circle" size={16} color={cores.tinta} style={{ marginTop: 1 }} />
      <Text style={estilos.avisoTexto}>{texto}</Text>
    </View>
  );
}

function Fonte({ fonte }) {
  const abrir = () =>
    Linking.openURL(fonte.url).catch(() => Alert.alert('Não deu para abrir o link', fonte.url));
  return (
    <Pressionavel
      onPress={abrir}
      accessibilityRole="link"
      accessibilityLabel={`Abrir a página oficial do serviço ${fonte.servico}`}
      style={estilos.fonte}
    >
      <Feather name="external-link" size={16} color={cores.azul} />
      <View style={{ flex: 1 }}>
        <Text style={estilos.fonteTitulo}>{fonte.servico} · página oficial</Text>
        <Text style={estilos.fonteData}>Consultada em {dataBR(fonte.dataColeta)}</Text>
      </View>
    </Pressionavel>
  );
}

function TextoSolicitacao({ texto }) {
  const [copiado, setCopiado] = useState(false);
  const copiar = async () => {
    try {
      await Clipboard.setStringAsync(texto);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      Alert.alert('Não deu para copiar', 'Selecione o texto e copie manualmente.');
    }
  };
  return (
    <View style={estilos.solicitacao}>
      <Text style={estilos.secao}>Texto da solicitação</Text>
      <Text style={estilos.solicitacaoTexto} selectable>
        {texto}
      </Text>
      <Botao
        titulo={copiado ? 'Copiado' : 'Copiar texto'}
        icone={copiado ? 'check' : 'copy'}
        variante={copiado ? 'contorno' : 'destaque'}
        pequeno
        onPress={copiar}
      />
      <Text style={estilos.dica}>Cole no app ou no portal SP156 ao abrir a solicitação.</Text>
    </View>
  );
}

export function ResultadoEncaminhamento({ resultado, aoGerarDeNovo, aoVoltar }) {
  if (!resultado.encontrado) {
    return (
      <Animated.View entering={FadeInDown.duration(300)} style={estilos.bloco}>
        <View style={estilos.vazio}>
          <View style={estilos.iconeVazio}>
            <Feather name="search" size={24} color={cores.tinta} />
          </View>
          <Text style={estilos.vazioTitulo}>Nenhum serviço encontrado</Text>
          {resultado.motivoEscolha ? (
            <Text style={estilos.vazioTexto}>{resultado.motivoEscolha}</Text>
          ) : null}
        </View>
        <Aviso texto={resultado.aviso} />
        <Botao titulo="Voltar ao problema" variante="contorno" onPress={aoVoltar} />
      </Animated.View>
    );
  }

  const documentos = (resultado.documentosNecessarios ?? '')
    .split(';')
    .map((d) => d.trim())
    .filter(Boolean);

  return (
    <View style={estilos.bloco}>
      <Animated.View entering={FadeInDown.duration(300)} style={estilos.servico}>
        <Text style={estilos.servicoRotulo}>Serviço indicado</Text>
        <Text style={estilos.servicoNome}>{resultado.servico}</Text>
        {resultado.categoria ? (
          <Text style={estilos.servicoCategoria}>{resultado.categoria}</Text>
        ) : null}
        <View style={{ gap: 12, marginTop: 4 }}>
          <Linha icone="briefcase" rotulo="Órgão responsável" valor={resultado.orgao} />
          <Linha icone="smartphone" rotulo="Onde pedir" valor={resultado.canal} />
          <Linha icone="clock" rotulo="Prazo de referência" valor={resultado.prazoReferencia} />
        </View>
      </Animated.View>

      {resultado.textoGerado && resultado.textoSolicitacao ? (
        <Animated.View entering={FadeInDown.delay(80).duration(300)}>
          <TextoSolicitacao texto={resultado.textoSolicitacao} />
        </Animated.View>
      ) : (
        <Animated.View entering={FadeInDown.delay(80).duration(300)} style={{ gap: 10 }}>
          <Text style={estilos.semTexto}>
            O texto da solicitação não pôde ser gerado agora. O serviço e a fonte acima já estão
            certos.
          </Text>
          <Botao
            titulo="Gerar o texto de novo"
            icone="refresh-cw"
            variante="contorno"
            pequeno
            onPress={aoGerarDeNovo}
          />
        </Animated.View>
      )}

      {documentos.length ? (
        <Animated.View entering={FadeInDown.delay(120).duration(300)} style={{ gap: 8 }}>
          <Text style={estilos.secao}>O que informar ao pedir</Text>
          {documentos.map((d) => (
            <View key={d} style={estilos.item}>
              <Feather name="check" size={14} color={cores.sucesso} style={{ marginTop: 3 }} />
              <Text style={estilos.itemTexto}>{d}</Text>
            </View>
          ))}
        </Animated.View>
      ) : null}

      {resultado.resumoObservacoes ? (
        <Animated.View entering={FadeInDown.delay(160).duration(300)} style={{ gap: 8 }}>
          <Text style={estilos.secao}>O que os vizinhos relataram</Text>
          <Text style={estilos.corpo}>{resultado.resumoObservacoes}</Text>
        </Animated.View>
      ) : null}

      <Animated.View entering={FadeInDown.delay(200).duration(300)} style={{ gap: 8 }}>
        <Text style={estilos.secao}>Fonte</Text>
        {resultado.fontes.map((f) => (
          <Fonte key={f.url} fonte={f} />
        ))}
        {resultado.motivoEscolha ? (
          <Text style={estilos.motivo}>Por que esse serviço: {resultado.motivoEscolha}</Text>
        ) : null}
      </Animated.View>

      <Aviso texto={resultado.aviso} />
    </View>
  );
}

const estilos = StyleSheet.create({
  bloco: { gap: 22 },
  servico: { backgroundColor: cores.asfalto, borderRadius: raio.xl, padding: 18, gap: 6 },
  servicoRotulo: {
    fontFamily: fontes.textoBold,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: cores.amarelo,
  },
  servicoNome: { fontFamily: fontes.titulo, fontSize: 24, lineHeight: 28, color: cores.papel },
  servicoCategoria: { fontFamily: fontes.textoMedio, fontSize: 13, color: cores.textoClaroSuave },
  linha: { flexDirection: 'row', gap: 10 },
  linhaRotulo: { fontFamily: fontes.textoMedio, fontSize: 12, color: cores.textoClaroSuave },
  linhaValor: { fontFamily: fontes.textoSemi, fontSize: 14, lineHeight: 20, color: cores.papel },
  secao: { fontFamily: fontes.textoBold, fontSize: 14, color: cores.tinta },
  solicitacao: {
    backgroundColor: cores.branco,
    borderRadius: raio.xl,
    borderWidth: 1,
    borderColor: cores.linha,
    padding: 16,
    gap: 12,
  },
  solicitacaoTexto: { fontFamily: fontes.texto, fontSize: 15, lineHeight: 23, color: cores.tinta },
  dica: { fontFamily: fontes.texto, fontSize: 12, color: cores.suave, textAlign: 'center' },
  semTexto: { fontFamily: fontes.texto, fontSize: 14, lineHeight: 20, color: cores.tintaMedia },
  item: { flexDirection: 'row', gap: 8 },
  itemTexto: {
    flex: 1,
    fontFamily: fontes.texto,
    fontSize: 14,
    lineHeight: 20,
    color: cores.tintaMedia,
  },
  corpo: { fontFamily: fontes.texto, fontSize: 14, lineHeight: 21, color: cores.tintaMedia },
  fonte: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: cores.branco,
    borderRadius: raio.md,
    borderWidth: 1,
    borderColor: cores.linha,
    padding: 12,
  },
  fonteTitulo: { fontFamily: fontes.textoSemi, fontSize: 14, color: cores.azul },
  fonteData: { fontFamily: fontes.texto, fontSize: 12, color: cores.suave },
  motivo: { fontFamily: fontes.texto, fontSize: 12, lineHeight: 18, color: cores.suave },
  aviso: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: cores.amareloClaro,
    borderRadius: raio.md,
    padding: 12,
  },
  avisoTexto: {
    flex: 1,
    fontFamily: fontes.texto,
    fontSize: 13,
    lineHeight: 19,
    color: cores.tinta,
  },
  vazio: { alignItems: 'center', gap: 8, paddingTop: 24 },
  iconeVazio: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: cores.papel2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  vazioTitulo: { fontFamily: fontes.textoBold, fontSize: 17, color: cores.tinta },
  vazioTexto: {
    fontFamily: fontes.texto,
    fontSize: 14,
    lineHeight: 20,
    color: cores.suave,
    textAlign: 'center',
  },
});
