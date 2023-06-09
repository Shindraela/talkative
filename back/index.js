const express = require('express')()
const cors = require('cors')
const http = require('http').createServer(express)
const io = require('socket.io')(http, {
	cors: {
		origin: 'http://localhost:5173'
	}
})
express.use(cors())

const { MongoClient } = require('mongodb')
const client = new MongoClient('mongodb://localhost:27017/?directConnection=true')

let users = []
let collection

io.use((socket, next) => {
	const username = socket.handshake.auth.username

  if (!username) {
    return next(new Error('invalid username'))
	}

  socket.username = username
  next()
})

io.on('connection', (socket) => {
	socket.on('join', async (roomId) => {
		try {
			let result = await collection.findOne({ '_id': roomId })

			if (!result) {
				await collection.insertOne({ '_id': roomId, messages: [] })
			}

			socket.join(roomId)
			socket.emit('joined', roomId)
			socket.activeRoom = roomId
		} catch (e) {
			console.error(e)
		}
	})

	/**
	 * Listen when a new user joins the server
	 * Add the new user to the list of users
	 * and send the list of users to the client
	 */
	socket.on('newUser', (data) => {
		const userID = socket.id
		users.push({ userID, ...data })

    io.to(socket.activeRoom).emit('newUserResponse', users)
	})
	
  // notify existing users
  socket.broadcast.emit('user connected', {
    userID: socket.id,
    username: socket.username,
    connected: true,
    messages: [],
	})

  // forward the private message to the right recipient (and to other tabs of the sender)
	socket.on('private message', ({ chatMessage, to }) => {
		socket.to(to).emit('private message', {
			chatMessage,
			from: socket.id,
		})
	})

	socket.on('message', (data) => {
		collection.updateOne({ '_id': socket.activeRoom }, {
			'$push': {
				'messages': data
			}
		})

		io.to(socket.activeRoom).emit('messageResponse', data)
	})

	socket.on('typing', (data) => socket.broadcast.emit('typingResponse', data))

  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected')
    // Update the list of users when a user disconnects from the server
		// And send the list of users to the client
		users = users.filter((user) => user.userID !== socket.id)

    io.to(socket.activeRoom).emit('newUserResponse', users)
    socket.disconnect()
  })
})

express.get('/chats', async (request, response) => {
	try {
		let result = await collection.findOne({ '_id': request.query.room })
		response.send(result)
	} catch (e) {
		response.status(500).send({ message: e.message })
	}
})

http.listen(4000, async () => {
	try {
		await client.connect()
		collection = client.db('talkative').collection('chats')
		console.log('Listening on port :%s...', http.address().port)
	} catch (e) {
		console.error(e)
	}
})
