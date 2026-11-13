import axios from 'axios';
import { API_URL, TEMPO_LIMITE_MS } from '../config';
import { sessaoEmMemoria } from './sessao';

export const api = axios.create({
  baseURL: API_URL,
  timeout: TEMPO_LIMITE_MS,
  headers: { Accept: 'application/json' },
});

// Coloca o "Authorization: Bearer <token>" em toda requisição.
api.interceptors.request.use((config) => {
  const sessao = sessaoEmMemoria();
  if (sessao?.token) config.headers.Authorization = `Bearer ${sessao.token}`;
  return config;
});

// Quando o token expira a API responde 401: avisamos o AuthContext para deslogar.
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

// Transforma qualquer erro da API (ErroResponse do Spring) numa frase para o usuário.
export function mensagemDeErro(erro) {
  if (erro?.code === 'ECONNABORTED') return 'O servidor demorou para responder. Tente de novo em instantes.';
  if (!erro?.response) return 'Sem conexão com o servidor. Confira sua internet.';
  const dados = erro.response.data;
  if (dados?.campos?.length) return dados.campos[0].mensagem;
  return dados?.mensagem || 'Algo deu errado. Tente novamente.';
}

// Erros de validação do Bean Validation viram { campo: mensagem } para mostrar embaixo de cada input.
export function errosPorCampo(erro) {
  const campos = erro?.response?.data?.campos ?? [];
  return Object.fromEntries(campos.map((c) => [c.campo, c.mensagem]));
}

// Endereço da foto de um problema (precisa do token, então usamos com cabecalhosAuth()).
export function urlFoto(problemaId) {
  return `${API_URL}/problemas/${problemaId}/foto`;
}

export function cabecalhosAuth() {
  const sessao = sessaoEmMemoria();
  return sessao?.token ? { Authorization: `Bearer ${sessao.token}` } : {};
}

// Chamada usada na abertura do app para "acordar" o Render.
export async function acordarServidor() {
  const inicio = Date.now();
  await api.get('/actuator/health', { timeout: TEMPO_LIMITE_MS });
  return Date.now() - inicio;
}
