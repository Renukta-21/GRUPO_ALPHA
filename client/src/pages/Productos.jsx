import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

// Breadcrumb navegable — cada item tiene label, id y path
function Breadcrumb({ items }) {
  const navigate = useNavigate()
  if (!items.length) return null

  return (
    <div className="flex items-center gap-1 text-xs mb-4 flex-wrap">
      <span
        onClick={() => navigate('/')}
        className="text-gray-400 hover:text-white cursor-pointer transition-colors"
      >
        🏠 Inicio
      </span>
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        // El path de cada item es todos los breadcrumbs hasta este nivel
        const slicedBreadcrumb = items.slice(0, i + 1).map(x => `${x.label}:${x.id}`).join('›')
        const path = `/productos?categoria=${item.id}&nombre=${encodeURIComponent(item.label)}&breadcrumb=${encodeURIComponent(slicedBreadcrumb)}`

        return (
          <span key={i} className="flex items-center gap-1">
            <span className="text-gray-600">›</span>
            {isLast ? (
              <span className="text-white font-semibold">{item.label}</span>
            ) : (
              <span
                onClick={() => navigate(path)}
                className="text-gray-400 hover:text-white cursor-pointer transition-colors"
              >
                {item.label}
              </span>
            )}
          </span>
        )
      })}
    </div>
  )
}

function ProductCard({ producto }) {
  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden flex flex-col">
      <div className="bg-white rounded-t-xl p-3">
        <img
          src={producto.img_portada}
          alt={producto.titulo}
          className="w-full h-32 object-contain"
          loading="lazy"
        />
      </div>
      <div className="p-3 flex flex-col gap-1 flex-1">
        <p className="text-white text-xs leading-tight line-clamp-2">{producto.titulo}</p>
        <p className="text-gray-400 text-xs">{producto.modelo}</p>
        <div className="mt-auto pt-2">
          <p className="text-blue-400 font-bold text-sm">
            ${parseFloat(producto.precios.precio_especial).toFixed(2)}
          </p>
          {producto.marca_logo && (
            <img src={producto.marca_logo} alt={producto.marca} className="h-4 object-contain mt-1 opacity-70" />
          )}
        </div>
      </div>
    </div>
  )
}

function ProductosSkeleton() {
  return (
    <>
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-slate-800 rounded-xl overflow-hidden animate-pulse">
          <div className="bg-slate-700 h-36" />
          <div className="p-3 space-y-2">
            <div className="bg-slate-700 h-3 rounded w-full" />
            <div className="bg-slate-700 h-3 rounded w-3/4" />
            <div className="bg-slate-600 h-4 rounded w-1/3 mt-2" />
          </div>
        </div>
      ))}
    </>
  )
}

function Productos({ searchQuery }) {
  const [searchParams] = useSearchParams()
  const [productos, setProductos] = useState([])
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const bottomRef = useRef(null)

  const busqueda = searchQuery || searchParams.get('busqueda')
  const categoria = searchParams.get('categoria')
  const nombre = searchParams.get('nombre')
  const breadcrumbParam = searchParams.get('breadcrumb') // "Audio y Video:66523›Audio IP:XXXX"
  const debouncedBusqueda = useDebounce(busqueda, 400)

  // Parsea breadcrumb: "Audio y Video:66523›Audio IP:XXXX" → [{label, id}]
  const breadcrumbItems = (() => {
    if (!breadcrumbParam) return nombre ? [{ label: nombre, id: categoria }] : []
    return breadcrumbParam.split('›').filter(Boolean).map(part => {
      const lastColon = part.lastIndexOf(':')
      return {
        label: part.slice(0, lastColon).trim(),
        id: part.slice(lastColon + 1).trim()
      }
    })
  })()

  useEffect(() => {
    setProductos([])
    setPagina(1)
    setTotalPaginas(1)
  }, [debouncedBusqueda, categoria])

  useEffect(() => {
    if (!debouncedBusqueda && !categoria) return

    const isFirstPage = pagina === 1
    isFirstPage ? setLoading(true) : setLoadingMore(true)

    const params = new URLSearchParams()
    if (debouncedBusqueda) params.append('busqueda', debouncedBusqueda)
    if (categoria) params.append('categoria', categoria)
    params.append('pagina', pagina)

    fetch(`${import.meta.env.VITE_API_URL}/products?${params}`)
      .then(res => res.json())
      .then(data => {
        setProductos(prev =>
          isFirstPage ? (data.productos || []) : [...prev, ...(data.productos || [])]
        )
        setTotalPaginas(data.paginas || 1)
      })
      .finally(() => {
        setLoading(false)
        setLoadingMore(false)
      })
  }, [debouncedBusqueda, categoria, pagina])

  const handleObserver = useCallback((entries) => {
    const [entry] = entries
    if (entry.isIntersecting && !loadingMore && pagina < totalPaginas) {
      setPagina(prev => prev + 1)
    }
  }, [loadingMore, pagina, totalPaginas])

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 })
    if (bottomRef.current) observer.observe(bottomRef.current)
    return () => observer.disconnect()
  }, [handleObserver])

  if (!debouncedBusqueda && !categoria) return null

  return (
    <div className="w-full">

      {/* Breadcrumb navegable */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Título */}
      {nombre && !debouncedBusqueda && (
        <h2 className="text-white font-bold text-base mb-3">{nombre}</h2>
      )}
      {debouncedBusqueda && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-white text-sm">Resultados para</span>
          <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
            {debouncedBusqueda}
          </span>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3">
        {loading ? <ProductosSkeleton /> : productos.map(p => (
          <ProductCard key={p.producto_id} producto={p} />
        ))}
      </div>

      {/* Scroll trigger */}
      <div ref={bottomRef} className="py-4 flex justify-center">
        {loadingMore && (
          <div className="flex gap-1">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        )}
        {!loading && !loadingMore && pagina >= totalPaginas && productos.length > 0 && (
          <p className="text-gray-500 text-xs">— Fin de resultados —</p>
        )}
      </div>
    </div>
  )
}

export default Productos
