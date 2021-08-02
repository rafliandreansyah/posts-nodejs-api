const express = require('express')

const { body } = require('express-validator/check')

const controllers = require('../controllers/feeds_controller')

const router = express.Router()

// GET /feeds/posts
router.get('/posts', controllers.getPosts)

// POST /feeds/post
router.post('/post',[
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 })
] , controllers.createPost)

// GET /feeds/post/postId
router.get('/post/:postId', controllers.getPost)

// PUT /feeds/post/postId
router.put('/post/:postId', [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 })
], controllers.updatePost)

// DELETE /feeds/post/postId
router.delete('/post/:postId', controllers.deletePost)

module.exports = router