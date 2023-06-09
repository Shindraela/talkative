import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './components/Home'
import { ChatPage } from './components/ChatPage'
import { SocketProvider } from './SocketContext'
import { ChatProvider } from './ChatContext'

function App() {
	return (
		<SocketProvider>
			<ChatProvider>
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<Home />}></Route>
						<Route path="/chat" element={<ChatPage />}></Route>
					</Routes>
				</BrowserRouter>
			</ChatProvider>
		</SocketProvider>
  );
}

export default App
