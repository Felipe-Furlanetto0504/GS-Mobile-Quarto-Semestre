import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pressionavel } from './Pressionavel';
import { cores, fontes, molas } from '../theme';

function Aba({ rotulo, icone, ativa, badge, aoTocar, escuro }) {
  const progresso = useSharedValue(ativa ? 1 : 0);
  useEffect(() => {
    progresso.value = withSpring(ativa ? 1 : 0, molas.suave);
  }, [ativa, progresso]);

  const estiloPilula = useAnimatedStyle(() => ({
    opacity: progresso.value,
    transform: [{ scaleX: 0.6 + progresso.value * 0.4 }],
  }));

  const corAtiva = escuro ? cores.amarelo : cores.tinta;
  const corInativa = escuro ? cores.textoClaroSuave : cores.suave;

  return (
    <Pressionavel
      onPress={aoTocar}
      accessibilityRole="tab"
      accessibilityState={{ selected: ativa }}
      accessibilityLabel={badge ? `${rotulo}, ${badge} novas` : rotulo}
      style={estilos.aba}
    >
      <View style={estilos.iconeAba}>
        <Animated.View
          style={[estilos.pilula, { backgroundColor: escuro ? cores.asfalto3 : cores.amareloClaro }, estiloPilula]}
        />
        <Feather name={icone} size={21} color={ativa ? corAtiva : corInativa} />
        {badge ? (
          <View style={estilos.badge}>
            <Text style={estilos.badgeTexto}>{badge > 9 ? '9+' : badge}</Text>
          </View>
        ) : null}
      </View>
      <Text style={[estilos.rotulo, { color: ativa ? corAtiva : corInativa }, ativa && { fontFamily: fontes.textoBold }]}>
        {rotulo}
      </Text>
    </Pressionavel>
  );
}

// Barra de abas própria (usada pelo <Tabs tabBar={...}> do Expo Router).
// acaoCentral = { icone, rotulo, aoTocar } desenha o botão amarelo de "publicar" no meio.
export function BarraDeAbas({ state, descriptors, navigation, acaoCentral, escuro }) {
  const insets = useSafeAreaInsets();
  // Abas com href: null recebem tabBarItemStyle { display: 'none' } do Expo Router.
  const rotas = state.routes.filter((r) => descriptors[r.key].options.tabBarItemStyle?.display !== 'none');
  const metade = Math.ceil(rotas.length / 2);

  const renderAba = (rota) => {
    const { options } = descriptors[rota.key];
    const ativa = state.routes[state.index].key === rota.key;
    return (
      <Aba
        key={rota.key}
        rotulo={options.title ?? rota.name}
        icone={options.icone ?? 'circle'}
        badge={options.tabBarBadge}
        ativa={ativa}
        escuro={escuro}
        aoTocar={() => {
          const evento = navigation.emit({ type: 'tabPress', target: rota.key, canPreventDefault: true });
          if (!ativa && !evento.defaultPrevented) {
            Haptics.selectionAsync().catch(() => {});
            navigation.navigate(rota.name);
          }
        }}
      />
    );
  };

  return (
    <View
      style={[
        estilos.barra,
        { paddingBottom: Math.max(insets.bottom, 10) },
        escuro ? { backgroundColor: '#1A1E27', borderTopColor: cores.asfalto3 } : null,
      ]}
    >
      {acaoCentral ? (
        <>
          {rotas.slice(0, metade).map(renderAba)}
          <Pressionavel
            escala={0.9}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
              acaoCentral.aoTocar();
            }}
            accessibilityLabel={acaoCentral.rotulo}
            style={[estilos.central, { borderColor: escuro ? '#1A1E27' : cores.papel }]}
          >
            <Feather name={acaoCentral.icone} size={26} color={cores.asfalto} />
          </Pressionavel>
          {rotas.slice(metade).map(renderAba)}
        </>
      ) : (
        rotas.map(renderAba)
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  barra: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    backgroundColor: cores.branco,
    borderTopWidth: 1,
    borderTopColor: cores.linha,
    paddingTop: 8,
    paddingHorizontal: 8,
  },
  aba: { flex: 1, alignItems: 'center', gap: 3, minHeight: 50 },
  iconeAba: { width: 56, height: 30, alignItems: 'center', justifyContent: 'center' },
  pilula: { position: 'absolute', width: 56, height: 30, borderRadius: 15 },
  rotulo: { fontFamily: fontes.textoSemi, fontSize: 11 },
  badge: {
    position: 'absolute',
    top: 0,
    right: 10,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: cores.perigo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeTexto: { color: cores.branco, fontFamily: fontes.textoBold, fontSize: 10 },
  central: {
    width: 60,
    height: 60,
    marginTop: -28,
    borderRadius: 20,
    backgroundColor: cores.amarelo,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: cores.amarelo,
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
});
