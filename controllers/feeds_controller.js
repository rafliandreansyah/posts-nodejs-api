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
        return res.status(422).json({
            message: 'Validation failed, entered data is incorrect',
            errors: error.array()
        })
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
            console.log(err)
        })
}