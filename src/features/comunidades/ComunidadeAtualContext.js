import { createContext, useContext, useMemo, useState } from 'react';
import { useMinhasComunidades } from './useComunidades';

const ComunidadeAtualContext = createContext(null);

export function ComunidadeAtualProvider({ children }) {
  const minhas = useMinhasComunidades();
  const [idEscolhido, setIdEscolhido] = useState(null);
  const lista = useMemo(() => minhas.data ?? [], [minhas.data]);

  // Se o usuário saiu da comunidade escolhida (ou ainda não escolheu), usa a primeira da lista.
  const valor = useMemo(
    () => ({
      comunidades: lista,
      carregando: minhas.isLoading,
      atual: lista.find((c) => c.id === idEscolhido) ?? lista[0] ?? null,
      escolher: setIdEscolhido,
    }),
    [lista, minhas.isLoading, idEscolhido]
  );

  return (
    <ComunidadeAtualContext.Provider value={valor}>{children}</ComunidadeAtualContext.Provider>
  );
}

export function useComunidadeAtual() {
  return useContext(ComunidadeAtualContext);
}
