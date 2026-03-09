import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoSearchSharp, IoCloseCircle } from 'react-icons/io5'

function Searchbar({ onSearch }) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    const val = e.target.value
    setQuery(val)
    if (onSearch) onSearch(val)  // live search mientras escribe
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!query.trim()) return
    navigate(`/productos?busqueda=${encodeURIComponent(query)}`)
  }

  const clear = () => {
    setQuery('')
    if (onSearch) onSearch('')
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
