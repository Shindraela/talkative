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

	socket.on('message', (data) => {
		collection.updateOne({ '_id': socket.activeRoom }, {
			'$push': {
				'messages': data
			}
		})

		io.to(socket.activeRoom).emit('messageResponse', data)
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

    io.to(socket.activeRoom).emit('newUserResponse', users)
  })

  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected')
    // Update the list of users when a user disconnects from the server
		// And send the list of users to the client
		users = users.filter((user) => user.socketID !== socket.id)

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
