import { useContext, useEffect } from 'react'
import { ConnectionState } from '../sockets/ConnectionState'
import { initReactiveProperties } from '../utils'
import SocketContext from '../SocketContext'
import ChatContext from '../ChatContext'

export const ChatBar = () => {
	const { socket, isConnected, users, setUsers } = useContext(SocketContext)
	const { selectedUser, onSelectUser } = useContext(ChatContext)

  useEffect(() => {
		socket.on('newUserResponse', (data) => {
			data.forEach((user) => {
				user.self = user.userID === socket.id
				initReactiveProperties(user)
			})

			// put the current user first, and then sort by username
			data = data.sort((a, b) => {
				if (a.self) return -1;
				if (b.self) return 1;
				if (a.username < b.username) return -1;
				return a.username > b.username ? 1 : 0;
			})

			setUsers(data)
		})

		socket.on('user connected', (user) => {
			initReactiveProperties(user)
			setUsers([...users, user])
		})
	}, [socket, users, selectedUser, setUsers])

	return (
    <div className="chat__sidebar">
      <h2>Open Chat</h2>

      <div>
				<h4 className="chat__header">ACTIVE USERS</h4>

        <div className="chat__users">
					{users && users.map((user) => (
						<div className="chat__user__status" key={user.userID}>
							<p onClick={() => onSelectUser(user)} className={`chat__username ${selectedUser.userID === user.userID ? 'selected' :  null}`}>{user.username}</p>

							<ConnectionState isConnected={isConnected} />
						</div>
          ))}
        </div>
      </div>
    </div>
  )
}
