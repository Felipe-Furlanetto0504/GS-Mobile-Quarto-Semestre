import { useState } from 'react';
import { Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { FormularioComunicado } from '../../src/features/comunicados/components/FormularioComunicado';
import { usePublicarComunicado } from '../../src/features/comunicados/useComunicados';
import { errosPorCampo, mensagemDeErro } from '../../src/services/api';

export default function NovoComunicado() {
  const { comunidadeId } = useLocalSearchParams();
  const publicar = usePublicarComunicado();
  const [errosApi, setErrosApi] = useState({});

  return (
    <FormularioComunicado
      titulo="Novo comunicado"
      salvando={publicar.isPending}
      errosApi={errosApi}
      aoSalvar={(dados) =>
        publicar.mutate(
          { comunidadeId, dados },
          {
            onSuccess: () => router.back(),
            onError: (e) => {
              setErrosApi(errosPorCampo(e));
              Alert.alert('Não foi possível publicar', mensagemDeErro(e));
            },
          }
        )
      }
    />
  );
}
