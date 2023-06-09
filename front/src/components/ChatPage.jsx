import { useContext } from 'react'
import { ChatBar } from './ChatBar'
import { ChatBody } from './ChatBody'
import { ChatFooter } from './ChatFooter'
import ChatContext from '../ChatContext'

export const ChatPage = () => {
	const { selectedUser } = useContext(ChatContext)

  return (
    <div className="chat">
			<ChatBar />

			{
				selectedUser ?
					<div className="chat__main">
						<ChatBody />
						<ChatFooter />
					</div>
					:
					null
			}
    </div>
  )
}
