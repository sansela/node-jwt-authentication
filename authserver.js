require('dotenv').config()
const express = require('express')
const jwt = require('jsonwebtoken')

const app = express()
PORT = 4000

app.use(express.json())

app.post('/login', (req, res) => {

    const name = req.body.name
    const password = req.body.password
    //Authenticate using bcrypt. But in this project main focus is on awt. Assume authentication is successful

    const user = {"name": name}

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json({
        "accessToken": accessToken
    })
})

app.listen(PORT, () => console.log(`app started running on port ${PORT}`))
