// importing requirements
const mongoose = require('mongoose');
const { Schema, model } = mongoose;


// creating schema for Property
const propertySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    image: {
        type: [ String ],
        required: true,
    },
    desc: {
        type: String,
        required: true,
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
        required: true
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
        required: true
    },
    maintenanceCost: {
        type: Number,
        default: 0,
    },
    security: {
        type: Number,
        required: true
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