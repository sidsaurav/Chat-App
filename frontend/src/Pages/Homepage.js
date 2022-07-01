import {
    Box,
    Container,
    HStack,
    VStack,
    Text,
    Tab,
    Tabs,
    TabList,
    TabPanel,
    TabPanels,
} from '@chakra-ui/react'
import React from 'react'
import { useEffect } from 'react'
import Login from '../components/Authentication/Login'
import Signup from '../components/Authentication/Signup'
import { useHistory } from 'react-router-dom'

const Homepage = () => {
    const history = useHistory()

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('userInfo'))
        if (user) history.push('/chats')
    }, [history])

    return (
        <Container centerContent maxW='xl'>
            <Box
                d='flex'
                justifyContent='center'
                p='3'
                bg='white'
                w='100%'
                m='40px 0px 15px 0px'
                borderRadius='lg'
                borderWidth='1px'
            >
                <Text fontSize='4xl' fontFamily='Work sans'>
                    Chat App
                </Text>
            </Box>
            <Box bg='white' w='100%' p='4' borderRadius='lg' borderWidth='1px'>
                <Tabs variant='soft-rounded'>
                    <TabList mb='1em'>
                        <Tab width='50%'>Login</Tab>
                        <Tab width='50%'>Sign Up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login />
                        </TabPanel>
                        <TabPanel>
                            <Signup />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    )
}

export default Homepage
