import { createContext, useEffect, useState } from 'react'
import socket from './socket'

const SocketContext = createContext({})

export const SocketProvider = ({ children }) => {
	const [isConnected, setIsConnected] = useState(socket.connected)
	const [users, setUsers] = useState([])

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

	return (
		<SocketContext.Provider value={{ socket, isConnected, setIsConnected, users, setUsers }}>
			{children}
		</SocketContext.Provider>
	)
}

export default SocketContext
