import { useState } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { TelaFormulario } from '../../src/components/TelaFormulario';
import { Campo } from '../../src/components/Campo';
import { Botao } from '../../src/components/Botao';
import { useEditarProblema, useProblema } from '../../src/features/problemas/useProblemas';
import { errosPorCampo, mensagemDeErro } from '../../src/services/api';
import { MensagemErro } from '../../src/components/Estados';
import { cores } from '../../src/theme';

export default function EditarProblema() {
  const { id } = useLocalSearchParams();
  const consulta = useProblema(id);

  if (consulta.isLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: cores.papel,
        }}
      >
        <ActivityIndicator color={cores.tinta} />
      </View>
    );
  }

  if (!consulta.data) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: cores.papel }}>
        <MensagemErro erro={mensagemDeErro(consulta.error)} aoTentarDeNovo={consulta.refetch} />
      </View>
    );
  }

  // O formulário só monta depois que o relato chega, já com os valores atuais.
  return <FormularioEdicao id={id} problema={consulta.data} />;
}

function FormularioEdicao({ id, problema }) {
  const editar = useEditarProblema();
  const [titulo, setTitulo] = useState(problema.titulo);
  const [descricao, setDescricao] = useState(problema.descricao);
  const [erros, setErros] = useState({});

  function salvar() {
    const e = {};
    if (!titulo.trim()) e.titulo = 'Informe o título.';
    if (!descricao.trim()) e.descricao = 'Descreva o problema.';
    setErros(e);
    if (Object.keys(e).length) return;
    editar.mutate(
      { id, dados: { titulo: titulo.trim(), descricao: descricao.trim() } },
      {
        onSuccess: () => router.back(),
        onError: (erro) => {
          setErros(errosPorCampo(erro));
          Alert.alert('Não foi possível salvar', mensagemDeErro(erro));
        },
      }
    );
  }

  return (
    <TelaFormulario
      titulo="Editar relato"
      iconeVoltar="x"
      tituloGrande="Ajuste o seu relato"
      descricao="A foto e o local não mudam. Depois que o gestor adotar, não dá mais para editar."
      rodape={
        <Botao
          titulo="Salvar alterações"
          icone="check"
          onPress={salvar}
          carregando={editar.isPending}
        />
      }
    >
      <Campo rotulo="Título" valor={titulo} aoMudar={setTitulo} maximo={120} erro={erros.titulo} />
      <Campo
        rotulo="Descrição"
        valor={descricao}
        aoMudar={setDescricao}
        maximo={1000}
        multilinha
        erro={erros.descricao}
      />
    </TelaFormulario>
  );
}
