require('dotenv').config()
const express = require('express')
const app = express()
const connectDB = require('./db/connectDB')
const methodOverride = require('method-override')
const flash = require('express-flash')
const session = require('express-session')
const passport = require('passport')
const notFoundMiddleWare = require('./middleware/not-found')


app.use(flash())
app.use(session({
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

// Middleware
app.use(express.static('./public'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.set('view engine', 'ejs')

const generalRouter = require('./routes/general')
const authRouter = require('./routes/auth')
const adminRouter = require('./routes/admin')

app.use('/', generalRouter)
app.use('/', authRouter)
app.use('/', adminRouter)
app.use(notFoundMiddleWare)



const PORT = process.env.PORT || 3000

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(PORT, console.log(`Listening on port ${PORT}...`))
    } catch (error) {
        console.log(error)
    }
}


start()