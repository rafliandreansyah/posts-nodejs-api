const express = require('express')

const { body } = require('express-validator/check')

const controllers = require('../controllers/feeds_controller')

const routers = express.Router()

// GET /feeds/posts
routers.get('/posts', controllers.getPosts)

// POST /feeds/post
routers.post('/post',[
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 })
] , controllers.createPost)

module.exports = routers