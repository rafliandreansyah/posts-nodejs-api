const expect = require('chai').expect
const sinon = require('sinon')
const mongoose = require('mongoose')

const FeedController = require('../controllers/feeds_controller')
const User = require('../model/user')

describe('Auth Controller - Login', function(){

    before(function(done){

        mongoose.connect('mongodb+srv://rafliandrean_:mancity113@cluster0.g1eir.mongodb.net/test-message?retryWrites=true')
        .then(result => {
            const user = new User({
                email: 'test@mail.com',
                password: 'test',
                name: 'testing',
                posts: [],
                _id: '5c0f66b979af55031b34728a'
            })
            return user.save()
        })
        .then(() => {
            done()
        })

    })

    it('should add a created post to the posts of the craetor', function(done){

        const req = {
            body: {
                title: 'Test a post',
                content: 'test a content'
            },
            file: {
                path: 'path'
            },
            userId: '5c0f66b979af55031b34728a'
        }

        const res = {
            status: function(){
                return this
            },
            json: function(){}
        }

        FeedController.createPost(req, res, () => {}).then(savedUser => {
            expect(savedUser).to.have.property('posts')
            expect(savedUser.posts).to.have.length(1)
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
