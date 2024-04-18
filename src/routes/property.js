const { fetchUser } = require('../middlewares/auth/authMiddleware');
const { uploadImage } = require('../middlewares/uploads/multer.middleware');
const { validatePropertyFields } = require('../middlewares/validation/validationField');
const validateValidationResult = require('../middlewares/validation/validationMiddleware');

// importing requirements
const router = require('express').Router();


// Route 1: To add a new property: '/api/v1/property/' [using POST] (login required)
router.post('/', uploadImage('image'), validatePropertyFields, validateValidationResult, fetchUser, async (req, res) => {

    console.log(req.body)
    res.send("ok")

});


// export all the routes
module.exports = router;