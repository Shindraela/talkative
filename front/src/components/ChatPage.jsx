import { useEffect, useRef, useState } from 'react'
import { ChatBar } from './ChatBar'
import { ChatBody } from './ChatBody'
import { ChatFooter } from './ChatFooter'

export const ChatPage = ({ socket }) => {
	const [messages, setMessages] = useState([])
	const [roomName, setRoomName] = useState('')
  const [typingStatus, setTypingStatus] = useState('')
  const lastMessageRef = useRef(null)

  useEffect(() => {
		socket.on('messageResponse', (data) => setMessages([...messages, data]))

		socket.on('joined', (roomId) => {
			const fetchData = async () => {
				const result = await fetch('http://localhost:4000/chats?room=' + roomId).then(response => response.json())

				if (result.messages.length > 0) {
					setMessages(result.messages)
				}

				if (result._id.length > 20) {
					result._id.shift()
				}
				setRoomName(result._id)
			}

			fetchData()
		})
  }, [socket, messages])

  useEffect(() => {
    // scroll to bottom every time messages change
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    socket.on('typingResponse', (data) => setTypingStatus(data))
  }, [socket])

  return (
    <div className="chat">
			<ChatBar socket={socket} />

      <div className="chat__main">
        <ChatBody roomName={roomName} messages={messages} typingStatus={typingStatus} lastMessageRef={lastMessageRef} />
        <ChatFooter socket={socket} />
      </div>
    </div>
  )
}
