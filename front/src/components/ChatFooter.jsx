import { useContext, useState } from 'react'
import SocketContext from '../SocketContext'
import ChatContext from '../ChatContext'

export const ChatFooter = () => {
	const { socket } = useContext(SocketContext)
	const { selectedUser } = useContext(ChatContext)
	const [inputText, setChatMessage] = useState('')
	const userIsEmpty = Object.keys(selectedUser).length <= 0

  const validate = () => inputText.length

  const handleSendMessage = e => {
    e.preventDefault()
		let data = {}

		data = {
			text: inputText,
			name: localStorage.getItem('username'),
			userID: socket.id,
			from: socket.id,
		}

		socket.emit('private message', data)
		socket.emit('typing', null)
    setChatMessage('')
	}

	const onChatChange = e => {
		setChatMessage(e.target.value)

		if (e.target.value.length > 0) {
			socket.emit('typing', `${localStorage.getItem('username')} is typing`)
		} else {
			socket.emit('typing', null)
		}
	}

  return (
    <div className="chat__footer">
      <form className="form" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Write message"
          className="message"
          value={inputText}
					onChange={(e) => onChatChange(e)}
					disabled={userIsEmpty}
				/>

        <button className={`sendBtn ${!validate() ? 'disabled' :  null}`} disabled={!validate()}>SEND</button>
      </form>
    </div>
  )
}
