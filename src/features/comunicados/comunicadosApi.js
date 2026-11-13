import { api } from '../../services/api';

// CRUD de comunicados (gestor publica, edita e exclui; todos os membros leem).
export async function buscarComunicados(comunidadeId, { page = 0, size = 20 } = {}) {
  const { data } = await api.get(`/comunidades/${comunidadeId}/comunicados`, { params: { page, size } });
  return data;
}

export async function publicarComunicado(comunidadeId, { titulo, texto, destacado }) {
  const { data } = await api.post(`/comunidades/${comunidadeId}/comunicados`, { titulo, texto, destacado });
  return data;
}

export async function editarComunicado(id, { titulo, texto, destacado }) {
  const { data } = await api.put(`/comunicados/${id}`, { titulo, texto, destacado });
  return data;
}

export async function excluirComunicado(id) {
  await api.delete(`/comunicados/${id}`);
}
