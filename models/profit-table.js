const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const profitTableSchema = new Schema({
    month: {
        type: String,
        required: true
    },
    vip1: {
        won: Number,
        total: Number
    },
    vip2: {
        won: Number,
        total: Number
    },
    vip3: {
        won: Number,
        total: Number
    },
    vip4: {
        won: Number,
        total: Number
    },
    vip5: {
        won: Number,
        total: Number
    },
    vip6: {
        won: Number,
        total: Number
    }
}, { timestamps: true });

module.exports = mongoose.model('Profit Table', profitTableSchema);