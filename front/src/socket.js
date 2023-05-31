import { io } from 'socket.io-client'

// "undefined" means the URL will be computed from the `window.location` object
const URL = import.meta.env.NODE_ENV === 'production' ? undefined : import.meta.env.VITE_BASE_URL

const socket = io(URL, {
  autoConnect: false
})

socket.onAny((event, ...args) => {
  console.log(event, args)
})

export default socket
