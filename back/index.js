const express = require('express')
const app = express()
const PORT = 5000

const http = require('http').Server(app)
const cors = require('cors')

app.use(cors())

const socketIO = require('socket.io')(http, {
	cors: {
		origin: 'http://localhost:5173'
	}
})

let users = []

socketIO.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`)
  // Listen and log the message to the console
  socket.on('message', (data) => {
    socketIO.emit('messageResponse', data)
	})

	socket.on('typing', (data) => socket.broadcast.emit('typingResponse', data))

	/**
	 * Listen when a new user joins the server
	 * Add the new user to the list of users
	 * and send the list of users to the client
	 */
	socket.on('newUser', (data) => {
		users.push(data)
    socketIO.emit('newUserResponse', users)
  })

  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected')
    // Update the list of users when a user disconnects from the server
		// And send the list of users to the client
    users = users.filter((user) => user.socketID !== socket.id)
    socketIO.emit('newUserResponse', users)
    socket.disconnect()
  })
})

app.get('/api', (req, res) => {
  res.json({
    message: 'Hello world',
  })
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})
