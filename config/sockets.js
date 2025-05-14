const socketIo = require('socket.io')

let io

module.exports = {
	init: (server) => {
		io = socketIo(server, {
			cors: {
				origin: '*',
				methods: ['GET', 'POST'],
			},
		})

		io.on('connection', (socket) => {
			console.log('New client connected')

			// Emitir un evento de ejemplo
			socket.emit('message', 'Hello from server')

			socket.on('disconnect', () => {
				console.log('Client disconnected')
			})
		})

		return io
	},
	getIo: () => {
		if (!io) {
			throw new Error('Socket.io not initialized!')
		}
		return io
	},
}
