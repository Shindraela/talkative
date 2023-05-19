import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { socket } from './socket'
import { Home } from './components/Home'
import { ChatPage } from './components/ChatPage'

function App() {
  return (
    <BrowserRouter>
			<Routes>
				<Route path="/" element={<Home socket={socket} />}></Route>
				<Route path="/chat" element={<ChatPage socket={socket} />}></Route>
			</Routes>
    </BrowserRouter>
  );
}

export default App
