import axios from 'axios';
import { API_URL, TEMPO_LIMITE_MS } from '../config';
import { sessaoEmMemoria } from './sessao';

// eslint-disable-next-line import/no-named-as-default-member -- axios.create é a forma documentada
export const api = axios.create({
  baseURL: API_URL,
  timeout: TEMPO_LIMITE_MS,
  headers: { Accept: 'application/json' },
});

api.interceptors.request.use((config) => {
  const sessao = sessaoEmMemoria();
  if (sessao?.token) config.headers.Authorization = `Bearer ${sessao.token}`;
  return config;
});

let aoExpirar = null;
export function quandoSessaoExpirar(callback) {
  aoExpirar = callback;
}

api.interceptors.response.use(
  (resposta) => resposta,
  (erro) => {
    const url = erro.config?.url ?? '';
    if (erro.response?.status === 401 && !url.startsWith('/auth/') && aoExpirar) aoExpirar();
    return Promise.reject(erro);
  }
);

export function mensagemDeErro(erro) {
  if (erro?.code === 'ECONNABORTED')
    return 'O servidor demorou para responder. Tente de novo em instantes.';
  if (!erro?.response) return 'Sem conexão com o servidor. Confira sua internet.';
  const dados = erro.response.data;
  if (dados?.campos?.length) return dados.campos[0].mensagem;
  return dados?.mensagem || 'Algo deu errado. Tente novamente.';
}

export function errosPorCampo(erro) {
  const campos = erro?.response?.data?.campos ?? [];
  return Object.fromEntries(campos.map((c) => [c.campo, c.mensagem]));
}

export function urlFoto(problemaId) {
  return `${API_URL}/problemas/${problemaId}/foto`;
}

export function cabecalhosAuth() {
  const sessao = sessaoEmMemoria();
  return sessao?.token ? { Authorization: `Bearer ${sessao.token}` } : {};
}

export async function acordarServidor() {
  const inicio = Date.now();
  await api.get('/actuator/health', { timeout: TEMPO_LIMITE_MS });
  return Date.now() - inicio;
}
