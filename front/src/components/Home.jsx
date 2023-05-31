import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Talkative from '../assets/logo_talkative.svg'

export const Home = ({ socket }) => {
  const navigate = useNavigate()
	const [userName, setUserName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
		localStorage.setItem('userName', userName)
		socket.emit('newUser', { userName, socketID: socket.id })
    navigate('/chat')
	}

	const connect = () => {
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
					value={userName}
					onChange={(e) => setUserName(e.target.value)}
				/>

				<button className="home__cta" onClick={ connect }>Connect</button>
			</form>
		</div>
  )
}
