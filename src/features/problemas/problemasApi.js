import { Platform } from 'react-native';
import { api } from '../../services/api';

// ---------- CRUD de Problema (requisito 02) ----------

// CREATE: multipart/form-data com titulo, descricao, latitude, longitude e foto.
export async function publicarProblema(comunidadeId, { titulo, descricao, latitude, longitude, foto }) {
  const form = new FormData();
  form.append('titulo', titulo);
  form.append('descricao', descricao);
  form.append('latitude', String(latitude));
  form.append('longitude', String(longitude));
  if (foto) {
    const nome = foto.fileName || `problema-${Date.now()}.jpg`;
    const tipo = foto.mimeType || 'image/jpeg';
    if (Platform.OS === 'web') {
      const blob = await (await fetch(foto.uri)).blob();
      form.append('foto', blob, nome);
    } else {
      form.append('foto', { uri: foto.uri, name: nome, type: tipo });
    }
  }
  const { data } = await api.post(`/comunidades/${comunidadeId}/problemas`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    transformRequest: (corpo) => corpo,
  });
  return data;
}

// READ: feed paginado. ordem = recentes | apoiados | gravidade
export async function buscarFeed(comunidadeId, { ordem = 'recentes', page = 0, size = 10 } = {}) {
  const { data } = await api.get(`/comunidades/${comunidadeId}/problemas`, { params: { ordem, page, size } });
  return data;
}

export async function buscarProblema(id) {
  const { data } = await api.get(`/problemas/${id}`);
  return data;
}

// UPDATE: só o autor, antes da adoção.
export async function editarProblema(id, { titulo, descricao }) {
  const { data } = await api.put(`/problemas/${id}`, { titulo, descricao });
  return data;
}

// DELETE: só o autor, antes da adoção.
export async function excluirProblema(id) {
  await api.delete(`/problemas/${id}`);
}

// ---------- Interações ----------

// POST alterna: se já apoiou, remove o apoio.
export async function alternarApoio(id) {
  const { data } = await api.post(`/problemas/${id}/apoios`);
  return data; // { problemaId, totalApoios, apoiadoPorMim }
}

export async function buscarObservacoes(id) {
  const { data } = await api.get(`/problemas/${id}/observacoes`);
  return data;
}

export async function adicionarObservacao(id, texto) {
  const { data } = await api.post(`/problemas/${id}/observacoes`, { texto });
  return data;
}

export async function excluirObservacao(observacaoId) {
  await api.delete(`/observacoes/${observacaoId}`);
}

// ---------- Gestor ----------

export async function buscarTriagem({ page = 0, size = 20 } = {}) {
  const { data } = await api.get('/triagem', { params: { page, size } });
  return data;
}

export async function adotarProblema(id) {
  const { data } = await api.post(`/problemas/${id}/adotar`);
  return data;
}

export async function reclassificarProblema(id) {
  await api.post(`/problemas/${id}/reclassificar`);
}

export async function buscarSupervisionados(comunidadeId, { page = 0, size = 20 } = {}) {
  const { data } = await api.get(`/comunidades/${comunidadeId}/supervisionados`, { params: { page, size } });
  return data;
}
