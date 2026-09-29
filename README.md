# Amorena — Moda Feminina

> Loja virtual completa, editorial e minimalista, construída em 6 fases.
> Slogan: *Amorena veste você*
> Loja física: Av. São José, 1261 · 1º andar

---

## 🏗️ Stack

| Camada        | Tecnologia                                                |
| ------------- | --------------------------------------------------------- |
| Frontend      | React 18 + Vite 5 + TypeScript + Tailwind CSS + React Router |
| Backend       | Java 21 + Spring Boot 3 (REST) + Spring Security + JWT + Spring Data JPA |
| Banco         | PostgreSQL 16 (via Docker Compose)                        |
| Migrations    | Flyway                                                    |
| Pagamento     | Mercado Pago (Pix + cartão em até 6x sem juros) + webhook |
| Frete         | Melhor Envio (cálculo por CEP)                            |
| Upload de img | Local (fácil troca para S3/Cloudinary)                    |

---

## 🚀 Como rodar (local)

### 1. Pré-requisitos
- **Node ≥ 20** + npm ou pnpm
- **JDK 21** (recomendado: Eclipse Temurin / Zulu)
- **Docker Desktop** (para o PostgreSQL)
- Copie `.env.example` para `.env` e preencha as variáveis de ambiente.
  As chaves de pagamento/frete podem ficar como `TODO_...` até a Fase 4.

### 2. Subir o banco de dados
```bash
docker compose up -d
```
- PostgreSQL fica em `localhost:5432`
- pgAdmin (opcional): `http://localhost:5050`

### 3. Rodar o **frontend** (FASE 1 — vitrine)
```bash
cd frontend
npm install
npm run dev
```
Abre em: **http://localhost:5173**

### 4. Rodar o **backend** (será possível a partir da FASE 2)
```bash
cd backend
./mvnw spring-boot:run      # Linux / Mac
mvnw.cmd spring-boot:run    # Windows
```
API roda em: **http://localhost:8080/api**

---

## ☁️ Deploy na Vercel (frontend SPA)

O repositório já está **pré-configurado para Vercel** com `vercel.json`
na raiz (monorepo) e dentro de `frontend/`. O arquivo de configuração
cuida do SPA Rewrite — sem ele a página dava 404 ao recarregar rotas como
`/loja/produto/vestido-midi-alfaiataria-bordo`.

### 1. Importar o projeto no painel Vercel
1. Acesse https://vercel.com/new
2. Importe o repo **Edblas/SiteGabi**
3. Tela "Configure Project":
   - **Framework Preset**: `Vite` (o `vercel.json` já força, mas confirme)
   - **Root Directory**: deixe vazio (`./`) — a config raiz já aponta
     comandos para a pasta `frontend/`
   - **Build Command**: `npm run build --prefix frontend` (auto-detectado)
   - **Output Directory**: `frontend/dist` (auto-detectado)
   - **Install Command**: `npm install --prefix frontend` (auto-detectado)

### 2. Variáveis de ambiente (painel Vercel → Project Settings → Environment Variables)

Copie os valores abaixo e marque **Production + Preview + Development**:

| Variável                  | Valor recomendado                      | Obrigatória p/ Fase 1 |
| ------------------------- | -------------------------------------- | :-------------------: |
| `VITE_WHATSAPP_NUMBER`    | `5535997061783`                        |           ✅           |
| `VITE_INSTAGRAM_URL`      | `https://instagram.com/amorena.conceito` |         ✅           |
| `VITE_LOJA_ENDERECO`      | `Av. São José, 1261 · 1º andar`        |           ✅           |
| `VITE_API_BASE_URL`       | `https://api.amorena.com.br/api` (FASE 2) |       ❌ (Fase 2)    |

> 💡 **As variáveis VITE_ são incorporadas no bundle no momento do build.**
> Sempre que alterar qualquer `VITE_*` no painel Vercel é preciso clicar em
> **"Redeploy"** (não precisa ser novo commit — botão "Redeploy" no Deploy).

### 3. Deploy
Clique em **Deploy**. O build deve terminar em ~30–60s, com saída assim:
```
✓ 60 modules transformed.
dist/index.html
dist/assets/index-....css   34 kB  gzip: 7 kB
dist/assets/index-....js   247 kB  gzip: 75 kB
```

### 4. Dominío personalizado (opcional)
Vercel → Project Settings → Domains → adicionar `amorena.com.br`
(ou `www.`). Configure os registros DNS conforme indicado e espere o
SSL automático provisionar.

---

