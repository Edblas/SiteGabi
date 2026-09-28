import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

import LandingPage from './pages/LandingPage'
import HomePage from './pages/HomePage'
import CategoryPage from './pages/CategoryPage'
import ProductPage from './pages/ProductPage'
import NovidadesPage from './pages/NovidadesPage'
import LojaFisicaPage from './pages/LojaFisicaPage'
import NotFoundPage from './pages/NotFoundPage'
import ColecaoPage from './pages/ColecaoPage'

import AnnouncementBar from './components/layout/AnnouncementBar'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import WhatsAppButton from './components/layout/WhatsAppButton'
import CartFabButton from './components/layout/CartFabButton'
import CartDrawer from './components/cart/CartDrawer'
import { CartProvider } from './context/CartContext'
import { useAnalytics } from './hooks/useAnalytics'

function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-creme text-vinho">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartFabButton />
      <WhatsAppButton />
      <CartDrawer />
    </div>
  )
}

export default function App() {
  const { pathname } = useLocation()
  const { trackEvent } = useAnalytics()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
    trackEvent('page_view', { path: pathname })
  }, [pathname, trackEvent])

  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route
          path="/loja"
          element={
            <StoreLayout>
              <HomePage />
            </StoreLayout>
          }
        />
        <Route
          path="/loja/colecao"
          element={
            <StoreLayout>
              <ColecaoPage />
            </StoreLayout>
          }
        />
        <Route
          path="/loja/novidades"
          element={
            <StoreLayout>
              <NovidadesPage />
            </StoreLayout>
          }
        />
        <Route
          path="/loja/categoria/:slug"
          element={
            <StoreLayout>
              <CategoryPage />
            </StoreLayout>
          }
        />
        <Route
          path="/loja/produto/:slug"
          element={
            <StoreLayout>
              <ProductPage />
            </StoreLayout>
          }
        />
        <Route
          path="/loja-fisica"
          element={
            <StoreLayout>
              <LojaFisicaPage />
            </StoreLayout>
          }
        />

        {/* Atalhos de compatibilidade — quem chega via link antigo de produto/novidade cai direto na loja (sem passar pela landing) */}
        <Route path="/produto/:slug" element={<Navigate to="/loja/produto/:slug" replace />} />
        <Route path="/categoria/:slug" element={<Navigate to="/loja/categoria/:slug" replace />} />
        <Route path="/novidades" element={<Navigate to="/loja/novidades" replace />} />

        <Route
          path="*"
          element={
            <StoreLayout>
              <NotFoundPage />
            </StoreLayout>
          }
        />
      </Routes>
    </CartProvider>
  )
}

