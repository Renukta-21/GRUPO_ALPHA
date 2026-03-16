import { useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'

export default function CartDrawer() {
  const navigate = useNavigate()
  const { items, open, setOpen, quitar, cambiarCantidad, vaciar, totalItems, totalPrecio } = useCart()

  if (!open) return null

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) setOpen(false)
  }

  const irACheckout = () => {
    setOpen(false)
    navigate('/checkout')
  }

  return (
    <div
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 flex justify-end bg-black/60"
    >
      <div className="w-full max-w-sm h-full bg-[#0f1724] flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-base">Carrito</span>
            {totalItems > 0 && (
              <span className="bg-amber-400 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {items.length > 0 && (
              <button
                onClick={vaciar}
                className="text-gray-500 hover:text-red-400 text-xs transition-colors"
              >
                Vaciar
              </button>
            )}
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-white text-xl transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Lista */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
              <div className="text-5xl opacity-20">🛒</div>
              <p className="text-gray-400 text-sm">Tu carrito está vacío</p>
              <button
                onClick={() => setOpen(false)}
                className="text-blue-400 text-sm hover:underline transition-colors"
              >
                Seguir comprando
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-white/5">
              {items.map(item => (
                <li key={item.producto_id} className="flex gap-3 px-4 py-4">
                  <div className="w-16 h-16 bg-white rounded-lg flex-shrink-0 overflow-hidden p-1">
                    <img src={item.img_portada} alt={item.titulo} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <p className="text-white text-xs leading-tight line-clamp-2">{item.titulo}</p>
                    <p className="text-gray-500 text-xs">{item.modelo}</p>
                    <p className="text-blue-400 text-sm font-bold">
                      ${parseFloat(item.precios.precio_especial).toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center border border-white/10 rounded-lg overflow-hidden">
                        <button
                          onClick={() => cambiarCantidad(item.producto_id, item.cantidad - 1)}
                          className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors text-sm"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-white text-xs font-medium">
                          {item.cantidad}
                        </span>
                        <button
                          onClick={() => cambiarCantidad(item.producto_id, item.cantidad + 1)}
                          className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors text-sm"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => quitar(item.producto_id)}
                        className="text-gray-600 hover:text-red-400 text-xs transition-colors ml-auto"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-white/10 px-5 py-4 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Subtotal ({totalItems} {totalItems === 1 ? 'pieza' : 'piezas'})</span>
              <span className="text-white font-bold text-base">${totalPrecio.toFixed(2)}</span>
            </div>
            <p className="text-gray-500 text-xs text-center">IVA incluido</p>
            <button
              onClick={irACheckout}
              className="w-full bg-amber-400 hover:bg-amber-300 text-black font-bold text-sm py-3 rounded-xl transition-colors"
            >
              Proceder al pago →
            </button>
            <button
              onClick={() => setOpen(false)}
              className="w-full text-gray-400 hover:text-white text-sm py-2 transition-colors"
            >
              Seguir comprando
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
