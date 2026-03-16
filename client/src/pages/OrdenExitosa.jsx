import { useNavigate, useSearchParams } from 'react-router-dom'

export default function OrdenExitosa() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('id')
  const total = searchParams.get('total')

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-5 text-white text-center px-6">
      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <div>
        <h1 className="text-xl font-bold mb-1">¡Pedido enviado!</h1>
        <p className="text-gray-400 text-sm">Orden #{orderId}</p>
      </div>
      <div className="bg-slate-800 rounded-xl px-6 py-4 w-full max-w-xs">
        <p className="text-gray-400 text-xs mb-1">Total del pedido</p>
        <p className="text-white font-bold text-2xl">${total} MXN</p>
      </div>
      <p className="text-gray-400 text-sm max-w-xs">
        Tu pedido fue enviado por WhatsApp. Nos pondremos en contacto contigo pronto para confirmar.
      </p>
      <button
        onClick={() => navigate('/')}
        className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-xl text-sm transition-colors"
      >
        Seguir comprando
      </button>
    </div>
  )
}
