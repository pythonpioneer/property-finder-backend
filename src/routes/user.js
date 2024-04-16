// importing requirements
const router = require('express').Router();
const { registerUser, loginUser } = require('../controllers/user');
const { validateRegistrationFields, validateLoginFields } = require('../middlewares/validation/validationField');
const validateValidationResult = require('../middlewares/validation/validationMiddleware');


// Route 1: To register user: '/api/v1/user/register' [using POST] (login not required)
router.post('/register', validateRegistrationFields, validateValidationResult, registerUser);

// Route 2: To login the register user: '/api/v1/user/login' [using POST] (login not required)
router.post('/login', validateLoginFields, validateValidationResult, loginUser);


// exporting the router object
module.exports = router;