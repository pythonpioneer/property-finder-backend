// importing requirements
const router = require('express').Router();
const { validateRegistrationField } = require('../middlewares/validation/validationField');
const validateValidationResult = require('../middlewares/validation/validationMiddleware');


// Route 1: To register user: '/api/v1/user/register' [using POST] (login not required)
router.post('/register', validateRegistrationField, validateValidationResult, (req, res) => {
    res.send("ok");
});

// exporting the router object
module.exports = router;