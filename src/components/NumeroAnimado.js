import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

// Número que "sobe" de 0 até o valor (usado nos contadores da triagem).
export function NumeroAnimado({ valor = 0, duracao = 700, style }) {
  const reduzir = useReducedMotion();
  const [mostrado, setMostrado] = useState(reduzir ? valor : 0);

  useEffect(() => {
    if (reduzir) return setMostrado(valor);
    let quadro;
    const inicio = Date.now();
    const de = 0;
    const passo = () => {
      const t = Math.min(1, (Date.now() - inicio) / duracao);
      const suavizado = 1 - Math.pow(1 - t, 3);
      setMostrado(Math.round(de + (valor - de) * suavizado));
      if (t < 1) quadro = requestAnimationFrame(passo);
    };
    quadro = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(quadro);
  }, [valor, duracao, reduzir]);

  return <Text style={style}>{mostrado}</Text>;
}
