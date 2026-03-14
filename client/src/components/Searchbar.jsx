import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { IoSearchSharp, IoCloseCircle } from 'react-icons/io5'

function Searchbar({ onSearch, searchQuery }) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  // Sincroniza el input si searchQuery se limpia desde afuera (ej: navegar a home)
  useEffect(() => {
    if (searchQuery === '') setQuery('')
  }, [searchQuery])

  // Limpia el search al navegar a una ruta de producto o categoría
  useEffect(() => {
    if (location.pathname.startsWith('/producto/')) {
      setQuery('')
      onSearch?.('')
    }
  }, [location.pathname])

  const handleChange = (e) => {
    const val = e.target.value
    setQuery(val)
    onSearch?.(val)
    // Si escribe, asegura estar en '/' para ver los resultados en vivo
    if (val && location.pathname !== '/') {
      navigate('/')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!query.trim()) return
    navigate(`/productos?busqueda=${encodeURIComponent(query)}`)
  }

  const clear = () => {
    setQuery('')
    onSearch?.('')
  }

  return (
    <div className="w-full flex">
      <form
        onSubmit={handleSubmit}
        className="flex flex-1 items-center border-gray-600 border rounded-3xl px-4 py-2 bg-slate-800 gap-2"
      >
        <button type="submit" className="text-gray-400 hover:text-white transition-colors">
          <IoSearchSharp size={18} />
        </button>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          className="flex-1 outline-none bg-transparent text-white placeholder-gray-500 text-sm"
          placeholder="Buscar productos, marcas..."
        />
        {query && (
          <button type="button" onClick={clear} className="text-gray-500 hover:text-white transition-colors">
            <IoCloseCircle size={16} />
          </button>
        )}
      </form>
    </div>
  )
}

export default Searchbar
