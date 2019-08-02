const express = require('express')
const app = express()

const path = require('path')
const fs = require('fs')
const axios = require('axios')
const cors = require('cors')

const port = 9000

app.use(cors())

app.get('/', (req, res) => {
  res.send('hello')
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
