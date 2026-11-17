import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { cores, raio } from '../theme';

function montarHtml({ centro, marcadores, raioKm, arrastavel }) {
  const delta = raioKm ? (raioKm / 111) * 2.6 : 0.008;
  const dados = JSON.stringify({
    centro,
    delta,
    raioKm: raioKm || 0,
    arrastavel,
    marcadores: marcadores.map((m) => ({
      id: m.id,
      lat: Number(m.latitude),
      lng: Number(m.longitude),
      titulo: m.titulo || '',
      descricao: m.descricao || '',
      cor: m.destaque ? cores.amarelo : cores.asfalto,
    })),
    corLinha: cores.asfalto,
  });

  return `<!DOCTYPE html>
<html><head>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
  html, body, #mapa { margin: 0; height: 100%; background: #E3E5DD; }
  .pino { width: 18px; height: 18px; border-radius: 50%; border: 3px solid #fff;
          box-shadow: 0 1px 4px rgba(0,0,0,.4); box-sizing: border-box; }
  .leaflet-popup-content { font-family: sans-serif; font-size: 13px; }
</style>
</head><body>
<div id="mapa"></div>
<script>
  var d = ${dados};
  function enviar(msg) { window.ReactNativeWebView.postMessage(JSON.stringify(msg)); }

  var c = [d.centro.latitude, d.centro.longitude];
  var mapa = L.map('mapa', { zoomControl: false, attributionControl: true })
    .fitBounds([[c[0] - d.delta / 2, c[1] - d.delta / 2], [c[0] + d.delta / 2, c[1] + d.delta / 2]]);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap &copy; CARTO'
  }).addTo(mapa);

  if (d.raioKm) {
    L.circle(c, { radius: d.raioKm * 1000, color: d.corLinha, weight: 2,
                  fillColor: '#FFC93C', fillOpacity: 0.18 }).addTo(mapa);
  }

  d.marcadores.forEach(function (m) {
    var icone = L.divIcon({ className: '', iconSize: [18, 18], iconAnchor: [9, 9],
      html: '<div class="pino" style="background:' + m.cor + '"></div>' });
    var marcador = L.marker([m.lat, m.lng], { icon: icone, draggable: d.arrastavel }).addTo(mapa);
    if (m.titulo) {
      var conteudo = document.createElement('div');
      conteudo.innerHTML = '<b></b><br/><span></span>';
      conteudo.querySelector('b').textContent = m.titulo;
      conteudo.querySelector('span').textContent = m.descricao;
      conteudo.onclick = function () { enviar({ tipo: 'marcador', id: m.id }); };
      marcador.bindPopup(conteudo);
    }
    marcador.on('dragend', function (e) {
      var p = e.target.getLatLng();
      enviar({ tipo: 'mover', latitude: p.lat, longitude: p.lng });
    });
  });

  if (d.arrastavel) {
    mapa.on('click', function (e) {
      enviar({ tipo: 'mover', latitude: e.latlng.lat, longitude: e.latlng.lng });
    });
  }
</script>
</body></html>`;
}

export function Mapa({
  centro,
  marcadores = [],
  raioKm,
  altura = 200,
  aoMoverPino,
  aoTocarMarcador,
  style,
}) {
  const valido =
    centro && Number.isFinite(Number(centro.latitude)) && Number.isFinite(Number(centro.longitude));

  const chave = JSON.stringify([centro, marcadores, raioKm]);
  const html = useMemo(
    () =>
      valido
        ? montarHtml({
            centro: { latitude: Number(centro.latitude), longitude: Number(centro.longitude) },
            marcadores: marcadores.filter(
              (m) => Number.isFinite(Number(m.latitude)) && Number.isFinite(Number(m.longitude))
            ),
            raioKm,
            arrastavel: !!aoMoverPino,
          })
        : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chave, valido, !!aoMoverPino]
  );

  if (!html) return <View style={[estilos.caixa, { height: altura }, style]} />;

  const aoReceber = (e) => {
    let msg;
    try {
      msg = JSON.parse(e.nativeEvent.data);
    } catch {
      return;
    }
    if (msg.tipo === 'mover' && aoMoverPino) {
      aoMoverPino({ latitude: msg.latitude, longitude: msg.longitude });
    } else if (msg.tipo === 'marcador' && aoTocarMarcador) {
      const m = marcadores.find((x) => String(x.id) === String(msg.id));
      if (m) aoTocarMarcador(m);
    }
  };

  return (
    <View style={[estilos.caixa, { height: altura }, style]}>
      <WebView
        originWhitelist={['*']}
        source={{ html, baseUrl: 'https://rootfix.app/' }}
        onMessage={aoReceber}
        style={estilos.web}
        nestedScrollEnabled
        scrollEnabled={false}
        setBuiltInZoomControls={false}
        javaScriptEnabled
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  caixa: { borderRadius: raio.xl, overflow: 'hidden', backgroundColor: '#E3E5DD' },
  web: { flex: 1, backgroundColor: '#E3E5DD' },
});