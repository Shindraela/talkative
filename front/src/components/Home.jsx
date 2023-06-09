import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Talkative from '../assets/logo_talkative.svg'
import SocketContext from '../SocketContext'

export const Home = () => {
	const { socket } = useContext(SocketContext)
  const navigate = useNavigate()
	const [username, setUsername] = useState('')
	const [usernameAlreadySelected, setUsernameAlreadySelected] = useState(false)

	useEffect(() => {
		socket.on('connect_error', (err) => {
      if (err.message === 'invalid username') {
        setUsernameAlreadySelected(false)
      }
		})

    return () => socket.off('connect_error')
	}, [socket, usernameAlreadySelected])

  const handleSubmit = (e) => {
    e.preventDefault()
		localStorage.setItem('username', username)
		const messages = []
		socket.emit('newUser', { username, userID: socket.id, messages })
    navigate('/chat')
	}

	const connect = () => {
		socket.auth = { username }
		socket.connect()
		socket.emit('join', 'chats')
	}

	return (
		<div className="home">
			<form className="home__container" onSubmit={handleSubmit}>
				<h2 className="home__header">
					<img alt="Logo Talkative" src={Talkative} />
					<div>Talkative</div>
				</h2>

				<label htmlFor="username">Username</label>
				<input
					type="text"
					minLength={5}
					name="username"
					id="username"
					className="username__input"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>

				{!usernameAlreadySelected ? <button className="home__cta" onClick={ connect }>Connect</button> : null}
			</form>
		</div>
  )
}
