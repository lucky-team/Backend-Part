var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

var claimSchema = new Schema({
    type: {
        type: Number,
        validate: {
            validator: (val) => {
                return /^[1-3]$/.test(val)
            },
            message: 'level can only be 1, 2, or 3.'
        },
        required: true
    },
    location: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    amount: {
        type: Currency,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    rejectReason: {
        type: String
    },
    files: [{
        type: String
    }],
    status: {
        type: String,
        enum: ['accepted', 'rejected', 'processing', 'pending'],
        default: 'pending',
        required: true
    },
    insurance: {
        type: 'ObjectId',
        ref: 'Insurance',
        required: true
    },
    user: {
        type: 'ObjectId',
        ref: 'User',
        require: true
    },
    employee: {
        type: 'ObjectId',
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Claim', claimSchema);