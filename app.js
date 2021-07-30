const express = require('express')
const bodyParser = require('body-parser')

const app = express()

const feedsRouter = require('./router/feeds')

//middleware Parse json
app.use(express.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})

app.use('/feeds', feedsRouter)

app.listen(8080)