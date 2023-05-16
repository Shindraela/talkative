import { BrowserRouter, Routes, Route } from 'react-router-dom'
import socketIO from 'socket.io-client'
import { Home } from './components/Home'
import { ChatPage } from './components/ChatPage'

const socket = socketIO.connect('http://localhost:5000', {
  autoConnect: false
})

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Home socket={socket} />}></Route>
          <Route path="/chat" element={<ChatPage socket={socket} />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App
