import { Stack } from 'expo-router';
import { cores } from '../../src/theme';

export default function LayoutAuth() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: cores.papel },
      }}
    >
      <Stack.Screen
        name="boas-vindas"
        options={{ contentStyle: { backgroundColor: cores.asfalto } }}
      />
      <Stack.Screen name="login" />
      <Stack.Screen name="cadastro-morador" />
      <Stack.Screen name="cadastro-gestor" />
    </Stack>
  );
}
