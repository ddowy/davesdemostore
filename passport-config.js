const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require('./models/users')


const users = async (email) => {
    try {
        const user = await User.findOne({email})
        console.log(user)
        return user
    } catch (error) {
        console.log(error)
    }
}


function initialize(passport) {
    const authenticateUser = async (email,password,done) => {
        try {
            const user = await User.findOne({email})
            if (user == null) {
                return done(null, false, {message: 'No user with that email'})
            }
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                done(null, false, {message: 'Password incorrect'})
            }
        } catch (err) {
            return done(err)
        }
    }
    passport.use(new LocalStrategy({ usernameField: 'email'},
    authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id,done) => {
        User.findById(id, function(err,user) {
            done(err, user)
        })
    })
}


module.exports = initialize
