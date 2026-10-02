import { useMemo, useState, type ChangeEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { COLORS, PRODUCTS, CATEGORIES, formatCurrency } from '../data/seed'
import type { Category, ColorSwatch, Product } from '../types/product'
import { clearAdminToken, getAdminToken } from '../components/admin/ProtectedRoute'

type Tab = 'produtos' | 'categorias' | 'cores'

export default function AdminDashboardPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('produtos')

  const [products, setProducts] = useState<Product[]>(() => JSON.parse(JSON.stringify(PRODUCTS)))
  const [categories, setCategories] = useState<Category[]>(() => JSON.parse(JSON.stringify(CATEGORIES)))
  const [colors, setColors] = useState<ColorSwatch[]>(() => JSON.parse(JSON.stringify(COLORS)))

  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<{ ok: boolean; msg: string; commitUrl?: string } | null>(null)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [uploading, setUploading] = useState<string | null>(null)

  async function salvarCores() {
    setSaving(true)
    setLastSaved(null)
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({
          colors,
          message: `feat(admin): atualizar cores via painel (${new Date().toISOString().slice(0, 16).replace('T', ' ')})`,
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        setLastSaved({ ok: false, msg: `Erro ${res.status}: ${json?.error || 'Falha'}` })
      } else {
        setLastSaved({
          ok: true,
          msg: `Cores salvas às ${new Date().toLocaleTimeString('pt-BR')}. Aguarde ~30s para aparecer no site.`,
          commitUrl: json.commitUrl,
        })
      }
    } catch (err: any) {
      setLastSaved({ ok: false, msg: err?.message || 'Erro de rede.' })
    } finally {
      setSaving(false)
    }
  }

  function adicionarProduto() {
    const nextIdx = products.length + 1
    const padded = String(nextIdx).padStart(3, '0')
    const newId = `P-${padded}-NOVO`
    const slugBase = `novo-produto-${nextIdx}`
    const firstSlug: any = categories[0]?.slug ?? 'vestidos'
    const template: Product = {
      id: newId,
      slug: slugBase,
      name: `Novo produto ${nextIdx} · (clique para editar)`,
      subtitle: 'Adicione o subtítulo aqui',
      category: firstSlug,
      isNew: true,
      isBestSeller: false,
      priceInCents: 19900,
      promotionalPriceInCents: undefined,
      shortDescription: 'Descrição curta · texto chamativo de até 2 linhas.',
      longDescription:
        'Descrição longa completa: fale sobre caimento, modelagem, ocasião de uso e tudo o que a cliente precisa saber antes de comprar.',
      composition: '100% poliéster (exemplo — edite com a composição real).',
      care: 'Lavar à mão · não torcer · secar à sombra (edite conforme a peça).',
      colorIds: [],
      availableSizes: ['P', 'M', 'G'],
      variations: [
        {
          sku: newId,
          colorId: '',
          size: 'M',
          stock: 10,
        },
      ],
      images: [
        {
          url: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=fashion%20photo%20of%20a%20woman%20wearing%20elegant%20bordeaux%20clothes%20cream%20studio%20background%20editorial%20amorena%20moda%20feminina&image_size=portrait_4_3',
          alt: 'Foto do produto (troque clicando em Trocar foto)',
        },
        {
          url: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=fashion%20editorial%20photo%20detail%20bordeaux%20cream%20texture%20fabric%20close%20up%20amorena&image_size=portrait_4_3',
          alt: 'Detalhe do produto (troque clicando em Trocar foto)',
        },
      ],
    }
    setProducts((prev) => [...prev, template])
    setSelectedProductId(template.id)
    setTimeout(() => {
      const editor = document.querySelector('[data-admin-editor-scroll]')
      editor?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  function adicionarCategoria() {
    const nextIdx = categories.length + 1
    const slugBase: any = `categoria-nova-${nextIdx}`
    const template: Category = {
      slug: slugBase,
      name: `Nova categoria ${nextIdx}`,
      eyebrow: `0${nextIdx} · Nova categoria`,
      lead: 'Frase chamativa da categoria · descreva a vibe das peças.',
      heroPrompt: 'fashion editorial bordeaux cream amorena moda feminina outfit inspiration pinterest cover',
      heroSize: 'landscape_16_9',
    }
    setCategories((prev) => [...prev, template])
    setTimeout(() => {
      const last = document.querySelectorAll('[data-admin-category-card]')
      const el = last[last.length - 1]
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  function adicionarCor() {
    const nextIdx = colors.length + 1
    const idBase = `cor-${nextIdx}`
    const template: ColorSwatch = {
      id: idBase,
      name: `Cor nova ${nextIdx}`,
      label: `Cor ${nextIdx}`,
      hex: '#8B2E3A',
    }
    setColors((prev) => [...prev, template])
    setTimeout(() => {
      const last = document.querySelectorAll('[data-admin-color-card]')
      const el = last[last.length - 1]
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  const selected = useMemo(
    () => products.find((p) => p.id === selectedProductId) || null,
    [products, selectedProductId]
  )

  function authHeaders(): Record<string, string> {
    const token = getAdminToken()
    return {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    }
  }

  async function salvarProdutos() {
    setSaving(true)
    setLastSaved(null)
    try {
      const res = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({
          products,
          message: `feat(admin): atualizar produtos via painel (${new Date().toISOString().slice(0, 16).replace('T', ' ')})`,
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        setLastSaved({ ok: false, msg: `Erro ${res.status}: ${json?.error || 'Falha'}` })
      } else {
        setLastSaved({
          ok: true,
          msg: `Salvo em ${new Date().toLocaleTimeString('pt-BR')}. Aguarde ~30s para aparecer no site.`,
          commitUrl: json.commitUrl,
        })
      }
    } catch (err: any) {
      setLastSaved({ ok: false, msg: err?.message || 'Erro de rede.' })
    } finally {
      setSaving(false)
    }
  }

  async function salvarCategorias() {
    setSaving(true)
    setLastSaved(null)
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({
          categories,
          colors: COLORS,
          message: `feat(admin): atualizar categorias via painel (${new Date().toISOString().slice(0, 16).replace('T', ' ')})`,
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        setLastSaved({ ok: false, msg: `Erro ${res.status}: ${json?.error || 'Falha'}` })
      } else {
        setLastSaved({
          ok: true,
          msg: `Categorias salvas às ${new Date().toLocaleTimeString('pt-BR')}. Aguarde ~30s para aparecer no site.`,
          commitUrl: json.commitUrl,
        })
      }
    } catch (err: any) {
      setLastSaved({ ok: false, msg: err?.message || 'Erro de rede.' })
    } finally {
      setSaving(false)
    }
  }

  async function trocarFotoProduto(ev: ChangeEvent<HTMLInputElement>, product: Product, imageIndex: number) {
    const file = ev.target.files?.[0]
    if (!file || !product?.id) return
    const safeSku = product.variations?.[0]?.sku?.replace(/[^A-Z0-9-]/gi, '') || product.slug.replace(/[^A-Z0-9-]/gi, '')
    const fileExt = file.type === 'image/png' ? 'png' : 'jpg'
    const filePath = `produtos/${safeSku}/imagem-${imageIndex + 1}.${fileExt}`

    setUploading(`${product.id}#${imageIndex}`)
    try {
      const base64 = await fileToBase64(file)
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          filePath,
          base64,
          alt: `${product.name} — ${imageIndex === 0 ? 'frente' : 'detalhe'}`,
          message: `feat(admin): upload foto produto ${product.id} ${imageIndex + 1}`,
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        alert(`Erro no upload: ${json?.error || 'Falha'}`)
        return
      }

      const newImages = [...product.images]
      newImages[imageIndex] = { url: json.url, alt: json.alt }
      setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, images: newImages } : p)))
    } finally {
      setUploading(null)
      ev.target.value = ''
    }
  }

  function atualizarCampoProduto(productId: string, key: keyof Product, value: any) {
    setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, [key]: value } : p)))
  }

  return (
    <div className="min-h-screen bg-creme text-vinho">
      <header className="sticky top-0 z-40 border-b border-bordo/20 bg-creme/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="font-display text-2xl text-bordo">
              amorena
            </Link>
            <h1 className="hidden font-serif text-xl text-vinho md:block">Painel Administrativo</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/loja" className="label-eyebrow hover:text-bordo">
              Ver loja →
            </Link>
            <button
              type="button"
              onClick={() => {
                clearAdminToken()
                navigate('/admin/login', { replace: true })
              }}
              className="label-eyebrow text-vinho/60 hover:text-bordo"
            >
              Sair
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-7xl flex flex-wrap items-center gap-2 px-6 pb-4">
          <TabButton active={tab === 'produtos'} onClick={() => setTab('produtos')}>
            Produtos · {products.length}
          </TabButton>
          <TabButton active={tab === 'categorias'} onClick={() => setTab('categorias')}>
            Categorias · {categories.length}
          </TabButton>
          <TabButton active={tab === 'cores'} onClick={() => setTab('cores')}>
            Cores · {colors.length}
          </TabButton>
          {tab === 'produtos' ? (
            <button type="button" onClick={adicionarProduto} className="btn-outline text-xs">
              ＋ Adicionar produto
            </button>
          ) : tab === 'categorias' ? (
            <button type="button" onClick={adicionarCategoria} className="btn-outline text-xs">
              ＋ Adicionar categoria
            </button>
          ) : (
            <button type="button" onClick={adicionarCor} className="btn-outline text-xs">
              ＋ Adicionar cor
            </button>
          )}
          <div className="flex-1" />
          {tab === 'produtos' ? (
            <button type="button" disabled={saving} onClick={salvarProdutos} className="btn-bordo disabled:opacity-50">
              {saving ? 'Salvando produtos…' : 'Salvar todos os produtos (deploy)'}
            </button>
          ) : tab === 'categorias' ? (
            <button type="button" disabled={saving} onClick={salvarCategorias} className="btn-bordo disabled:opacity-50">
              {saving ? 'Salvando categorias…' : 'Salvar categorias (deploy)'}
            </button>
          ) : (
            <button type="button" disabled={saving} onClick={salvarCores} className="btn-bordo disabled:opacity-50">
              {saving ? 'Salvando cores…' : 'Salvar cores (deploy)'}
            </button>
          )}
        </div>

        {lastSaved && (
          <div className={`mx-auto max-w-7xl px-6 pb-4 ${lastSaved.ok ? 'text-emerald-900' : 'text-rose-800'}`}>
            {lastSaved.ok ? '✅ ' : '⚠️ '}
            <span className="text-sm">{lastSaved.msg}</span>
            {lastSaved.commitUrl && (
              <a
                href={lastSaved.commitUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-3 text-xs underline underline-offset-4 hover:text-bordo"
              >
                Ver commit no GitHub ↗
              </a>
            )}
          </div>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {tab === 'produtos' ? (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-7">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {products.map((p) => {
                  const selected = p.id === selectedProductId
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedProductId(p.id)}
                      className={`flex gap-4 rounded-sm border p-3 text-left transition ${
                        selected ? 'border-bordo bg-creme-deep/80 shadow-card' : 'border-bordo/15 hover:border-bordo/40'
                      }`}
                    >
                      {p.images?.[0]?.url && (
                        <img src={p.images[0].url} alt="" className="h-20 w-20 flex-none object-cover" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs uppercase tracking-widest text-bordo">{p.category}</p>
                        <p className="truncate font-serif text-lg leading-tight">{p.name}</p>
                        <p className="mt-1 text-sm text-vinho/80">
                          {formatCurrency(p.promotionalPriceInCents ?? p.priceInCents)}
                          {!!p.promotionalPriceInCents && (
                            <span className="ml-2 text-xs text-vinho/60 line-through">
                              {formatCurrency(p.priceInCents)}
                            </span>
                          )}
                        </p>
                        {p.isNew && (
                          <span className="chip mt-2 inline-block text-[10px]">Nova</span>
                        )}
                        {p.isBestSeller && (
                          <span className="chip mt-2 ml-2 inline-block border border-bordo/40 text-[10px] text-bordo">
                            Mais amada
                          </span>
                        )}
                        {p.colorIds?.length > 0 && (
                          <div className="mt-2 flex items-center gap-1.5">
                            {p.colorIds.map((cid) => {
                              const sw = colors.find((c) => c.id === cid)
                              return (
                                <span
                                  key={cid}
                                  title={sw?.name || cid}
                                  className="inline-block h-4 w-4 rounded-full border border-vinho/30"
                                  style={{ backgroundColor: sw?.hex || '#ccc' }}
                                />
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="col-span-12 lg:col-span-5">
              {selected ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      if (!confirm('Excluir este produto permanentemente? (esta ação é salva só depois de clicar em Salvar todos os produtos)')) return
                      setProducts((prev) => prev.filter((p) => p.id !== selectedProductId))
                      setSelectedProductId(null)
                    }}
                    className="absolute right-3 top-3 z-10 text-xs text-rose-700 hover:underline underline-offset-4"
                  >
                    🗑️ Excluir produto
                  </button>
                  <ProductEditor
                    key={selected.id}
                    product={selected}
                    categories={categories}
                    colors={colors}
                    uploading={uploading}
                    onChange={(k, v) => atualizarCampoProduto(selected.id, k, v)}
                    onUpload={(ev, idx) => trocarFotoProduto(ev, selected, idx)}
                  />
                </div>
              ) : (
                <div className="rounded-sm border border-dashed border-bordo/30 p-10 text-center text-vinho/60">
                  Clique em um produto ao lado para editar.
                </div>
              )}
            </div>
          </div>
        ) : tab === 'categorias' ? (
          <CategoryEditor
            categories={categories}
            onChange={(i, k, v) => {
              if ((k as string) === '__DELETE__') {
                setCategories((prev) => prev.filter((_, idx) => idx !== i))
                return
              }
              setCategories((prev) => {
                const next = [...prev]
                next[i] = { ...next[i], [k]: v }
                return next
              })
            }}
          />
        ) : (
          <ColorEditor
            colors={colors}
            onChange={(i, k, v) => {
              if (k === '__DELETE__') {
                setColors((prev) => prev.filter((_, idx) => idx !== i))
                return
              }
              setColors((prev) => {
                const next = [...prev]
                next[i] = { ...next[i], [k]: v }
                return next
              })
            }}
          />
        )}
      </main>
    </div>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`label-eyebrow rounded-sm border px-4 py-2 transition ${
        active ? 'border-bordo bg-bordo text-creme' : 'border-bordo/25 hover:border-bordo/60'
      }`}
    >
      {children}
    </button>
  )
}

function ProductEditor({
  product,
  categories,
  colors,
  uploading,
  onChange,
  onUpload,
}: {
  product: Product
  categories: Category[]
  colors: ColorSwatch[]
  uploading: string | null
  onChange: (key: keyof Product, value: any) => void
  onUpload: (e: ChangeEvent<HTMLInputElement>, imageIndex: number) => void
}) {
  function toggleColor(colorId: string, checked: boolean) {
    const next = new Set(product.colorIds || [])
    if (checked) next.add(colorId)
    else next.delete(colorId)
    onChange('colorIds', Array.from(next))
  }
  return (
    <div data-admin-editor-scroll className="sticky top-[190px] space-y-4 rounded-sm border border-bordo/20 bg-white/60 p-5">
      <div>
        <p className="label-eyebrow mb-2">Fotos do produto</p>
        <div className="grid grid-cols-2 gap-4">
          {product.images.map((img, idx) => (
            <div key={idx} className="space-y-2">
              <div className="aspect-[4/5] overflow-hidden rounded-sm border border-bordo/15 bg-creme-deep">
                <img src={img.url} alt={img.alt} className="h-full w-full object-cover" />
              </div>
              <label className="block cursor-pointer text-center">
                <span className="label-eyebrow">
                  {uploading === `${product.id}#${idx}` ? 'Enviando…' : 'Trocar foto'}
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  disabled={!!uploading}
                  onChange={(e) => onUpload(e, idx)}
                />
              </label>
              <p className="truncate text-[10px] text-vinho/60">{img.alt || `Foto ${idx + 1}`}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="SKU / ID">
          <input
            className="input-admin"
            value={product.id}
            onChange={(e) => onChange('id', e.target.value)}
          />
        </Field>
        <Field label="Slug (URL)">
          <input
            className="input-admin"
            value={product.slug}
            onChange={(e) => onChange('slug', e.target.value)}
          />
        </Field>
      </div>

      <Field label="Nome">
        <input
          className="input-admin"
          value={product.name}
          onChange={(e) => onChange('name', e.target.value)}
        />
      </Field>

      <Field label="Subtítulo">
        <input
          className="input-admin"
          value={product.subtitle}
          onChange={(e) => onChange('subtitle', e.target.value)}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Categoria">
          <select
            className="input-admin"
            value={product.category}
            onChange={(e) => onChange('category', e.target.value)}
          >
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center gap-2 text-xs uppercase tracking-widest text-vinho/80">
            <input
              type="checkbox"
              checked={!!product.isNew}
              onChange={(e) => onChange('isNew', e.target.checked)}
            />
            Nova coleção
          </label>
          <label className="flex items-center gap-2 text-xs uppercase tracking-widest text-vinho/80">
            <input
              type="checkbox"
              checked={!!product.isBestSeller}
              onChange={(e) => onChange('isBestSeller', e.target.checked)}
            />
            Mais amada
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <p className="label-eyebrow">Cores disponíveis desta peça</p>
        <div className="grid grid-cols-2 gap-2 pt-1">
          {colors.map((c) => {
            const checked = product.colorIds?.includes(c.id) || false
            return (
              <label
                key={c.id}
                className={`flex items-center gap-2 rounded-sm border px-2 py-1.5 text-xs ${
                  checked ? 'border-bordo bg-creme-deep' : 'border-bordo/15 hover:border-bordo/40'
                }`}
              >
                <input
                  type="checkbox"
                  className="shrink-0"
                  checked={checked}
                  onChange={(e) => toggleColor(c.id, e.target.checked)}
                />
                <span
                  className="inline-block h-4 w-4 shrink-0 rounded-full border border-vinho/30"
                  style={{ backgroundColor: c.hex }}
                  aria-hidden
                />
                <span className="truncate">{c.label}</span>
              </label>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Preço (R$)">
          <input
            type="number"
            className="input-admin"
            value={product.priceInCents / 100}
            step="0.01"
            onChange={(e) => onChange('priceInCents', Math.round(parseFloat(e.target.value || '0') * 100))}
          />
        </Field>
        <Field label="Preço promocional (R$)">
          <input
            type="number"
            className="input-admin"
            value={product.promotionalPriceInCents ? product.promotionalPriceInCents / 100 : ''}
            step="0.01"
            placeholder="(opcional)"
            onChange={(e) => {
              const raw = e.target.value
              const cents = raw ? Math.round(parseFloat(raw) * 100) : undefined
              const copy: any = { ...product }
              if (!cents) delete copy.promotionalPriceInCents
              else copy.promotionalPriceInCents = cents
              onChange('promotionalPriceInCents', copy.promotionalPriceInCents)
            }}
          />
        </Field>
      </div>

      <Field label="Descrição curta">
        <input
          className="input-admin"
          value={product.shortDescription}
          onChange={(e) => onChange('shortDescription', e.target.value)}
        />
      </Field>
      <Field label="Descrição longa">
        <textarea
          className="input-admin min-h-[96px]"
          value={product.longDescription}
          onChange={(e) => onChange('longDescription', e.target.value)}
        />
      </Field>
      <Field label="Composição">
        <input
          className="input-admin"
          value={product.composition}
          onChange={(e) => onChange('composition', e.target.value)}
        />
      </Field>
      <Field label="Cuidados">
        <input
          className="input-admin"
          value={product.care}
          onChange={(e) => onChange('care', e.target.value)}
        />
      </Field>
    </div>
  )
}

function CategoryEditor({
  categories,
  onChange,
}: {
  categories: Category[]
  onChange: (index: number, key: string | keyof Category, value: any) => void
}) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((c, i) => (
        <div key={c.slug} data-admin-category-card className="relative rounded-sm border border-bordo/20 bg-white/60 p-5 space-y-3">
          <button
            type="button"
            onClick={() => {
              if (!confirm(`Excluir categoria "${c.name}" permanentemente? (só é salvo ao clicar em Salvar categorias)`)) return
              onChange(i, '__DELETE__', true as any)
            }}
            className="absolute right-3 top-3 z-10 text-[11px] text-rose-700 hover:underline underline-offset-4"
            title="Excluir esta categoria"
          >
            🗑️ Excluir
          </button>
          <div className="flex items-baseline justify-between">
            <span className="font-serif italic text-lg text-bordo">0{i + 1}</span>
            <input
              className="input-admin text-right"
              value={c.eyebrow}
              onChange={(e) => onChange(i, 'eyebrow', e.target.value)}
            />
          </div>
          <Field label="Nome">
            <input
              className="input-admin"
              value={c.name}
              onChange={(e) => onChange(i, 'name', e.target.value)}
            />
          </Field>
          <Field label="Slug (URL)">
            <input
              className="input-admin"
              value={c.slug}
              onChange={(e) => onChange(i, 'slug', e.target.value)}
            />
          </Field>
          <Field label="Frase lead">
            <input
              className="input-admin"
              value={c.lead}
              onChange={(e) => onChange(i, 'lead', e.target.value)}
            />
          </Field>
          <Field label="Prompt foto (editorial)">
            <textarea
              className="input-admin min-h-[72px]"
              value={c.heroPrompt}
              onChange={(e) => onChange(i, 'heroPrompt', e.target.value)}
            />
          </Field>
          <Field label="Tamanho imagem hero">
            <select
              className="input-admin"
              value={c.heroSize}
              onChange={(e) => onChange(i, 'heroSize', e.target.value)}
            >
              <option value="portrait_4_3">Retrato 4:3</option>
              <option value="portrait_16_9">Retrato 16:9</option>
              <option value="landscape_16_9">Paisagem 16:9</option>
              <option value="landscape_4_3">Paisagem 4:3</option>
              <option value="square_hd">Quadrado</option>
            </select>
          </Field>
        </div>
      ))}
    </div>
  )
}

function ColorEditor({
  colors,
  onChange,
}: {
  colors: ColorSwatch[]
  onChange: (index: number, key: string | keyof ColorSwatch, value: any) => void
}) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {colors.map((c, i) => (
        <div
          key={c.id}
          data-admin-color-card
          className="relative rounded-sm border border-bordo/20 bg-white/60 p-5 space-y-3"
        >
          <button
            type="button"
            onClick={() => {
              if (!confirm(`Excluir cor "${c.name}" permanentemente? (só é salvo ao clicar em Salvar cores)`)) return
              onChange(i, '__DELETE__', true as any)
            }}
            className="absolute right-3 top-3 z-10 text-[11px] text-rose-700 hover:underline underline-offset-4"
            title="Excluir esta cor"
          >
            🗑️ Excluir
          </button>
          <div className="flex items-center gap-3">
            <div
              className="h-16 w-16 shrink-0 rounded-full border-2 border-vinho/25 shadow-inner"
              style={{ backgroundColor: c.hex }}
              title={`Cor ${c.name}`}
            />
            <div className="flex-1 min-w-0">
              <p className="truncate font-serif text-lg leading-tight">{c.label}</p>
              <p className="text-xs uppercase tracking-widest text-bordo">{c.id}</p>
            </div>
          </div>
          <Field label="ID da cor (slug)">
            <input
              className="input-admin"
              value={c.id}
              onChange={(e) => onChange(i, 'id', e.target.value)}
            />
          </Field>
          <Field label="Nome completo (SEO)">
            <input
              className="input-admin"
              value={c.name}
              onChange={(e) => onChange(i, 'name', e.target.value)}
            />
          </Field>
          <Field label="Rótulo curto (swatch)">
            <input
              className="input-admin"
              value={c.label}
              onChange={(e) => onChange(i, 'label', e.target.value)}
            />
          </Field>
          <Field label="Código HEX (#)">
            <div className="flex items-center gap-2">
              <input
                type="color"
                className="h-10 w-12 shrink-0 cursor-pointer rounded-sm border border-bordo/20 bg-transparent"
                value={/^#[0-9a-fA-F]{6}$/.test(c.hex) ? c.hex : '#8B2E3A'}
                onChange={(e) => onChange(i, 'hex', e.target.value)}
              />
              <input
                className="input-admin flex-1 font-mono text-sm"
                value={c.hex}
                pattern="#[0-9a-fA-F]{6}"
                onChange={(e) => onChange(i, 'hex', e.target.value)}
              />
            </div>
          </Field>
        </div>
      ))}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="label-eyebrow">{label}</span>
      {children}
    </label>
  )
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
