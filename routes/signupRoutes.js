const express = require('express')
const Router = express.Router()
const { verifyToken } = require('../middleware/jwt')
const controller = require('../controllers/Signupcon')

Router.get('/', controller.GetHome)

Router.get('/signup', controller.GetSignup)

Router.get('/login', controller.GetLogin)

Router.get('/forgot-password', controller.GetForgot)

Router.post('/AddEmail', controller.AddEmail)

Router.get('/verify-otp', controller.GetOtpVerify)

Router.post('/AddOtp', verifyToken, controller.AddOtp)

Router.get('/reset-password', controller.GetResetPassword)

Router.post('/reset-password', verifyToken, controller.AddNewpassword)

Router.post('/AddUser', controller.AddUser)

Router.post('/postUser', controller.PostUser)

Router.get('/home2', verifyToken, controller.GetHome2Page)

module.exports = Router