const { validationResult } = require('express-validator/check')

const Post = require('../model/post')

exports.getPosts = (req, res, next) => {
    Post.find()
        .then(posts => {
            if (posts.length < 1){
                return res.status(201).json({
                    message: 'Post is empty.'
                })
            }
            res.status(200).json({
                posts: posts
            })
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500
            }
            next(err)
        })
}

exports.createPost = (req, res, next) => {
    const error = validationResult(req)

    if (!error.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect')
        error.statusCode = 422
        throw error
    }

    const title = req.body.title
    const content = req.body.content

    const post = new Post({
        title: title,
        content: content,
        imageUrl: 'images/comp.jpg',
        creator: {
            name: 'Rafli Andreansyah'
        }
    })
    post.save()
        .then(result => {
            console.log(result)
            //sending status post
            res.status(201).json({
                message: "post created successfully",
                post: result
            })
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500
            }
            next(err)
        })
}

exports.getPost = (req, res, next) => {
    const postId = req.params.postId
    
    Post.findById(postId)
        .then(postData => {
            if(!postData){
                const error = new Error('Post not found!')
                error.statusCode = 404
                throw error
            }
            res.status(200).json({
                message: 'get post success',
                post: postData
            })
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500
            }
            next(err)
        })
}