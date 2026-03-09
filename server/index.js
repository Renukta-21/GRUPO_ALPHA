const express = require('express')
const syscomRoutes = require('./routes/syscom')
const cors = require('cors')
const PORT = process.env.PORT || 3000

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/syscom', syscomRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})