const express = require('express')

const controllers = require('../controllers/feeds_controller')

const routers = express.Router()

// GET /feeds/posts
routers.get('/posts', controllers.getPosts)

// POST /feeds/post
routers.post('/post', controllers.createPost)

module.exports = routers