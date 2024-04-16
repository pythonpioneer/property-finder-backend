// importing requirements
const { generateToken } = require("../middlewares/auth/authMiddleware");
const { generatePassword, comparePassword } = require("../middlewares/auth/passwordMiddleware");
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

// to login a registerd user
const loginUser = async (req, res) => {
    try {
        // fetching data from request body
        const password = req.body.password.trim();
        const email = req.body.email.toLowerCase();

        // check that the user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ status: 401, message: "Invalid Credentials!" });  // use not found here but returning invalid credentials for security purpose

        // now, compare the password of the existing user with the current user
        const isPasswordMatched = comparePassword(password, user.password);
        if (!isPasswordMatched) return res.status(401).json({ status: 401, message: "Invalid Credentials!" });  // password not matched

        // now, sending user id as payload, accesssing data using id is easier
        const payloadData = {
            user: {
                id: user.id
            },
        };

        // generate the authentication user
        const authToken = generateToken(payloadData);

        // also save the token inside db
        user.refreshToken = authToken;
        await user.save();

        // return the response to the user as success
        return res.status(200).json({ status: 200, message: 'User Logged-in Successfully', "auth-token": authToken });

    } catch (err) {  // unrecogonized errors
        return res.status(500).json({ message: "Internal Server Error!!", errors: err });
    }
}


// exporting all the controllers functions
module.exports = { registerUser, loginUser };