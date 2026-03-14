import { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/NavbarTop'
import Searchbar from './components/Searchbar'
import Productos from './pages/Productos'
import ProductoDetalle from './components/ProductoDetalle'

function AppContent() {
  const [searchQuery, setSearchQuery] = useState('')
  const location = useLocation()

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
        <Route
          path="/"
          element={<Productos searchQuery={searchQuery} />}
        />
        <Route
          path="/productos"
          element={<Productos searchQuery={searchQuery} />}
        />
        <Route
          path="/producto/:id"
          element={<ProductoDetalle />}
        />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
