const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const path = require('path');
const cors = require('./cors');
const config = require('../config');

const Claims = require('../models/claims');
const resRouter = express.Router();

resRouter.route('/claim-files/:claimId/:filename')
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Claims.findOne({_id: req.params.claimId})
    .then((claim) => {
        if (claim.user.equals(req.user._id) || claim.employee.equals(req.user._id)) {
            let relativePath = `${config.storePath}/insurances/${claim.insurance}/${req.params.claimId}/${req.params.filename}`;
            let targetFile = path.resolve(__dirname, relativePath);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.sendFile(targetFile);
        } else {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            return res.json({err: {name: "UnauthorizedError", "message": "You are unauthorized to access here"}});
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})

module.exports = resRouter;