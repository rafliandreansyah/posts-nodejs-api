const { validationResult } = require('express-validator/check')

const Post = require('../model/post')

exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [
            {
                _id: '1',
                title: "Hello this is my first post", 
                content: "This is my first Post",
                imageUrl: 'images/comp.jpg',
                creator: {
                    name: 'Rafli'
                },
                createdAt: new Date()
            }
        ]
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