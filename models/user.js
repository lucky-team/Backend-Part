var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    employee: {
        type: Boolean,
        default: false
    },
    profile: {
        type: 'ObjectId',
        ref: 'Profile'
    }
}, {
    timestamps: true
})

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);