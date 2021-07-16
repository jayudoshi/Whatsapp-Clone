const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema = new Schema({
    userId:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        unique: true
    },
    contacts: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }]
} , {
    timestamps: true
});

module.exports = mongoose.model("Contact" , contactSchema);