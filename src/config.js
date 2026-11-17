export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://rootfix-java.onrender.com';

export const TEMPO_LIMITE_MS = 70000;

// Serviço de IA (Encaminhador do gestor), em FastAPI no Render.
export const IA_URL = process.env.EXPO_PUBLIC_IA_URL || 'https://rootfix-ia.onrender.com';

// O encaminhamento lê a API Java, busca nas fichas e gera o texto com o Gemini. Se o serviço de IA
// e a API Java estiverem dormindo no Render, os dois acordam em sequência: 70 s não bastam.
export const TEMPO_LIMITE_IA_MS = 120000;
