const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    activated: {
        type: Boolean,
        default: false
    },
    expiration: {
        type: Date,
        default: new Date(0)
    },
    admission: {
        type: Date,
        default: new Date(1),
        required: true
    },
    resetToken: {
        type: String
    },
    resetTokenExpiration: {
        type: Date
    },
    hidden: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('User', userSchema);