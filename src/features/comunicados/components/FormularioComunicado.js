import { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { TelaFormulario } from '../../../components/TelaFormulario';
import { Campo } from '../../../components/Campo';
import { Botao } from '../../../components/Botao';
import { cores, fontes, raio } from '../../../theme';

export function FormularioComunicado({ titulo, inicial, aoSalvar, salvando, errosApi = {} }) {
  const [form, setForm] = useState({
    titulo: inicial?.titulo ?? '',
    texto: inicial?.texto ?? '',
    destacado: inicial?.destacado ?? false,
  });
  const [erros, setErros] = useState({});
  const todos = { ...errosApi, ...erros };

  function salvar() {
    const e = {};
    if (!form.titulo.trim()) e.titulo = 'Informe o título do comunicado.';
    if (!form.texto.trim()) e.texto = 'Escreva o texto do comunicado.';
    setErros(e);
    if (Object.keys(e).length) return;
    aoSalvar({ titulo: form.titulo.trim(), texto: form.texto.trim(), destacado: form.destacado });
  }

  return (
    <TelaFormulario
      titulo={titulo}
      iconeVoltar="x"
      rodape={<Botao titulo="Publicar" icone="send" onPress={salvar} carregando={salvando} />}
    >
      <Campo
        rotulo="Título"
        valor={form.titulo}
        aoMudar={(v) => setForm({ ...form, titulo: v })}
        maximo={120}
        erro={todos.titulo}
      />
      <Campo
        rotulo="Texto"
        valor={form.texto}
        aoMudar={(v) => setForm({ ...form, texto: v })}
        maximo={2000}
        multilinha
        erro={todos.texto}
      />
      <View style={estilos.destaque}>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={estilos.destaqueTitulo}>Fixar em destaque</Text>
          <Text style={estilos.destaqueTexto}>Aparece no topo do feed de todos os moradores.</Text>
        </View>
        <Switch
          value={form.destacado}
          onValueChange={(v) => setForm({ ...form, destacado: v })}
          trackColor={{ true: cores.asfalto, false: cores.linhaForte }}
          thumbColor={form.destacado ? cores.amarelo : cores.branco}
          accessibilityLabel="Fixar em destaque"
        />
      </View>
    </TelaFormulario>
  );
}

const estilos = StyleSheet.create({
  destaque: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: cores.branco,
    borderRadius: raio.lg,
    borderWidth: 1.5,
    borderColor: cores.linha,
    padding: 14,
  },
  destaqueTitulo: { fontFamily: fontes.textoBold, fontSize: 14, color: cores.tinta },
  destaqueTexto: { fontFamily: fontes.texto, fontSize: 12, color: cores.suave },
});
