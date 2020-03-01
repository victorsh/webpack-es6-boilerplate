'use strict'

const server = require('./js/server')
const http = require('http').Server(server)
const uuid = require('./js/socket/uuid')
const ioon = require('./js/socket/io-on')

global[uuid] = {}
global[uuid].io = require('socket.io')(http)

const port = 9000

http.listen(port, async () => {
  console.log(`Example app listening on port ${port}!`)
  await ioon.connect()
})
