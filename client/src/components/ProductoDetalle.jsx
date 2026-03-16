import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DisponibilidadModal from './DisponibilidadModal'
import { useCart } from '../hooks/useCart'

export default function ProductoDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [producto, setProducto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [imagenActiva, setImagenActiva] = useState(0)
  const [showDisponibilidad, setShowDisponibilidad] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetch(`${import.meta.env.VITE_API_URL}/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Producto no encontrado')
        return res.json()
      })
      .then(data => {
        setProducto(data)
        setImagenActiva(0)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="flex justify-center items-center py-32">
      <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (error) return (
    <div className="flex flex-col items-center py-32 gap-4">
      <p className="text-red-400">{error}</p>
      <button onClick={() => navigate(-1)} className="text-blue-400 hover:underline text-sm">
        ← Volver
      </button>
    </div>
  )

  if (!producto) return null

  const todasLasImagenes = [
    producto.img_portada,
    ...(producto.imagenes || []).map(i => i.imagen)
  ].filter(Boolean)

  const imagenesUnicas = [...new Map(todasLasImagenes.map(url => [url, url])).values()]
  const total = imagenesUnicas.length

  const prev = () => setImagenActiva(i => (i - 1 + total) % total)
  const next = () => setImagenActiva(i => (i + 1) % total)

  return (
    <div className="w-full text-white pb-16">
      {showDisponibilidad && (
        <DisponibilidadModal
          productoId={id}
          existencia={producto.existencia}
          onClose={() => setShowDisponibilidad(false)}
        />
      )}

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-4 transition-colors"
      >
        ← Volver
      </button>

      {/* ── MÓVIL ── */}
      <div className="md:hidden flex flex-col gap-4">
        <div className="relative bg-slate-800 rounded-xl overflow-hidden">
          <img
            key={imagenActiva}
            src={imagenesUnicas[imagenActiva]}
            alt={producto.titulo}
            className="w-full h-72 object-contain p-4"
          />
          {total > 1 && (
            <>
              <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white text-xl hover:bg-black/70 transition">‹</button>
              <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white text-xl hover:bg-black/70 transition">›</button>
            </>
          )}
          {total > 1 && (
            <div className="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
              {imagenActiva + 1} / {total}
            </div>
          )}
          {total > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {imagenesUnicas.map((_, i) => (
                <button key={i} onClick={() => setImagenActiva(i)}
                  className={`h-2 rounded-full transition-all ${i === imagenActiva ? 'bg-blue-400 w-4' : 'bg-white/40 w-2'}`}
                />
              ))}
            </div>
          )}
        </div>
        <InfoProducto
          producto={producto}
          onVerDisponibilidad={() => setShowDisponibilidad(true)}
        />
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden md:flex gap-4 items-start">
        <div className="flex flex-col gap-2 w-14 flex-shrink-0">
          {imagenesUnicas.map((url, i) => (
            <button key={i} onClick={() => setImagenActiva(i)}
              className={`w-14 h-14 rounded-lg overflow-hidden bg-white p-1 border-2 transition-all ${
                imagenActiva === i ? 'border-blue-500 opacity-100' : 'border-transparent opacity-50 hover:opacity-80'
              }`}
            >
              <img src={url} alt={`img-${i}`} className="w-full h-full object-contain" />
            </button>
          ))}
        </div>
        <div className="flex-1 bg-slate-800 rounded-xl overflow-hidden flex items-center justify-center" style={{ minHeight: '320px', maxHeight: '420px' }}>
          <img
            key={imagenActiva}
            src={imagenesUnicas[imagenActiva]}
            alt={producto.titulo}
            className="w-full h-full object-contain p-4"
            style={{ maxHeight: '420px' }}
          />
        </div>
        <div className="flex-1">
          <InfoProducto
            producto={producto}
            onVerDisponibilidad={() => setShowDisponibilidad(true)}
          />
        </div>
      </div>
    </div>
  )
}

function InfoProducto({ producto, onVerDisponibilidad }) {
  const { agregar, setOpen, items } = useCart()
  const [cantidad, setCantidad] = useState(1)

  const yaEnCarrito = items.some(i => i.producto_id === producto.producto_id)

  const handleAgregar = () => {
    if (yaEnCarrito) {
      setOpen(true)
      return
    }
    agregar(producto, cantidad)
    setOpen(true)
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        {producto.marca_logo && (
          <img src={producto.marca_logo} alt={producto.marca} className="h-5 object-contain mb-2 opacity-70" />
        )}
        <h1 className="text-white font-bold text-lg leading-snug">
          {producto.titulo}
        </h1>
      </div>

      {/* Precio */}
      <div className="flex items-baseline gap-3">
        <span className="text-blue-400 text-3xl font-bold">
          ${parseFloat(producto.precios.precio_descuento).toFixed(2)}
        </span>
        {producto.precios.precio_lista !== producto.precios.precio_especial && (
          <span className="text-gray-500 text-sm line-through">
            ${parseFloat(producto.precios.precio_lista).toFixed(2)} precio lista
          </span>
        )}
      </div>

      {/* Selector de cantidad + botón agregar */}
      <div className="flex items-center gap-3">
        {/* Cantidad */}
        <div className="flex items-center border border-white/10 rounded-lg overflow-hidden">
          <button
            onClick={() => setCantidad(q => Math.max(1, q - 1))}
            className="w-9 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            −
          </button>
          <span className="w-10 text-center text-white text-sm font-medium">{cantidad}</span>
          <button
            onClick={() => setCantidad(q => q + 1)}
            className="w-9 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            +
          </button>
        </div>

        {/* Agregar al carrito */}
        <button
          onClick={handleAgregar}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all ${
            yaEnCarrito
              ? 'bg-green-500 text-white'
              : 'bg-amber-400 hover:bg-amber-300 text-black'
          }`}
        >
          {yaEnCarrito ? (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Ver carrito
            </>
          ) : (
            <>🛒 Agregar al carrito</>
          )}
        </button>
      </div>

      {producto.caracteristicas?.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {producto.caracteristicas.map((c, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-200">
              <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>
              {c}
            </li>
          ))}
        </ul>
      )}

      {/* Metadatos */}
      <div className="flex flex-col gap-2 pt-2 border-t border-slate-700">
        <MetaRow icon="📦" label="Modelo"     value={producto.modelo} highlight />
        <MetaRow icon="🏷️" label="Marca"      value={producto.marca} highlight />
        <MetaRow icon="#"  label="Código SAT" value={producto.sat_key} highlight />
        <MetaRow icon="🛡️" label="Garantía"   value={`${producto.garantia} con SYSCOM`} highlight />
        {producto.total_existencia > 0 && (
          <MetaRow icon="✅" label="Stock" value={`${producto.total_existencia} piezas`} />
        )}
      </div>

      {/* Botón disponibilidad */}
      <button
        onClick={onVerDisponibilidad}
        className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors w-fit"
      >
        🏬 Ver disponibilidad
      </button>

      {/* Recursos */}
      {producto.recursos?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {producto.recursos.map((r, i) => (
            <a key={i} href={r.path} target="_blank" rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 rounded-full border border-slate-600 text-gray-300 hover:border-blue-500 hover:text-blue-400 transition-colors"
            >
              {r.recurso.replace(/_/g, ' ')}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

function MetaRow({ icon, label, value, highlight }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-500 w-4 text-center text-xs">{icon}</span>
      <span className="text-gray-400">{label}:</span>
      <span className={highlight ? 'text-blue-400 font-medium' : 'text-gray-200'}>{value}</span>
    </div>
  )
}
