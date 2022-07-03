import {
    Box,
    FormControl,
    IconButton,
    Input,
    Spinner,
    Text,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { getSender, getSenderFull } from '../config/ChatLogics'
import ProfileModal from './miscellaneous/ProfileModal'
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal'
import axios from 'axios'
import { useToast } from '@chakra-ui/react'
import './styles.css'
import ScrollableChat from './ScrollableChat'
import io from 'socket.io-client'
import Lottie from 'react-lottie'
import animationData from '../animations/typing.json'

const ENDPOINT = 'http://localhost:5000'
let socket, selectedChatCompare

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const {
        user,
        selectedChat,
        setSelectedChat,
        notification,
        setNotification,
        online,
        setOnline,
    } = ChatState()
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState('')
    const toast = useToast()
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    }

    const fetchMessages = async () => {
        if (!selectedChat) return

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }
            setLoading(true)
            const { data } = await axios.get(
                `/api/message/${selectedChat._id}`,
                config
            )
            setMessages(data)
            setLoading(false)

            socket.emit('join chat', selectedChat._id)
        } catch (error) {
            toast({
                title: 'Error Occured!',
                description: 'Failed to Load the Messages',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            })
        }
    }

    const sendMessage = async (e) => {
        if (e.key === 'Enter' && newMessage) {
            socket.emit('stop typing', selectedChat._id)
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`,
                    },
                }

                setNewMessage('')

                const { data } = await axios.post(
                    '/api/message',
                    {
                        content: newMessage,
                        chatId: selectedChat._id,
                    },
                    config
                )

                socket.emit('new message', data)
                setFetchAgain(!fetchAgain)
                setMessages([...messages, data])
            } catch (err) {
                toast({
                    title: 'Error Occured!',
                    description: 'Failed to send the message',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom',
                })
            }
        }
    }

    useEffect(() => {
        socket = io(ENDPOINT)
        socket.emit('setup', user)
        socket.on('connected', () => setSocketConnected(true))
        socket.on('typing', () => setIsTyping(true))
        socket.on('stop typing', () => setIsTyping(false))
    }, [])

    useEffect(() => {
        fetchMessages()
        selectedChatCompare = selectedChat
    }, [selectedChat])

    console.log(notification)

    useEffect(() => {
        socket.on('message recieved', (newMessageRecieved) => {
            if (
                !selectedChatCompare ||
                selectedChatCompare._id !== newMessageRecieved.chat._id
            ) {
                if (!notification.includes(newMessageRecieved)) {
                    setNotification([newMessageRecieved, ...notification])
                }
            } else {
                setMessages([...messages, newMessageRecieved])
            }
            setFetchAgain(!fetchAgain)
        })
    })

    const typingHandler = (e) => {
        setNewMessage(e.target.value)

        if (!socketConnected) return

        if (!typing) {
            setTyping(true)
            socket.emit('typing', selectedChat._id)
        }
        let lastTypingTime = new Date().getTime()
        var timerLength = 3000
        setTimeout(() => {
            var timeNow = new Date().getTime()
            var timeDiff = timeNow - lastTypingTime
            if (timeDiff >= timerLength && typing) {
                socket.emit('stop typing', selectedChat._id)
                setTyping(false)
            }
        }, timerLength)
    }

    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        fontSize={{ base: '28px', md: '30px' }}
                        pb={3}
                        px={2}
                        w='100%'
                        fontFamily='Work sans'
                        d='flex'
                        justifyContent={{ base: 'space-between' }}
                        alignItems='center'
                    >
                        <IconButton
                            d={{ base: 'flex', md: 'none' }}
                            icon={
                                <i
                                    class='fa fa-arrow-left'
                                    aria-hidden='true'
                                ></i>
                            }
                            onClick={() => setSelectedChat('')}
                        />
                        {!selectedChat.isGroupChat ? (
                            <>
                                {getSender(user, selectedChat.users)}
                                <ProfileModal
                                    user={getSenderFull(
                                        user,
                                        selectedChat.users
                                    )}
                                />
                            </>
                        ) : (
                            <>
                                {selectedChat.chatName.toUpperCase()}
                                <UpdateGroupChatModal
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                    fetchMessages={fetchMessages}
                                ></UpdateGroupChatModal>
                            </>
                        )}
                    </Text>
                    <Box
                        d='flex'
                        flexDir='column'
                        justifyContent='flex-end'
                        p={3}
                        bg='#E8E8E8'
                        w='100%'
                        h='100%'
                        borderRadius='lg'
                        overflowY='hidden'
                    >
                        {loading ? (
                            <Spinner
                                size='xl'
                                w={20}
                                h={20}
                                alignSelf='center'
                                margin='auto'
                            />
                        ) : (
                            <div className='messages'>
                                <ScrollableChat
                                    messages={messages}
                                ></ScrollableChat>
                            </div>
                        )}
                        <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                            {isTyping ? (
                                <div>
                                    <Lottie
                                        options={defaultOptions}
                                        width={70}
                                        style={{
                                            marginBottom: 15,
                                            marginLeft: 0,
                                        }}
                                    />
                                </div>
                            ) : (
                                <></>
                            )}
                            <Input
                                variant='filled'
                                bg='#E0E0E0'
                                placeholder='Enter a message...'
                                onChange={typingHandler}
                                value={newMessage}
                            />
                        </FormControl>
                    </Box>
                </>
            ) : (
                <Box
                    d='flex'
                    alignItems='center'
                    justifyContent='center'
                    h='100%'
                >
                    <Text fontSize='3xl' pb={3} fontFamily='Work sans'>
                        Click on a user to start chatting
                    </Text>
                </Box>
            )}
        </>
    )
}

export default SingleChat
