// importing requirements
const router = require('express').Router();


// Route 1: To add a new property: '/api/v1/property/' [using POST] (login required)
router.post('/', async (req, res) => {
    res.send("ok")
});


// export all the routes
module.exports = router;