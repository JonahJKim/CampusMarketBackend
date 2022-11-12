const connection = require('../mysql/connection.js')

const auth = async (req, res, next) => {
    if (!(req.session) || !(req.session.userId)) {
        return res.send("Invalid session!");
    }

    await connection.query(`SELECT * FROM users WHERE id=${req.session.userId}`, (err, result) => {
        if (err) {
            return res.send('Error in fetching user query!')
        }
        if (result.length === 0) {
            return res.send("User doesn't exist!");
        }
        req.user = result[0];
        return next()
    })

}

module.exports = auth;

// CONTINUE MIDDLEWARE

// https://www.youtube.com/watch?v=j8Yxff6L_po
// 20:42