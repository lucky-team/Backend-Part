var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');

var config = require('./config');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey,
        {expiresIn: 3600 * 24});
}

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err) {
                return done(err, false);
            } else if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
    }));

exports.verifyUser = (req, res, next) => {
    passport.authenticate('jwt', {session: false}, function(err, user, info) {
        if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({
                err: {
                    name: 'VerifyError',
                    message: err
                }
            })
        }
        if (!user) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            return res.json({
                err: {
                    name: 'UnauthenticatedUserError',
                    message: 'Not an authorized user'
                }
            });
        }
        req.user = user;
        next();
    })(req, res, next);
}

exports.verifyEmployee = (req, res, next) => {
    User.findOne({_id: req.user._id})
    .then((user) => {
        if (user.employee) {
            next();
        } else {
            res.statusCode = 403;
            res.setHeader('Content-Type', 'application/json');
            return res.json({
                err: {
                    name: 'UnauthorizedUserError',
                    message: 'You are not authorized as an employee to perform this operation'
                }
            })
        }
    }, (err) => next(err))
    .catch((err) => next(err));
}
