const path = require('path')

const express = require('express')

const mongoose = require('mongoose')

const app = express()

const feedsRouter = require('./router/feeds')

const MONGO_URL = 'mongodb+srv://rafliandrean_:mancity113@cluster0.g1eir.mongodb.net/message?retryWrites=true'

//middleware Parse json
app.use(express.json()) //parser json

// static path
app.use('/images', express.static(path.join(__dirname, 'images')))

// Allow cors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})

//Route middleware
app.use('/feeds', feedsRouter)


//Global handling error
app.use((error, req, res, next) => {
    console.log(error)
    const status = error.statusCode || 500
    const message = error.message
    res.status(status).json({
        message: message
    })
})

//mongo connect to database
mongoose.connect(MONGO_URL)
    .then(result => {
        app.listen(8080)
    })
    .catch(err => console.log(err))