const { check } = require('express-validator');

// Validate the address schema
const validateAddress = (fieldName, isOptional) => {
    if (typeof fieldName !== 'string') throw new Error('Field name must be a string.');

    const validationChain = check(fieldName, `Enter a valid ${fieldName}`);

    if (isOptional) validationChain.optional();

    return validationChain.custom((value, { req }) => {
        const { state, city, district, zip, sector, block, buildingName } = value;

        // Validate each field against its validation rules
        if (!state || !city || !district || !zip) {
            throw new Error('State, city, district, and zip are required fields');
        }

        if (typeof state !== 'string' || state.trim() === '') {
            throw new Error('State must be a non-empty string');
        }

        if (typeof city !== 'string' || city.trim() === '') {
            throw new Error('City must be a non-empty string');
        }

        if (typeof district !== 'string' || district.trim() === '') {
            throw new Error('District must be a non-empty string');
        }

        if (typeof zip !== 'string' || zip.trim() === '') {
            throw new Error('Zip must be a non-empty string');
        }

        if (sector && typeof sector !== 'string') {
            throw new Error('Sector must be a string');
        }

        if (block && typeof block !== 'string') {
            throw new Error('Block must be a string');
        }

        if (buildingName && typeof buildingName !== 'string') {
            throw new Error('Building name must be a string');
        }

        return true;
    });
};

module.exports = { validateAddress };
