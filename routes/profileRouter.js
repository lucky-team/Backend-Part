const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('../routes/cors');

const Profiles = require('../models/profiles');
const Users = require('../models/user');
const profileRouter = express.Router();
profileRouter.use(bodyParser.json());

profileRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    let queryStr = {}
    if (req.user.employee)
        queryStr = req.query;
    else
        queryStr = {...req.query, _id: req.user.profile};
    Profiles.find(queryStr)
    .then((profiles) => {
        res.statsuCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(profiles);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    let createObj = {...req.body, user: req.user._id};
    Profiles.create(createObj)
    .then((profile) => {
        Users.findOne({_id: req.user._id})
        .then((user) => {
            user.profile = profile._id;
            user.save();
        });
        res.statsuCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ succuss: true, msg: 'Profile Creation Successful!' });
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    let putObj = {...req.body, _id: req.user.profile, user: req.user._id};
    Profiles.findOneAndUpdate({_id: req.user.profile}, {
        $set: putObj
    }, { new: true })
    .then((profile) => {
        res.statsuCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(profile);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    let queryStr;
    if (req.user.employee)
        queryStr = req.query;
    else
        queryStr = {...req.query, _id: req.user.profile};
    Profiles.find(queryStr)
    .then((profiles) => {
        profiles.map(profile => {
            Users.findOne({_id: profile.user})
            .then(user => {
                user.profile = undefined;
                user.save();
            });
        });
    })
    .then(() => {
        Profiles.deleteMany(queryStr)
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = profileRouter;