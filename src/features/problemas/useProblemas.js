import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as problemasApi from './problemasApi';

const proximaPagina = (ultima) =>
  ultima.page.number + 1 < ultima.page.totalPages ? ultima.page.number + 1 : undefined;

export function useFeed(comunidadeId, ordem = 'recentes') {
  return useInfiniteQuery({
    queryKey: ['feed', String(comunidadeId), ordem],
    queryFn: ({ pageParam }) => problemasApi.buscarFeed(comunidadeId, { ordem, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: proximaPagina,
    enabled: !!comunidadeId,
  });
}

export function useProblema(id) {
  return useQuery({
    queryKey: ['problema', String(id)],
    queryFn: () => problemasApi.buscarProblema(id),
    enabled: !!id,
    refetchInterval: (query) => (query.state.data && !query.state.data.gravidadeIa ? 4000 : false),
  });
}

export function useObservacoes(id) {
  return useQuery({
    queryKey: ['observacoes', String(id)],
    queryFn: () => problemasApi.buscarObservacoes(id),
    enabled: !!id,
  });
}

export function useTriagem() {
  return useQuery({ queryKey: ['triagem'], queryFn: () => problemasApi.buscarTriagem() });
}

export function useSupervisionados(comunidadeId) {
  return useQuery({
    queryKey: ['supervisionados', String(comunidadeId)],
    queryFn: () => problemasApi.buscarSupervisionados(comunidadeId),
    enabled: !!comunidadeId,
  });
}

function useAtualizarListas() {
  const queryClient = useQueryClient();
  return (id) => {
    queryClient.invalidateQueries({ queryKey: ['feed'] });
    queryClient.invalidateQueries({ queryKey: ['triagem'] });
    queryClient.invalidateQueries({ queryKey: ['supervisionados'] });
    if (id) queryClient.invalidateQueries({ queryKey: ['problema', String(id)] });
  };
}

export function usePublicarProblema() {
  const atualizar = useAtualizarListas();
  return useMutation({
    mutationFn: ({ comunidadeId, dados }) => problemasApi.publicarProblema(comunidadeId, dados),
    onSuccess: () => atualizar(),
  });
}

export function useEditarProblema() {
  const atualizar = useAtualizarListas();
  return useMutation({
    mutationFn: ({ id, dados }) => problemasApi.editarProblema(id, dados),
    onSuccess: (_, { id }) => atualizar(id),
  });
}

export function useExcluirProblema() {
  const atualizar = useAtualizarListas();
  return useMutation({ mutationFn: problemasApi.excluirProblema, onSuccess: () => atualizar() });
}

export function useAlternarApoio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: problemasApi.alternarApoio,
    onSuccess: (resposta) => {
      queryClient.setQueryData(['problema', String(resposta.problemaId)], (antigo) =>
        antigo
          ? { ...antigo, totalApoios: resposta.totalApoios, apoiadoPorMim: resposta.apoiadoPorMim }
          : antigo
      );
      queryClient.invalidateQueries({ queryKey: ['feed'], refetchType: 'inactive' });
      queryClient.invalidateQueries({ queryKey: ['triagem'] });
    },
  });
}

export function useAdicionarObservacao(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (texto) => problemasApi.adicionarObservacao(id, texto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['observacoes', String(id)] });
      queryClient.invalidateQueries({ queryKey: ['problema', String(id)] });
    },
  });
}

export function useExcluirObservacao(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: problemasApi.excluirObservacao,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['observacoes', String(id)] }),
  });
}

export function useAdotarProblema() {
  const atualizar = useAtualizarListas();
  return useMutation({
    mutationFn: problemasApi.adotarProblema,
    onSuccess: (p) => atualizar(p.id),
  });
}

export function useReclassificar() {
  const atualizar = useAtualizarListas();
  return useMutation({
    mutationFn: problemasApi.reclassificarProblema,
    onSuccess: (_, id) => atualizar(id),
  });
}
