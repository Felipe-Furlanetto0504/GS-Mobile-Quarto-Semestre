import { useCallback, useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Archivo_700Bold, Archivo_800ExtraBold } from '@expo-google-fonts/archivo';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '../src/features/auth/AuthContext';
import { AcordandoServidor } from '../src/components/AcordandoServidor';
import { acordarServidor } from '../src/services/api';
import { cores } from '../src/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30 * 1000 },
  },
});

// Antes de abrir o app, chama /actuator/health para acordar a API no Render.
function useServidor() {
  const [estado, setEstado] = useState('acordando'); 

  const tentar = useCallback(() => {
    setEstado('acordando');
    const aviso = setTimeout(() => setEstado((e) => (e === 'acordando' ? 'lento' : e)), 1500);
    acordarServidor()
      .then(() => setEstado('pronto'))
      .catch(() => setEstado('falhou'))
      .finally(() => clearTimeout(aviso));
  }, []);

  useEffect(tentar, [tentar]);
  return { estado, tentar, continuar: () => setEstado('pronto') };
}

function Navegacao({ fontesProntas }) {
  const { carregando, logado, ehGestor } = useAuth();
  const servidor = useServidor();
  const pronto = fontesProntas && !carregando;

  useEffect(() => {
    if (pronto && servidor.estado !== 'acordando') SplashScreen.hideAsync().catch(() => {});
  }, [pronto, servidor.estado]);

  if (!pronto || servidor.estado === 'acordando') return null;

  if (servidor.estado !== 'pronto') {
    return (
      <>
        <StatusBar style="light" />
        <AcordandoServidor
          falhou={servidor.estado === 'falhou'}
          aoTentarDeNovo={servidor.tentar}
          aoContinuar={servidor.continuar}
        />
      </>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: cores.papel },
        }}
      >
        <Stack.Screen name="index" />

        <Stack.Protected guard={!logado}>
          <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
        </Stack.Protected>

        <Stack.Protected guard={logado}>
          <Stack.Screen name="(abas)" options={{ animation: 'fade' }} />
          <Stack.Screen name="problema/[id]" />
          <Stack.Screen name="problema/novo" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="problema/editar" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="comunidade/[id]" />
          <Stack.Screen name="comunicado/novo" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="comunicado/editar" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Protected guard={ehGestor}>
            <Stack.Screen name="comunidade/nova" options={{ animation: 'slide_from_bottom' }} />
          </Stack.Protected>
        </Stack.Protected>
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontesProntas, erroFontes] = useFonts({
    Archivo_700Bold,
    Archivo_800ExtraBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Navegacao fontesProntas={fontesProntas || !!erroFontes} />
          </AuthProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
