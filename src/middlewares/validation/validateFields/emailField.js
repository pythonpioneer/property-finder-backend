// importing requirements
const { check } = require('express-validator');

/**
 * This method is only used to validate the email fields.
 * @param {Array} emails - This method takes an array of email-names as input.
 * @param {Boolean} isOptional - Provide optional as true, if want the validation array to become optional.
 * @returns {Array} - It returns validation array to validate email fields.
 */
const validateEmail = (emails, isOptional) => {

    // check that the given input is array type
    if (!Array.isArray(emails)) throw new Error('This method accepts input as an array only.');

    // returns the validation array to validate email
    return emails.map(email => {
        const validationChain = check(email, `Enter a valid ${email}`).isEmail().isLength({ max: 50 });

        // making the validation array optional and return the validation array
        if (isOptional) validationChain.optional();

        // return the validation array
        return validationChain;
    });
};

module.exports = { validateEmail };