import { useState } from 'react';
import { Text } from 'react-native';
import { TelaFormulario } from '../../src/components/TelaFormulario';
import { Campo } from '../../src/components/Campo';
import { Botao } from '../../src/components/Botao';
import { SeletorDeLocal } from '../../src/components/SeletorDeLocal';
import { useAuth } from '../../src/features/auth/AuthContext';
import { errosPorCampo, mensagemDeErro } from '../../src/services/api';
import { cores, fontes } from '../../src/theme';

export default function CadastroMorador() {
  const { registrarMorador } = useAuth();
  const [form, setForm] = useState({ nome: '', email: '', senha: '' });
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
    if (!local.endereco.trim()) e.endereco = 'Informe o endereço.';
    else if (local.latitude == null) e.endereco = 'Toque em "Buscar endereço" ou use o GPS para localizar.';
    setErros(e);
    return Object.keys(e).length === 0;
  }

  async function enviar() {
    setErroGeral(null);
    if (!validar()) return;
    setEnviando(true);
    try {
      await registrarMorador({
        nome: form.nome.trim(),
        email: form.email.trim(),
        senha: form.senha,
        endereco: local.endereco.trim(),
        latitude: local.latitude,
        longitude: local.longitude,
      });
    } catch (e) {
      setErros(errosPorCampo(e));
      setErroGeral(mensagemDeErro(e));
      setEnviando(false);
    }
  }

  return (
    <TelaFormulario
      titulo="Criar conta"
      subtitulo="Morador"
      tituloGrande="Seu bairro, sua voz"
      descricao="Com o seu endereço mostramos as comunidades a até 3 km de casa."
      rodape={
        <>
          {erroGeral ? <Text style={{ fontFamily: fontes.textoSemi, color: cores.perigo, fontSize: 13 }}>{erroGeral}</Text> : null}
          <Botao titulo="Criar conta" icone="arrow-right" onPress={enviar} carregando={enviando} />
        </>
      }
    >
      <Campo rotulo="Nome" valor={form.nome} aoMudar={mudar('nome')} erro={erros.nome} maximo={120} autoComplete="name" />
      <Campo
        rotulo="E-mail"
        valor={form.email}
        aoMudar={mudar('email')}
        erro={erros.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      <Campo rotulo="Senha" valor={form.senha} aoMudar={mudar('senha')} erro={erros.senha} senha autoComplete="new-password" />
      <SeletorDeLocal local={local} aoMudar={setLocal} erro={erros.endereco} />
    </TelaFormulario>
  );
}
