require('dotenv').config()
const express = require('express')
const app = express()
const http = require('http')
const socketConfig = require('./config/sockets')
const cookieParser = require('cookie-parser')
// Rutas
const publicRoutes = require('./routes/Public.routes')
const privateRoutes = require('./routes/Private.routes')
const requestServiceRoutes = require('./routes/RequestService.routes')
const procoopRoutes = require('./routes/Procoop.routes')

// Configuracion para los cors
const corsConfig = require('./config/app.conf')

app.use(corsConfig)
app.use(cookieParser())

// Configuracion para el body parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api', publicRoutes)
app.use('/api', privateRoutes)
app.use('/api', requestServiceRoutes)
app.use('/api', procoopRoutes)
//Para archivos
app.use('/images', express.static('images'))
const server = http.createServer(app)
socketConfig.init(server)

server.listen(4000, () => {
	console.log('Server is running on port 4000')
	console.log('http://localhost:4000')
})
