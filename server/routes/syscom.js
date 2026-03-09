const router = require('express').Router()
const { getToken } = require('../services/syscom')

router.get('/', async (req, res) => {
  try {
    const token = await getToken()
    res.json(token)
  }  catch (error) {
    res.status(500).json({message: "Error al obtener el token"})
  }
})

module.exports = router