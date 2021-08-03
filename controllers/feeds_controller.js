const { validationResult } = require('express-validator/check')

const Post = require('../model/post')
const User = require('../model/user')

const fileHelper = require('../utils/file-helper')

exports.getPosts = (req, res, next) => {
    let page = req.query.page || 1
    let perPage = 2
    let totalItems

    Post.find().countDocuments()
        .then(countDocument => {
            totalItems = countDocument
            return Post.find()
                .skip((page - 1) * perPage)
                .limit(perPage)
        })
        .then(posts => {
            res.status(200).json({
                posts: posts,
                totalItems: totalItems
            })
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500
            }
            next(err)
        })
        
    Post.find()
        .then(posts => {
            if (posts.length < 1){
                return res.status(201).json({
                    message: 'Post is empty.'
                })
            }
            
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

    let creator
    const post = new Post({
        title: title,
        content: content,
        imageUrl: image.path,
        creator: req.userId
    })
    post.save()
        .then(result => {
            return User.findById(req.userId)
        })
        .then(user => {
            creator = user
            user.posts.push(post)
            return user.save()
        })
        .then(result => {
            //sending status post
            res.status(201).json({
                message: "post created successfully",
                post: post,
                creator: {
                    _id: creator._id, name: creator.name
                }
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
            if (post.creator.toString() !== req.userId){
                const error = new Error('Not authorized!')
                error.statusCode = 403
                throw error
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
                err.statusCode = 500
            }
            next(err)
        })

}

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId

    Post.findById(postId)
        .then(post => {
            if (!post){
                const error = new Error('Post not found')
                error.statusCode = 404
                throw error
            }
            if (post.creator.toString() !== req.userId){
                const error = new Error('Not authorized!')
                error.statusCode = 403
                throw error
            }
            fileHelper.deleteFile(post.imageUrl)
            return Post.findByIdAndRemove(postId)
        })
        .then(result => {
            return User.findById(req.userId)
        })
        .then(user => {
            user.posts.pull(postId)
            return user.save()
        })
        .then(result => {
            res.status(200).json({message: 'Post deleted.'})
        })
        .catch(err => {
            if (!err.statusCode){
                err.statusCode = 500
            }
            next(err)
        })
}