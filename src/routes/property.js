// importing requirements
const router = require('express').Router();
const { addProperty, fetchOneProperty, addMoreImage, deleteProperty, updateOtherOptionalFields, udpateProperty, updatePrice, fetchAllProperties } = require('../controllers/property');
const { fetchUser } = require('../middlewares/auth/authMiddleware');
const { uploadImage } = require('../middlewares/uploads/multer.middleware');
const { validatePropertyFields, validateMongoDbObjectId, validateOtherUpdates, validateUpdationPropertyFields, validatePriceUpdate } = require('../middlewares/validation/validationField');
const validateValidationResult = require('../middlewares/validation/validationMiddleware');


// Route 1: To add a new property: '/api/v1/property/' [using POST] (login required)
router.post('/', uploadImage('image'), validatePropertyFields, validateValidationResult, fetchUser, addProperty);

// Route 2: To fetch all properties: '/api/v1/property/properties' [using GET] (login not required)
router.get('/properties', fetchAllProperties);

// Route 3: To add more images to property: '/api/v1/property/:propertyId/images' [using PATCH] (login required)
router.patch('/:propertyId/images', uploadImage('image'), validateMongoDbObjectId, validateValidationResult, fetchUser, addMoreImage);

// Route 4: To delete property: '/api/v1/property/:propertyId' [using DELETE] (login required)
router.delete('/:propertyId', validateMongoDbObjectId, validateValidationResult, fetchUser, deleteProperty);

// Route 5: To update the age and flooring of the property: '/api/v1/property/:propertyId/other' [using PATCH] (login required)
router.patch('/:propertyId/other', validateOtherUpdates, validateValidationResult, fetchUser, updateOtherOptionalFields);

// Route 6: To update the property: '/api/v1/property/:propertyId' [using PUT] (login required)
router.put('/:propertyId', validateUpdationPropertyFields, validateValidationResult, fetchUser, udpateProperty);

// Route 7: To update the property price: '/api/v1/property/:propertyId/price' [using PATCH] (login required)
router.patch('/:propertyId/price', validatePriceUpdate, validateValidationResult, fetchUser, updatePrice);

// Route 8: To add fetch any property: '/api/v1/property/:propertyId' [using GET] (login not required)
router.get('/:propertyId', validateMongoDbObjectId, validateValidationResult, fetchOneProperty);


// export all the routes
module.exports = router;