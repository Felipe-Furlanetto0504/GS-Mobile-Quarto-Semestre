import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// O token JWT fica no armazenamento seguro do aparelho (Keychain no iOS, Keystore no Android).
// No navegador (expo web) não existe SecureStore, então usamos o localStorage só para testes.
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

// Sessão em memória, para o interceptor do Axios não precisar ler o disco a cada requisição.
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

// Recebe o AuthResponse da API: { token, tipo, expiraEmSegundos, usuario }
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
