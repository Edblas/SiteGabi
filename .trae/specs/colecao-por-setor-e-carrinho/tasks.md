# Amorena — Implementação: Coleção por Setor + Carrinho (Plano)

Ordem de execução: T1 → T2 → (T3 + T4) → T5 → T6 → T7

---

## Task 1: Remover categoria Bazar + renumerar setores 01..06
- **Status**: `pending`
- **Priority**: high
- **Depends On**: None
- **Description**:
  - Apagar entrada `slug = 'bazar'` de `CATEGORIES` em `seed.ts`.
  - Renumerar `CATEGORIES[i].eyebrow` de 01..06 (Vestidos 01, Conjuntos 02, Blusas 03, Calças 04, Saias 05, Acessórios 06).
  - Remapear produto `category = 'bazar'` (produto p-012 Tshirt orgânica) → `blusas`. Atualizar seu `subtitle` de "Bazar · Últimas unidades" para "Blusas · Algodão orgânico" e remover a tag `'bazar'` de `tags` (deixar só `'ultimas-unidades'`).
  - Type `product.ts`: remover `'bazar'` do union type de `Product['category']`.
  - `siteConfig.seo.storeDescription`: trocar string com "e bazar" por 6 categorias apenas.
- **Acceptance Criteria Addressed**: AC-2 (Bazar removido de TUDO), partial AC-7 (types ok).
- **Test Requirements**:
  - `rule` TR-1.1: Busca `(?i)bazar` em `frontend/src/**/*.ts` e `frontend/src/**/*.tsx` retorna **0 matches** em categorias / products / types. (Evidence: `Select-String` command output).
  - `rule` TR-1.2: `CATEGORIES.length === 6` e último `eyebrow === '06 · Coleção'`. (Evidence: `console.log` de `CATEGORIES` em runtime).
  - `rule` TR-1.3: `tsc --noEmit` exit 0 após remover `'bazar'` type union. (Evidence: terminal exit code 0).

## Task 2: Criar página `/loja/colecao` (cards editoriais Pinterest 01..06 assimetria)
- **Status**: `pending`
- **Priority**: high
- **Depends On**: T1 (pega categorias renumeradas 01..06)
- **Description**:
  - Criar `frontend/src/pages/ColecaoPage.tsx`.
  - Hero/Header: eyebrow "Coleção 01 · OI · Outono Inverno", título `<h1 font-h-editorial> A coleção organizada em <em italic bordo> setores </em>`, lead serif italic: "Escolha o universo que quer explorar primeiro."
  - Botão voltar: `<a class="btn-ghost" href="/loja">← Voltar para a loja</a>` (volta a Home).
  - Grid de 6 cards em **grid 12 col** assimétrico (Pinterest editorial). Regra de assimetria (igual CategoryList):
    - Índice par (0,2,4 → Vestidos, Blusas, Saias): `col-span-12 md:col-span-8 aspect-[16/10]` foto grande, texto serif grande tracking-tight.
    - Índice ímpar (1,3,5 → Conjuntos, Calças, Acessórios): `col-span-12 md:col-span-4 aspect-[4/5]` foto estreita alta, texto italic medium bordo/85.
  - Cada card = link `<a href="/loja/categoria/{slug}">` com: imagem editorial (1 foto da categoria usando `coresg` prompt específico por categoria + `image_size portrait_4_3` ou `landscape_16_9` conforme), número 01..06 serif italic, nome categoria fonte size clamp 3rem a 8rem, framer-lead `CATEGORIES.lead`, overlay `gradiente creme bleed` igual hero principal para legibilidade.
  - Footer da página: botão flutuante CTA "Ver todos os produtos →" que vai para `/loja/novidades` (atalho de ver tudo).
  - Registrar em `App.tsx` nova rota `/loja/colecao` DENTRO de `<StoreLayout>`.
  - Atualizar `Hero.tsx` (botão "Comprar coleção"): trocar `<Link to="/categoria/vestidos">` por `<Link to="/loja/colecao">`.
- **Acceptance Criteria Addressed**: AC-1 (hero setores), partial AC-8 (assimetria editorial), partial AC-7 (build).
- **Test Requirements**:
  - `rule` TR-2.1: `Navigate` clicar hero → pathname `/loja/colecao`. (Evidence: screenshot página carregada).
  - `rule` TR-2.2: 6 cards renderizados, nenhum com slug bazar. Cada card `href` começa com `/loja/categoria/`. (Evidence: DOM query `a[href^='/loja/categoria/']` length = 6).
  - `rubric` TR-2.3: Fidelidade estética (igual AC-8 mas aplicado à página). Scale 1-5, threshold ≥ 4, mesmo anchors. (Evidence: screenshots 1440px e 390px).
  - `rubric` TR-2.4: Mobile 390px layout (igual AC-9). Scale 1-5, threshold ≥ 4. (Evidence: screenshot device mode 390×844).

