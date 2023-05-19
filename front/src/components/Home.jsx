import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ConnectionState } from '../sockets/ConnectionState'
import { ConnectionManager } from '../sockets/ConnectionManager'

export const Home = ({ socket }) => {
  const navigate = useNavigate()
	const [userName, setUserName] = useState('')
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

  const handleSubmit = (e) => {
    e.preventDefault()
		localStorage.setItem('userName', userName)
		socket.emit('newUser', { userName, socketID: socket.id })
    navigate('/chat')
	}

	return (
		<>
			<ConnectionState isConnected={isConnected} />

			<form className="home__container" onSubmit={handleSubmit}>
				<h2 className="home__header">Sign in to Open Chat</h2>
				<label htmlFor="username">Username</label>
				<input
					type="text"
					minLength={6}
					name="username"
					id="username"
					className="username__input"
					value={userName}
					onChange={(e) => setUserName(e.target.value)}
					/>

				<ConnectionManager />
			</form>
		</>
  )
}
