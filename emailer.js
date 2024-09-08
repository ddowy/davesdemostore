require('dotenv').config()
const nodeMailer = require('nodemailer')
const transporter = nodeMailer.createTransport({
    service: process.env.NODEMAILER_SERVICE,
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
    }
})


module.exports = transporter