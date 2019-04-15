const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const cors = require('./cors');
const config = require('../config');

const Claims = require('../models/claims');
const Insurances = require('../models/insurances');
const claimRouter = express.Router();
claimRouter.use(bodyParser.json());
claimRouter.use(bodyParser.urlencoded({ extended: true }));

const saveFile = (file, relativePath) => {
    let filePath = file.path;
    let targetDir = path.join(__dirname, relativePath);
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, {recursive: true}, (err) => {
            if (err) {
                console.info(`mkdir err: ${file.name} ${file.path}\nErr: ${err}`);
            }
        });
    }
    let fileName = new Date().getTime() + '_' + file.name;
    let targetFile = path.join(targetDir, fileName);
    fs.rename(filePath, targetFile, (err) => {
        if (err) {
            console.info(err);
        }
    })
    return fileName;
}

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
    let form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, '../../tmp');
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        let {employee, rejectReason, files: deleted, ...claim} = {...fields, user: req.user._id, status: 'pending'};
        claim['amount'] = parseInt(claim['amount'])
        claim['type'] = parseInt(claim['type'])
        Claims.create(claim)
        .then((claim) => {
            Insurances.findOne({_id: claim.insurance})
            .then((insurance) => {
                if (insurance.user.equals(req.user._id)) {
                    insurance.claim = claim._id;
                    insurance.save();
                }
            })
            let relativePath = `${config.storePath}/insurances/${fields.insurance}/${claim._id}`
            claim['files'] = [];
            for (let key in files) {
                claim['files'].push(saveFile(files[key], relativePath));
            }
            claim.save()
            .then((claim) => {
                res.json({success: true, msg: 'Claim Creation Successful!'});
            })
        }, (err) => next(err))
        .catch((err) => next(err));
    });
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    let queryStr;
    if (req.user.employee)
        queryStr = req.query;
    else
        queryStr = {...req.query, user: req.user._id};
    Claims.find(queryStr)
    .then((claims) => {
        claims.map(claim => {
            Insurances.findOne({_id: claim.insurance})
            .then(insurance => {
                insurance.claim = undefined;
                insurance.save();
            });
        })
    })
    .then(() => {
        Claims.deleteMany(queryStr)
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));
    }, (err) => next(err))
    .catch((err) => next(err));
})

claimRouter.route('/assign/:claimId')
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})
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
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})
.get(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyEmployee, (req, res, next) => {
    Claims.findOne({_id: req.params.claimId})
    .then((claim) => {
        if (claim.status != 'processing') {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            return res.json({err: {name: "ClaimNotProcessingError", "message": "Claim cannot be accepted"}});
        } else if (!claim.employee.equals(req.user._id)) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            return res.json({err: {name: "UnauthorizedError", "message": "Claim has been assigned to another employee"}});
        }
        Insurances.findOne({_id: claim.insurance})
        .then(insurance => {
            insurance.claim = undefined;
            insurance.save();
        });
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
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyEmployee, (req, res, next) => {
    Claims.findOne({_id: req.params.claimId})
    .then((claim) => {
        if (claim.status !== 'processing') {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            return res.json({err: {name: "ClaimNotProcessingError", "message": "Claim cannot be rejected"}});
        } else if (!claim.employee.equals(req.user._id)) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            return res.json({err: {name: "UnauthorizedError", "message": "Claim has been assigned to another employee"}});
        } else if (!req.body.rejectReason) {    
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            return res.json({err: {name: "NoRejectResonError", "message": "No reject reason given"}});
        }
        Insurances.findOne({_id: claim.insurance})
        .then(insurance => {
            insurance.claim = undefined;
            insurance.save();
        });
        claim.employee = req.user._id;
        claim.status = 'rejected';
        claim.rejectReason = req.body.rejectReason;
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