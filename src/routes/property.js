const { fetchUser } = require('../middlewares/auth/authMiddleware');
const { validatePropertyFields } = require('../middlewares/validation/validationField');
const validateValidationResult = require('../middlewares/validation/validationMiddleware');

// importing requirements
const router = require('express').Router();


// Route 1: To add a new property: '/api/v1/property/' [using POST] (login required)
router.post('/', validatePropertyFields, validateValidationResult, fetchUser, async (req, res) => {
    res.send("ok")
});


// export all the routes
module.exports = router;