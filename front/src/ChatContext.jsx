import { useContext } from 'react'
import { createContext, useState, useEffect, useRef } from 'react'
import SocketContext from './SocketContext'

const ChatContext = createContext({})

export const ChatProvider = ({ children }) => {
	const { socket, users } = useContext(SocketContext)
	const [messages, setMessages] = useState([])
	const [text, setChatMessage] = useState([])
	const [roomName, setRoomName] = useState('')
  const [typingStatus, setTypingStatus] = useState('')
  const [selectedUser, setSelectedUser] = useState({})
	const lastMessageRef = useRef(null)

	useEffect(() => {
    // scroll to bottom every time messages change
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' })

		socket.on('private message', ({ text, from }) => {
			for (let i = 0; i < users.length; i++) {
				const user = users[i]

				if (user.userID === from) {
					user.messages.push({
						text,
						fromSelf: false,
					})

					if (user !== selectedUser) {
						user.hasNewMessages = true
					}
					break
				}
			}
		})

		return () => socket.off('private message')
	}, [socket, selectedUser, users, messages])

	const onSelectUser = user => {
		setSelectedUser(user)
		user.hasNewMessages = false
	}

	return (
		<ChatContext.Provider value={{ text, setChatMessage, messages, setMessages, roomName, setRoomName, typingStatus, setTypingStatus, selectedUser, setSelectedUser, onSelectUser, lastMessageRef }}>
			{children}
		</ChatContext.Provider>
	)
}

export default ChatContext
