// importing all requirements

const { validateEmail } = require("./validateFields/emailField");
const { validateString } = require("./validateFields/stringField");


// generating a validation array to validate registration field
const validateRegistrationField = [
    ...validateEmail(['email'], false),
    ...validateString(['name'], false, { min: 2, max: 30 }),
    ...validateString(['password'], false, { min: 6, max: 15 })
];


// export all the validation array
module.exports = { validateRegistrationField };




