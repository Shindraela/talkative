const express = require('express')
const http = require('http')
const cors = require('cors')
const app = express()
const PORT = 4000

const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server, {
	cors: {
		origin: 'http://localhost:5173'
	}
})
app.use(cors())

let users = []

io.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`)
  // Listen and log the message to the console
  socket.on('message', (data) => {
    io.emit('messageResponse', data)
	})

	socket.on('typing', (data) => socket.broadcast.emit('typingResponse', data))

	/**
	 * Listen when a new user joins the server
	 * Add the new user to the list of users
	 * and send the list of users to the client
	 */
	socket.on('newUser', (data) => {
		const socketID = socket.id
		users.push({ socketID, ...data })

    io.emit('newUserResponse', users)
  })

  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected')
    // Update the list of users when a user disconnects from the server
		// And send the list of users to the client
    users = users.filter((user) => user.socketID !== socket.id)
    io.emit('newUserResponse', users)
    socket.disconnect()
  })
})

io.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})
