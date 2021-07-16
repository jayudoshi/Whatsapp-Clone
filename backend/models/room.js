const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    name: {
        type: String,
        require: true
    },

    description: {
        type: String,
    },

    group: {
        type: Boolean,
        default: true,  
    },

    admin: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],

    groupDP: {
        type: String,
        default: 'default.png'
    },

    members: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],

    chats: {
        type: mongoose.Types.ObjectId,
        ref: 'Chat'
    }

} , {
    timestamps: true
});

module.exports = mongoose.model("Room" , roomSchema);