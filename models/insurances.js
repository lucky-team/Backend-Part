var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var insuredSchema = new Schema({
    lastname: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    socialId: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    bankName: {
        type: String,
        required: true
    },
    bankAccount: {
        type: String,
        required: true
    },
    bankUsername: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

var insuranceSchema = new Schema({
    plan: {
        type: Number,
        validate: {
            validator: (val) => {
                return /^[1-3]$/.test(val)
            },
            message: 'plan can only be 1, 2, or 3.'
        },
        required: true
    },
    level: {
        type: Number,
        validate: {
            validator: (val) => {
                return /^[1-3]$/.test(val)
            },
            message: 'level can only be 1, 2, or 3.'
        },
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,
        validate: {
            validator: (val) => {
                if (val % 30 == 0 && val != 0) {
                    return true;
                } else {
                    return false;
                }
            },
            message: 'duration can only be multiples of 30.'
        },
        required: true
    },
    expireDate: {
        type: Date,
        required: true
    },
    user: {
        type: 'ObjectId',
        ref: 'User'
    },
    claim: {
        type: 'ObjectId',
        ref: 'Claim'
    },
    insured: insuredSchema
}, {
    timestamps: true
})

module.exports = mongoose.model('Insurance', insuranceSchema);