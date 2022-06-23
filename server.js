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