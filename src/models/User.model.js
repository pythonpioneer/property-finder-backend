// importing requirements
const mongoose = require('mongoose');
const { Schema, model } = mongoose;


// creating schema for users
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    contactNumber: {
        type: String,
        required: true,
        unique: true,
        min: [10, 'Mobile Number must be 10 characters long.'],
        max: [10, 'Mobile Number must be 10 characters long.']
    },
    name: {
        type: String,
        required: true,
        min: [2, 'Name must be atleast 2 characters long.'],
        max: [30, 'Name can not be longer than 30 characters.']
    },
    password: {
        type: String,
        required: true,
        min: [6, 'Password must be atleast 6 characters long.'],
        max: [15, 'Password can not be longer than 15 characters.']
    }, 
    userType: {
        type: String,
        default: "tenant",
        lowercase: true,
    },
    likedProperties: {
        type: [ Schema.Types.ObjectId ],
        default: [],
    },
    refreshToken: {
        type: String,
    }
}, { timestamps: true });

// export the user model
const User = model('user', userSchema);
module.exports = User;