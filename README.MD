# 📍 RootFix · App Mobile

App React Native (Expo) do **RootFix**, a zeladoria urbana por comunidade: o morador relata, a vizinhança apoia, a IA prioriza e o gestor resolve.

Global Solution 2026/2 · FIAP · tema **CitizenTech** · grupo **Rooted** · disciplina **Mobile Application Development**

Consome a API Java: https://github.com/joaocaetano1310/Rootfix_Java (no ar em https://rootfix-java.onrender.com)

## 👥 Integrantes

| Integrante | Responsabilidade |
|---|---|
| João Victor Caetano · RM 562074 | API Java e DevOps |
| João Victor Bueno Castelini | IA e QA |
| Felipe Furlanetto | App Mobile |
| Raul Rezende | Banco de dados |
| Ryan Vetoriano | API .NET |

## ✅ Requisitos da disciplina

| # | Requisito | Onde está |
|---|---|---|
| 01 | 6+ telas com navegação | 16 telas com **Expo Router** (Stack + Tabs), pasta `app/` |
| 02 | CRUD com a API Java (Axios) | **Problema**: `POST` multipart, `GET` feed/detalhe, `PUT` editar, `DELETE` excluir (`src/features/problemas/problemasApi.js`). Também há CRUD de **Comunicados** para o gestor |
| 03 | Autenticação | `POST /auth/login` e cadastros → JWT salvo no `expo-secure-store`, enviado pelo interceptor do Axios; 401 desloga. Rotas protegidas com `Stack.Protected` |
| 04 | Estilização | Paleta própria (asfalto + amarelo de faixa), fontes Archivo e Inter, ícone, splash e logo próprios (`assets/`) |
| 05 | Arquitetura | Separação por *feature* (ver abaixo) |
| 06 | Vídeo | _link a preencher_ |
| 07 | Publicação | _link a preencher_ (ver "Publicar") |

## 📱 Telas

**Entrada:** boas-vindas (carrossel animado) · login (com acesso rápido da demo) · cadastro de morador · cadastro de gestor (já cria a 1ª comunidade)

**Morador (abas):** Feed da comunidade · Mapa de comunidades a até 3 km · Avisos · Perfil · botão central **Publicar**

**Gestor (abas):** Triagem da IA · Comunidades · Avisos · Perfil

**Telas empilhadas:** detalhe do problema · publicar problema · editar problema · comunidade (gestor) · nova comunidade · novo comunicado · editar comunicado

## ✨ Animações (Reanimated 4 + Gesture Handler)

- Botões e cards "afundam" ao toque com mola; vibração leve (`expo-haptics`)
- Cards do feed entram em cascata; listas com *skeleton* pulsando enquanto carregam
- **Apoiar**: ícone pula, o número rola para cima/baixo, atualização otimista
- **IA analisando**: linha amarela de "scan" desce sobre a foto até o Gemini responder (o app consulta a API a cada 4 s); o selo de gravidade entra com *pop* e o medidor acende segmento por segmento
- Detalhe com foto em *parallax*
- Avisos: arraste para a esquerda para excluir
- Triagem: contadores sobem de 0 ao valor; card adotado sai para a direita
- Tela "acordando o servidor" com a rua andando (o Render gratuito dorme depois de 15 min)
- Respeita "Reduzir movimento" do sistema

## 🗂️ Estrutura

```
app/                      rotas (Expo Router)
  _layout.js              providers, fontes, splash, rotas protegidas
  index.js                redireciona por perfil
  (auth)/                 boas-vindas, login, cadastros
  (abas)/                 feed, triagem, comunidades, avisos, perfil
  problema/               [id], novo, editar
  comunidade/             [id], nova
  comunicado/             novo, editar
src/
  config.js               URL da API
  services/               api.js (Axios + JWT), sessao.js (SecureStore)
  features/
    auth/                 AuthContext, chamadas de login/cadastro
    problemas/            API, hooks (TanStack Query) e componentes
    comunidades/          API, hooks, comunidade atual, card
    comunicados/          API, hooks, card e formulário
    notificacoes/         API, hooks e item com swipe
  components/             Botao, Campo, Cabecalho, BarraDeAbas, Mapa...
  hooks/                  useLocalizacao (GPS + endereço)
  theme/                  cores, tipografia, espaçamentos, molas
  utils/                  datas, status, distância
assets/                   ícone, splash, logo
```

## 🚀 Como rodar

Pré-requisitos: Node 20+ e o app **Expo Go** no celular.

```bash
npm install
npx expo start
```

Leia o QR code com o Expo Go. Por padrão o app usa a API no Render. Para usar a API rodando no seu PC, crie um `.env`:

```
EXPO_PUBLIC_API_URL=http://SEU_IP_NA_REDE:8080
```

(no celular, `localhost` é o próprio celular; use o IP do PC, ex.: `192.168.0.10`)

### Usuários de teste (criados pela API Java)

| Perfil | E-mail | Senha |
|---|---|---|
| Morador | `morador@rootfix.com` | `Rootfix@2026` |
| Gestor | `gestor@rootfix.com` | `Rootfix@2026` |

Na tela de login há os botões **Morador** e **Gestor** que entram direto com essas contas.

## 📦 Publicar

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build -p android --profile preview   # gera um APK para instalar
```

Para o mapa funcionar no APK do Android é preciso uma chave do Google Maps em `app.json` (`android.config.googleMaps.apiKey`). No Expo Go funciona sem chave.

## 🛠️ Tecnologias

Expo SDK 57 · React Native 0.86 · Expo Router 57 · Axios · TanStack Query 5 · Reanimated 4 · Gesture Handler · expo-secure-store · expo-image-picker · expo-location · react-native-maps · expo-image · expo-haptics · Archivo + Inter (Google Fonts)
