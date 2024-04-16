// importing requirements
const mongoose = require('mongoose');
const { Schema, model } = mongoose;


// creating schema for Property
const propertySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    images: {  // cloudinary uri
        type: [ String ],
        required: true,
    },
    desc: {
        type: String,
        required: true,
        min: [4, 'Description must be atleast 4 characters long.'],
        max: [300, 'Description can not be longer than 300 characters.']
    },
    price: {
        type: priceSchema,
        required: true
    },
    propertyType: {
        type: String,
        enum: ['1 bhk', '2 bhk', '3 bhk', '4 bhk', '5 bhk'],
        required: true
    },
    furnishing: {
        type: String,
        enum: ['full', 'semi', 'un'],
        required: true
    },
    preferredTenant: [{
        type: String,
        enum: ['bachelors', 'married', 'girls', 'boys', 'family', 'studio', 'couples'],
        required: true
    }],
    area: {  // the area calculated in sqft.
        type: Number,
        required: true,
        min: 81
    },
    flooring: {
        type: String,
    },
    propertyAge: {  // the age calculated in years
        type: Number,
    },
    location: {
        type: addressSchema,
        required: true
    }
}, { timestamps: true });


// creating a price schema
const priceSchema = new Schema({
    monthlyRent: {
        type: Number,
        required: true,
        min: 1
    },
    maintenanceCost: {
        type: Number,
        default: 0,
    },
    security: {
        type: Number,
        default: 0
    },
    brokerage: {
        type: Number,
        default: 0
    }
});

// creating an address schema to simplify the location
const addressSchema = new Schema({
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    sector: {
        type: String
    },
    block: {
        type: String
    },
    zip: {
        type: String,
        required: true,
    },
    buildingName: {
        type: String
    }

    // can add more address fields
});


// export the user model
const Property = model('property', propertySchema);
module.exports = Property;