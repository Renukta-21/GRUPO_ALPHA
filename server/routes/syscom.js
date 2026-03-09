const router = require('express').Router()
const syscomAPI = require('../services/syscom')

router.get('/categories', async (req, res) => {
  try {
    const {data} = await syscomAPI.get('/categorias')
    res.json(data)
  }  catch (error) {
    res.status(500).json({message: "Error al obtener el token"})
  }
})
router.get('/categories/:id', async(req,res)=>{
  const {id} = req.params
  try {
    const {data} = await syscomAPI.get(`/categorias/${id}`)
    res.json(data)
   } catch (error) {
    res.status(500).json({message: "Error al obtener la categoría"})
  }
})
router.get('/products', async (req, res) => {
  try {
    const { data } = await syscomAPI.get('/productos', { params: req.query })
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/productos', async (req, res) => {
  try {
    const { data } = await syscomAPI.get('/productos', { params: req.query })
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})
module.exports = router