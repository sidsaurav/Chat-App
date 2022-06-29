import {
    Avatar,
    Box,
    Button,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
    Tooltip,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { ChatState } from '../../Context/ChatProvider'
import ProfileModal from './ProfileModal'

const SideDrawer = () => {
    const [search, setSearch] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState()

    //user k andar user.data me sara data h
    let { user } = ChatState()
    user = user.data
    const history = useHistory()

    const logoutHandler = () => {
        localStorage.removeItem('userInfo')
        history.push('/')
    }
    return (
        <>
            <Box
                d='flex'
                justifyContent='space-between'
                alignItems='center'
                bg='white'
                w='100%'
                p='5px 10px 5px 10px'
                borderWidth='5px'
            >
                <Tooltip label='Search users' aria-label='A tooltip' hasArrow>
                    <Button variant='ghost'>
                        <i class='fas fa-search'></i>
                        <Text d={{ base: 'none', md: 'flex' }} px='4'>
                            Search User
                        </Text>
                    </Button>
                </Tooltip>
                <Text fontSize='2xl' fontFamily='Work sans'>
                    Chit-Chat App
                </Text>
                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <i class='fa-solid fa-bell fa-xl'></i>
                        </MenuButton>
                    </Menu>
                    <Menu>
                        <MenuButton
                            as={Button}
                            rightIcon={<i class='fas fa-chevron-down'></i>}
                        >
                            <Avatar
                                size='sm'
                                cursor='pointer'
                                name={user.name}
                                src={user.pic}
                            ></Avatar>
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>
        </>
    )
}

export default SideDrawer
