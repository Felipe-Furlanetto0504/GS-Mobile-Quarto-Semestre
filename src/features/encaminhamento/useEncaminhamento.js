import { useQuery } from '@tanstack/react-query';
import * as encaminhamentoApi from './encaminhamentoApi';

const chave = (id) => ['encaminhamento', String(id)];

// Cada encaminhamento chama o Gemini, que tem cota e leva alguns segundos. Por isso o resultado
// fica guardado enquanto o app está aberto: voltar à tela não gera de novo. "Gerar de novo"
// (refetch) é o único jeito de pedir outro.
export function useEncaminhamento(problemaId) {
  return useQuery({
    queryKey: chave(problemaId),
    queryFn: () => encaminhamentoApi.encaminharProblema(problemaId),
    enabled: !!problemaId,
    staleTime: Infinity,
    gcTime: 30 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

// Só lê o que já foi gerado, sem chamar o serviço (para o card da tela do problema).
export function useEncaminhamentoGuardado(problemaId) {
  return useQuery({
    queryKey: chave(problemaId),
    queryFn: () => encaminhamentoApi.encaminharProblema(problemaId),
    enabled: false,
    staleTime: Infinity,
  }).data;
}
