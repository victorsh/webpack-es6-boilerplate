const express = require('express')
const app = express()
const path = require('path')
const port = 9000

app.get('/', (req, res) => {
  res.send('hello')
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
