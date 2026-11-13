import { Alert, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { router, useIsFocused } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, LinearTransition, SlideOutRight } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import {
  useAdotarProblema,
  useReclassificar,
  useTriagem,
} from '../../src/features/problemas/useProblemas';
import { FotoProblema } from '../../src/features/problemas/components/FotoProblema';
import { GravidadeChip } from '../../src/features/problemas/components/GravidadeChip';
import { Pressionavel } from '../../src/components/Pressionavel';
import { Botao } from '../../src/components/Botao';
import { NumeroAnimado } from '../../src/components/NumeroAnimado';
import { EstadoVazio, Esqueleto, MensagemErro } from '../../src/components/Estados';
import { mensagemDeErro } from '../../src/services/api';
import { plural, tempoRelativo } from '../../src/utils/formatos';
import { cores, fontes, raio } from '../../src/theme';

const CONTADORES = [
  { chave: 'criticos', rotulo: 'Críticos', fundo: '#3A1E1D', cor: '#FF8A80', texto: '#F2B8B3' },
  { chave: 'altos', rotulo: 'Altos', fundo: '#3A2619', cor: '#FFA870', texto: '#F4C6A8' },
  { chave: 'medios', rotulo: 'Médios', fundo: '#362F17', cor: '#FFC93C', texto: '#EBD89A' },
  { chave: 'baixos', rotulo: 'Baixos', fundo: '#17332A', cor: '#7DD3A8', texto: '#B5E3CB' },
];

function ItemTriagem({ problema, indice, primeiro }) {
  const adotar = useAdotarProblema();
  const reclassificar = useReclassificar();

  const aoAdotar = () =>
    adotar.mutate(problema.id, {
      onSuccess: () =>
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {}),
      onError: (e) => Alert.alert('Não foi possível adotar', mensagemDeErro(e)),
    });

  return (
    <Animated.View
      entering={FadeInDown.delay(Math.min(indice, 6) * 60)
        .springify()
        .damping(16)}
      exiting={SlideOutRight.duration(260)}
      layout={LinearTransition.springify().damping(18)}
      style={[estilos.item, primeiro && estilos.itemPrimeiro]}
    >
      <Pressionavel
        onPress={() => router.push(`/problema/${problema.id}`)}
        escala={0.985}
        style={estilos.itemTopo}
      >
        <FotoProblema
          problema={problema}
          altura={68}
          arredondado={14}
          style={{ width: 68 }}
          analisando={!problema.gravidadeIa}
        />
        <View style={{ flex: 1, gap: 4 }}>
          <View style={estilos.linhaChips}>
            <GravidadeChip gravidade={problema.gravidadeIa} prefixo="" escuro={!primeiro} />
            <Text style={[estilos.meta, primeiro && { color: cores.suave }]}>
              {plural(problema.totalApoios, 'apoio', 'apoios')}
            </Text>
          </View>
          <Text style={[estilos.titulo, primeiro && { color: cores.tinta }]} numberOfLines={2}>
            {problema.titulo}
          </Text>
          <Text style={[estilos.meta, primeiro && { color: cores.suave }]}>
            {problema.comunidade?.nome} · {tempoRelativo(problema.criadoEm)}
          </Text>
        </View>
      </Pressionavel>
      <View style={estilos.acoes}>
        <Botao
          titulo="Adotar"
          variante={primeiro ? 'primario' : 'destaque'}
          pequeno
          onPress={aoAdotar}
          carregando={adotar.isPending}
          style={{ flex: 1 }}
        />
        <Botao
          titulo="Reanalisar"
          icone="refresh-cw"
          variante={primeiro ? 'contorno' : 'contornoEscuro'}
          pequeno
          carregando={reclassificar.isPending}
          onPress={() =>
            reclassificar.mutate(problema.id, {
              onSuccess: () =>
                Alert.alert(
                  'Pedido enviado',
                  'A IA vai analisar a foto de novo em alguns segundos.'
                ),
              onError: (e) => Alert.alert('Não deu certo', mensagemDeErro(e)),
            })
          }
        />
      </View>
    </Animated.View>
  );
}

