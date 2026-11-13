import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as comunicadosApi from './comunicadosApi';

export function useComunicados(comunidadeId) {
  return useQuery({
    queryKey: ['comunicados', String(comunidadeId)],
    queryFn: () => comunicadosApi.buscarComunicados(comunidadeId),
    enabled: !!comunidadeId,
  });
}

function useInvalidar() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ['comunicados'] });
}

export function usePublicarComunicado() {
  const invalidar = useInvalidar();
  return useMutation({
    mutationFn: ({ comunidadeId, dados }) => comunicadosApi.publicarComunicado(comunidadeId, dados),
    onSuccess: invalidar,
  });
}

export function useEditarComunicado() {
  const invalidar = useInvalidar();
  return useMutation({
    mutationFn: ({ id, dados }) => comunicadosApi.editarComunicado(id, dados),
    onSuccess: invalidar,
  });
}

export function useExcluirComunicado() {
  const invalidar = useInvalidar();
  return useMutation({ mutationFn: comunicadosApi.excluirComunicado, onSuccess: invalidar });
}
