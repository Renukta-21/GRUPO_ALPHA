import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import DisponibilidadModal from '../components/DisponibilidadModal'
import { useCart } from '../hooks/useCart'
import carrito from '../assets/carrito.png'

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

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
  const navigate = useNavigate()
  const { agregar, items } = useCart()
  const [modalProducto, setModalProducto] = useState(null)

  const yaEnCarrito = items.some(i => i.producto_id === producto.producto_id)
  const sinStock = !producto.total_existencia || producto.total_existencia === 0

  const handleAgregar = (e) => {
    e.stopPropagation()
    if (!yaEnCarrito && !sinStock) agregar(producto)
  }

  return (
    <>
      {modalProducto && (
        <DisponibilidadModal
          productoId={modalProducto.producto_id}
          existencia={modalProducto.existencia}
          onClose={() => setModalProducto(null)}
        />
      )}

      <div
        onClick={() => navigate(`/producto/${producto.producto_id}`)}
        className="bg-slate-800 rounded-xl overflow-hidden flex flex-col cursor-pointer hover:ring-2 hover:ring-blue-500 transition"
      >
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
          <div className="mt-auto pt-2 flex items-end justify-between gap-2">
            <div>
              <p className="text-blue-400 font-bold text-sm">
                ${parseFloat(producto.precios.precio_especial).toFixed(2)}
              </p>
              {producto.marca_logo && (
                <img src={producto.marca_logo} alt={producto.marca} className="h-4 object-contain mt-1 opacity-70" />
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Disponibilidad */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setModalProducto(producto)
                }}
                className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-500 flex items-center justify-center transition-colors"
                title="Ver disponibilidad"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                  <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
              </button>

              {/* Agregar al carrito */}
              {sinStock ? (
                <span className="flex-shrink-0 px-2 py-1 rounded-lg bg-slate-700 text-gray-500 text-xs font-medium">
                  Sin stock
                </span>
              ) : (
                <button
                  onClick={handleAgregar}
                  className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                    yaEnCarrito ? 'bg-green-500' : 'bg-amber-400 hover:bg-amber-300'
                  }`}
                  title={yaEnCarrito ? 'Ya en carrito' : 'Agregar al carrito'}
                >
                  {yaEnCarrito ? (
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : (
                    <img src={carrito} alt="carrito" className="w-5 invert" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
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
  const breadcrumbParam = searchParams.get('breadcrumb')
  const debouncedBusqueda = useDebounce(busqueda, 400)

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
      <Breadcrumb items={breadcrumbItems} />

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

      <div className="grid grid-cols-2 gap-3">
        {loading ? <ProductosSkeleton /> : productos.map(p => (
          <ProductCard key={p.producto_id} producto={p} />
        ))}
      </div>

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
