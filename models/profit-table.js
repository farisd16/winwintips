const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const profitTableSchema = new Schema({
    percentages: {
        type: [Number],
        default: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
}, { timestamps: true });

module.exports = mongoose.model('Profit Table', profitTableSchema);