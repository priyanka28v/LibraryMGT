const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const express = require('express')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const SECRET_KEY = 'library';
const { User } = require('../models/index')


const adminEmail = "priyankabhola0803@gmail.com";
const adminPass = 123456;
const adminName = "Priyanka";

exports.GetHome = (req, res) => {
    res.render('home')
}

exports.GetLogin = (req, res) => {
    res.render('login', { error: null, success: null })
}

exports.GetSignup = (req, res) => {
    res.render('signup', { error: null, success: null })
}

exports.GetHome2 = (req, res) => {
    res.render('home2')
}



const finduser = (email) => {
    try {
        const user = User.findOne({ email })
        return user
    } catch (err) {
        console.log(err)
        return null;
    }
}

exports.AddUser = async (req, res) => {
    try {
        const { username, email, password } = req.body
        const user = await finduser(email)
        if (user) {
            res.render('signup', { error: 'user already exits', success: null })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.render('login', { success: 'Signup successful! Please login.', error: null })
    } catch (err) {
        console.log(err)
        res.render('login', {
            error: "Something went wrong.",
            success: null
        });
    }
}

exports.PostUser = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user)
            return res.render('login', { error: "INVALID CREDENTIALS", success: null })

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('login', { error: "INVALID CREDENTIALS", success: null });
        }

        if (user.email == adminEmail) {
            const token = jwt.sign({ id: user._id, name: user.username, email: user.email, isAdmin: true },
                SECRET_KEY, { expiresIn: '1h' })
            res.cookie("token", token, {
                httpOnly: true,//javascript access na kr ske
            })
        }

        else {
            const token = jwt.sign({
                id: user._id, name: user.username, email: user.email, isAdmin: false
            },
                SECRET_KEY, { expiresIn: '1h' });

            res.cookie("token", token, {
                httpOnly: true,//javascript access na kr ske
            })
        }

        res.redirect('/home2')
    }
    catch (err) {
        console.log(err)
        res.render('login', { success: null, error: 'Something went wrong!' });
    }
}

exports.GetForgot = async (req, res) => {
    res.render('forgot-password')
}

exports.AddEmail = async (req, res) => {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (user) {
        const otp = Math.floor(100000 + Math.random() * 900000);


        const token = jwt.sign({ email, otp }, SECRET_KEY, { expiresIn: '15m' });

        let tranporter = nodemailer.createTransport({
            service: 'gmail',
            secure: true,
            auth: {
                user: 'himanisharma1738@gmail.com',
                pass: 'rlxguzlarvqksswe'
            }
        })

        let transport = ({
            from: 'himanisharma1738@gmail.com',
            to: email,
            subject: 'Your OTP for Password Reset',
            text: `Your OTP is ${otp}`

        })

        await tranporter.sendMail(transport, (err, info) => {
            if (err) {
                console.log(err);
                res.send('Error sending email');
            } else {
                console.log('Email sent: ' + info.response);
                res.redirect('/verify-otp');
            }
        })

        res.cookie('token', token, {
            httpOnly: true
        })

    }
    else {
        return res.send('Email not found');
    }
}

exports.GetOtpVerify = async (req, res) => {
    res.render('verify-otp')
}

exports.AddOtp = async (req, res) => {
    const { otp } = req.body;

    try {
        const token = req.cookies.token;

        const decoded = jwt.verify(token, SECRET_KEY);
        const tokenOtp = decoded.otp;

        if (parseInt(otp) === tokenOtp) {
            const userEmail = decoded.email;
            const newtoken = jwt.sign({ email: userEmail }, SECRET_KEY, { expiresIn: '1h' })

            res.cookie(
                'token',
                newtoken, {
                httpOnly: true,
            })
            res.redirect('/reset-password');
        } else {
            res.send('Invalid OTP');
        }
    } catch (error) {
        console.log(error);
        res.status(400).send('Invalid or expired token');
    }
};


exports.GetResetPassword = async (req, res) => {
    res.render('reset-password')
}

exports.AddNewpassword = async (req, res) => {
    const token = req.cookies.token
    const { newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const email = decoded.email;

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).send('User not found');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await User.updateOne({ email: email }, { password: hashedPassword });

        const newToken = jwt.sign({ email: email }, SECRET_KEY, { expiresIn: '1h' });

        res.render('login', { newToken, error: null, success: 'password reset succesfully,login here!!!' })

    } catch (error) {
        console.log(error);
        res.status(500).send('Error resetting password');
    }
}

exports.GetHome2Page = async (req, res) => {
    if (req.user)
        res.render('home2', { user: req.user });
}