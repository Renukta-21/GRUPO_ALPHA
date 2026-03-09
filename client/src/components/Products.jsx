import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

function Productos() {
  const [searchParams] = useSearchParams()
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(false)

  const busqueda = searchParams.get('busqueda')
  const categoria = searchParams.get('categoria')

  useEffect(() => {
    if (!busqueda && !categoria) return

    setLoading(true)
    const params = new URLSearchParams()
    if (busqueda) params.append('busqueda', busqueda)
    if (categoria) params.append('categoria', categoria)

    fetch(`http://localhost:3000/api/syscom/products?${params}`)
      .then(res => res.json())
      .then(data => setProductos(data.productos || []))
      .finally(() => setLoading(false))
  }, [busqueda, categoria])

  if (loading) return <p className="text-white">Cargando...</p>

  return (
    <div className="text-white">
      <h1 className="text-xl mb-4">
        {busqueda ? `Resultados: "${busqueda}"` : `Categoría`}
      </h1>
      <div className="grid grid-cols-3 gap-4">
        {productos.map(p => (
          <div key={p.producto_id} className="bg-slate-800 p-4 rounded">
            <img src={p.img_portada} alt={p.titulo} className="w-full" />
            <p className="mt-2 text-sm">{p.titulo}</p>
            <p className="text-blue-400">${p.precios.precio_especial}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Productos