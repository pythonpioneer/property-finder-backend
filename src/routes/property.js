// importing requirements
const router = require('express').Router();
const { addProperty } = require('../controllers/property');
const { fetchUser } = require('../middlewares/auth/authMiddleware');
const { uploadImage } = require('../middlewares/uploads/multer.middleware');
const { validatePropertyFields, validateMongoDbObjectId } = require('../middlewares/validation/validationField');
const validateValidationResult = require('../middlewares/validation/validationMiddleware');


// Route 1: To add a new property: '/api/v1/property/' [using POST] (login required)
router.post('/', uploadImage('image'), validatePropertyFields, validateValidationResult, fetchUser, addProperty);

// Route 1: To add fetch any property: '/api/v1/property/:propertyId' [using POST] (login required)
router.get('/:propertyId', validateMongoDbObjectId, validateValidationResult, fetchUser, async (req, res) => {
    res.send(req.params)
});


// export all the routes
module.exports = router;