require('dotenv').config()
const express = require('express')
const jwt = require('jsonwebtoken')
app = express()
PORT = 3000

app.use(express.json())

let posts = [
    {
       username: "Santosh",
       title: "Post 1" 
    },
    {
        username: "John",
        title: "Post 2"
    }]

app.get('/posts', authenticateToken, (req, res) => {
    const post = posts.filter((post) => post.username === req.user.name)
    res.json(post)
})

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

function authenticateToken(req, res, next) {

    const authHeader = req.header('authorization')
    const token = authHeader && authHeader.split(' ')[1]

    if(token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403)
        req.user = user
        next()
    })
    

}

app.listen(PORT, ()=> {
    console.log(`server started running on port ${PORT}`)
})