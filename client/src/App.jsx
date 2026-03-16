import { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/NavbarTop'
import Searchbar from './components/Searchbar'
import Productos from './pages/Productos'
import ProductoDetalle from './components/ProductoDetalle'
import CartDrawer from './components/CartDrawer'
import { CartProvider } from './hooks/useCart.jsx'

function AppContent() {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (val) => {
    setSearchQuery(val)
  }

  return (
    <div className='bg-logo-blue w-full min-h-screen px-4'>
      <Navbar onNavigate={() => setSearchQuery('')} />
      <div className="py-3">
        <Searchbar onSearch={handleSearch} searchQuery={searchQuery} />
      </div>

      <Routes>
        <Route path="/"            element={<Productos searchQuery={searchQuery} />} />
        <Route path="/productos"   element={<Productos searchQuery={searchQuery} />} />
        <Route path="/producto/:id" element={<ProductoDetalle />} />
      </Routes>

      {/* Drawer del carrito — siempre montado, se muestra/oculta con open */}
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
