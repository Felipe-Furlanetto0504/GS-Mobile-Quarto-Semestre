import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

export function NumeroAnimado({ valor = 0, duracao = 700, style }) {
  const reduzir = useReducedMotion();
  const [mostrado, setMostrado] = useState(0);

  useEffect(() => {
    if (reduzir) return;
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

  return <Text style={style}>{reduzir ? valor : mostrado}</Text>;
}
