// importing requirements
const { generateToken } = require("../middlewares/auth/authMiddleware");
const { generatePassword, comparePassword } = require("../middlewares/auth/passwordMiddleware");
const { Property } = require("../models/Property.model");
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
        return res.status(200).json({ status: 200, message: 'User Logged-in Successfully', "auth-token": authToken, likedProperties: user.likedProperties });

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
            if (newUser) return res.status(400).json({ status: 400, message: "An User with this contact already exists" });

            updatedFields.contactNumber = contactNumber;
        }
        if (email) {

            // check that the user with this email exists
            const newUser = await User.findOne({ email });
            if (newUser) return res.status(400).json({ status: 400, message: "An User with this email already exists" });

            updatedFields.email = email.toLowerCase();
        }

        // check that user wants to update something
        let toBeUpdated = Object.keys(updatedFields).length > 0;

        // checking fields that need to be updated
        if (!toBeUpdated) return res.status(204).json({ status: 204, message: "There is nothing to update" })

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

// to like the property by logged in user
const likeProperty = async (req, res) => {
    try {
        // fetch the property id from req
        const propertyId = req.params.propertyId;

        // check that the property exists 
        const property = await Property.findById(propertyId);
        if (!property) return res.status(404).json({ status: 404, message: "Property Not Found" });

        // check that the user exists
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ status: 404, message: "User Not Found" });

        // check that the property is already liked
        const propertyPosition = user.likedProperties.indexOf(propertyId);

        // now, if property is already liked then unlike else like it
        if (propertyPosition === -1) {
            user.likedProperties.push(propertyId);
        } else {

            // remove propertyId from the likedProperties array
            user.likedProperties.splice(propertyPosition, 1);
        }

        // now, save the user;
        user.save();

        // property liked successfully
        return res.status(200).json({ status: 200, message: propertyPosition + 1 ? "Liked" : "Unliked", info: `User ${propertyPosition + 1 ? "Liked" : "Unliked"} the property`, likedProperties: user.likedProperties })

    } catch (err) {  // unrecogonized errors
        return res.status(500).json({ message: "Internal Server Error!!", errors: err });
    }
}

// to fetch all the liked properties by the loggedin user
const likedProperties = async (req, res) => {
    try {
        // check that the user exists
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ status: 404, message: "User Not Found" });

        // all liked properties id
        const likedPropertiesId = user.likedProperties;

        // now, fetch all the liked properties details from the Property collections
        const likedPropertiesDetails = await Property.find({ _id: { $in: likedPropertiesId } });

        // Return the details of liked properties
        return res.status(200).json({ status: 200, likedProperties: likedPropertiesDetails });

    } catch (err) {  // unrecogonized errors
        return res.status(500).json({ message: "Internal Server Error!!", errors: err });
    }
}

// to fetch all properties listed by the loggedin user
const fetchUserProperties = async (req, res) => {
    try {
        // check that the user exists
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ status: 404, message: "User Not Found" });

        // calculate the offset
        let page = Number(req.params.page) || 1;
        if (page <= 0) page = 1;

        let limit = 10;
        let skip = (page - 1) * limit;

        // construct filter object based on req.query parameters
        const filter = { user: user._id };

        // location filters
        if (req.query.state) filter['location.state'] = req.query.state;
        if (req.query.city) filter['location.city'] = req.query.city;
        if (req.query.district) filter['location.district'] = req.query.district;
        if (req.query.sector) filter['location.sector'] = req.query.sector;

        // rrice range filters
        if (req.query.minPrice || req.query.maxPrice) {
            filter['price.monthlyRent'] = {};
            if (req.query.minPrice) filter['price.monthlyRent'].$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) filter['price.monthlyRent'].$lte = Number(req.query.maxPrice);
        }

        // property type filter
        if (req.query.propertyType) filter.propertyType = req.query.propertyType;

        // furnishing filter
        if (req.query.furnishing) filter.furnishing = req.query.furnishing;

        // preferred tenant filter
        if (req.query.preferredTenant) filter.preferredTenant = { $in: req.query.preferredTenant };

        // find properties based on filter and pagination
        const properties = await Property.find(filter).skip(skip).limit(limit);

        if (properties.length === 0) {
            return res.status(200).json({ status: 200, message: "No Data to Display", properties, page });
        }

        // Send properties as success
        return res.status(200).json({ status: 200, message: "Filtered Properties", properties, page });

    } catch (err) {
        // Handle errors
        return res.status(500).json({ message: "Internal Server Error!!", errors: err });
    }
}


// exporting all the controllers functions
module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUserDetails,
    updateContact,
    updateUserType,
    likeProperty,
    likedProperties,
    fetchUserProperties,
};