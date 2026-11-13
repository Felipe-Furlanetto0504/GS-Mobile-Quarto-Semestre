import { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { TelaFormulario } from '../../src/components/TelaFormulario';
import { Campo } from '../../src/components/Campo';
import { Botao } from '../../src/components/Botao';
import { SeletorDeLocal } from '../../src/components/SeletorDeLocal';
import { useCriarComunidade } from '../../src/features/comunidades/useComunidades';
import { errosPorCampo, mensagemDeErro } from '../../src/services/api';

export default function NovaComunidade() {
  const criar = useCriarComunidade();
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [local, setLocal] = useState({ endereco: '', latitude: null, longitude: null });
  const [erros, setErros] = useState({});

  function salvar() {
    const e = {};
    if (!nome.trim()) e.nome = 'Dê um nome para a comunidade.';
    if (local.latitude == null) e.local = 'Defina o centro da comunidade (GPS ou endereço).';
    setErros(e);
    if (Object.keys(e).length) return;
    criar.mutate(
      { nome: nome.trim(), descricao: descricao.trim() || null, latitude: local.latitude, longitude: local.longitude },
      {
        onSuccess: (c) => router.replace(`/comunidade/${c.id}`),
        onError: (erro) => {
          setErros(errosPorCampo(erro));
          Alert.alert('Não foi possível criar', mensagemDeErro(erro));
        },
      }
    );
  }

  return (
    <TelaFormulario
      titulo="Nova comunidade"
      iconeVoltar="x"
      tituloGrande="Mais um bairro no mapa"
      descricao="Moradores a até 3 km do centro escolhido podem entrar."
      rodape={<Botao titulo="Criar comunidade" icone="check" onPress={salvar} carregando={criar.isPending} />}
    >
      <Campo rotulo="Nome" valor={nome} aoMudar={setNome} maximo={120} erro={erros.nome} placeholder="Ex.: Mooca - Rua da Mooca" />
      <Campo rotulo="Descrição (opcional)" valor={descricao} aoMudar={setDescricao} maximo={500} multilinha />
      <SeletorDeLocal rotulo="Centro da comunidade" local={local} aoMudar={setLocal} erro={erros.local} />
    </TelaFormulario>
  );
}
