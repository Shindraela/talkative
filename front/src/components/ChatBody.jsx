import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SocketContext from '../SocketContext'
import ChatContext from '../ChatContext'

export const ChatBody = () => {
	const { socket } = useContext(SocketContext)
	const { roomName, setRoomName, messages, setMessages, typingStatus, setTypingStatus, lastMessageRef } = useContext(ChatContext)
	const navigate = useNavigate()

  useEffect(() => {
		socket.on('messageResponse', (data) => setMessages([...messages, data]))
    socket.on('typingResponse', (data) => setTypingStatus(data))

		// socket.on('joined', (roomId) => {
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
  }, [socket, messages, setMessages, setRoomName, setTypingStatus])

  const handleLeaveChat = () => {
    localStorage.removeItem('username')
    navigate('/')
    window.location.reload()
  }

  return (
    <>
      <header className="chat__mainHeader">
				<p>Welcome to {roomName} !</p>

        <button className="leaveChat__btn" onClick={handleLeaveChat}>
					LEAVE CHAT
        </button>
      </header>

      <div className="message__container">
        {messages && messages.map((message) =>
          message.name === localStorage.getItem('username') ? (
            <div className="message__chats" key={message.id}>
							<p className="sender__name">You</p>

              <div className="message__sender">
                <p>{message.text}</p>
              </div>
            </div>
          ) : (
            <div className="message__chats" key={message.id}>
              <p>{message.name}</p>

								<div className="message__recipient">
                <p>{message.text}</p>
              </div>
            </div>
          )
        )}

        <div className="message__status">
          <p>{typingStatus}</p>
				</div>
				
				<div ref={lastMessageRef} />
      </div>
    </>
  )
}
