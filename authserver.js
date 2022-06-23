require('dotenv').config()
const express = require('express')
const jwt = require('jsonwebtoken')

const app = express()
PORT = 4000

app.use(express.json())

let refreshTokens = []

app.post('/login', (req, res) => {

    const name = req.body.name
    const password = req.body.password
    //Authenticate using bcrypt. But in this project main focus is on awt. Assume authentication is successful

    const user = {"name": name}

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s'})
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken)
    res.json({
        "accessToken": accessToken,
        "refreshToken": refreshToken
    })
})

app.post('/token', (req, res) => {
    const refreshToken = req.body.token
    if(refreshToken == null) {
        return res.sendStatus(401)
    }
    if(!refreshTokens.includes(refreshToken)) {
        return res.sendStatus(403)
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(500)
        res.json({"accessToken": generateToken(user, process.env.ACCESS_TOKEN_SECRET)})
    })

})

app.delete('/logout', (req, res) => {
    const refreshToken = req.body.token
    if(refreshToken == null) res.sendStatus(401)
    if(!refreshTokens.includes(refreshToken)) res.sendStatus(403)
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken)
    res.sendStatus(204)
})

function generateToken(user, secretKey) {
    return jwt.sign({name: user.name}, secretKey, { expiresIn: '30s'})
}

app.listen(PORT, () => console.log(`app started running on port ${PORT}`))
