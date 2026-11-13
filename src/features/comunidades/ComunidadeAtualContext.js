import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useMinhasComunidades } from './useComunidades';

const ComunidadeAtualContext = createContext(null);

export function ComunidadeAtualProvider({ children }) {
  const minhas = useMinhasComunidades();
  const [idEscolhido, setIdEscolhido] = useState(null);
  const lista = minhas.data ?? [];

  useEffect(() => {
    const aindaParticipa = lista.some((c) => c.id === idEscolhido);
    if (!aindaParticipa) setIdEscolhido(lista[0]?.id ?? null);
  }, [lista, idEscolhido]);

  const valor = useMemo(
    () => ({
      comunidades: lista,
      carregando: minhas.isLoading,
      atual: lista.find((c) => c.id === idEscolhido) ?? null,
      escolher: setIdEscolhido,
    }),
    [lista, minhas.isLoading, idEscolhido]
  );

  return <ComunidadeAtualContext.Provider value={valor}>{children}</ComunidadeAtualContext.Provider>;
}

export function useComunidadeAtual() {
  return useContext(ComunidadeAtualContext);
}
