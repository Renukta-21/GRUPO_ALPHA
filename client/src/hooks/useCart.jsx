import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cart')
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })
  const [open, setOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const agregar = (producto, cantidad = 1) => {
    setItems(prev => {
      const existe = prev.find(i => i.producto_id === producto.producto_id)
      if (existe) {
        return prev.map(i =>
          i.producto_id === producto.producto_id
            ? { ...i, cantidad: i.cantidad + cantidad }
            : i
        )
      }
      return [...prev, { ...producto, cantidad }]
    })
  }

  const quitar = (producto_id) => {
    setItems(prev => prev.filter(i => i.producto_id !== producto_id))
  }

  const cambiarCantidad = (producto_id, cantidad) => {
    if (cantidad < 1) return quitar(producto_id)
    setItems(prev =>
      prev.map(i => i.producto_id === producto_id ? { ...i, cantidad } : i)
    )
  }

  const vaciar = () => setItems([])

  const totalItems = items.reduce((acc, i) => acc + i.cantidad, 0)
  const totalPrecio = items.reduce(
    (acc, i) => acc + parseFloat(i.precios.precio_especial) * i.cantidad, 0
  )

  return (
    <CartContext.Provider value={{
      items, open, setOpen,
      agregar, quitar, cambiarCantidad, vaciar,
      totalItems, totalPrecio
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider')
  return ctx
}
