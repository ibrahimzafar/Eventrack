var express = require('express');
var router = express.Router();
const AdminUser = require('../models/admin');
const Event = require('../models/event');
const eventAttendance = require('../models/eventAttendance');

//imports the adminuser model and the BcryptJS Library
// BcryptJS is a no setup encryption tool
const bcrypt = require('bcryptjs');

//require('dotenv').config();
const secret = process.env.SECRET || 'mysecret';
//gives us access to our environment variables 
//and sets the secret object.
const passport = require('passport');
const jwt = require('jsonwebtoken');
//imports Passport and the JsonWebToken library for some utilities


router.post('/adminregister', (req, res) => {
    if (!req.body.emailAddress || !req.body.password) {
        return res.send('Must include email and password')
    }
    AdminUser.findOne({ emailAddress: req.body.emailAddress })
        .then(user => {
            if (user) {
                let error = 'Email Address Exists in Database.';
                return res.status(400).json(error);
            } else {
                const newUser = new AdminUser({
                    name: req.body.name,
                    emailAddress: req.body.emailAddress,
                    password: req.body.password,
                    mobile: req.body.mobile
                });
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) throw err;
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        console.log("Hash generated");
                        newUser.save().then(user => res.json(user))
                            .catch(err => res.status(400).json(err));
                    });
                });
            }
        });
});

router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log(req.body);
    AdminUser.findOne({ emailAddress: email }, (errors, user) => {
        if (!user) {
            let errors = "No Account Found";
            return res.status(404).json(errors);
        }
        bcrypt.compare(password, user.password)
            .then(isMatch => {
                if (isMatch) {
                    const payload = {
                        id: user._id,
                        name: user.name
                    };
                    jwt.sign(payload, secret, { expiresIn: 36000 },
                        (err, token) => {
                            if (err) res.status(500)
                                .json({
                                    error: "Error signing token",
                                    raw: err
                                });
                            //                               res.json({ success: true, token: `Bearer ${token}` });
                            req.session.token = `Bearer ${token}`;
                            req.session.email = email;
                            console.log('req.session');
                            console.log(req.session);
                            res.redirect('/home');
                        });
                } else {
                    let errors = "Password is incorrect";
                    res.status(400).json(errors);
                }
            });
    })
});
/* GET home page. */
router.get('/home', function(req, res, next) {
    res.render('index', { title: 'Express', email: req.session.email, token: req.session.token });
});

//router.method('/path', passport.authenticate('jwt', {session: false}), (req,res) => ... );
router.post('/logout', function(req, res, next) {
    req.session.destroy(function(err) {
        // cannot access session here
        //logic to return to homepage
        res.redirect('/');

    });
});



module.exports = router;