import { useContext } from 'react'
import { createContext, useState, useEffect, useRef } from 'react'
import SocketContext from './SocketContext'

const ChatContext = createContext({})

export const ChatProvider = ({ children }) => {
	const { socket, users } = useContext(SocketContext)
	const [messages, setMessages] = useState([])
	const [chatMessage, setChatMessage] = useState([])
	const [roomName, setRoomName] = useState('')
  const [typingStatus, setTypingStatus] = useState('')
  const [selectedUser, setSelectedUser] = useState({})
	const lastMessageRef = useRef(null)

  useEffect(() => {
    // scroll to bottom every time messages change
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages])

	const onSelectUser = user => {
		console.log('user :', user)
		setSelectedUser(user)
		user.hasNewMessages = false

		if (user) {
			socket.emit('private message', {
				chatMessage,
				to: user.userID,
			})

			user.messages.push({
				chatMessage,
				fromSelf: true,
			})
		}

		socket.on('private message', ({ chatMessage, from }) => {
			for (let i = 0; i < users.length; i++) {
				const user = users[i]

				if (user.userID === from) {
					user.messages.push({
						chatMessage,
						fromSelf: false,
					})

					if (user !== selectedUser) {
						user.hasNewMessages = true
					}
					break
				}
			}
		})

		// socket.on('joined', (roomId) => {
		// 	console.log('joined roomId :', roomId)
		// 	const fetchData = async () => {
		// 		const result = await fetch('http://localhost:4000/chats?room=' + roomId).then(response => response.json())
		// 		console.log('joined result :', result)

		// 		if (result.messages.length > 0) {
		// 			setMessages(result.messages)
		// 		}

		// 		if (result._id.length > 20) {
		// 			result._id.shift()
		// 		}
		// 		setRoomName(result._id)
		// 	}

		// 	fetchData()
		// })
	}

	return (
		<ChatContext.Provider value={{ chatMessage, setChatMessage, messages, setMessages, roomName, setRoomName, typingStatus, setTypingStatus, selectedUser, setSelectedUser, onSelectUser, lastMessageRef }}>
			{children}
		</ChatContext.Provider>
	)
}

export default ChatContext
