import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCategorias } from '../hooks/useCategories'

function CategoryMenu({ onClose }) {
  const navigate = useNavigate()
  const { getCategorias, getSubcategorias, loading } = useCategorias()
  const [stack, setStack] = useState([])
  const [titles, setTitles] = useState(['Categorías'])

  useEffect(() => {
    getCategorias().then(data => setStack([data]))
  }, [])

  const current = stack[stack.length - 1]

  const open = async (cat) => {
    const subcats = await getSubcategorias(cat.id)
    if (subcats?.length > 0) {
      setStack([...stack, subcats])
      setTitles([...titles, cat.nombre])
    } else {
      onClose()
      navigate(`/productos?categoria=${cat.id}&nombre=${encodeURIComponent(cat.nombre)}&breadcrumb=${encodeURIComponent(titles.slice(1).concat(cat.nombre).join('›'))}`)
    }
  }

  const verTodas = () => {
    const catActual = titles[titles.length - 1]
    // 👈 necesita el id de la categoría actual — lo sacamos del stack anterior
    const catId = stack[stack.length - 2]?.find(c => c.nombre === catActual)?.id || ''
    onClose()
    navigate(`/productos?categoria=${catId}&nombre=${encodeURIComponent(catActual)}&breadcrumb=${encodeURIComponent(titles.slice(1).join('›'))}`)
  }

  const goBack = () => {
    setStack(stack.slice(0, -1))
    setTitles(titles.slice(0, -1))
  }

  return (
    <div className="fixed left-0 top-0 w-80 h-screen bg-slate-900 text-white p-4 z-10">
      <div className="flex justify-between items-center mb-4">
        <span className="font-bold">{titles[titles.length - 1]}</span>
        <div className="flex items-center gap-2">
          {stack.length > 1 && (  // 👈 solo aparece cuando estás en subcategoría
            <button
              onClick={verTodas}
              className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded-full transition-colors"
            >
              Ver todas ›
            </button>
          )}
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>
      </div>

      {stack.length > 1 && (
        <button onClick={goBack} className="mb-4 text-blue-400 flex items-center gap-1 text-sm">
          ‹ Volver
        </button>
      )}

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <ul className="space-y-4">
          {current?.map((cat) => (
            <li
              key={cat.id}
              onClick={() => open(cat)}
              className="flex justify-between cursor-pointer hover:text-blue-400"
            >
              {cat.nombre}
              <span>›</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CategoryMenu