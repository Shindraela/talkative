import { useContext, useState } from 'react'
import SocketContext from '../SocketContext'

export const ChatFooter = () => {
	const { socket } = useContext(SocketContext)
  // const [message, setMessage] = useState('')
  const [chatMessage, setChatMessage] = useState('')

	const handleTyping = () => {
		if (chatMessage.length > 1) {
			socket.emit('typing', `${localStorage.getItem('username')} is typing`)
		} else {
			socket.emit('typing', null)
		}
	}

  const handleSendMessage = (e) => {
    e.preventDefault()
		let content = {}
		if (chatMessage.trim() && localStorage.getItem('username')) {
			content = {
        text: chatMessage,
        name: localStorage.getItem('username'),
        id: `${socket.id}${Math.random()}`,
        userID: socket.id,
      }
      socket.emit('message', content)
		}

    setChatMessage(content)
	}

  return (
    <div className="chat__footer">
      <form className="form" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Write message"
          className="message"
          value={chatMessage}
					onChange={(e) => setChatMessage(e.target.value)}
					onKeyDown={handleTyping}
				/>

        <button className="sendBtn">SEND</button>
      </form>
    </div>
  )
}
