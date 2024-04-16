// importing requirements
const router = require('express').Router();
const { registerUser } = require('../controllers/user');
const { validateRegistrationField } = require('../middlewares/validation/validationField');
const validateValidationResult = require('../middlewares/validation/validationMiddleware');


// Route 1: To register user: '/api/v1/user/register' [using POST] (login not required)
router.post('/register', validateRegistrationField, validateValidationResult, registerUser);

// exporting the router object
module.exports = router;