## 🛟 Troubleshoot na Vercel

| Problema                                    | Solução                                                                     |
| ------------------------------------------- | --------------------------------------------------------------------------- |
| Refresco em `/loja` dá **404**              | Verificar `rewrites` em `vercel.json` (arquivo incluso).                   |
| WhatsApp abre com número `00000...`         | Verificar env `VITE_WHATSAPP_NUMBER` no painel → redeploy.                 |
| Foto hero em branco                         | Commit do `hero-landing.jpeg` em `frontend/public/hero-landing.jpeg`.       |
| `npm install` falha "no root package.json"  | Verificar Install Command no Vercel → `npm install --prefix frontend`.     |


---

## 📦 Estrutura de pastas

```
site/
├── docker-compose.yml          # PostgreSQL + pgAdmin
├── .env.example                # Template de variáveis de ambiente
├── README.md
├── frontend/                   # React + Vite + TS + Tailwind
│   └── src/
│       ├── pages/              # Home, Categoria, Produto, ...
│       ├── components/         # layout / home / product / category
│       ├── data/               # Seed mocado de produtos (Fase 1)
│       ├── types/              # Tipos TypeScript do domínio
│       └── routes/             # Config do React Router
└── backend/                    # Java 21 + Spring Boot 3
    ├── pom.xml
    └── src/main/
        ├── java/com/amorena/
        │   ├── AmorenaApplication.java
        │   ├── domain/         # entidades (Fase 2)
        │   ├── repository/     # Spring Data JPA (Fase 2)
        │   ├── service/        # regras de negócio (Fase 2)
        │   ├── dto/            # records / DTOs (Fase 2)
        │   ├── controller/     # REST API (Fase 2)
        │   └── config/         # Security, JWT, CORS (Fase 2)
        └── resources/
            ├── application.yml
            └── db/migration/   # Flyway SQLs (Fase 2)
```

---

## 🧱 Fases

- **[FASE 1] ✅ Base e vitrine** — Estrutura do projeto + páginas Home / Categoria / Produto + seed de 12 produtos com dados mocado (frontend standalone, sem backend ainda)
- **[FASE 2] ⏳ Backend e catálogo** — Entidades, API REST, validações, Flyway, testes
- **[FASE 3] ⏳ Carrinho e conta** — Carrinho drawer, auth JWT, cupons, 8% OFF 1ª compra
- **[FASE 4] ⏳ Frete e pagamento** — Melhor Envio + Mercado Pago + webhook + e-mail
- **[FASE 5] ⏳ Painel admin** — Gestão de produtos, pedidos, cupons e banners
- **[FASE 6] ⏳ Acabamento** — SEO, WebP, acessibilidade, institucionais, segurança, deploy

---

## 🎨 Identidade visual (valores de tokens)

Cores fixas (**não usar degradê, glassmorphism, nem roxo/azul**):

| Token              | Hex       | Uso                        |
| ------------------ | --------- | -------------------------- |
| `--bordô`          | `#581221` | Primária / CTAs / divisores (oxblood, pedido da dona) |
| `--bordô-soft`     | `#8B2E3A` | Acentos / badges / hover leve |
| `--creme`          | `#FBF6F2` | Fundo                      |
| `--marrom-vinho`   | `#2B1216` | Texto título / ênfase      |
| `--rosé-nude`      | `#E8CFC8` | Apoio / badges             |

- **Serifada (títulos)**: *Cormorant Garamond* — usar itálico para ênfase.
- **Corpo**: *Montserrat* weight 300 / 400.
- Textura sutil de papel no fundo (`.bg-paper`), divisores de 1px em bordô,
  numeração fina `01 · 02 · 03` nas seções, grade assimétrica na vitrine.

---

## 🔑 Placeholders / TODOs marcados

Até a próxima fase, os pontos abaixo estão **mockados**:

| Item                         | Onde                         |
| ---------------------------- | ---------------------------- |
| Foto hero real da landing    | `frontend/public/hero-landing.jpeg` |
| Link Grupo VIP WhatsApp      | `frontend/src/config/siteConfig.ts → vipGroupUrl` |
| Horário de atendimento real  | `Rodapé / loja física / siteConfig.store.hours` |
| OG Image 1200×630 p/ compartilhamento | `frontend/src/config/siteConfig.ts → seo.ogImageUrl` |
| Chaves Mercado Pago          | `.env` (usar na Fase 4)      |
| Token Melhor Envio           | `.env` (usar na Fase 4)      |
| Fotos reais dos produtos     | `frontend/src/data/seed.ts`  |