export default function Triagem() {
  const consulta = useTriagem();
  const focada = useIsFocused();
  const dados = consulta.data;
  const fila = (dados?.problemas?.content ?? []).filter((p) => !p.adotado);

  const topo = (
    <View style={estilos.topo}>
      <View>
        <Text style={estilos.sobrelinha}>Gestor · fila da IA</Text>
        <Text style={estilos.tituloTela}>Triagem</Text>
      </View>
      <View style={estilos.contadores}>
        {CONTADORES.map((c) => (
          <View key={c.chave} style={[estilos.contador, { backgroundColor: c.fundo }]}>
            <NumeroAnimado
              valor={dados?.[c.chave] ?? 0}
              style={[estilos.contadorNumero, { color: c.cor }]}
            />
            <Text style={[estilos.contadorRotulo, { color: c.texto }]}>{c.rotulo}</Text>
          </View>
        ))}
      </View>
      <Text style={estilos.ajuda}>
        {dados?.semClassificacao
          ? `${plural(dados.semClassificacao, 'problema', 'problemas')} ainda sem classificação · `
          : ''}
        Ordenado por gravidade e apoios
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={estilos.tela} edges={['top']}>
      {focada ? <StatusBar style="light" /> : null}
      <FlatList
        data={fila}
        keyExtractor={(p) => String(p.id)}
        renderItem={({ item, index }) => (
          <ItemTriagem problema={item} indice={index} primeiro={index === 0} />
        )}
        ListHeaderComponent={topo}
        ListEmptyComponent={
          consulta.isLoading ? (
            <View>
              <Esqueleto altura={150} escuro />
              <Esqueleto altura={150} escuro />
            </View>
          ) : consulta.error ? (
            <MensagemErro
              erro={mensagemDeErro(consulta.error)}
              aoTentarDeNovo={consulta.refetch}
              escuro
            />
          ) : (
            <EstadoVazio
              icone="check-circle"
              titulo="Fila vazia"
              texto="Nenhum problema esperando adoção."
              escuro
            />
          )
        }
        refreshControl={
          <RefreshControl
            refreshing={consulta.isRefetching}
            onRefresh={consulta.refetch}
            tintColor={cores.amarelo}
            colors={[cores.asfalto]}
          />
        }
        contentContainerStyle={estilos.conteudo}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.asfalto },
  conteudo: { padding: 20, paddingBottom: 32 },
  topo: { gap: 14, marginBottom: 16 },
  sobrelinha: {
    fontFamily: fontes.textoBold,
    fontSize: 12,
    letterSpacing: 1.4,
    color: cores.amarelo,
    textTransform: 'uppercase',
  },
  tituloTela: { fontFamily: fontes.titulo, fontSize: 28, letterSpacing: -0.6, color: cores.papel },
  contadores: { flexDirection: 'row', gap: 8 },
  contador: { flex: 1, borderRadius: 16, paddingVertical: 12, paddingHorizontal: 10, gap: 2 },
  contadorNumero: { fontFamily: fontes.titulo, fontSize: 26 },
  contadorRotulo: { fontFamily: fontes.textoBold, fontSize: 11 },
  ajuda: { fontFamily: fontes.texto, fontSize: 12, color: cores.textoClaroSuave },
  item: {
    backgroundColor: cores.asfalto2,
    borderRadius: raio.xl,
    borderWidth: 1,
    borderColor: '#2E3440',
    padding: 14,
    gap: 12,
    marginBottom: 12,
  },
  itemPrimeiro: { backgroundColor: cores.papel, borderColor: cores.papel },
  itemTopo: { flexDirection: 'row', gap: 12 },
  linhaChips: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  titulo: { fontFamily: fontes.textoBold, fontSize: 15, lineHeight: 20, color: cores.papel },
  meta: { fontFamily: fontes.texto, fontSize: 12, color: cores.textoClaroSuave },
  acoes: { flexDirection: 'row', gap: 8 },
});
