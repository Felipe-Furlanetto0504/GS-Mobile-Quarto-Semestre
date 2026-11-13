import { useState } from 'react';
import { Text } from 'react-native';
import { TelaFormulario } from '../../src/components/TelaFormulario';
import { Campo } from '../../src/components/Campo';
import { Botao } from '../../src/components/Botao';
import { SeletorDeLocal } from '../../src/components/SeletorDeLocal';
import { useAuth } from '../../src/features/auth/AuthContext';
import { errosPorCampo, mensagemDeErro } from '../../src/services/api';
import { cores, fontes } from '../../src/theme';

// O gestor já cria a primeira comunidade junto com a conta.
export default function CadastroGestor() {
  const { registrarGestor } = useAuth();
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    organizacao: '',
    comunidade: '',
    descricao: '',
  });
  const [local, setLocal] = useState({ endereco: '', latitude: null, longitude: null });
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const mudar = (campo) => (valor) => setForm((f) => ({ ...f, [campo]: valor }));

  function validar() {
    const e = {};
    if (!form.nome.trim()) e.nome = 'Informe o nome.';
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = 'E-mail inválido.';
    if (form.senha.length < 8) e.senha = 'A senha deve ter pelo menos 8 caracteres.';
    if (!form.organizacao.trim()) e.organizacao = 'Informe a organização.';
    if (!form.comunidade.trim()) e.comunidade = 'Dê um nome para a comunidade.';
    if (local.latitude == null) e.local = 'Defina o centro da comunidade (GPS ou endereço).';
    setErros(e);
    return Object.keys(e).length === 0;
  }

  async function enviar() {
    setErroGeral(null);
    if (!validar()) return;
    setEnviando(true);
    try {
      await registrarGestor({
        nome: form.nome.trim(),
        email: form.email.trim(),
        senha: form.senha,
        organizacao: form.organizacao.trim(),
        comunidade: {
          nome: form.comunidade.trim(),
          descricao: form.descricao.trim() || null,
          latitude: local.latitude,
          longitude: local.longitude,
        },
      });
    } catch (e) {
      const porCampo = errosPorCampo(e);
      setErros({
        ...porCampo,
        comunidade: porCampo['comunidade.nome'],
        local: porCampo['comunidade.latitude'] || porCampo['comunidade.longitude'],
      });
      setErroGeral(mensagemDeErro(e));
      setEnviando(false);
    }
  }

  return (
    <TelaFormulario
      titulo="Criar conta"
      subtitulo="Gestor"
      tituloGrande="Cuide de uma comunidade"
      descricao="Associações de bairro e secretarias recebem a fila de problemas priorizada pela IA."
      rodape={
        <>
          {erroGeral ? (
            <Text style={{ fontFamily: fontes.textoSemi, color: cores.perigo, fontSize: 13 }}>
              {erroGeral}
            </Text>
          ) : null}
          <Botao
            titulo="Criar conta e comunidade"
            icone="arrow-right"
            onPress={enviar}
            carregando={enviando}
          />
        </>
      }
    >
      <Campo
        rotulo="Seu nome"
        valor={form.nome}
        aoMudar={mudar('nome')}
        erro={erros.nome}
        maximo={120}
      />
      <Campo
        rotulo="E-mail"
        valor={form.email}
        aoMudar={mudar('email')}
        erro={erros.email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Campo rotulo="Senha" valor={form.senha} aoMudar={mudar('senha')} erro={erros.senha} senha />
      <Campo
        rotulo="Organização"
        valor={form.organizacao}
        aoMudar={mudar('organizacao')}
        erro={erros.organizacao}
        placeholder="Ex.: Associação de Moradores da Bela Vista"
        maximo={150}
      />
      <Text
        style={{ fontFamily: fontes.textoBold, fontSize: 16, color: cores.tinta, marginTop: 8 }}
      >
        Primeira comunidade
      </Text>
      <Campo
        rotulo="Nome da comunidade"
        valor={form.comunidade}
        aoMudar={mudar('comunidade')}
        erro={erros.comunidade}
        placeholder="Ex.: Bela Vista - Av. Paulista"
        maximo={120}
      />
      <Campo
        rotulo="Descrição (opcional)"
        valor={form.descricao}
        aoMudar={mudar('descricao')}
        maximo={500}
        multilinha
      />
      <SeletorDeLocal
        rotulo="Centro da comunidade"
        local={local}
        aoMudar={setLocal}
        erro={erros.local}
        ajuda="Moradores a até 3 km deste ponto podem entrar."
      />
    </TelaFormulario>
  );
}
