const jwt = require('jsonwebtoken')

const sign = require('./app')
module.exports = function (req, res, next) {
    const token = req.header('auth_token')
    // console.log("validation", req);
    if(!token) {
        return res.redirect ('/')
        // ?console.log("create account first");
        // return res.status(400).send("Invalid token")
    }

    try {
        const verified = jwt.verify(token, process.env.SECRET_KEY)
        req.user = verified
    } catch (err) {
        res.status(400).send('Invalid Token')
    }
}