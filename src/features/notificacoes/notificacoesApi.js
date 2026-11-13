import { api } from '../../services/api';

export async function buscarNotificacoes({ page = 0, size = 30 } = {}) {
  const { data } = await api.get('/notificacoes', { params: { page, size } });
  return data;
}

export async function marcarComoLida(id) {
  const { data } = await api.patch(`/notificacoes/${id}/lida`);
  return data;
}

export async function excluirNotificacao(id) {
  await api.delete(`/notificacoes/${id}`);
}

export async function excluirLidas() {
  await api.delete('/notificacoes/lidas');
}
