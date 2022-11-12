const express = require('express')
const sessions = require('client-sessions');
const createTable = require('../middleware/createTable.js');
const connection = require('../mysql/connection.js')
const auth = require('../middleware/auth.js')
const bcrypt = require('bcrypt')
require('dotenv').config()


const router = new express.Router()
router.use(createTable);

// use sessions for login
router.use(sessions({
    cookieName: "session",
    secret: "hashKey",
    duration: 60 * 60 * 1000 // 60 min
}))

router.get("/", async (req, res) => {
    connection.query('SELECT * FROM users WHERE id=5', (err, result) => {
        console.log(result);
    })
})

router.post('/login', async (req, res) => {
    const userExists = `SELECT id, lastName, firstName, email, password from users WHERE email='${req.body.email}';`;
    await connection.query(userExists, async (err, result, fields) => {
        if (err) {
            // throw Error;
            return res.send('Error!')
        }

        console.log(result[0].password);
        console.log(req.body.password);

        if (result.length !== 0) {
            const isSame = bcrypt.compareSync(req.body.password, result[0].password);
            if (isSame) {
                req.session.userId = result[0].id;
                return res.send('User exists!')
            }
            return res.send('Invalid password!')
        }
        else {
            return res.send('User does not exist!');
        }
    })

})


router.post('/register', async (req, res) => {
    let new_user = {
        lastName: req.body.lastName,
        firstName: req.body.firstName,
        email: req.body.email
    }

    if (!req.body.password) {
        return res.send('Must supply password!');
    }

    const hash = bcrypt.hashSync(req.body.password, parseInt(process.env.SALT_ROUNDS))
    new_user.hashed_password = hash

    const createUser = `INSERT INTO users (lastName, firstName, email, password) VALUES ('${new_user.lastName}', '${new_user.firstName}', '${new_user.email}', '${new_user.hashed_password}');`
    await connection.query(createUser, (err, result, fields) => {
        if (err) {
            if (err.code == 'ER_DUP_ENTRY') {
                return res.send('User already exists!');
            }
            
        }
        return res.send('Successful!');
    })
})

router.get('/logout', auth, (req, res) => {
    req.session.userId = null;
    res.send('goodbye')
})

router.get('/dashboard', auth, (req, res) => {
    res.send('hello')
})

module.exports = router