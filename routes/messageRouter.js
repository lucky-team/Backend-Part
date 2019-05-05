const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors');
const { sms } = require('../config');
const rp = require('request-promise');

const Messages = require('../models/messages');
const Profiles = require('../models/profiles');
const messageRouter = express.Router();
messageRouter.use(bodyParser.json());

messageRouter.options('*', cors.corsWithOptions, (req, res) => { res.sendStatus(200); });

const genSecurityCode = () => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

messageRouter.post('/sendSecurityCode', cors.corsWithOptions, (req, res) => {
    const { phone, lang } = req.body;
    if (typeof lang !== 'undefined' && typeof phone !== 'undefined') {
        Profiles.findOne({ phone: phone })
            .then((profile) => {
                if (profile) {
                    Messages.findOne({ user: profile.user })
                        .then((message) => {
                            const securityCode = genSecurityCode();
                            let postData = {
                                sid: sms.sid,
                                token: sms.token,
                                appid: sms.appid,
                                templateid: lang === 'cn' ? sms.templateId_cn
                                    : sms.templateId_en,
                                mobile: phone.split(' ')[1],
                                param: `${securityCode},${sms.live}`
                            };
                            var options = {
                                uri: 'https://open.ucpaas.com/ol/sms/sendsms',
                                body: postData,
                                json: true,
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                resolveWithFullResponse: false
                            };
                            if (message) {
                                const messageDate = new Date(message.sendAt);
                                const diff = (new Date().getTime() - messageDate.getTime()) / 1000;
                                if (diff > sms.frequency * 60) {
                                    rp(options)
                                    .then((body) => {
                                        switch (body.code) {
                                            case '000000':
                                                let date = new Date(body.create_date);
                                                Messages.findOneAndUpdate({user: profile.user},
                                                    {$set: {
                                                        user: profile.user,
                                                        code: securityCode,
                                                        sendAt: date.toISOString(),
                                                        live: sms.live,
                                                        stale: false
                                                    }}, {new: true})
                                                    .then((message) => {
                                                        res.statusCode = 200;
                                                        res.setHeader('Content-Type', 'application/json');
                                                        return res.json({
                                                            success: true,
                                                            live: message.live,
                                                            code: message.code,
                                                            sendAt: message.sendAt,
                                                            frequency: sms.frequency
                                                        });
                                                    }, err => {
                                                        res.statusCode = 500;
                                                        res.setHeader('Content-Type', 'application/json');
                                                        return res.json({
                                                            err: {
                                                                name: 'CreateMessageError',
                                                                message: err
                                                            }
                                                        });
                                                    });
                                                break;
                                            case '105147':
                                                res.statusCode = 500;
                                                res.setHeader('Content-Type', 'application/json');
                                                return res.json({
                                                    err: {
                                                        name: 'SendMessageError',
                                                        message: 'Over the specified frequency',
                                                        code: body.code
                                                    }
                                                });
                                            default:
                                                res.statusCode = 500;
                                                res.setHeader('Content-Type', 'application/json');
                                                return res.json({
                                                    err: {
                                                        name: 'ServerError',
                                                        message: body.msg,
                                                        code: body.code
                                                    }
                                                });
                                        }
                                    })
                                    .catch((err) => {
                                        return res.send(err);
                                    });
                                } else {
                                    res.statusCode = 500;
                                    res.setHeader('Content-Type', 'application/json');
                                    return res.json({
                                        err: {
                                            name: 'SendMessageError',
                                            message: 'Over the specified frequency',
                                            excess: Math.ceil(sms.frequency * 60 - diff)
                                        }
                                    });
                                }
                            } else {
                                rp(options)
                                .then((body) => {
                                    switch (body.code) {
                                        case '000000':
                                            let date = new Date(body.create_date);
                                            Messages.create({
                                                user: profile.user,
                                                code: securityCode,
                                                sendAt: date.toISOString(),
                                                live: sms.live,
                                                stale: false
                                            })
                                            .then((message) => {
                                                res.statusCode = 200;
                                                res.setHeader('Content-Type', 'application/json');
                                                return res.json({
                                                    success: true,
                                                    live: message.live,
                                                    code: message.code,
                                                    sendAt: message.sendAt,
                                                    frequency: sms.frequency
                                                });
                                            }, err => {
                                                res.statusCode = 500;
                                                res.setHeader('Content-Type', 'application/json');
                                                return res.json({
                                                    err: {
                                                        name: 'CreateMessageError',
                                                        message: err
                                                    }
                                                });
                                            });
                                            break;
                                        case '105147':
                                            res.statusCode = 500;
                                            res.setHeader('Content-Type', 'application/json');
                                            return res.json({
                                                err: {
                                                    name: 'SendMessageError',
                                                    message: 'Over the specified frequency',
                                                    code: body.code
                                                }
                                            });
                                        default:
                                            res.statusCode = 500;
                                            res.setHeader('Content-Type', 'application/json');
                                            return res.json({
                                                err: {
                                                    name: 'SendMessageError',
                                                    message: body.msg,
                                                    code: body.code
                                                }
                                            });
                                    }
                                })
                                .catch((err) => {
                                    return res.send(err);
                                });
                            }
                        })

                } else {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    return res.json({ err: { name: 'PhoneError', value: 'This phone number is not exist' } });
                }
            })
    } else {
        res.json({ success: false });
    }
});

module.exports = messageRouter;