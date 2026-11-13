import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { carregarSessao, limparSessao, salvarSessao } from '../../services/sessao';
import { quandoSessaoExpirar } from '../../services/api';
import * as authApi from './authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [sessao, setSessao] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarSessao().then((s) => {
      setSessao(s);
      setCarregando(false);
    });
  }, []);

  const sair = useCallback(async () => {
    await limparSessao();
    queryClient.clear();
    setSessao(null);
  }, [queryClient]);

  useEffect(() => {
    quandoSessaoExpirar(() => sair());
  }, [sair]);

  const iniciar = useCallback(async (resposta) => {
    const nova = await salvarSessao(resposta);
    setSessao(nova);
    return nova;
  }, []);

  const valor = useMemo(
    () => ({
      carregando,
      usuario: sessao?.usuario ?? null,
      logado: !!sessao,
      ehGestor: sessao?.usuario?.perfil === 'GESTOR',
      entrar: async (email, senha) => iniciar(await authApi.entrar(email, senha)),
      registrarMorador: async (dados) => iniciar(await authApi.registrarMorador(dados)),
      registrarGestor: async (dados) => iniciar(await authApi.registrarGestor(dados)),
      sair,
    }),
    [carregando, sessao, iniciar, sair]
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error('useAuth precisa estar dentro do AuthProvider');
  return contexto;
}
