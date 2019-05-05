const express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/user');
const Messages = require('../models/messages');
const passport = require('passport');
const authenticate = require('../authenticate');
const cors = require('./cors');
const { sms } = require('../config');

const userRouter = express.Router();
userRouter.use(bodyParser.json());

userRouter.options('*', cors.corsWithOptions, (req, res) => { res.sendStatus(200); });

userRouter.get('/', cors.corsWithOptions, 
    (req, res, next) => {
        let queryStr = {...req.query};
        User.find(queryStr)
        .then((users) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(users);
        }, (err) => next(err))
        .catch((err) => next(err));
});

userRouter.delete('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyEmployee,
    (req, res, next) => {
        let queryStr = {...req.query, employee: false};
        User.deleteMany(queryStr)
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));
});

userRouter.post('/signup', cors.corsWithOptions, (req, res, next) => {
    User.register(new User({ username: req.body.username }),
        req.body.password, (err, user) => {
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({ err: err });
            } else {
                passport.authenticate('local')(req, res, () => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ success: true, msg: 'Registration Successful!' });
                });
            }
        });
});

userRouter.post('/registerEmployee', cors.corsWithOptions, (req, res, next) => {
    User.register(new User({ username: req.body.username }),
        req.body.password, (err, user) => {
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({ err: err });
            } else {
                user.employee = true;
                user.save((err, user) => {
                    if (err) {
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({err: err});
                        return ;
                    }
                });
                passport.authenticate('local')(req, res, () => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ success: true, msg: 'Registration Successful!' });
                });
            }
    });
});

userRouter.post('/login', cors.corsWithOptions, (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            return res.json({ err: info });
        }
        req.logIn(user, (err) => {
            if (err) {
                res.statusCode = 401;
                res.setHeader('Content-Type', 'application/json');
                return res.json({ err: 'Could not log in user' });
            }
            let token = authenticate.getToken({ _id: req.user._id });
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: true, msg: 'Login Successfully!', employee: user.employee, token: token });
        });
    })(req, res, next);
});

userRouter.get('/logout', cors.corsWithOptions, (req, res, next) => {
    if (req.session) {
        req.session.destroy();
        res.clearCookie('session-id');
        res.redirect('/');
    } else {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        return res.json({ err: 'You are not logged in'});
    }
});

userRouter.post('/changePwd', cors.corsWithOptions, (req, res) => {
    User.findByUsername(req.body.username)
    .then((user) => {
        res.setHeader('Content-Type', 'application/json');
        if (user) {
            Messages.findOne({user: user._id})
            .then((message) => {
                if (message) {
                    const diff = (new Date().getTime() - new Date(message.sendAt).getTime()) / 1000;
                    if (!message.stale &&
                        diff <= message.live * 60 &&
                        message.code === req.body.code) {
                        user.setPassword(req.body.password, () => {
                            message.stale = true;
                            user.save();
                            message.save();
                            res.json({
                                success: true,
                                msg: 'Password Change Successful'
                            })
                        })
                    } else {
                        res.statusCode = 500;
                        return res.json({err: {
                            name: 'SecurityCodeError',
                            message: 'Security code not correct'
                        }});
                    }
                }
            })
        } else {
            res.statusCode = 500;
            return res.json({err: {
                name: 'UserNotExist',
                message: 'User not exist'
            }});
        }
    })
})

module.exports = userRouter;
