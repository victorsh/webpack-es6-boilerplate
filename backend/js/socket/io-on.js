'use strict'

const uuid = require('./uuid')

module.exports = {
  connect: async () => {
    global[uuid].io.on('connect', async (client) => {
      client.on('disconnect', () => {})
      console.log('user is connected')
      global[uuid].io.sockets.emit('sup', 'dog')
    })
  },
  emit: async (evt, msg) => {
    setTimeout(() => {
      global[uuid].io.sockets.emit(evt, msg)
    }, 1000)
  }
}
