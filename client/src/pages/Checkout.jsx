import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'

export default function Checkout() {
  const navigate = useNavigate()
  const { items, totalItems, totalPrecio, vaciar } = useCart()

  const [form, setForm] = useState({
    nombre: '',
    telefono: '',
    calle: '',
    colonia: '',
    ciudad: '',
    estado: '',
    cp: '',
    referencias: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Redirige si el carrito está vacío
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4 text-white">
        <div className="text-5xl opacity-20">🛒</div>
        <p className="text-gray-400">Tu carrito está vacío</p>
        <button onClick={() => navigate('/')} className="text-blue-400 hover:underline text-sm">
          Ir a comprar
        </button>
      </div>
    )
  }

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const addressCompleta = [
    form.calle,
    form.colonia,
    form.ciudad,
    form.estado,
    form.cp ? `CP ${form.cp}` : '',
    form.referencias
  ].filter(Boolean).join(', ')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!form.nombre || !form.calle || !form.ciudad) {
      setError('Por favor llena nombre, calle y ciudad como mínimo.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          address: addressCompleta,
          cliente: `${form.nombre} | Tel: ${form.telefono}`
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al generar la orden')

      // Abre WhatsApp con el mensaje listo
      window.open(data.whatsappUrl, '_blank')

      // Limpia el carrito y redirige
      vaciar()
      navigate(`/orden-exitosa?id=${data.orderId}&total=${data.total}`)

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full text-white pb-20 max-w-2xl mx-auto">

      {/* Header */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-6 transition-colors"
      >
        ← Volver al carrito
      </button>

      <h1 className="text-xl font-bold mb-6">Finalizar pedido</h1>

      <div className="flex flex-col gap-6">

        {/* Resumen del carrito */}
        <div className="bg-slate-800 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <span className="text-sm font-medium">Resumen del pedido</span>
            <span className="text-gray-400 text-xs">{totalItems} {totalItems === 1 ? 'producto' : 'productos'}</span>
          </div>
          <ul className="divide-y divide-white/5">
            {items.map(item => (
              <li key={item.producto_id} className="flex items-center gap-3 px-4 py-3">
                <div className="w-12 h-12 bg-white rounded-lg flex-shrink-0 p-1">
                  <img src={item.img_portada} alt={item.titulo} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white line-clamp-1">{item.titulo}</p>
                  <p className="text-xs text-gray-500">{item.modelo} · x{item.cantidad}</p>
                </div>
                <span className="text-blue-400 text-sm font-bold flex-shrink-0">
                  ${(parseFloat(item.precios.precio_especial) * item.cantidad).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
          <div className="px-4 py-3 border-t border-white/10 flex justify-between items-center">
            <span className="text-gray-400 text-sm">Total</span>
            <span className="text-white font-bold">${totalPrecio.toFixed(2)} MXN</span>
          </div>
        </div>

        {/* Formulario de dirección */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h2 className="text-base font-semibold">Datos de entrega</h2>

          {/* Nombre y teléfono */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Nombre completo *</label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Juan Pérez"
                className="bg-slate-800 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Teléfono</label>
              <input
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                placeholder="55 1234 5678"
                className="bg-slate-800 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Calle */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">Calle y número *</label>
            <input
              name="calle"
              value={form.calle}
              onChange={handleChange}
              placeholder="Av. Insurgentes 123, Int. 4B"
              className="bg-slate-800 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Colonia y Ciudad */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Colonia</label>
              <input
                name="colonia"
                value={form.colonia}
                onChange={handleChange}
                placeholder="Del Valle"
                className="bg-slate-800 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Ciudad *</label>
              <input
                name="ciudad"
                value={form.ciudad}
                onChange={handleChange}
                placeholder="Ciudad de México"
                className="bg-slate-800 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Estado y CP */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Estado</label>
              <input
                name="estado"
                value={form.estado}
                onChange={handleChange}
                placeholder="CDMX"
                className="bg-slate-800 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Código Postal</label>
              <input
                name="cp"
                value={form.cp}
                onChange={handleChange}
                placeholder="03100"
                className="bg-slate-800 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Referencias */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">Referencias adicionales</label>
            <input
              name="referencias"
              value={form.referencias}
              onChange={handleChange}
              placeholder="Entre calles, color de fachada..."
              className="bg-slate-800 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-900/30 border border-red-800 rounded-lg px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Botón enviar */}
          <button
            type="submit"
            disabled={loading}
            className="w-full  cursor-pointer bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm mt-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generando orden...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Enviar pedido por WhatsApp
              </>
            )}
          </button>

          <p className="text-gray-600 text-xs text-center">
            Se abrirá WhatsApp con el resumen completo de tu pedido
          </p>
        </form>
      </div>
    </div>
  )
}
