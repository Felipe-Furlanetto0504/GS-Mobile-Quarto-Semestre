import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const CHAVE = 'rootfix.sessao';

async function ler() {
  if (Platform.OS === 'web') return globalThis.localStorage?.getItem(CHAVE) ?? null;
  return SecureStore.getItemAsync(CHAVE);
}

async function gravar(valor) {
  if (Platform.OS === 'web') return globalThis.localStorage?.setItem(CHAVE, valor);
  return SecureStore.setItemAsync(CHAVE, valor);
}

async function apagar() {
  if (Platform.OS === 'web') return globalThis.localStorage?.removeItem(CHAVE);
  return SecureStore.deleteItemAsync(CHAVE);
}

let sessaoAtual = null;

export function sessaoEmMemoria() {
  return sessaoAtual;
}

export async function carregarSessao() {
  try {
    const bruto = await ler();
    if (!bruto) return null;
    const sessao = JSON.parse(bruto);
    if (!sessao.expiraEm || Date.now() >= sessao.expiraEm) {
      await apagar();
      return null;
    }
    sessaoAtual = sessao;
    return sessao;
  } catch {
    return null;
  }
}

export async function salvarSessao(resposta) {
  const sessao = {
    token: resposta.token,
    usuario: resposta.usuario,
    expiraEm: Date.now() + resposta.expiraEmSegundos * 1000,
  };
  sessaoAtual = sessao;
  await gravar(JSON.stringify(sessao));
  return sessao;
}

export async function limparSessao() {
  sessaoAtual = null;
  await apagar();
}
