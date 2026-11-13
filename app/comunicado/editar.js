import { useState } from 'react';
import { Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { FormularioComunicado } from '../../src/features/comunicados/components/FormularioComunicado';
import { useComunicados, useEditarComunicado } from '../../src/features/comunicados/useComunicados';
import { EstadoVazio } from '../../src/components/Estados';
import { errosPorCampo, mensagemDeErro } from '../../src/services/api';

export default function EditarComunicado() {
  const { id, comunidadeId } = useLocalSearchParams();
  const lista = useComunicados(comunidadeId);
  const editar = useEditarComunicado();
  const [errosApi, setErrosApi] = useState({});
  const comunicado = lista.data?.content.find((c) => String(c.id) === String(id));

  if (!comunicado) {
    return (
      <EstadoVazio
        icone="loader"
        titulo={lista.isLoading ? 'Carregando…' : 'Comunicado não encontrado'}
      />
    );
  }

  return (
    <FormularioComunicado
      titulo="Editar comunicado"
      inicial={comunicado}
      salvando={editar.isPending}
      errosApi={errosApi}
      aoSalvar={(dados) =>
        editar.mutate(
          { id, dados },
          {
            onSuccess: () => router.back(),
            onError: (e) => {
              setErrosApi(errosPorCampo(e));
              Alert.alert('Não foi possível salvar', mensagemDeErro(e));
            },
          }
        )
      }
    />
  );
}
