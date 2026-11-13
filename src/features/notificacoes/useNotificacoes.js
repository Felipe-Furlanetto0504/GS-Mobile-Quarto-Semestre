import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as notificacoesApi from './notificacoesApi';

const CHAVE = ['notificacoes'];

export function useNotificacoes() {
  return useQuery({ queryKey: CHAVE, queryFn: () => notificacoesApi.buscarNotificacoes(), refetchInterval: 30000 });
}

export function useNaoLidas() {
  const { data } = useNotificacoes();
  return (data?.content ?? []).filter((n) => !n.lida).length;
}

// Remove da lista na hora (otimista) e desfaz se a API falhar.
function useMudancaOtimista(mutationFn, aplicar) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onMutate: async (variavel) => {
      await queryClient.cancelQueries({ queryKey: CHAVE });
      const anterior = queryClient.getQueryData(CHAVE);
      if (anterior) queryClient.setQueryData(CHAVE, { ...anterior, content: aplicar(anterior.content, variavel) });
      return { anterior };
    },
    onError: (_e, _v, contexto) => contexto?.anterior && queryClient.setQueryData(CHAVE, contexto.anterior),
    onSettled: () => queryClient.invalidateQueries({ queryKey: CHAVE }),
  });
}

export function useMarcarComoLida() {
  return useMudancaOtimista(notificacoesApi.marcarComoLida, (lista, id) =>
    lista.map((n) => (n.id === id ? { ...n, lida: true } : n))
  );
}

export function useExcluirNotificacao() {
  return useMudancaOtimista(notificacoesApi.excluirNotificacao, (lista, id) => lista.filter((n) => n.id !== id));
}

export function useExcluirLidas() {
  return useMudancaOtimista(notificacoesApi.excluirLidas, (lista) => lista.filter((n) => !n.lida));
}
