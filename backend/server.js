const express = require('express')
const dotenv = require('dotenv')
const chats = require('../backend/data/data')
const connectDB = require('./config/db')
const app = express()
const router = require('./routers/userRouters')
const User = require('./models/userModel')
const mongoose = require('mongoose')

dotenv.config()
app.use(express.json())

const PORT = process.env.PORT

app.listen(PORT, console.log(`Server is running on port ${PORT}`))

connectDB()
app.use('/api/user', router)
app.post('/reset', async (req, res) => {
    User.deleteMany({}, (err) => {
        if (err) {
            res.json(err)
        } else {
            res.json('Deleted Successfully')
        }
    })
})
