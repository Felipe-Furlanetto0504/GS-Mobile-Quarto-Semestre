import { apiIA } from '../../services/api';

// POST /encaminhar/{id} no serviço de IA. Sem corpo: o serviço lê o problema e as observações
// na API Java com o token do gestor, que o interceptor já coloca no cabeçalho.
export async function encaminharProblema(problemaId) {
  const { data } = await apiIA.post(`/encaminhar/${problemaId}`);
  return data;
}
