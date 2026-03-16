import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/NavbarTop'
import Searchbar from './components/Searchbar'
import Productos from './pages/Productos'
import ProductoDetalle from './components/ProductoDetalle'
import CartDrawer from './components/CartDrawer'
import Checkout from './pages/Checkout'
import OrdenExitosa from './pages/OrdenExitosa'
import { CartProvider } from './hooks/useCart'

function AppContent() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className='bg-logo-blue w-full min-h-screen px-4'>
      <Navbar onNavigate={() => setSearchQuery('')} />
      <div className="py-3">
        <Searchbar onSearch={setSearchQuery} searchQuery={searchQuery} />
      </div>

      <Routes>
        <Route path="/"             element={<Productos searchQuery={searchQuery} />} />
        <Route path="/productos"    element={<Productos searchQuery={searchQuery} />} />
        <Route path="/producto/:id" element={<ProductoDetalle />} />
        <Route path="/checkout"     element={<Checkout />} />
        <Route path="/orden-exitosa" element={<OrdenExitosa />} />
      </Routes>

      <CartDrawer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </BrowserRouter>
  )
}

export default App
