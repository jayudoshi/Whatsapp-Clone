const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    name: {
        type: String
    },
    profilePic: {
        type: String,
        default: 'default.png'
    },
    about:{
        type: String,
    },
    profileSetup:{
        type: Boolean,
        default: false,
    }
} , {
    timestamps: true
});

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User" , userSchema);