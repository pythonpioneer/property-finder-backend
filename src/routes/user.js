// importing requirements
const router = require('express').Router();
const { registerUser, loginUser, logoutUser, getUserDetails, updateContact, updateUserType, likeProperty } = require('../controllers/user');
const { fetchUser } = require('../middlewares/auth/authMiddleware');
const { validateRegistrationFields, validateLoginFields, validateUpdationFields, validateUserTypeField, validateMongoDbObjectId } = require('../middlewares/validation/validationField');
const validateValidationResult = require('../middlewares/validation/validationMiddleware');


// Route 1: To register user: '/api/v1/user/register' [using POST] (login not required)
router.post('/register', validateRegistrationFields, validateValidationResult, registerUser);

// Route 2: To login the register user: '/api/v1/user/login' [using POST] (login not required)
router.post('/login', validateLoginFields, validateValidationResult, loginUser);

// Route 3: To login the register user: '/api/v1/user/logout' [using DELETE] (login required)
router.delete('/logout', fetchUser, logoutUser);

// Route 4: To fetch the logged in user: '/api/v1/user/' [using GET] (login required)
router.get('/', fetchUser, getUserDetails);

// Route 5: To update the logged in user: '/api/v1/user/contact' [using PATCH] (login required)
router.patch('/contact', validateUpdationFields, validateValidationResult, fetchUser, updateContact);

// Route 6: To update the logged in user type: '/api/v1/user/type' [using PATCH] (login required)
router.patch('/type', validateUserTypeField, validateValidationResult, fetchUser, updateUserType);

// Route 7: To like the property: '/api/v1/user/:propertyId/like' [using PATCH] (login required)
router.patch('/:propertyId/like', validateMongoDbObjectId, validateValidationResult, fetchUser, likeProperty);


// exporting the router object
module.exports = router;