import { router } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';
import { BarraDeAbas } from '../../src/components/BarraDeAbas';
import { useAuth } from '../../src/features/auth/AuthContext';
import { ComunidadeAtualProvider, useComunidadeAtual } from '../../src/features/comunidades/ComunidadeAtualContext';
import { useNaoLidas } from '../../src/features/notificacoes/useNotificacoes';
import { cores } from '../../src/theme';

function Abas() {
  const { ehGestor } = useAuth();
  const naoLidas = useNaoLidas();
  const { atual } = useComunidadeAtual();

  const acaoCentral = ehGestor
    ? null
    : {
        icone: 'plus',
        rotulo: 'Publicar problema',
        aoTocar: () =>
          atual
            ? router.push({ pathname: '/problema/novo', params: { comunidadeId: atual.id } })
            : router.push('/comunidades'),
      };

  return (
    <Tabs
      backBehavior="history"
      tabBar={(props) => <BarraDeAbas {...props} acaoCentral={acaoCentral} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: cores.papel }, animation: 'shift' }}
    >
      {/* href: null esconde a aba para o perfil que não usa */}
      <Tabs.Screen name="feed" options={{ title: 'Feed', icone: 'home', href: ehGestor ? null : undefined }} />
      <Tabs.Screen name="triagem" options={{ title: 'Triagem', icone: 'list', href: ehGestor ? undefined : null }} />
      <Tabs.Screen name="comunidades" options={{ title: ehGestor ? 'Comunidades' : 'Mapa', icone: ehGestor ? 'users' : 'map' }} />
      <Tabs.Screen name="avisos" options={{ title: 'Avisos', icone: 'bell', tabBarBadge: naoLidas || undefined }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil', icone: 'user' }} />
    </Tabs>
  );
}

export default function LayoutAbas() {
  return (
    <ComunidadeAtualProvider>
      <Abas />
    </ComunidadeAtualProvider>
  );
}
