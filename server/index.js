const express = require('express')
const syscomRoutes = require('./routes/syscom')
const PORT = process.env.PORT || 3000

const app = express()
app.use('/api/syscom', syscomRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})