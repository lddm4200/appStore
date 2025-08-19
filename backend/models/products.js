const mongoose = require('mongoose');
const Scheme = mongoose.Schema;

const products = new Scheme({
    name: { type: String },
    pice: { type: Number },
    quantity: { type: Number },
    image: { type: Array },

}, {
    timestamps: true
})
module.exports = mongoose.model('product', products)