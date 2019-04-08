var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var profileSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    socialId: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    province: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    user: {
        type: 'ObjectId',
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Profile', profileSchema);