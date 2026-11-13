import { forwardRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { Pressionavel } from './Pressionavel';
import { cores, fontes, raio } from '../theme';

export const Campo = forwardRef(function Campo(
  { rotulo, erro, maximo, valor, aoMudar, senha, multilinha, style, ...props },
  ref
) {
  const foco = useSharedValue(0);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const estiloBorda = useAnimatedStyle(() => ({
    borderColor: erro ? cores.perigo : interpolateColor(foco.value, [0, 1], [cores.linhaForte, cores.asfalto]),
    shadowOpacity: foco.value * 0.5,
  }));

  return (
    <View style={[estilos.grupo, style]}>
      <View style={estilos.topo}>
        <Text style={estilos.rotulo}>{rotulo}</Text>
        {maximo ? (
          <Text style={estilos.contador}>
            {valor?.length ?? 0}/{maximo}
          </Text>
        ) : null}
      </View>
      <Animated.View style={[estilos.caixa, multilinha && estilos.caixaMultilinha, estiloBorda]}>
        <TextInput
          ref={ref}
          {...props}
          value={valor}
          onChangeText={aoMudar}
          maxLength={maximo}
          multiline={multilinha}
          secureTextEntry={senha && !mostrarSenha}
          accessibilityLabel={rotulo}
          placeholderTextColor="#8A8F99"
          onFocus={(e) => {
            foco.value = withTiming(1, { duration: 160 });
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            foco.value = withTiming(0, { duration: 160 });
            props.onBlur?.(e);
          }}
          style={[estilos.input, multilinha && estilos.inputMultilinha]}
        />
        {senha ? (
          <Pressionavel
            onPress={() => setMostrarSenha((m) => !m)}
            accessibilityLabel={mostrarSenha ? 'Esconder senha' : 'Mostrar senha'}
            style={estilos.olho}
          >
            <Feather name={mostrarSenha ? 'eye-off' : 'eye'} size={20} color={cores.suave} />
          </Pressionavel>
        ) : null}
      </Animated.View>
      {erro ? <Text style={estilos.erro}>{erro}</Text> : null}
    </View>
  );
});

const estilos = StyleSheet.create({
  grupo: { gap: 6 },
  topo: { flexDirection: 'row', justifyContent: 'space-between' },
  rotulo: { fontFamily: fontes.textoSemi, fontSize: 13, color: cores.tinta },
  contador: { fontFamily: fontes.texto, fontSize: 12, color: cores.suave },
  caixa: {
    minHeight: 52,
    borderRadius: raio.md,
    borderWidth: 1.5,
    backgroundColor: cores.branco,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: cores.amarelo,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  caixaMultilinha: { alignItems: 'flex-start' },
  input: { flex: 1, paddingHorizontal: 16, fontFamily: fontes.texto, fontSize: 15, color: cores.tinta, minHeight: 50 },
  inputMultilinha: { minHeight: 110, paddingTop: 14, textAlignVertical: 'top' },
  olho: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  erro: { fontFamily: fontes.textoMedio, fontSize: 12, color: cores.perigo },
});
