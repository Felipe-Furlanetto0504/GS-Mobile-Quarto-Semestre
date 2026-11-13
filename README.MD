# 📍 RootFix Mobile

Aplicativo mobile de **zeladoria urbana por comunidade**: o morador fotografa um problema na rua (buraco, lâmpada queimada, lixo acumulado), a vizinhança apoia, a IA classifica a gravidade e o gestor da comunidade adota e acompanha a resolução. Os dados vêm de uma API REST real em Java/Spring Boot, com autenticação JWT.

Desenvolvido para **Mobile Application Development** — FIAP · **Global Solution 2026/2**, tema **CitizenTech** · grupo **Rooted**.

## 📋 Índice

- [Instalar o app publicado](#-instalar-o-app-publicado)
- [Vídeo](#-vídeo)
- [Requisitos da disciplina](#-requisitos-da-disciplina)
- [Sobre o projeto](#-sobre-o-projeto)
- [Fluxo de um problema](#-fluxo-de-um-problema)
- [Avisos](#-avisos)
- [Telas](#-telas)
- [Animações](#-animações)
- [Arquitetura](#-arquitetura)
- [Integração com a API](#-integração-com-a-api)
- [Tecnologias](#️-tecnologias)
- [Como executar localmente](#-como-executar-localmente)
- [Lint e formatação](#-lint-e-formatação)
- [Gerar o APK](#-gerar-o-apk)
- [Integrantes](#-integrantes)

## 📲 Instalar o app publicado

O app está publicado no **Firebase App Distribution**.

| | |
|---|---|
| Link de instalação | **LINK_DO_FIREBASE** |
| Versão | 1.0.0 |
| Plataforma | Android (APK) |
| Commit de referência | [`2ba29b4`](https://github.com/Felipe-Furlanetto0504/GS-Mobile-Quarto-Semestre/commit/2ba29b432e3a4f07529746197e98cdf3ca9d6c5f) |

1. Abra o link de instalação no celular Android (ou o convite recebido por e-mail) e entre com a conta Google cadastrada como tester.
2. Baixe o APK e, se o Android pedir, permita a instalação de apps desta fonte.
3. Abra o app e entre com uma das [contas de teste](#contas-de-teste).

> **Conferir a versão:** em **Perfil → Sobre o App** aparece o hash do commit usado no build. Ele deve ser o mesmo da tabela acima. Os commits posteriores a ele alteram apenas a documentação (README), não o código do app.

> **Primeiro acesso do dia:** a API roda no plano gratuito do Render, que desliga o servidor depois de 15 minutos parado. Ao abrir, o app chama `/actuator/health` e mostra a tela **"Acordando o servidor"** (com a rua andando) até a API responder, o que pode levar até 1 minuto. Depois disso as ações são rápidas.

## 🎥 Vídeo

📺 **Demonstração do RootFix:** LINK_DO_YOUTUBE

O vídeo (até 5 minutos) mostra cadastro e login, navegação entre as telas, o CRUD de problemas e de comunicados, a tela "Sobre o App" e o logout.

## ✅ Requisitos da disciplina

| # | Requisito | O que foi feito |
|---|---|---|
| 01 | Telas e navegação | 16 telas com **Expo Router** (Stack + Tabs), separadas por perfil: abas do morador e abas do gestor (fora a tela "Sobre o App"). |
| 02 | CRUD com a API | **Problema**: `POST` multipart com foto, `GET` do feed e do detalhe, `PUT` para editar e `DELETE` para excluir, tudo com **Axios**. O gestor também tem CRUD de **Comunicados**. |
| 03 | Autenticação | Login e cadastros na API Java, que devolve um **JWT**. O token fica no `expo-secure-store` e vai em toda requisição pelo interceptor do Axios. Quando a API responde 401, o app desloga. As rotas internas usam `Stack.Protected`. |
| 04 | Estilização | Identidade própria (asfalto + amarelo de faixa de pedestre), fontes **Archivo** e **Inter**, ícone, splash e logo próprios. |
| 05 | Arquitetura | Separação por *feature*: cada domínio tem a sua API, os seus hooks (TanStack Query) e os seus componentes. Nenhuma tela chama HTTP diretamente. Código padronizado com **ESLint** (`eslint-config-expo`) e **Prettier**. |
| 06 | Vídeo | Demonstração de todas as funcionalidades em até 5 minutos, no YouTube: [ver seção Vídeo](#-vídeo). |
| 07 | Publicação | APK publicado no **Firebase App Distribution**, com o professor como tester. A tela **Sobre o App** mostra o hash do commit de referência do build. |

## 📱 Sobre o projeto

**Problema:** quem mora num bairro vê o mesmo buraco, o mesmo poste apagado e o mesmo entulho por semanas. A reclamação some num grupo de mensagens ou num protocolo da prefeitura, ninguém sabe se alguém já avisou, e o responsável não tem como saber o que é mais urgente.

**Solução:** o RootFix organiza a zeladoria por **comunidade**. O morador entra nas comunidades a até 3 km de casa e publica o problema com foto e localização. Os vizinhos apoiam ("também sofri com isso") e comentam. Uma IA (Gemini, chamada pela API Java) lê a foto e dá a gravidade. O gestor da comunidade vê tudo numa fila de triagem ordenada e adota o que vai resolver. O andamento aparece para todo mundo numa linha do tempo.

### Perfis

| | 🏠 Morador | 🏛️ Gestor |
|---|---|---|
| Cadastro | Nome, e-mail, senha e endereço (vira coordenada) | Nome, e-mail, senha, organização e **a primeira comunidade** |
| Comunidades | Entra e sai das comunidades próximas | Cria e gerencia as suas comunidades |
| Problemas | Publica, edita e exclui os seus (antes da adoção), apoia e comenta | Vê a triagem da IA, adota e pede reclassificação |
| Comunicados | Lê | Publica, edita e exclui |

## 🔄 Fluxo de um problema

```
Morador fotografa o problema e publica  (POST multipart com foto + GPS)
        │
        ▼
App abre o detalhe com a linha amarela "escaneando" a foto
        │
        ▼
API Java manda a foto para a IA (Gemini)
App pergunta de novo a cada 4 s  (useProblema → refetchInterval)
        │
        ▼
Gravidade chega → selo entra com "pop" e o medidor acende
        │
        ▼
Vizinhos apoiam e comentam no feed da comunidade
        │
        ▼
Gestor vê o problema na Triagem e adota
        │
        ▼
Status é atualizado no painel .NET → linha do tempo no app
```

| Etapa na linha do tempo | Origem |
|---|---|
| Aguardando gestor | Problema publicado, ainda não adotado |
| Adotado | Gestor adotou na API Java |
| Em andamento | Status alterado no painel .NET |
| Resolvido / Arquivado | Status alterado no painel .NET |

| Gravidade (IA) | Nível no medidor |
|---|---|
| 🟥 Crítica | 4 |
| 🟧 Alta | 3 |
| 🟨 Média | 2 |
| 🟩 Baixa | 1 |

O autor só pode editar ou excluir o problema **antes da adoção**. Depois que o gestor adota, o registro fica fixo.

## 🔔 Avisos

Os avisos são gerados pelo backend quando algo acontece com um problema ou uma comunidade, e o app busca a lista a cada **30 s** (`useNotificacoes`).

- Um contador de não lidos aparece no ícone da aba **Avisos**.
- Os avisos de prioridade alta ganham destaque visual.
- A lista é separada em **Hoje** e **Antes**.
- Tocar num aviso marca como lido e abre o problema relacionado.
- Arrastar para a esquerda exclui o aviso. Também dá para limpar todos os já lidos de uma vez.

## 📺 Telas

### 🔐 Entrada
- **Boas-vindas:** carrossel animado apresentando o app.
- **Login:** com os atalhos **Morador** e **Gestor**, que entram direto nas contas de teste. O formulário "balança" quando a senha está errada.
- **Cadastro de morador:** endereço digitado ou pelo botão **Usar meu GPS**, com pino ajustável no mapa. Essa coordenada define quais comunidades aparecem como próximas.
- **Cadastro de gestor:** cria a conta e a primeira comunidade (com posição no mapa) no mesmo passo.
- A sessão fica salva no aparelho e expira junto com o JWT.

### 🏠 Morador (abas)
- **Feed:** problemas da comunidade atual, paginados, ordenados por *recentes*, *mais apoiados* ou *gravidade*, e uma aba com os comunicados do gestor. Uma folha de baixo troca de comunidade.
- **Comunidades:** mapa com o raio de 3 km a partir do endereço cadastrado e lista das comunidades próximas, com distância e opção de entrar ou sair.
- **➕ Publicar** (botão amarelo no meio da barra): foto pela câmera ou galeria, título, descrição e local pelo GPS, com pino arrastável no mapa.
- **Avisos** e **Perfil**.

### 🏛️ Gestor (abas)
- **Triagem:** fila da IA com contadores animados. O gestor **adota** o problema (o card sai para a direita) ou pede **reclassificação** para a IA.
- **Comunidades:** as que ele gerencia, mais o botão de criar uma nova.
- **Avisos** e **Perfil**.

### 📄 Telas empilhadas
- **Detalhe do problema:** foto em parallax, análise da IA (medidor de 4 níveis + justificativa), linha do tempo, apoios e observações.
- **Publicar problema** e **Editar problema**.
- **Comunidade (gestor):** feed completo e comunicados com CRUD.
- **Nova comunidade.**
- **Novo comunicado** e **Editar comunicado** (com opção de destacar).

### 👤 Perfil
- Avatar com as iniciais, perfil (morador ou gestor), e-mail, organização e endereço.
- Quantidade de comunidades em que participa ou que gerencia.
- Endereço da API em uso e versão do app.
- Atalho para **Sobre o App**.
- Sair da conta.

### ℹ️ Sobre o App
- Versão do app e **hash do commit** usado no build, com link para o commit no GitHub.
- Disciplina, entrega, endereço da API e integrantes do grupo.
- O hash é gravado no build pelo `app.config.js` (variável `EAS_BUILD_GIT_COMMIT_HASH` no EAS Build, ou `git rev-parse HEAD` localmente).

## ✨ Animações

Feitas com **Reanimated 4** e **Gesture Handler**:

- Botões e cards "afundam" ao toque com efeito de mola, com vibração leve (`expo-haptics`).
- Cards do feed entram em cascata. Enquanto carregam, as listas mostram um *skeleton* pulsando.
- **Apoiar:** o ícone pula, o número rola para cima ou para baixo e a contagem muda na hora (atualização otimista).
- **IA analisando:** uma linha amarela de *scan* desce sobre a foto até a gravidade chegar.
- Detalhe com foto em **parallax**.
- Na triagem, os contadores sobem de 0 até o valor e o card adotado sai para a direita.
- Tela "acordando o servidor" com a rua andando.
- Todas respeitam a opção **Reduzir movimento** do sistema.

## 🧱 Arquitetura

As telas só cuidam da interface. Toda chamada à API passa pelos hooks e pelo cliente HTTP:

```
app/ (telas)  →  features/*/use*.js  →  features/*/*Api.js  →  services/api.js  →  API Java (Render)
     UI          estado e cache          endpoints de cada       Axios + JWT
                 (TanStack Query)        domínio
```

```
rootfix-mobile/
├── app/                              # Rotas (Expo Router): cada arquivo é uma tela
│   ├── _layout.js                    # Providers, fontes, splash, servidor acordando, rotas protegidas
│   ├── index.js                      # Manda cada perfil para a sua primeira tela
│   ├── sobre.js                      # Sobre o App: versão e hash do commit do build
│   ├── (auth)/                       # boas-vindas, login, cadastro-morador, cadastro-gestor
│   ├── (abas)/                       # feed, triagem, comunidades, avisos, perfil
│   ├── problema/                     # [id] (detalhe), novo, editar
│   ├── comunidade/                   # [id] (visão do gestor), nova
│   └── comunicado/                   # novo, editar
│
├── src/
│   ├── config.js                     # URL da API (troca pelo .env) e tempo limite
│   ├── services/
│   │   ├── api.js                    # Axios: token JWT, 401 desloga, mensagens de erro do Spring
│   │   └── sessao.js                 # Sessão no SecureStore (localStorage no expo web)
│   │
│   ├── features/
│   │   ├── auth/                     # AuthContext + login e cadastros
│   │   ├── problemas/                # API, hooks e componentes: card, foto, análise da IA,
│   │   │                             # selo de gravidade, linha do tempo, botão de apoio, feed
│   │   ├── comunidades/              # API, hooks, comunidade atual e card
│   │   ├── comunicados/              # API, hooks, card e formulário
│   │   └── notificacoes/             # API, hooks e item com arrastar para excluir
│   │
│   ├── components/                   # Botao, Campo, Cabecalho, BarraDeAbas, Mapa (+ versão web),
│   │                                 # SeletorDeLocal, Segmentos, Estados, NumeroAnimado...
│   ├── hooks/
│   │   └── useLocalizacao.js         # GPS do aparelho e conversão endereço ↔ coordenadas
│   ├── theme/                        # Cores, tipografia, espaçamentos e molas das animações
│   └── utils/
│       └── formatos.js               # Datas relativas, situação do problema, distância
│
├── assets/                           # Ícone, splash, ícone adaptativo e logo
├── app.json                          # Configuração do Expo (pacote, plugins e permissões)
├── app.config.js                     # Acrescenta o hash do commit à configuração do build
├── eas.json                          # Perfis do EAS Build (APK de distribuição)
├── eslint.config.js                  # ESLint (eslint-config-expo + Prettier)
└── .prettierrc                       # Regras de formatação
```

## 🔗 Integração com a API

**Backend:** [Rootfix_Java](https://github.com/joaocaetano1310/Rootfix_Java) (Java + Spring Boot, Spring Security + JWT, Oracle), publicado em **https://rootfix-java.onrender.com**.

| Recurso | Endpoints usados pelo app |
|---|---|
| Autenticação | `POST /auth/login` · `POST /auth/registro/morador` · `POST /auth/registro/gestor` · `GET /usuarios/me` |
| Comunidades | `GET /comunidades/proximas` · `GET /usuarios/me/comunidades` · `GET /comunidades/{id}` · `POST /comunidades` · `POST` · `DELETE /comunidades/{id}/membros` |
| Problemas | `GET` · `POST /comunidades/{id}/problemas` · `GET` · `PUT` · `DELETE /problemas/{id}` · `GET /problemas/{id}/foto` |
| Apoios e observações | `POST /problemas/{id}/apoios` · `GET` · `POST /problemas/{id}/observacoes` · `DELETE /observacoes/{id}` |
| Gestor | `GET /triagem` · `POST /problemas/{id}/adotar` · `POST /problemas/{id}/reclassificar` · `GET /comunidades/{id}/supervisionados` |
| Comunicados | `GET` · `POST /comunidades/{id}/comunicados` · `PUT` · `DELETE /comunicados/{id}` |
| Avisos | `GET /notificacoes` · `PATCH /notificacoes/{id}/lida` · `DELETE /notificacoes/{id}` · `DELETE /notificacoes/lidas` |
| Saúde | `GET /actuator/health` (acordar o servidor) |

Todas as rotas, exceto login, cadastro e saúde, exigem o header `Authorization: Bearer <token>`. Os erros de validação do Bean Validation aparecem embaixo de cada campo do formulário.

## 🛠️ Tecnologias

| Tecnologia | Uso |
|---|---|
| React Native 0.86 + Expo SDK 57 | App mobile |
| Expo Router 57 | Rotas por arquivo, Stack + Tabs e `Stack.Protected` |
| Axios | Cliente HTTP com interceptor de JWT |
| TanStack Query 5 | Cache, paginação infinita, atualização otimista e consulta repetida |
| Reanimated 4 + Gesture Handler | Animações e gestos (arrastar, parallax, molas) |
| expo-secure-store | Token JWT guardado de forma segura |
| expo-image-picker | Foto do problema (câmera ou galeria) |
| expo-location | GPS e conversão endereço ↔ coordenadas |
| react-native-maps | Mapa das comunidades e pino do problema |
| expo-image | Foto do problema com cache e header de autenticação |
| expo-haptics | Vibração ao tocar |
| Archivo + Inter (Google Fonts) | Tipografia |
| EAS Build | Geração do APK |
| Firebase App Distribution | Distribuição do APK para os testers |
| ESLint + Prettier | Padronização e formatação do código |

## 💻 Como executar localmente

Pré-requisitos: Node.js 20+ e o app **Expo Go** no celular (ou um emulador Android).

```bash
git clone https://github.com/Felipe-Furlanetto0504/GS-Mobile-Quarto-Semestre.git
cd GS-Mobile-Quarto-Semestre
npm install
npx expo start -c
```

Escaneie o QR code com o Expo Go. Por padrão o app usa a API publicada no Render.

### Contas de teste

Criadas automaticamente pela API Java:

| Perfil | E-mail | Senha |
|---|---|---|
| Morador | `morador@rootfix.com` | `Rootfix@2026` |
| Gestor | `gestor@rootfix.com` | `Rootfix@2026` |

Na tela de login, os botões **Morador** e **Gestor** entram direto com essas contas.

## 🧹 Lint e formatação

```bash
npm run lint          # ESLint (regras do Expo + Prettier)
npm run lint:fix      # corrige o que for automático
npm run format        # formata todos os arquivos com Prettier
npm run format:check  # só confere a formatação
```

O `.gitattributes` mantém as quebras de linha em LF em qualquer sistema operacional, para o Prettier não acusar diferença no Windows.

## 📦 Gerar o APK

```bash
npx eas-cli login
npx eas-cli build -p android --profile preview
```

O perfil `preview` do `eas.json` gera um `.apk` de distribuição interna. O `requireCommit` impede o build com alterações não commitadas, garantindo que o hash mostrado em **Sobre o App** corresponda ao código do repositório. O APK gerado é publicado no Firebase App Distribution.

## 👥 Integrantes

| Nome | RM |
|---|---|
| Felipe Furlanetto | RM562766 |
| João Victor Caetano Alves da Silva | RM562074 |
| João Victor Bueno Castelini da Silva | RM564115 |
| Raul Rezende Iemini Aguiar | RM564002 |
| Ryan Victor da Silva Vetoriano | RM565667 |
