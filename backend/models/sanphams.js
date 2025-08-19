const mongoose = require('mongoose');
const Scheme = mongoose.Schema;

const samphams = new Scheme({
    name: { type: String },
    gia: { type: Number },
    soLuong: { type: Number },
    image: { type: Array },

}, {
    timestamps: true
})
module.exports = mongoose.model('sanpham', samphams)