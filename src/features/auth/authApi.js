import { api } from '../../services/api';

export async function entrar(email, senha) {
  const { data } = await api.post('/auth/login', { email, senha });
  return data;
}

export async function registrarMorador(dados) {
  const { data } = await api.post('/auth/registro/morador', dados);
  return data;
}

export async function registrarGestor(dados) {
  const { data } = await api.post('/auth/registro/gestor', dados);
  return data;
}

export async function buscarEu() {
  const { data } = await api.get('/usuarios/me');
  return data;
}
