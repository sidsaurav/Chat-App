import {
    Button,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    useToast,
    VStack,
} from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

const Login = () => {
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()

    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)

    const toast = useToast()
    const history = useHistory()
    const submitHandler = async () => {
        setLoading(true)
        if (!email || !password) {
            toast({
                title: 'Please enter all fields.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            })
            setLoading(false)
            return
        }

        try {
            const data = await axios.post('/api/user/login', {
                email,
                password,
            })
            toast({
                title: 'Logged in successfully',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            })
            history.push('/chats')
            setLoading(false)
            localStorage.setItem('userInfo', JSON.stringify(data))
        } catch (err) {
            console.log(err)
            setLoading(false)
        }
    }
    return (
        <VStack spacing='5px'>
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder='Enter Your Email'
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>

            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup size='md'>
                    <Input
                        placeholder='Enter Password'
                        type={show ? 'text' : 'password'}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width='4.5rem'>
                        <Button
                            h='1.75rem'
                            size='sm'
                            onClick={() => setShow(!show)}
                        >
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <Button
                colorScheme='blue'
                width='100%'
                color='white'
                style={{ marginTop: 15 }}
                onClick={submitHandler}
                isLoading={loading}
            >
                Login
            </Button>
            <Button
                variant='solid'
                colorScheme='red'
                width='100%'
                onClick={() => {
                    setEmail('guest@example.com')
                    setPassword('123456')
                }}
            >
                Get Guest User Credentials
            </Button>
        </VStack>
    )
}

export default Login
