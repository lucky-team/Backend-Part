const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    user: {
        type: 'ObjectId',
        required: true,
        unique: true
    },
    lang: {
        type: String,
        enum: ['cn', 'en'],
        required: true
    },
    code: {
        type: String,
        required: true
    },
    sendAt: {
        type: Date,
        required: true
    },
    live: {
        type: Number,
        required: true
    },
    stale: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);