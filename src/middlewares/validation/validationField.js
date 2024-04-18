// importing all requirements

const { validateEmail } = require("./validateFields/emailField");
const { validateMongoId } = require("./validateFields/mongoField");
const { validateString } = require("./validateFields/stringField");
const { validateAddress } = require("./validateFields/validateAddress");
const { validateArraySpecificValues } = require("./validateFields/validateArraySpecificValues");
const { validatePrice } = require("./validateFields/validatePrice");
const { validateSpecificValues } = require("./validateFields/validateSpecificValues");


// generating a validation array to validate registration fields
const validateRegistrationFields = [
    ...validateEmail(['email'], false),
    ...validateString(['name'], false, { min: 2, max: 30 }),
    ...validateString(['password'], false, { min: 6, max: 15 }),
    ...validateString(['contactNumber'], false, { min: 10, max: 10 }, true),
];

// generate a validation array to validate the login feilds
const validateLoginFields = [
    ...validateEmail(['email'], false),
    ...validateString(['password'], false, { min: 6, max: 15 }),
]; 

// generate a validation array to validate the update feilds
const validateUpdationFields = [
    ...validateEmail(['email'], true),
    ...validateString(['name'], true, { min: 2, max: 30 }),
    ...validateString(['contactNumber'], true, { min: 10, max: 10 }, true),
];

// genearte a validation array to validate the user type
const validateUserTypeField = [
    ...validateSpecificValues(['userType'], false, ['tenant', 'owner']),
];

// genearat a validatioin array to validate property fields
const validatePropertyFields = [

    // required fields
    ...validateString(['desc'], false, { min: 4, max: 300 }),
    validatePrice('price', false),
    ...validateSpecificValues(['propertyType'], false, ['1 bhk', '2 bhk', '3 bhk', '4 bhk', '5 bhk', 'studio']),
    ...validateSpecificValues(['furnishing'], false, ['full', 'semi', 'un']),
    ...validateString(['area'], false, { max: 4 }, true), // a number but validated through string

    // Optional fields
    ...validateString(['flooring'], true, { max: 20 }),
    ...validateString(['propertyAge'], true, { max: 2 }, true), // a number but validated through string
];

// generate a validatioin array to vaidate mongo db object id
const validateMongoDbObjectId = [
    ...validateMongoId(['propertyId'], false),
];

// generate a validatioin array to vaidate mongo db object id and property age and property flooring
const validateOtherUpdates = [
    ...validateMongoId(['propertyId'], false),
    ...validateString(['flooring'], true, { max: 20 }),
    ...validateString(['propertyAge'], true, { max: 2 }, true),
];

// genearat a validatioin array to validate property fields
const validateUpdationPropertyFields = [

    // required fields
    ...validateString(['desc'], true, { min: 4, max: 300 }),
    validatePrice('price', true),
    ...validateSpecificValues(['propertyType'], true, ['1 bhk', '2 bhk', '3 bhk', '4 bhk', '5 bhk', 'studio']),
    ...validateSpecificValues(['furnishing'], true, ['full', 'semi', 'un']),
    ...validateString(['area'], true, { max: 4 }, true), // a number but validated through string

    // Optional fields
    ...validateString(['flooring'], true, { max: 20 }),
    ...validateString(['propertyAge'], true, { max: 2 }, true), // a number but validated through string
];

// generate the validation array to validate the price fields
const validatePriceUpdate = [
    validatePrice('price', false),
    ...validateMongoId(['propertyId'], false),
];


// export all the validation array
module.exports = { 
    validateRegistrationFields, 
    validateLoginFields, 
    validateUpdationFields, 
    validateUserTypeField,
    validatePropertyFields,
    validateMongoDbObjectId,
    validateOtherUpdates,
    validateUpdationPropertyFields,
    validatePriceUpdate,
};
