// importing requirements
const { check, validationResult } = require('express-validator');


// to validate the price schema
const validatePrice = (fieldName, isOptional) => {

    // check that the field name is a string
    if (typeof fieldName !== 'string') throw new Error('Field name must be a string.');

    // validate the field using the priceSchema
    const validationChain = check(fieldName, `Enter a valid ${fieldName}`);

    // if optional flag is true, make the validation optional
    if (isOptional) validationChain.optional();

    return validationChain.custom((value, { req }) => {

        // check if the value matches the priceSchema
        const { monthlyRent, maintenanceCost, security, brokerage } = value;
        if (
            (value.monthlyRent && (typeof value.monthlyRent !== 'number' || value.monthlyRent < 1)) ||
            (value.maintenanceCost && typeof value.maintenanceCost !== 'number') ||
            (value.security && typeof value.security !== 'number') ||
            (value.brokerage && typeof value.brokerage !== 'number')
        ) {
            throw new Error('Invalid price schema');
        }

        // return true if the value matches the schema
        return true;
    });
};


// export the middleware
module.exports = { validatePrice };
