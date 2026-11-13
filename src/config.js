// Endereço da API Java. Para usar a API rodando no seu PC, crie um arquivo .env com
// EXPO_PUBLIC_API_URL=http://SEU_IP:8080 (no celular, "localhost" não aponta para o PC).
export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://rootfix-java.onrender.com';

// O Render gratuito dorme depois de 15 minutos; o primeiro acesso pode levar ~1 minuto.
export const TEMPO_LIMITE_MS = 70000;
