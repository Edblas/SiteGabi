# Amorena — Moda Feminina: Coleção por Setor + Carrinho (PRD)

## Overview
- **Summary**: (A) Reorganizar o ponto de entrada "Comprar coleção" (Hero Home) para mostrar os setores da coleção em uma página dedicada de cards grandes, editoriais, *tipo Pinterest*, e remover a categoria "Bazar" de TODO o site; (B) Implementar estado global de carrinho (persistente em `localStorage`), drawer lateral estilo Mercado Livre, badge no ícone da sacola, integração real com os botões "Adicionar ao carrinho" (produto e QuickView), e finalização agregada para WhatsApp (lista de itens + subtotal + observação de frete, gerando uma única mensagem para a Gabi).
- **Purpose**: Transformar a vitrine atual (WhatsApp por produto, sem memória) em um fluxo de compra real no site: a cliente explora por setor, adiciona quantas peças quiser, vê o total e finaliza tudo em 1 mensagem para a Gabi, igual no Mercado Livre.
- **Target Users**: Visitante mulher 25–55 anos, chega do Instagram `/`, entra na loja `/loja`, navega coleção, monta carrinho com 2–6 peças e fecha em 1 clique.

## Goals
- [Goal 1] **Hero "Comprar coleção" leva a uma página `/loja/colecao`** com 6 categorias (setores) em cards grandes editoriais, SEM BAZAR — substituindo o redirecionamento hard-coded para `/categoria/vestidos`.
- [Goal 2] **Remover a categoria Bazar de TODOS os lugares do site**: Navbar (desktop e mobile), CategoryList, seed de categorias, produto seed existente de Bazar realocar para categoria equivalente ou arquivar, texto de SEO que menciona "bazar", rodape, hero "Ver conjuntos" continuar funcionando.
- [Goal 3] **Carrinho funcional estilo Mercado Livre**: estado global, drawer lateral (abre ao clicar na sacola do Navbar / "Adicionar ao carrinho" com sucesso), mostra linha por item com foto pequena, nome, cor, tamanho, qtd editável, valor unitário, valor por item, subtotal, placeholder de valor de frete (0 ou "calcular depois"), total geral, botão "Continuar comprando" (fecha drawer) e botão "Finalizar compra" (gera 1 mensagem WhatsApp completa e abre `wa.me`).
- [Goal 4] **Integração 100% dos CTAs de adicionar**: em ProductPage e ProductQuickView, clicar em "Adicionar ao carrinho" adiciona item real com SKU/cor/tamanho ao invés de `alert('Fase 3')`.
- [Goal 5] **Persistência e acessibilidade**: carrinho sobrevive a reload (localStorage `amorena:cart`), badge da sacola no Navbar mostra qtd real de itens, foco visível no drawer, contraste AAA em botões, ARIA correta.

## Non-Goals
- **Checkout real na web com Mercado Pago, Pix, cartão, cálculo de CEP real, cupons** → isso permanece Fase 4 original. A finalização é "carrinho → WhatsApp agregado com a Gabi" (pedido do usuário).
- **Gestão de estoque real via banco**. Ainda usamos `getStock()` do seed local apenas para não adicionar no carrinho mais unidades do que o seed declara (aviso "fora do estoque").
- **Autenticação / login / minha conta** → Fase 3 original. Carrinho é visitante-only.
- **Página institucional dedicada de "Bazar / Outlet"** → categoria é removida completamente (pedido do usuário).
- **CEP cálculo Melhor Envio** → placeholder "Cálculo de frete informado pela Gabi após finalização".
- **Troca / remover item com confirmação em modal** → remover é simples (lixeira sem confirmação extra).

