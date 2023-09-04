const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const app = express()
const userRouter = require('./routers/userRouter')
const chatRouter = require('./routers/chatRouter')
const messageRouter = require('./routers/messageRouter')
const cors = require('cors')

dotenv.config()
app.use(express.json())
app.use(cors())

connectDB()

const server = app.listen(process.env.PORT, () =>
    console.log('Server is running on port 5000')
)
app.use((req, res, next) => {
    console.log(req.originalUrl)
    console.log("Request Made")
    next()
})

app.use('/api/user', userRouter)
app.use('/api/chat', chatRouter)
app.use('/api/message', messageRouter)
app.get((req, res) => {
    res.send('API is running :)')
})

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: '*'
    },
})

io.on('connection', (socket) => {
    console.log('connected to socket.io')

    socket.on('setup', (userData) => {
        socket.join(userData._id)
        socket.emit('connected')
    })

    socket.on('join chat', (room) => {
        socket.join(room)
        console.log('User joined room: ', room)
    })

    socket.on('typing', (room) => socket.in(room).emit('typing'))
    socket.on('stop typing', (room) => socket.in(room).emit('stop typing'))

    socket.on('new message', (newMessageRecieved) => {
        var chat = newMessageRecieved.chat

        if (!chat.users) return console.log('chat.users not defined')

        chat.users.forEach((user) => {
            if (user._id == newMessageRecieved.sender._id) return

            socket.in(user._id).emit('message recieved', newMessageRecieved)
        })
    })

    socket.off('setup', () => {
        console.log('USER DISCONNECTED')
        socket.leave(userData._id)
    })
})
