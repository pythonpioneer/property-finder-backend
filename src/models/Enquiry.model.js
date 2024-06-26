// importing requirements
const mongoose = require('mongoose');
const { Schema, model } = mongoose;


// creating schema for users
const enquirySchema = new Schema({
    desc: {
        type: String,
        required: true,
        max: [900, 'Name can not be longer than 900 characters.']
    },
    from: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
    },
    to: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
    },
}, { timestamps: true });


// export the user model
const Enquiry = model('enquiry', enquirySchema);
module.exports = Enquiry;