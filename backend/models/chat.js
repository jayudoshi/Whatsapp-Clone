const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    from: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        require: true
    },
    type: {
        type: String,
        default: "text"
    },
    msg: {
        type: String,
        require: true
    },
},{
    timestamps: true
})

const chatsSchema = new Schema({
    roomId: {
        type: String,
        require: true
    },
    chats: [chatSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model("Chat" , chatsSchema);