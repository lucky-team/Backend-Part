const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Claims = require('../models/claims');
const claimRouter = express.Router();
claimRouter.use(bodyParser.json());

claimRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    let queryStr;
    if (req.user.employee)
        queryStr = req.query;
    else
        queryStr = {...req.query, user: req.user._id};
    Claims.find(queryStr)
    .then((claims) => {
        res.statsuCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(claims);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    if (req.user.employee) {
        res.statsuCode = 401;
        res.setHeader('Content-Type', 'application/json');
        return res.json({success: false, msg: 'Employee cannot create an claim!'});
    }
    let claims;
    if (req.body.length) {
        claims = req.body.map(claim => {
            return {...claim, user: req.user._id, status: 'pending'};
        });
    } else {
        claims = {...req.body, user: req.user._id, status: 'pending'};
    }
    Claims.create(claims)
    .then((claim) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ succuss: true, msg: 'Claim Creation Successful!' });
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    let queryStr;
    if (req.user.employee)
        queryStr = req.query;
    else
        queryStr = {...req.query, user: req.user._id};
    Claims.deleteMany(queryStr)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
})

claimRouter.route('/assign/:claimId')
.get(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyEmployee, (req, res, next) => {
    Claims.findOne({_id: req.params.claimId})
    .then((claim) => {
        if (claim.status != 'pending') {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            return res.json({err: {name: "ClaimNotPendingError", "message": "A claim cannot be assigned again"}});
        }
        claim.employee = req.user._id;
        claim.status = 'processing';
        claim.save()
        .then((claim) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: true, msg: 'Claim Assignment Successful!' });
        })
    }, (err) => next(err))
    .catch((err) => next(err));
})

claimRouter.route('/accept/:claimId')
.get(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyEmployee, (req, res, next) => {
    Claims.findOne({_id: req.params.claimId})
    .then((claim) => {
        if (claim.status != 'processing') {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            return res.json({err: {name: "ClaimNotProcessingError", "message": "Claim cannot be accepted"}});
        } else if (String(claim.employee) !== req.user._id) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            return res.json({err: {name: "UnauthorizedError", "message": "Claim has been assigned to another employee"}});
        }
        claim.employee = req.user._id;
        claim.status = 'accepted';
        claim.save()
        .then((claim) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: true, msg: 'Claim Acception Successful!' });
        })
    }, (err) => next(err))
    .catch((err) => next(err));
})

claimRouter.route('/reject/:claimId')
.get(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyEmployee, (req, res, next) => {
    Claims.findOne({_id: req.params.claimId})
    .then((claim) => {
        if (claim.status !== 'processing') {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            return res.json({err: {name: "ClaimNotProcessingError", "message": "Claim cannot be rejected"}});
        } else if (String(claim.employee) !== req.user._id) {
            console.log(`employee: '${typeof(claim.employee)}'\nid: '${typeof(req.user._id)}'`);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            return res.json({err: {name: "UnauthorizedError", "message": "Claim has been assigned to another employee"}});
        }
        claim.employee = req.user._id;
        claim.status = 'rejected';
        claim.save()
        .then((claim) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: true, msg: 'Claim Rejection Successful!' });
        })
    }, (err) => next(err))
    .catch((err) => next(err));
})

module.exports = claimRouter;