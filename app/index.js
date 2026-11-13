import { Redirect } from 'expo-router';
import { useAuth } from '../src/features/auth/AuthContext';

export default function Inicio() {
  const { logado, ehGestor } = useAuth();
  if (!logado) return <Redirect href="/boas-vindas" />;
  return <Redirect href={ehGestor ? '/triagem' : '/feed'} />;
}
