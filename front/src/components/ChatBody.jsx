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
        {messages && messages.map((message, index) =>
          message.name === localStorage.getItem('username') ? (
            <div className="message__chats" key={index}>
							<p className="sender__name">You</p>

              <div className="message__sender">
                <p>{message.text}</p>
              </div>
            </div>
          ) : (
            <div className="message__chats" key={index}>
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
