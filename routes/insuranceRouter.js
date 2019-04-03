var express = require('express');
var bodyParser = require('body-parser');
var authenticate = require('../authenticate');
var cors = require('./cors');

var Insurances = require('../models/insurances');
var insuranceRouter = express.Router();
insuranceRouter.use(bodyParser.json());

insuranceRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    let queryStr = {}
    if (req.user.employee)
        queryStr = req.query;
    else
        queryStr = {...req.query, user: req.user._id};
    Insurances.find(queryStr)
    .then((insurances) => {
        res.statsuCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(insurances);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    if (req.user.employee) {
        res.statsuCode = 401;
        res.setHeader('Content-Type', 'application/json');
        return res.json({success: false, msg: 'Employee cannot create an insurance!'});
    }
    let creatObj = {...req.body, user: req.user._id};
    Insurances.create(creatObj)
    .then((insurance) => {
        res.statsuCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ succuss: true, msg: 'Insurance Creation Successful!' });
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on ' + req.baseUrl);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyEmployee, (req, res, next) => {
    let queryStr = {}
    if (req.user.employee)
        queryStr = req.query;
    else
        queryStr = {...req.query, user: req.user._id};
    Insurances.deleteMany(queryStr)
    .then((resp) => {
        res.statsuCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = insuranceRouter;