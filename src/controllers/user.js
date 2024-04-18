// importing requirements
const { generateToken } = require("../middlewares/auth/authMiddleware");
const { generatePassword, comparePassword } = require("../middlewares/auth/passwordMiddleware");
const User = require("../models/User.model");


// to create a user
const registerUser = async (req, res) => {
    try {
        // fetching the data from the request body
        const name = req.body.name.trim();
        const contactNumber = req.body.contactNumber;
        const password = req.body.password.trim();
        const email = req.body.email.toLowerCase();

        // check that the user already exists
        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ status: 400, message: "User with this email, already exists" });

        // check that the contact exist
        const contact = await User.findOne({ contactNumber });
        if (contact) return res.status(400).json({ status: 400, message: "User with this contact, already exists" });

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

// to logout the user
const logoutUser = async (req, res) => {
    try {

        // check that the user exist or not
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ status: 404, message: "User Not Found!" });

        let message = "User Already Logged out!"

        // logout the user by deleting token from db
        if (user.refreshToken) {

            user.refreshToken = null;
            await user.save();
            message = "User Logout Successfully!"
        }

        // send the response to the user as success
        return res.status(200).json({ status: 200, message });
        
    } catch (err) {  // unrecogonized errors
        return res.status(500).json({ message: "Internal Server Error!!", errors: err });
    }
}

// to fetch the logged in user details
const getUserDetails = async (req, res) => {
    try {
        // check that the user exist or not
        const user = await User.findById(req.user.id).select('-password -likedProperties -refreshToken');
        if (!user) return res.status(404).json({ status: 404, message: "User Not Found!" });

        // send the user as response
        return res.status(200).json({ status: 200, message: "User Found!", user });

    } catch (err) {  // unrecogonized errors
        return res.status(500).json({ message: "Internal Server Error!!", errors: err });
    }
}

// to update the user details like name, email and contactNumber
const updateContact = async (req, res) => {
    try {
        // fetch the user details from the body
        const { name, contactNumber, email } = req.body;

        // check that the user exist or not
        const user = await User.findById(req.user.id).select('-password -likedProperties -refreshToken');
        if (!user) return res.status(404).json({ status: 404, message: "User Not Found!" });

        // fields to be updated
        const updatedFields = {}

        // finding possible fields to be updated
        if (name) {
            updatedFields.name = name.trim();
        }
        if (contactNumber) {

            // check that the user with this email exists
            const newUser = await User.findOne({ contactNumber });
            if (newUser) return res.status(400).json({ status: 400, message: "An User with this contact already exists"});

            updatedFields.contactNumber = contactNumber;
        }
        if (email) {

            // check that the user with this email exists
            const newUser = await User.findOne({ email });
            if (newUser) return res.status(400).json({ status: 400, message: "An User with this email already exists"});

            updatedFields.email = email.toLowerCase();
        }

        // check that user wants to update something
        let toBeUpdated = Object.keys(updatedFields).length > 0;

        // checking fields that need to be updated
        if (!toBeUpdated) return res.status(204).json({ status: 204, message: "There is nothing to update"})

        // update the fields
        Object.assign(user, updatedFields);
        await user.save();

        // now, send the user with updated message
        return res.status(200).json({ status: 200, message: "User Updated Successfully", user });

    } catch (err) {  // unrecogonized errors
        return res.status(500).json({ message: "Internal Server Error!!", errors: err });
    }
}

// to update the role of the user
const updateUserType = async (req, res) => {
    try {
        // fetch the user type from the request body
        const { userType } = req.body;

        // check that the user exist or not
        const user = await User.findById(req.user.id).select('-password -likedProperties -refreshToken');
        if (!user) return res.status(404).json({ status: 404, message: "User Not Found!" });

        // update the user and save in db
        user.userType = userType;
        await user.save();

        // respond the user with success response
        return res.status(200).json({ status: 200, message: "User role updated", user });
        
    } catch (err) {  // unrecogonized errors
        return res.status(500).json({ message: "Internal Server Error!!", errors: err });
    }
}


// exporting all the controllers functions
module.exports = { registerUser, loginUser, logoutUser, getUserDetails, updateContact, updateUserType };