const express = require('express')
const router = express.Router()
const { registerUser, authUser } = require('../controllers/userControllers')

router
    .route('/')
    .post(registerUser)
    .get((req, res) => {
        res.json('Hi')
    })
router.route('/login').post(authUser)

module.exports = router
