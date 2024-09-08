const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const initializePassport = require('../passport-config')
const passport = require('passport')
const User = require('../models/users')
const {checkAuthenticated, checkNotAuthenticated} = require('../controllers/authControl')



initializePassport(passport)
                
router.route('/login').get(checkNotAuthenticated, (req,res) => {
    res.render('login')
})
router.route('/login').post(checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/login',
    failureFlash: true
}))
    
router.route('/register').get(checkNotAuthenticated, (req,res) => {
    res.render('register')
})

router.route('/register').post(checkNotAuthenticated, async (req,res) => {

    try {
        const userLength = await User.find({})
        if (userLength.length >= 2) {
            req.flash('info','User Limit Reached')
            res.redirect('/register')
            return
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const users = new User ({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        await users.save()
        res.redirect('/login')
    } catch (err) {
        res.redirect('/register')
        console.log(err)
    }
})



router.route('/logout').delete((req,res,next) => {
    req.logOut((err) => {
        if (err) {
            return next(err)
        }
    })
    res.redirect('/login')
})


module.exports = router