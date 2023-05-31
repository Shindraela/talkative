import { useState, useEffect } from 'react'
import { ConnectionState } from '../sockets/ConnectionState'

export const ChatBar = ({ socket }) => {
	const [users, setUsers] = useState([])
	const [isConnected, setIsConnected] = useState(socket.connected)

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true)
    }

    const onDisconnect = () => {
      setIsConnected(false)
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
    }
  }, [])

  useEffect(() => {
		socket.on('newUserResponse', (data) => {
			setUsers(data)
		})
  }, [socket, users])

  return (
    <div className="chat__sidebar">
      <h2>Open Chat</h2>

      <div>
				<h4 className="chat__header">ACTIVE USERS</h4>

        <div className="chat__users">
					{users.map((user) => (
						<div className="chat__user__status" key={user.socketID}>
							<p >{user.userName}</p>

							<ConnectionState isConnected={isConnected} />
						</div>
          ))}
        </div>
      </div>
    </div>
  )
}
