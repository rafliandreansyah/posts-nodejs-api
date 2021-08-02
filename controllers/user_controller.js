const { validationResult } = require('express-validator/check')
const bcrypt = require('bcryptjs')

const User = require('../model/user')

exports.signUp = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        const error = new Error('Validation failed')
        error.statusCode = 422
        error.data = errors.array()
        throw error
    }

    const email = req.body.email
    const password = req.body.password
    const name = req.body.name

    bcrypt.hash(password, 12)
        .then(passwordHash => {
            const user = new User({
                email: email,
                password: passwordHash,
                name: name
            })
            return user.save()
        })
        .then(result => {
            res.status(201).json({
                message: 'User created',
                userId: result._id
            })
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500
            }
            next(err)
        })
}