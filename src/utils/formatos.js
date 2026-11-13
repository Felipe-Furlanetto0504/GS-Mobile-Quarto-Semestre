// A API manda LocalDateTime sem fuso ("2026-11-11T20:15:00"), no horário de São Paulo.
export function paraData(valor) {
  if (!valor) return null;
  const temFuso = /[zZ]|[+-]\d{2}:?\d{2}$/.test(valor);
  return new Date(temFuso ? valor : `${valor}-03:00`);
}

export function tempoRelativo(valor) {
  const data = paraData(valor);
  if (!data) return '';
  const seg = Math.max(0, Math.round((Date.now() - data.getTime()) / 1000));
  if (seg < 60) return 'agora';
  const min = Math.round(seg / 60);
  if (min < 60) return `há ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `há ${h} h`;
  const d = Math.round(h / 24);
  if (d === 1) return 'ontem';
  if (d < 30) return `há ${d} dias`;
  return data.toLocaleDateString('pt-BR');
}

// Juntando "adotado" (Java) com "status" (alterado pelo painel .NET).
export function situacaoDoProblema(problema) {
  if (!problema?.adotado) return { rotulo: 'Aguardando gestor', etapa: 0 };
  switch (problema.status) {
    case 'EM_ANDAMENTO':
      return { rotulo: 'Em andamento', etapa: 2 };
    case 'RESOLVIDO':
      return { rotulo: 'Resolvido', etapa: 3 };
    case 'ARQUIVADO':
      return { rotulo: 'Arquivado', etapa: 3 };
    default:
      return { rotulo: 'Adotado', etapa: 1 };
  }
}

export function plural(n, singular, pluralTexto) {
  return `${n} ${n === 1 ? singular : pluralTexto}`;
}

export function distancia(km) {
  if (km == null) return '';
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1).replace('.', ',')} km`;
}
