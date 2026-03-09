import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/NavbarTop'
import Searchbar from './components/Searchbar'
import Productos from './pages/Productos'

function AppContent() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className='bg-logo-blue w-full min-h-screen px-4'>
      <Navbar />
      <div className="py-3">
        <Searchbar onSearch={setSearchQuery} />
      </div>
      {/* Productos aparece debajo del searchbar con resultados en vivo */}
      {searchQuery ? (
        <Productos searchQuery={searchQuery} />
      ) : (
        <Routes>
          <Route path="/" element={<h1 className="text-white">Home</h1>} />
          <Route path="/productos" element={<Productos />} />
        </Routes>
      )}
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
