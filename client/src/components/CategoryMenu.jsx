import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCategorias } from '../hooks/useCategories'

const categoryIcons = {
  'Audio y Video': '🎵',
  'Automatización e Intrusión': '🔔',
  'Cableado Estructurado': '🔌',
  'Control de Acceso': '🔒',
  'Detección de Fuego': '🚨',
  'Energía / Herramientas': '⚡',
  'Industria / BMS/ Robots': '🤖',
  'IoT / GPS / Telemática y Señalización Audiovisual': '📡',
  'Radiocomunicación': '📻',
  'Redes e IT': '🌐',
  'Videovigilancia': '📷',
  'Marketing': '📣',
}

function CategoryMenu({ onClose }) {
  const navigate = useNavigate()
  const { getCategorias, getSubcategorias, loading } = useCategorias()
  const [stack, setStack] = useState([])
  const [titles, setTitles] = useState(['Categorías'])
  const [ids, setIds] = useState([null])

  useEffect(() => {
    getCategorias().then(data => setStack([data]))
  }, [])

  const current = stack[stack.length - 1]
  const isSubLevel = stack.length > 1

  // Construye el breadcrumb con formato "nombre:id›nombre:id"
  const buildBreadcrumb = (extraNombre = null, extraId = null) => {
    const parts = titles.slice(1).map((t, i) => `${t}:${ids[i + 1]}`)
    if (extraNombre && extraId) parts.push(`${extraNombre}:${extraId}`)
    return parts.join('›')
  }

  const open = async (cat) => {
    const subcats = await getSubcategorias(cat.id)
    if (subcats?.length > 0) {
      setStack([...stack, subcats])
      setTitles([...titles, cat.nombre])
      setIds([...ids, cat.id])
    } else {
      // Nivel final — navega a productos
      onClose()
      navigate(
        `/productos?categoria=${cat.id}&nombre=${encodeURIComponent(cat.nombre)}&breadcrumb=${encodeURIComponent(buildBreadcrumb(cat.nombre, cat.id))}`
      )
    }
  }

  const verTodas = () => {
    const catNombre = titles[titles.length - 1]
    const catId = ids[ids.length - 1]
    onClose()
    navigate(
      `/productos?categoria=${catId}&nombre=${encodeURIComponent(catNombre)}&breadcrumb=${encodeURIComponent(buildBreadcrumb())}`
    )
  }

  const goBack = () => {
    setStack(stack.slice(0, -1))
    setTitles(titles.slice(0, -1))
    setIds(ids.slice(0, -1))
  }

  return (
    <div className="fixed left-0 top-0 w-80 h-screen bg-[#0f1724] text-white z-50 flex flex-col shadow-2xl">

      {/* Header */}
      <div className="flex justify-between items-center px-5 py-4 border-b border-white/10">
        {isSubLevel ? (
          <span className="font-bold text-base">{titles[titles.length - 1]}</span>
        ) : (
          <input
            type="text"
            placeholder="Buscar categorías..."
            className="bg-white/10 text-white placeholder-gray-400 text-sm rounded-full px-4 py-1.5 outline-none w-48"
          />
        )}
        <div className="flex items-center gap-2">
          {isSubLevel && (
            <button
              onClick={verTodas}
              className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1.5 rounded-full font-medium transition-colors flex items-center gap-1"
            >
              Ver todas ›
            </button>
          )}
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">✕</button>
        </div>
      </div>

      {/* Volver */}
      {isSubLevel && (
        <button
          onClick={goBack}
          className="flex items-center gap-2 px-5 py-3 text-blue-400 hover:text-blue-300 text-sm border-b border-white/10 transition-colors"
        >
          <span className="text-lg">‹</span> Volver
        </button>
      )}

      {/* Lista */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="px-5 py-4 space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-4 bg-white/10 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <ul>
            {current?.map((cat) => (
              <li
                key={cat.id}
                onClick={() => open(cat)}
                className="flex items-center justify-between px-5 py-3.5 cursor-pointer border-b border-white/5 hover:bg-white/5 text-sm transition-colors"
              >
                <div className="flex items-center gap-3">
                  {!isSubLevel && (
                    <span className="text-blue-400 text-lg w-6 text-center">
                      {categoryIcons[cat.nombre] || '📦'}
                    </span>
                  )}
                  <span>{cat.nombre}</span>
                </div>
                <span className="text-gray-500">›</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default CategoryMenu