## Task 3: Criar `CartContext` (estado global + localStorage + open/close drawer + add/update/remove/clear actions + derived subtotal count)
- **Status**: `pending`
- **Priority**: high
- **Depends On**: None
- **Description**:
  - Novo arquivo: `frontend/src/context/CartContext.tsx`.
  - Type `CartItem = { id: string; productId: string; sku?: string; productName: string; slug: string; colorId: string; colorName: string; size: string; qty: number; unitPrice: number; imageThumbUrl: string; imageAlt: string; }`.
  - Provider state: `items: CartItem[]`, `drawerOpen: boolean`.
  - Ações:
    - `addToCart(product: Product, colorId, size, qty)` — idempotente. Gera `id = '${product.id}_${colorId}_${size}'`. Se já existe item com esse id, soma qty (Math.min(soma, getStock(product, colorId, size)). Caso ultrapasse, limite e opcionalmente dispare tracking/warning. Sempre atualiza `drawerOpen = true` após sucesso (para UX tipo Mercado Livre "veja seu carrinho").
    - `updateQty(id, newQty)` — `newQty >= 1` e `<= getStock` (falta getStock no contexto; podemos receber como max externo ou receber produto completo via item. Para simplificar: não vamos bloquear stock no update — só no add; o update aceita até 99). Se `newQty === 0` chama `removeItem`.
    - `removeItem(id)`.
    - `clearCart()`.
    - `openDrawer()`, `closeDrawer()`, `toggleDrawer()`.
  - Derived (useMemo): `itemCount = sum(qty)`, `subtotal = sum(qty * unitPrice)`.
  - Persistência em `localStorage.getItem('amorena:cart')` JSON.parse no init. useEffect dependente `items` para salvar sempre (`localStorage.setItem('amorena:cart', JSON.stringify(items))`). Inicialização segura (catch se JSON malformado → items []).
  - Exports: `CartProvider`, `useCart()` hook (useContext).
  - Em `App.tsx`: wrap `<CartProvider>` FORA das Routes, envolta TODA a aplicação (para Navbar ler estado).
- **Acceptance Criteria Addressed**: AC-3 (persiste + badge), partial AC-4, partial AC-7.
- **Test Requirements**:
  - `rule` TR-3.1: Adicionar item mesmo product+cor+tamanho duas vezes, qtd é somada (não duplica linha). (Evidence: items.length === 1 após 2 adições do mesmo).
  - `rule` TR-3.2: Ctrl+R refresh página → estado mantido. (Evidence: JSON.parse(localStorage) = items).
  - `rule` TR-3.3: subtotal, itemCount atualizados reativamente. (Evidence: log em console do provider).
  - `rule` TR-3.4: `tsc --noEmit` exit 0. (Evidence: command).
  - `rule` TR-3.5: package.json sem novas deps. (Evidence: `git diff frontend/package.json` vazio).

## Task 4: Criar componente `CartDrawer.tsx` (Mercado Livre pattern — drawer direita overlay + linha item + subtotal + frete placeholder + CTAs)
- **Status**: `pending`
- **Priority**: high
- **Depends On**: T3 (useCart)
- **Description**:
  - Novo arquivo: `frontend/src/components/cart/CartDrawer.tsx`.
  - Consome `useCart()`. Anexa em `StoreLayout` (App.tsx) FORA do `<main>` (drawer overlay global). Para permitir Landing `/` SEM carrinho? Sim. Wrap só quando StoreLayout. Alternativa: Colocar drawer DENTRO de StoreLayout perto do WhatsApp.
  - Porta lógica padrão `fixed inset-0 z-50`. Overlay escuro (bg `bg-vinho/30` 30% opacity vinho). Drawer direita, `w-full sm:max-w-md` (mobile full, tablet 480px), altura cheia, fundo creme, border esquerda 1px bordo/15, animação slide-in right (transform 100% → 0 em 250ms ease-out). Overlay com fade-in.
  - Close: clique no overlay, tecla ESC (listener keydown global ativo só quando drawerOpen), botão X no header, botão "Continuar comprando".
  - `body.overflow-hidden = drawerOpen` via useEffect quando drawer monta/desmonta. Foco trap opcional (básico: foco inicial no primeiro botão).
  - **Header**: Ícone X direita (fechar). Esquerda: eyebrow uppercase tracking largo "00 · Sua sacola" + label serif italic `${cart.itemCount} item(ns)`.
  - **Empty state**: Quando cart.items length === 0 → div central vertical: "Sua sacola ainda está vazia." (font-serif italic text-vinho). Botão ← "Voltar para a loja" btn-outline → closeDrawer(). Nenhum emoji.
  - **Lista de itens (tem items)**: `divide-y divide-bordo/10 border-y border-bordo/10 py-1`. Cada item:
    - Grid 12 colunas: foto 3 col (aspect-square, src item.imageThumbUrl, alt). 6 col: nome serif; 1 linha "cor • tamanho" (sans 11px uppercase tracking largo, cor = swatch mini color hex inline 12x12 rounded border). 3 col direita alinhado fim: preço formatCurrency(qty * unitPrice) com destaque.
    - Abaixo de nome/cor: Stepper qty = `[−] [qty] [+]` + `lixeira svg` discreta canto inferior direito. Stepper igual ProductPage. + e - border-btn.
  - **Rodapé sticky bottom** (sempre visível, separa do conteúdo rolável). Linhas:
    - Eyebrow "Subtotal" + formatCurrency(cart.subtotal).
    - Eyebrow "Frete" + serif italic "a confirmar pela Gabi" (bordo/60).
    - HR 1px bordo.
    - Eyebrow "Total" + `font-display text-bordo` formatCurrency(subtotal) tamanho grande.
    - 2 botões pilula não (retangular rounded 4px border 1px bordo):
      (1) "Continuar comprando →" (ghost) → closeDrawer();
      (2) "Finalizar compra · enviar para a Gabi →" (bordo primary full width min-h 64px) → dispara montar mensagem e abrir wa.me (importante: a lógica da mensagem fica no CartContext como helper `buildCheckoutWhatsAppMessage()` ou aqui dentro no drawer — preferível no drawer).
    - Canto inferior esquerdo texto menor serif italic: "Limpar carrinho" link-underline → onClick={clearCart}.
- **Acceptance Criteria Addressed**: AC-4 (editar, remover, subtotal), partial AC-5 (Finalizar botão), partial AC-8, partial AC-9.
- **Test Requirements**:
  - `rule` TR-4.1: Drawer fecha corretamente por (overlay + esc + X + Continuar comprando). (Evidence: teste manual).
  - `rule` TR-4.2: Body scroll trava com drawer aberto. (Evidence: document.body.style.overflow === 'hidden').
  - `rule` TR-4.3: Empty state mostra conteúdo. (Evidence: limpar carrinho, abrir drawer, screenshot).
  - `rule` TR-4.4: Stepper qtd + remover item funcionam (items.length diminui / aumenta + subtotal correto). (Evidence: console subtotal value).
  - `rubric` TR-4.5: Acessibilidade mobile 390px (igual AC-9). Threshold ≥ 4. (Evidence: screenshots).
  - `rubric` TR-4.6: Estética editoriaal (igual AC-8). Threshold ≥ 4. (Evidence: screenshots).

## Task 5: Integrar botões "Adicionar ao carrinho" ProductPage + ProductQuickView (e Navbar badge + open cart + toast)
- **Status**: `pending`
- **Priority**: high
- **Depends On**: T3 + T4
- **Description**:
  - **Navbar**: Badge hardcoded `0` → `cart.itemCount` (> 99 → "99+"). `aria-label` dinâmico. `onClick` do ícone sacola = `cart.toggleDrawer()`.
  - **ProductPage**: `onClick` botão "Adicionar ao carrinho" = chamar `cart.addToCart(product, colorId, size, qty)` (depois de checar hasSelection). Trocar `alert('Fase 3')`. Mensagem toast simples: "Adicionada à sua sacola →" aparece embaixo 3.5s (criar componente `Toast.tsx` em `ui/` ou inline em ProductPage).
  - **ProductQuickView**: Mesmo `onClick` = `addToCart(product, color, size, 1)` (QuickView usa 1 unidade por padrão). Depois, fecha o QuickView automaticamente e abre o drawer (pois addToCart já faz drawerOpen=true). Ajustar link "Ver ficha completa" para navegar `/loja/produto/${slug}` (em vez de `/produto/${slug}` sem `/loja` — já arruma compat).
  - **Toast leve (opcional, melhor UX)**. Criar `components/ui/ToastMessage.tsx`. Usar `useState(false)` em `StoreLayout`. Quando `addToCart` tem sucesso → `toastMessageContext.show()`. Ou mais simples: disparar evento `CustomEvent('amorena:cart_added')` e um `<div toast>` em `App.tsx` o escuta.
  - **Acessibilidade**: após adicionar, foco vai para o primeiro item do drawer (opcional).
- **Acceptance Criteria Addressed**: AC-3, AC-6.
- **Test Requirements**:
  - `rule` TR-5.1: ProductPage adiciona item e abre drawer. (Evidence: screenshot).
  - `rule` TR-5.2: ProductQuickView adiciona e fecha quickview. (Evidence: Home → Espiar → Add → fechou quickview e drawer aberto).
  - `rule` TR-5.3: Badge sacola = `2` após duas adições de qty=1. (Evidence: screenshot navbar).

## Task 6: Integrar "Finalizar compra · enviar para a Gabi" (mensagem WhatsApp agregada + waLink + trackEvent + limpar opcional)
- **Status**: `pending`
- **Priority**: high
- **Depends On**: T4 + T5
- **Description**:
  - Helper function `buildCartWhatsAppMessage(cartItems[], subtotal, locationHref)` → returns string formatada:
    ```
    Olá Gabi! Gostaria de finalizar meu pedido pelo site da Amorena:

    ✅ ITENS:
    1. Vestido Midi Alfaiataria (Bordô Atemporal · M) · 2 un. · R$ 398,00 cada = R$ 796,00
    2. ...

    📦 SUBTOTAL: R$ XXXX,XX
    🚚 FRETE: a confirmar pela Gabi
    📌 Referência: ${locationHref}

    Obrigada!
    ```
  - Botão "Finalizar compra →" em CartDrawer: onClick → `window.open(waLink(mensagem), '_blank')`. Chamar `trackEvent('cart_finalize_whatsapp', { itemCount, subtotal, skus: items.map(i => i.sku || i.productId)} )`.
  - Carrinho permanece intacto após o clique (para usuário ajustar se quiser). Botão "Limpar carrinho" está lá para limpar manualmente.
  - Em `siteConfig`: adicionar helper opcional ou atualizar para exportar `buildWhatsAppMessage()` se quiser centralizar.
- **Acceptance Criteria Addressed**: AC-5.
- **Test Requirements**:
  - `rule` TR-6.1: URL wa.me gerada contém `text` com todos os itens listados + subtotal. (Evidence: extrair URL, decode, diff manual).
  - `rule` TR-6.2: Evento `amorena:track` `cart_finalize_whatsapp` dispara no window. (Evidence: listener log no console).
  - `rule` TR-6.3: Carrinho não é limpo automáticamente após clique (items.length permanece). (Evidence: items no localStorage ainda).

## Task 7: Verificação geral → TypeScript strict check + Vite build + preview em 390px + 1440px + documentar pendências + commitar + push
- **Status**: `pending`
- **Priority**: high
- **Depends On**: T1, T2, T3, T4, T5, T6
- **Description**:
  - `cd frontend ; npx tsc --noEmit` → exit 0.
  - `cd frontend ; npm run build` → exit 0 warnings 0.
  - Abrir preview no Vite dev server, fazer smoke tests manuais: (a) landing → loja → comprar coleção → cards 6 → categoria. (b) produto → adicionar → drawer aberto → adicionar outro → editar qty → remover → subtotal → finalizar WhatsApp → decode da mensagem no console. (c) Navbar badge atualiza. (d) Ctrl+R carrinho persiste.
  - Mobile 390px: screenshots, validar alvos toque + input 16px.
  - Desktop 1440px: screenshots página coleção + drawer.
  - Atualizar `TODO_PENDING_DATA` em `siteConfig` caso ainda falte item (não deve — Bazar foi removido e dados reais WhatsApp/Alfenas já existem).
  - Commit: `git add -A && git commit -m "feat(colecao-carrinho): setores pagina /loja/colecao + remover bazar + carrinho mercadolivre drawer finaliza WhatsApp agregado"` + push GitHub origin main.
- **Acceptance Criteria Addressed**: AC-1 ao AC-7 (re-verificação final), AC-8 evidencia, AC-9 evidencia.
- **Test Requirements**:
  - `rule` TR-7.1: `tsc --noEmit` exit 0 · `npm run build` exit 0. (Evidence: terminal outputs).
  - `rule` TR-7.2: 3 smoke tests manuais (a, b, c) acima PASSAM. (Evidence: notas e screenshots).
  - `rubric` TR-7.3: Rubrica geral fidelidade estética (AC-8) com screenshots finais. Score ≥ 4.
  - `rubric` TR-7.4: Rubrica mobile 390px (AC-9) com screenshots. Score ≥ 4.
  - `rule` TR-7.5: GitHub push sucesso (main atualizado). (Evidence: último commit log).
