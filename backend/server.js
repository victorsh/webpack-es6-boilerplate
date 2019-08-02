const express = require('express')
const app = express()
const path = require('path')
const port = 9000
const fs = require('fs')
const axios = require('axios')
const cors = require('cors')

app.use(cors())

app.get('/', (req, res) => {
  res.send('hello')
})

app.get('/cardata', (req, res) => {
  const data = fs.readFileSync(path.join(__dirname, '/data/cardata.json'), 'utf-8')
  res.json(JSON.parse(data))

  // axios.get('https://storage.googleapis.com/tfjs-tutorials/carsData.json')
  //   .then(res => {
  //     console.log(res.data)
  //     fs.writeFileSync('./cardata.json', JSON.stringify(res.data))
  //   })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
