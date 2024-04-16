// importing requirements
const { generatePassword } = require("../middlewares/auth/passwordMiddleware");
const User = require("../models/User.model");


// to create a user
const registerUser = async (req, res) => {
    try {
        // fetching the data from the request body
        const { name, contactNumber } = req.body;
        const password = req.body.password.trim();
        const email = req.body.email.toLowerCase();

        // check that the user already exists
        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ status: 400, message: "User with this email, already exists" });

        // let's create an hashed password for the given password
        const securePassword = generatePassword(password);

        // now, we will create a new user
        User.create({
            email,
            name,
            contactNumber,
            password: securePassword
        })
            .then(() => {

                // send the success response to the user
                return res.status(200).json({ status: 200, message: `User Registered Successfully` });
            })
            .catch(err => {  // error while saving the user in User model
                return res.status(500).json({ status: 500, message: "User Not Created!", errors: err });
            });

    } catch (err) {  // unrecogonized errors
        return res.status(500).json({ message: "Internal Server Error!! " });
    }
}

// exporting all the controllers functions
module.exports = { registerUser };