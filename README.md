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
| `--bordô`          | `#8B2E3A` | Primária / CTAs / divisores |
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
| Número WhatsApp real         | `.env → VITE_WHATSAPP_NUMBER` |
| Cidade / UF da loja física   | Home → seção Visite a loja   |
| Horário de atendimento       | Rodapé / loja física         |
| Chaves Mercado Pago          | `.env` (usar na Fase 4)      |
| Token Melhor Envio           | `.env` (usar na Fase 4)      |
| Fotos reais dos produtos     | `frontend/src/data/seed.ts`  |