## Background & Context
- Em [Hero.tsx](file:///d:/Amorena/site/frontend/src/components/home/Hero.tsx) atualmente o botão "Comprar coleção" é um `<Link to="/categoria/vestidos">` — redireciona direto para a categoria "Vestidos". Usuário pediu que ao invés disso apareça **separado por setor (vestidos, bolsas [=acessórios], blusas etc)** em formato de página dedicada.
- Categoria "Bazar" (`slug: 'bazar'`) atualmente existe em [seed.ts](file:///d:/Amorena/site/frontend/src/data/seed.ts#L51-L56), possui 1 produto (P-012 "T-Shirt de algodão orgânica · Bazar"), aparece no Navbar menu desktop e mobile, CategoryList (linha 07), Footer SEO description. Usuário disse "Tirar a parte de bazar" e pediu 5ª categoria na página de setores então Bazar é apagado de tudo.
- Botão "Adicionar ao carrinho" em [ProductPage.tsx:222-228](file:///d:/Amorena/site/frontend/src/pages/ProductPage.tsx#L222-L228) hoje roda `alert('Carrinho será implementado na Fase 3.')` — **não adiciona nada**. ProductQuickView [154-160](file:///d:/Amorena/site/frontend/src/components/product/ProductQuickView.tsx#L154-L160) também tem `disabled={!size || stock===0}` mas sem `onClick`.
- Ícone da sacola no Navbar [Navbar.tsx:143-148](file:///d:/Amorena/site/frontend/src/components/layout/Navbar.tsx#L143-L148) tem badge `0` hardcoded — precisa refletir contagem real do carrinho e abrir drawer de clique.
- Landing "/" possui funcionalidade de `localStorage` em `useAnalytics.ts` (já existente). Vamos usar a mesma chave namespace `amorena:` para `amorena:cart`.

## Functional Requirements

### Grupo FR-A. Página "Comprar coleção por setor" (`/loja/colecao`)
- **FR-A1**: Rota `/loja/colecao` existe, renderizada DENTRO de `<StoreLayout>` (Navbar + Footer + WhatsApp flutuante).
- **FR-A2**: Botão do hero `Comprar coleção` aponta para `/loja/colecao`. Botão secundário `Ver conjuntos` continua apontando para `/loja/categoria/conjuntos`.
- **FR-A3**: A página lista **6 cards grandes editoriais** = setores: Vestidos, Conjuntos, Blusas, Calças, Saias, Acessórios. NÃO existe card Bazar.
- **FR-A4**: Cada card tem: foto editorial da categoria, título serigráfico grande (Cormorant / estilo o CategoryList), eyebrow numérico 01..06, lead curto (da CATEGORIES.lead). Clique do card = navega para `/loja/categoria/:slug`.
- **FR-A5**: Layout de cards é tipo Pinterest editorial (não grid perfeito). Par/ímpar tem larguras/tamanhos de foto assimétricos, seguindo o estilo do CategoryList (números pares grandes, ímpares italic medium).
- **FR-A6**: A página tem Header tipográfico ("Coleção Amorena · 2026 · Alfenas-MG" + "Escolha um setor para começar").
- **FR-A7**: "Voltar" → link para Home `/loja`.

### Grupo FR-B. Remoção da categoria "Bazar" de TODO o site
- **FR-B1**: `CATEGORIES` em seed.ts remove item com slug 'bazar'. Eyebrows numéricos dos restantes são renumerados 01..06 (Vestidos 01, Conjuntos 02, Blusas 03, Calças 04, Saias 05, Acessórios 06).
- **FR-B2**: Se existir produto com `category = 'bazar'` → remapeia para 'blusas' (ex.: produto 012 = T-Shirt organica) e remove tag `bazar` / reescreve ribbon/subtitle. Product `category` type union em `types/product.ts` remove 'bazar'.
- **FR-B3**: Navbar desktop (`CATEGORIES.map` categorias) agora renderiza só 6 itens. Navbar mobile idem.
- **FR-B4**: CategoryList lista tipográfica renderiza apenas 6 linhas (01..06).
- **FR-B5**: SEO description em siteConfig que contém "e bazar" no storeDescription é trocada para "Coleção Amorena — vestidos, conjuntos, blusas, calças, saias e acessórios."
- **FR-B6**: Footer (quarto coluna) se tiver link Bazar é removido.
- **FR-B7**: Rota `/loja/categoria/bazar` cai em NotFound corretamente.

### Grupo FR-C. Estado global do Carrinho (React Context + localStorage)
- **FR-C1**: Exist `CartProvider` (Context API React) wrapando TODAS as rotas da loja em `App.tsx`. O Provider inicializa o carrinho a partir de `localStorage.getItem('amorena:cart')`. Se vazio, carrinho = `[]`.
- **FR-C2**: Interface de item do carrinho: `{ id: string (único, pode ser sku+productId), productId, sku, productName, slug, colorId, colorName, size, qty: number, unitPrice: number, imageThumbUrl: string, imageAlt }`.
- **FR-C3**: 4 ações do cart:
  - `addToCart({ product, colorId, size, qty })`: adiciona item. Se já existe item com mesma cor+sku+productId+size, incrementa qty (soma, não sobreescreve). Máximo qty = `getStock(product, colorId, size)`. Caso ultrapasse avisa e limita.
  - `updateQty(cartItemId, newQty)`: atualiza qtd, min=1, max=estoque, zero remove.
  - `removeItem(cartItemId)`: remove item.
  - `clearCart()`: limpa carrinho.
- **FR-C4**: Toda vez que qualquer ação é disparada, sincroniza `localStorage.setItem('amorena:cart', JSON.stringify(items))` com escrita debounced ou síncrona (como é pequeno, pode ser síncrono).
- **FR-C5**: Provider expõe também `open`/`close`/`toggle` para o drawer lateral. Valor booleano inicial = false. Quando `addToCart` tem sucesso, drawer abre automaticamente (UX Mercado Livre: "1 item adicionado ao carrinho → já mostra o carrinho").
- **FR-C6**: 2 leituras derivadas do estado: `itemCount = sum(items.qty)` e `subtotal = sum(items.qty * items.unitPrice)`.

### Grupo FR-D. Drawer lateral do Carrinho (estilo Mercado Livre)
- **FR-D1**: Drawer desliza da DIREITA (Mercado Livre pattern), com overlay escuro (10% preto semi-transparente). Fecha com clique no overlay, ESC, ou botão "Fechar" / "Continuar comprando".
- **FR-D2**: Header do drawer mostra "Sua sacola · N itens" (nº itens, em Montserrat uppercase tracking largo) + ícone X.
- **FR-D3**: Corpo do drawer: lista de itens 1 por linha. Cada linha:
  - Thumb foto (aspect-square, borda 1px bordo/15, tamanho 72px, pega `imageThumbUrl` = `product.images[0].url`)
  - Nome da peça (serif, preto-vinho) + cor (label swatch mini hex) + tamanho (uppercase)
  - Qtd stepper (`-` valor `+`)
  - Valor unitário + valor por linha (qty * price) em formatCurrency()
  - Ícone lixeira discreta para remover
- **FR-D4**: Rodapé sticky (sempre visível quando drawer dá scroll vertical por ter muitos itens):
  - Linha "Subtotal" → `formatCurrency(subtotal)`
  - Linha "Frete" → **placeholders "a confirmar pela Gabi"** (não integrado ainda)
  - Linha "Total" em negrito bordo = subtotal
  - Dois botões: (1) "Continuar comprando" (fecha drawer, fica na página), (2) "Finalizar compra · enviar para a Gabi" bordô ativo (abre WhatsApp).
- **FR-D5**: Estado empty do carrinho: quando nenhum item, mostra ilustração tipográfica "Sua sacola está vazia" + CTA "Voltar para a loja →" que fecha drawer.
- **FR-D6**: Ao scrolar a página com drawer aberto, o body tem `overflow: hidden` (evita scroll duplo).
- **FR-D7**: Drawer acessível: overlay aria-hidden, drawer role="dialog" aria-modal="true" aria-labelledby="cart-drawer-title", foco retorna ao botão da sacola ao fechar.

### Grupo FR-E. Finalização agregada para WhatsApp
- **FR-E1**: Clicar em "Finalizar compra" monta 1 única mensagem formatada para WhatsApp com **todos os itens** + subtotal + observação de frete. Formato:
```
Olá Gabi! Gostaria de finalizar meu pedido pelo site da Amorena:

✅ ITENS:
1. Vestido Midi Alfaiataria (Bordô Atemporal · M) · 2 un. · R$ 398,00 cada = R$ 796,00
2. ...

📦 SUBTOTAL: R$ XXXX,XX
🚚 FRETE: a confirmar pela Gabi (retirada na loja? / envio?)
📌 Link pedido: /loja/colecao

Obrigada!
```
- **FR-E2**: Abre `window.open` ou `window.location.href` com `https://wa.me/5535997061703?text=...` (use URL da `waLink()` no siteConfig já existente, passando a mensagem montada).
- **FR-E3**: Após abrir o WhatsApp, deixa o carrinho INTACTO (não limpa automaticamente — a Gabi confirma o pedido por fora e a cliente pode reabrir / ajustar). Botão extra "Limpar carrinho" discreto no canto inferior.
- **FR-E4**: Evento tracking `amorena:track` `name = 'cart_finalize_whatsapp'`, props `{ itemCount, subtotal, skus: [...] }`.

### Grupo FR-F. Integração dos CTAs "Adicionar ao carrinho"
- **FR-F1**: ProductPage.tsx: botão "Adicionar ao carrinho" agora dispara `cart.addToCart(...)`. Desativado até selecionar cor + tamanho com estoque > 0. Após clique, abre drawer do carrinho automaticamente e mostra feedback tipo "1 item adicionado".
- **FR-F2**: ProductQuickView.tsx: idem. Além disso, o link "Ver ficha completa" continua funcionando.
- **FR-F3**: Feedback visual temporário de sucesso: toast leve no canto inferior direito tipo "Peça adicionada à sacola →" com fade auto out em 3.5s.
- **FR-F4**: Badge da sacola no Navbar agora lê `cart.itemCount`. Se > 99, mostra "99+". Altera `aria-label` dinamicamente: `"Abrir sacola (${n} itens)"`.

## Non-Functional Requirements
- **NFR-1 (Performance)**: Carrinho vazio + drawer aberto inicializa < 100ms em mobile 390px (CPU throttled 4x). Sincronização localStorage < 5ms (máx 20 itens).
- **NFR-2 (Bundle size)**: Nenhuma dependência nova NPM (Context API React + Tailwind já existe = suficiente). Tamanho total do bundle Vite build aumenta ≤ +5 kB gzip.
- **NFR-3 (Design tokens)**: Todos os novos componentes (Coleção page, CartDrawer) usam apenas as 4 tokens da paleta `#581221 bordo`, `#FBF6F2 creme`, `#2B1216 vinho`, `#E8CFC8 rose nude`. Nenhum degradê, nenhum glass, nenhum emoji (exceto 3 caracteres Unicode leves usados como bullets FR-E1).
- **NFR-4 (Acessibilidade WCAG AA)**: Contraste ≥ 4.5:1 nos textos do drawer. Foco visível `focus-visible: bordo` em todos os botões do drawer, steppers, itens clicáveis. Escrita de ARIA completa.
- **NFR-5 (Persistência segura)**: Nenhum dado pessoal é guardado em `amorena:cart` (só referência de produto). Nenhuma chave secreta ou SKU sensível exposto.
- **NFR-6 (Testabilidade)**: TypeScript strict sem erros (`npx tsc --noEmit` exit 0). Vite production build zero warnings.

## Constraints
- **Technical**: React 18 + Vite 5 + TypeScript 5 + Tailwind 3 + React Router 6. `@reduxjs/toolkit` / `zustand` NÃO permitidos — usar Context API React nativo (NFR-2: zero deps novas). Estrutura de pasta: `frontend/src/context/CartContext.tsx`, `frontend/src/components/cart/CartDrawer.tsx`, `frontend/src/pages/ColecaoPage.tsx`.
- **Business**: A página da Loja Física, Landing, VIP, Novidades, Footer e fluxo de WhatsApp existentes do produto individual NÃO são removidos. Continua existindo botão "Pedir pelo WhatsApp" por produto (independente do carrinho agregado). Carrinho só oferece a alternativa adicional.
- **Dependencies**: Nenhuma. Usa `useAnalytics` e `siteConfig.ts` já existentes.

## Assumptions
- [Assumption 1]: A usuária disse "bolsas" na frase "setor tipo vestidos, bolsas entre outros" → como não existe categoria "Bolsas" e o seed tem "Acessórios" (contém bolsas, bijuterias, cintos), assumo que o card do setor usa categoria slug `acessorios` com nome "Acessórios" no card, e NÃO crio categoria nova "Bolsas" separada. Se for necessário separar depois, podemos ajustar.
- [Assumption 2]: Produto atualmente no Bazar (P-012 T-shirt organica) → remapeio para categoria `blusas` como pedido implícito de "tirar Bazar mas não apagar a peça" (arquivaria = pior UX). Se a Gabi preferir apagar completamente, aprovação do usuário no AC-B7.
- [Assumption 3]: "Estilo Pinterest editorial" = página `/loja/colecao` com grid assimétrico 12 col, cards par/ímpar tamanhos diferentes (ex: Vestidos 8 colunas span, Conjuntos 4 col span align bottom, Blusas 4 span, Calças 8 span foto wide), acompanhado de fotos editoriais + textos grandes. Repete a linguagem visual existente no CategoryList mas com FOTOS GRANDES (inves de só texto).

## Acceptance Criteria

### AC-1: Hero leva a página coleção com 6 setores e sem Bazar
- **Type**: `rule`
- **Given**: A usuária abre `/loja` (Home)
- **When**: Clica no botão "Comprar coleção" (bordô) no hero
- **Then**: Navega para `/loja/colecao`, onde existem 6 cards (Vestidos, Conjuntos, Blusas, Calças, Saias, Acessórios). Não existe card "Bazar". Clicar em qualquer card vai para `/loja/categoria/:slug` correto.
- **Pass Condition**: `window.location.pathname === '/loja/colecao'` após clique, e DOM contém 6 `<a>` cards com data-testid="setor-card" e nenhum com slug "bazar".
- **Evidence**: DevTools (network/Router) + screenshot em viewport 1440px e 390px.

### AC-2: Categoria Bazar removida de TODO o site
- **Type**: `rule`
- **Given**: Qualquer tela da loja `/loja` ou inferior
- **When**: Renderiza Navbar desktop, Navbar mobile, CategoryList (Home), seed CATEGORIES, siteConfig SEO description, rodapé
- **Then**: A palavra "Bazar" / slug "bazar" / union type "'bazar'" NÃO aparece. Somente 6 categorias numéricas 01..06. Produto P-012 (anteriormente bazar) tem `category='blusas'`.
- **Pass Condition**: Search `rg "(?i)bazar"` em `frontend/src/` retorna 0 linhas em categorias, rotas, products, footer, seed types; `CATEGORIES.length === 6`; `PRODUCTS.find(p => p.category === 'bazar')` === `undefined`.
- **Evidence**: `cd frontend ; Select-String -Pattern 'bazar' -Path src\*.ts,src\*.tsx,src\**\*.ts,src\**\*.tsx -CaseSensitive:$false` + `tsc --noEmit` saída sem erros.

### AC-3: Adicionar item ao carrinho persiste e atualiza badge
- **Type**: `rule`
- **Given**: Página de produto `/loja/produto/vestido-midi-alfaiataria-bordo` carregada. Seleciona cor "Bordô Atemporal", tamanho "M", qty=2. Estoque ≥ 2.
- **When**: Clica em "Adicionar ao carrinho". Depois atualiza a página com `Ctrl+R`.
- **Then**: (1) Drawer do carrinho abre automaticamente. (2) Item aparece no drawer com nome, cor, tamanho M, qty 2, valor correto. (3) Badge da sacola no Navbar mostra "2". (4) Após reload, carrinho ainda tem o mesmo item (localStorage sincronizado).
- **Pass Condition**: localStorage.getItem('amorena:cart') parse JSON tem 1 item com `productId === 'p-001' && size === 'M' && qty === 2`. Badge Navbar `textContent != '0'`.
- **Evidence**: Console DevTools `JSON.parse(localStorage.getItem('amorena:cart'))` + screenshot badge.

### AC-4: Drawer carrinho (Mercado Livre pattern) — editar qty, remover, subtotal correto
- **Type**: `rule`
- **Given**: Carrinho tem 2 itens (Item A: qty 2 unit R$ 100, subtotal A = 200; Item B: qty 1 unit R$ 250, subtotal B = 250)
- **When**: (a) Incrementa qty Item A para 3, (b) remove Item B, (c) fecha drawer e abre de novo
- **Then**: (a) Subtotal = 300 após passo (a). (b) Subtotal = 300 e item list tem só Item A após passo (b). (c) Drawer fecha/abre corretamente sem perder estado. Stepper "max" não deixa passar do estoque declarado.
- **Pass Condition**: `cart.subtotal === (3 * 100)` após increment + remove. Tentar passar do estoque = qtd limitado e aviso.
- **Evidence**: Drawer state changes screenshot + console output `cartProvider`.

### AC-5: Finalização para WhatsApp agregada (1 mensagem com lista + total)
- **Type**: `rule`
- **Given**: Carrinho com 2 itens listados acima, subtotal R$ 450,00
- **When**: Clica em "Finalizar compra · enviar para a Gabi"
- **Then**: Abre `https://wa.me/5535997061703?text=...` cujo `text` contém as linhas "1. ... 2. ...", "SUBTOTAL: R$ 450,00", "FRETE: a confirmar pela Gabi", "Olá Gabi! Gostaria de finalizar meu pedido". Mensagem é UTF-8 encoded corretamente.
- **Pass Condition**: Extrair URL final → decode do query param `text` dá a mensagem formatada esperada (assert manual no console). Evento `amorena:track cart_finalize_whatsapp` disparado no `window`.
- **Evidence**: DevTools Network `wa.me` URL + Console do listener do CustomEvent.

### AC-6: QuickView Product também adiciona ao carrinho (integração F+F2)
- **Type**: `rule`
- **Given**: Home `/loja` + QuickView "Espiar" de um produto com cor+tamanho selecionados e estoque > 0
- **When**: Clica "Adicionar ao carrinho"
- **Then**: Drawer abre, item é adicionado, badge atualiza igual ao AC-3. QuickView pode permanecer aberto ou fechar automaticamente (fecha após adicionar = UX esperada).
- **Pass Condition**: item count no cart sobe ≥ 1; draw aberto visível.
- **Evidence**: Screenshot QuickView → clique → drawer ao lado.

### AC-7: Nenhuma dependência NPM nova + typecheck + build ok
- **Type**: `rule`
- **Given**: Código após todas alterações
- **When**: Rodar (a) `cd frontend ; npx tsc --noEmit`, (b) `npm run build`, (c) `git diff -- package.json` (ou package.json diff com o de antes da implementação)
- **Then**: (a) exit 0, 0 erros; (b) exit 0, 0 warnings; (c) `dependencies` / `devDependencies` em package.json **sem novas entradas**.
- **Pass Condition**: Os 3 passes acima.
- **Evidence**: Terminal output dos 3 comandos.

### AC-8: Coerência estética com editorial Amorena (paleta, tipografia, assimetria, sem clichês)
- **Type**: `rubric`
- **Dimension**: Fidelidade visual à marca (design system tokens).
- **Scale**: 1 a 5
- **Anchors**: 1 = parece template genérico (degradês, ícones pill, Inter/Arial, glassmorphism); 3 = segue paleta mas desvia em tipografia ou grid regular perfeito; 5 = 100% fiel: usa `font-display`/`font-serif` títulos, `font-sans uppercase tracking largo` rótulos, assimetria par/ímpar nos cards da `/loja/colecao`, 4 cores só, `rounded` (4px) em botões do carrinho (não pill), seta → serif em CTAs finais do drawer, textura papel creme de fundo, **nenhum emoji**.
- **Pass Threshold**: >= 4
- **Evidence**: Screenshots 1440px e 390px de `/loja/colecao` e do drawer carrinho aberto.

### AC-9: Mobile first 390px (tudo utilizável com 1 polegar)
- **Type**: `rubric`
- **Dimension**: Utilização e toque no mobile viewport 390×844.
- **Scale**: 1 a 5
- **Anchors**: 1 = drawer transborda / inputs 14px zoom iOS / CTAs pequenos; 3 = funcional mas com overlaps leves; 5 = tudo encaixa (header, lista, footer sticky), botões ≥ 48px toque alvo, inputs text 16px, altura botão ≥ 56px, drawer abre sem quebrar, badge na sacola 360° visível, scroll vertical 1 dedo, carrinho empty sem overflow.
- **Pass Threshold**: >= 4
- **Evidence**: Screenshots em Chrome DevTools Device Mode iPhone 12 Pro (390px).

## Open Questions
- [Open Q1 (Aprovação Assumption 2)]: Produto P-012 (anteriormente em Bazar, "T-shirt de algodão orgânica · bordô") será **remapeada para Blusas**. Alternativa: **apagar completamente a peça** da lista de produtos. Qual a preferência? (Escolhi padrão remapear → se preferir apagar, me avise que ajusto no AC-B7).
- [Open Q2 (Aprovação Assumption 3)]: "Estilo Pinterest editorial" para `/loja/colecao` = grid 12 col **assimétrico** com tamanhos de foto diferentes por card (par/ímpar). OK? (Alternativa: grid simétrico 3 colunas igual de cards, mais tradicional — assumi assimétrico para ser fiel à identidade Amorena editorial).
- [Open Q3 (Frete placeholder)]: Em FR-D4 e FR-E1, placeholder de frete é **"a confirmar pela Gabi"** ou prefere escrever **"Informe seu CEP na mensagem para a Gabi calcular"**? (Escolhi "a confirmar pela Gabi" por ser minimalista).
