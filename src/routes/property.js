// importing requirements
const router = require('express').Router();
const { addProperty, fetchOneProperty, addMoreImage, deleteProperty, updateOtherOptionalFields } = require('../controllers/property');
const { fetchUser } = require('../middlewares/auth/authMiddleware');
const { uploadImage } = require('../middlewares/uploads/multer.middleware');
const { validatePropertyFields, validateMongoDbObjectId, validateOtherUpdates } = require('../middlewares/validation/validationField');
const validateValidationResult = require('../middlewares/validation/validationMiddleware');


// Route 1: To add a new property: '/api/v1/property/' [using POST] (login required)
router.post('/', uploadImage('image'), validatePropertyFields, validateValidationResult, fetchUser, addProperty);

// Route 2: To add fetch any property: '/api/v1/property/:propertyId' [using GET] (login not required)
router.get('/:propertyId', validateMongoDbObjectId, validateValidationResult, fetchOneProperty);

// Route 3: To add more images to property: '/api/v1/property/:propertyId/images' [using PATCH] (login required)
router.patch('/:propertyId/images', uploadImage('image'), validateMongoDbObjectId, validateValidationResult, fetchUser, addMoreImage);

// Route 4: To delete property: '/api/v1/property/:propertyId' [using DELETE] (login required)
router.delete('/:propertyId', validateMongoDbObjectId, validateValidationResult, fetchUser, deleteProperty);

// Route 5: To update the age and flooring of the property: '/api/v1/property/:propertyId/other' [using PATCH] (login required)
router.patch('/:propertyId/other', validateOtherUpdates, validateValidationResult, fetchUser, updateOtherOptionalFields);


// export all the routes
module.exports = router;