// importing all requirements

const { validateEmail } = require("./validateFields/emailField");
const { validateString } = require("./validateFields/stringField");


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

// export all the validation array
module.exports = { validateRegistrationFields, validateLoginFields, validateUpdationFields };




