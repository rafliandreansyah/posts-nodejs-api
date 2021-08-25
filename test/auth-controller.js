const expect = require('chai').expect
const sinon = require('sinon')
const mongoose = require('mongoose')

const AuthController = require('../controllers/auth_controller')
const User = require('../model/user')

describe('Auth Controller - Login', function(){

    before(function(done){

        mongoose.connect('mongodb+srv://rafliandrean_:mancity113@cluster0.g1eir.mongodb.net/test-message?retryWrites=true')
        .then(result => {
            const user = new User({
                email: 'test@mail.com',
                password: 'test',
                name: 'testing',
                post: [],
                _id: '5c0f66b979af55031b34728a'
            })
            return user.save()
        })
        .then(() => {
            done()
        })

    })

    it('should throw an error with code 500 if accessing database fails', function(done){
        sinon.stub(User, 'findOne')
        User.findOne.throws()

        const req = {
            body: {
                email: 'rafli@test.com',
                password: '112233'
            }
        }

        AuthController.postLogin(req, {}, () => {}).then(result => {
            expect(result).to.be.an('error')
            expect(result).to.have.property('statusCode', 500)
            done()
        })

        User.findOne.restore()
    })

    it('should send a response with a valid user status for an existing user', function(done){

        const req = { userId: '5c0f66b979af55031b34728a' }
        const res = {
            statusCode: 500,
            userStatus: null,
            status: function(code) {
                this.statusCode = code
                return this
            },
            json: function(data){
                this.userStatus = data.status
            }
        }
        AuthController.getStatus(req, res, () => {}).then(() => {
            expect(res.statusCode).to.be.equal(200)
            expect(res.userStatus).to.be.equal('i am new user')
            done()
        })
    })

    after(function(done){
        User.deleteMany({})
        .then(() => {
            return mongoose.disconnect()
        })
        .then(() => {
            done()
        }) 
    })
})
