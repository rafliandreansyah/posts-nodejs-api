const { validationResult } = require('express-validator/check')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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

exports.postLogin = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password

    let userData

    User.findOne({email: email})
        .then(user => {
            if (!user){
                const error = new Error('User with this email not found.')
                error.statusCode = 401
                throw error
            }
            userData = user
            return bcrypt.compare(password, user.password)
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('Wrong Password')
                error.statusCode = 401
                throw error
            }
            const token = jwt.sign({
                email: userData.email,
                userId: userData._id.toString()
            }, 'supersecretkey', { expiresIn: '1h' })
            res.status(200).json({
                token: token,
                userId: userData._id.toString()
            })
        })
        .catch(err => {
            if(!err.statusCode) {
                err.statusCode = 500
            }
            next(err)
        })
}


exports.getStatus = (req, res, next) => {
    User.findById(req.userId)
        .then(user => {
            if (!user) {
                const error = new Error('User not found!')
                error.statusCode = 404
                throw error
            }
            res.status(200).json({
                status: user.status
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err)
        })
}

exports.updateStatus = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        const error = new Error('Validation error')
        error.statusCode = 422
        throw error
    }
    const userId = req.userId
    const status = req.body.status

    User.findByIdAndUpdate(userId , {status: status})
        .then(result => {
            console.log(result)
            if (!result) {
                const error = new Error('User not found!')
                error.statusCode = 404
                throw error
            }
            res.status(200).json({
                message: 'Status updated',
                result: result    
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err)
        })
}