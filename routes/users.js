var express = require('express');
var bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate');
var cors = require('./cors');

var userRouter = express.Router();
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

module.exports = userRouter;
