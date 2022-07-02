import { Box } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import ChatBox from '../components/ChatBox'
import SideDrawer from '../components/miscellaneous/SideDrawer'
import MyChats from '../components/MyChats'
import { ChatState } from '../Context/ChatProvider'

const ChatPage = () => {
    const [fetchAgain, setFetchAgain] = useState(false)
    const { user } = ChatState()

    return (
        <div style={{ width: '100%' }}>
            {user && <SideDrawer />}
            <Box
                d='flex'
                justifyContent='space-between'
                w='100%'
                h='91.5vh'
                p='10px'
            >
                {user && <MyChats fetchAgain={fetchAgain} />}
                {user && (
                    <ChatBox
                        fetchAgain={fetchAgain}
                        setFetchAgain={setFetchAgain}
                    />
                )}
            </Box>
        </div>
    )
}

export default ChatPage
