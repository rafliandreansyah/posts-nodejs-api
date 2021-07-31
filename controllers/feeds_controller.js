const { validationResult } = require('express-validator/check')

const Post = require('../model/post')

const fileHelper = require('../utils/file-helper')

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
    const title = req.body.title

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect')
        error.statusCode = 422
        throw error
    }

    const content = req.body.content
    const image = req.file

    if (!req.file){
        const error = new Error('No image provided')
        error.statusCode = 422
        throw error
    }

    const post = new Post({
        title: title,
        content: content,
        imageUrl: image.path,
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

exports.updatePost = (req, res, next) => {
    const postId = req.params.postId

    const errors = validationResult(req)

    if (!errors.isEmpty()){
        const error = new Error('Validation failed, entered data is incorrect')
        error.statusCode = 422
        throw error
    }

    const title = req.body.title
    const content = req.body.content
    let imageUrl = req.body.image

    console.log(imageUrl)

    if (req.file) {
        imageUrl = req.file.path
    }
    
    if (!imageUrl) {
        const error = new Error('No image pick.')
        error.statusCode = 422
        throw error
    }

    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Post not found.')
                error.statusCode = 404
                throw error 
            }
            if (imageUrl !== post.imageUrl){
                fileHelper.deleteFile(post.imageUrl)
            }
            post.title = title
            post.content = content
            post.imageUrl = imageUrl
            return post.save()
        })
        .then(result => {
            res.status(200).json({
                message: 'Post Updated.',
                post: result
            })
        })
        .catch(err => {
            if (!err.statusCode){
                err.statusCode = 422
            }
            next(err)
        })

}