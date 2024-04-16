// importing requirements
const router = require('express').Router();


// Route 1: To register user: '/api/v1/user/register' [using POST] (login not required)
router.post('/register', (req, res) => {
    res.send("ok");
});

// exporting the router object
module.exports = router;