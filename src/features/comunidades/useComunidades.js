import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as comunidadesApi from './comunidadesApi';

export function useMinhasComunidades() {
  return useQuery({ queryKey: ['comunidades', 'minhas'], queryFn: comunidadesApi.buscarMinhas });
}

export function useComunidadesProximas(ativo = true) {
  return useQuery({
    queryKey: ['comunidades', 'proximas'],
    queryFn: () => comunidadesApi.buscarProximas(),
    enabled: ativo,
  });
}

export function useComunidade(id) {
  return useQuery({
    queryKey: ['comunidade', String(id)],
    queryFn: () => comunidadesApi.buscarComunidade(id),
    enabled: !!id,
  });
}

function useInvalidarComunidades() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ['comunidades'] });
}

export function useEntrarNaComunidade() {
  const invalidar = useInvalidarComunidades();
  return useMutation({ mutationFn: comunidadesApi.entrarNaComunidade, onSuccess: invalidar });
}

export function useSairDaComunidade() {
  const invalidar = useInvalidarComunidades();
  return useMutation({ mutationFn: comunidadesApi.sairDaComunidade, onSuccess: invalidar });
}

export function useCriarComunidade() {
  const invalidar = useInvalidarComunidades();
  return useMutation({ mutationFn: comunidadesApi.criarComunidade, onSuccess: invalidar });
}
