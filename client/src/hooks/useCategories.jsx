import { useState, useRef } from 'react'

const cache = {}  

export const useCategorias = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getCategorias = async () => {
    if (cache['root']) return cache['root'] 

    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/categories`)
      const data = await res.json()
      cache['root'] = data  
      return data
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getSubcategorias = async (id) => {
    if (cache[id]) return cache[id] 

    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/categories/${id}`)
      const data = await res.json()
      cache[id] = data.subcategorias  
      return data.subcategorias
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { getCategorias, getSubcategorias, loading, error }
}