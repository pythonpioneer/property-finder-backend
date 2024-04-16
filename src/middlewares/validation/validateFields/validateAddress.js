// import requirements
const { check } = require('express-validator');


// valdiate the address schema
const validateAddress = (fieldName, isOptional) => {

    // check that the field name is a string
    if (typeof fieldName !== 'string') throw new Error('Field name must be a string.');

    // validate the field using the addressSchema
    const validationChain = check(fieldName, `Enter a valid ${fieldName}`);

    // if optional flag is true, make the validation optional
    if (isOptional) validationChain.optional();

    return validationChain.custom((value, { req }) => {

        // check if the value matches the addressSchema
        const { state, city, district, sector, block, zip, buildingName } = value;
        if (
            typeof state !== 'string' ||
            typeof city !== 'string' ||
            typeof district !== 'string' ||
            (sector && typeof sector !== 'string') ||
            (block && typeof block !== 'string') ||
            typeof zip !== 'string' ||
            (buildingName && typeof buildingName !== 'string')
        ) {
            throw new Error('Invalid address schema');
        }

        // return true if the value matches the schema
        return true;
    });
};

// export the validation middleware
module.exports = { validateAddress };
