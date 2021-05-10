const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tipSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    text: {
        type: String
    },
    updated: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Tip', tipSchema);