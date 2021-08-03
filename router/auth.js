const express = require('express')

const { body } = require('express-validator/check')

const User = require('../model/user')
const authController = require('../controllers/auth_controller')
const router = express.Router()
const isAuth = require('../middleware/is-auth')

router.put('/signup', [
    body('email').isEmail().withMessage('Please enter a valid email')
    .custom((value, { req }) => {
        return User.findOne({email: value}).then(userDoc => {
            if (userDoc) {
                return Promise.reject('E-mail address already exists!')
            }
        })
    })
    .normalizeEmail(),
    body('password').trim().isLength({ min: 5 }),
    body('name').trim().not().isEmpty()
], authController.signUp)

router.post('/login', [
    body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail(),
    body('password').trim().not().isEmpty()], authController.postLogin)

//GET /auth/status
router.get('/status', isAuth, authController.getStatus)

//POST /auth/status
router.patch('/status', isAuth,[
    body('status').trim().not().isEmpty()
] , authController.updateStatus)

module.exports = router