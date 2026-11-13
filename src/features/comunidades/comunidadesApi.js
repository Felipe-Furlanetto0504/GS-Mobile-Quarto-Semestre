import { api } from '../../services/api';

// Comunidades a até 3 km do endereço do morador.
export async function buscarProximas({ page = 0, size = 20 } = {}) {
  const { data } = await api.get('/comunidades/proximas', { params: { page, size } });
  return data;
}

// Comunidades em que participo (morador) ou que gerencio (gestor).
export async function buscarMinhas() {
  const { data } = await api.get('/usuarios/me/comunidades');
  return data;
}

export async function buscarComunidade(id) {
  const { data } = await api.get(`/comunidades/${id}`);
  return data;
}

export async function entrarNaComunidade(id) {
  const { data } = await api.post(`/comunidades/${id}/membros`);
  return data;
}

export async function sairDaComunidade(id) {
  await api.delete(`/comunidades/${id}/membros`);
}

// Gestor: { nome, descricao, latitude, longitude }
export async function criarComunidade(dados) {
  const { data } = await api.post('/comunidades', dados);
  return data;
}
