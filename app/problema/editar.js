import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { TelaFormulario } from '../../src/components/TelaFormulario';
import { Campo } from '../../src/components/Campo';
import { Botao } from '../../src/components/Botao';
import { useEditarProblema, useProblema } from '../../src/features/problemas/useProblemas';
import { errosPorCampo, mensagemDeErro } from '../../src/services/api';
import { cores } from '../../src/theme';

export default function EditarProblema() {
  const { id } = useLocalSearchParams();
  const consulta = useProblema(id);
  const editar = useEditarProblema();
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [erros, setErros] = useState({});

  useEffect(() => {
    if (consulta.data) {
      setTitulo(consulta.data.titulo);
      setDescricao(consulta.data.descricao);
    }
  }, [consulta.data]);

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
