var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

var claimSchema = new Schema({
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
    files: [{
        type: String
    }],
    status: {
        type: String,
        enum: ['accepted', 'rejected', 'processing', 'pending'],
        default: 'pending'
    },
    insurance: {
        type: 'ObjectId',
        ref: 'Insurance'
    },
    user: {
        type: 'ObjectId',
        ref: 'User'
    },
    employee: {
        type: 'ObjectId',
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Claim', claimSchema);