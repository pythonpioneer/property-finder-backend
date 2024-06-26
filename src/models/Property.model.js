// importing requirements
const mongoose = require('mongoose');
const { Schema, model } = mongoose;


// creating an address schema to simplify the location
const addressSchema = new Schema({
    state: {  // rare seraching on this field
        type: String,
        required: true
    },
    city: {
        type: String,
        index: true,
    },
    district: {
        type: String,
        required: true,
        index: true,
    },
    sector: {
        type: String,
        index: true,
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

    // we can add more address fields
});


// creating a price schema
const priceSchema = new Schema({
    monthlyRent: {
        type: Number,
        required: true,
        min: 1,
        index: true,
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


// creating schema for Property
const propertySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
    },
    images: {  // cloudinary uri
        type: [ String ],
        required: true,
    },
    desc: {  // indexing enabled
        type: String,
        required: true,
        min: [4, 'Description must be atleast 4 characters long.'],
        max: [300, 'Description can not be longer than 300 characters.']
    },
    price: {  // indexing enabled on the price schema
        type: priceSchema,
        required: true,
    },
    propertyType: {
        type: String,
        enum: ['1 bhk', '2 bhk', '3 bhk', '4 bhk', '5 bhk', 'studio'],
        required: true,
        index: true,
    },
    furnishing: {
        type: String,
        enum: ['full', 'semi', 'un'],
        required: true,
        index: true,
    },
    preferredTenant: [{
        type: [ String ],
        enum: ['bachelors', 'married', 'girls', 'boys', 'family', 'studio', 'couples'],
        required: true
    }],
    area: {  // the area calculated in sqft.
        type: Number,
        required: true,
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

// Index the 'desc' field for text search
propertySchema.index({ desc: 'text' });


// export the user model
const Property = model('property', propertySchema);
module.exports = { Property, addressSchema };