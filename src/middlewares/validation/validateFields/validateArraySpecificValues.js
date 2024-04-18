// importing requirements
const { check } = require('express-validator');

/**
 * This method is only used to validate the name fields.
 * @param {Array} messages - This method takes an array of names as input.
 * @param {Boolean} isOptional - Provide optional as true, if want the validation array to become optional.
 * @param {Aarray} values - This field contain all possibl state for the values 
 * @returns {Array} - It returns validation array to validate name fields.
 */
const validateArraySpecificValues = (messages, isOptional, values) => {

    // check that the given input is array type
    if (!Array.isArray(messages) || !Array.isArray(values)) throw new Error('This method accepts input as an array only.');

    // now validate the name field
    return messages.map(name => {

        const validationChain = check(name, `Enter a valid ${name}`).isArray({ min: 1, max: 8});

        // making the validation array optional and return the validation array
        if (isOptional) validationChain.optional();

        // return the validation array
        return validationChain;
    });
};

module.exports = { validateArraySpecificValues };