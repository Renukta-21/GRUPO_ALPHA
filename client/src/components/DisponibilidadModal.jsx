export default function DisponibilidadModal({ productoId, existencia, onClose }) {
  const nuevo     = existencia?.nuevo ?? 0
  const asterisco = existencia?.asterisco ?? {}
  const totalAlt  = (asterisco.a ?? 0) + (asterisco.b ?? 0) + (asterisco.c ?? 0) + (asterisco.d ?? 0)

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
    >
      <div className="bg-slate-900 rounded-xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-700">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="text-white text-sm font-semibold">
              Disponibilidad {productoId}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-lg leading-none transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Stock principal */}
        <div className="px-6 py-8 flex flex-col items-center gap-1 border-b border-slate-700">
          <span className="text-5xl font-bold text-white">{nuevo}</span>
          <span className="text-gray-400 text-sm mt-1">piezas nuevas disponibles</span>
          <div className={`mt-3 px-3 py-1 rounded-full text-xs font-medium ${
            nuevo > 50
              ? 'bg-green-900/50 text-green-400 border border-green-800'
              : nuevo > 0
              ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-800'
              : 'bg-red-900/50 text-red-400 border border-red-800'
          }`}>
            {nuevo > 50 ? '● Stock disponible' : nuevo > 0 ? '● Stock limitado' : '● Sin stock'}
          </div>
        </div>

        {/* Stock asterisco — solo si hay */}
        {totalAlt > 0 && (
          <div className="px-4 py-4 border-b border-slate-700">
            <p className="text-gray-400 text-xs mb-3 text-center">Stock con condición especial</p>
            <div className="flex justify-center gap-2">
              {['a', 'b', 'c', 'd'].map(tipo =>
                asterisco[tipo] > 0 ? (
                  <div key={tipo} className="flex flex-col items-center bg-slate-800 rounded-lg px-4 py-2">
                    <span className="text-amber-400 text-lg font-bold">{asterisco[tipo]}</span>
                    <span className="text-gray-500 text-xs uppercase mt-0.5">Tipo {tipo}</span>
                  </div>
                ) : null
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-800/40">
          <span className="text-gray-400 text-xs">Total existencia</span>
          <span className="text-white text-sm font-semibold">{nuevo + totalAlt} piezas</span>
        </div>
      </div>
    </div>
  )
}
