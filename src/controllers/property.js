const { Property } = require("../models/Property.model");
const User = require("../models/User.model");
const { uploadOnCloudinary } = require("../services/cloudinary");

// to add a new property
const addProperty = async (req, res) => {
    try {
        // fetch all the information from the request body
        const { desc, propertyType, furnishing, area } = req.body;
        const price = JSON.parse(req.body.price);
        const preferredTenant = JSON.parse(req.body.preferredTenant)
        const location = JSON.parse(req.body.location);

        // fetching file
        const imageLocalPath = req.file?.path;

        // find the user
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ status: 404, message: "User Not Found" });

        // validate that we get the image on our server
        if (!imageLocalPath) return res.status(400).json({ status: 400, message: "Image is required" });

        // upload the image on cloudinary
        const image = await uploadOnCloudinary(imageLocalPath);

        // validate the image
        if (!image) return res.status(400).json({ status: 400, message: "Image is required" });

        Property.create({
            desc,
            images: image.secure_url,
            price,
            propertyType,
            furnishing,
            preferredTenant,
            area,
            location,
            user: user._id,
        })
            .then(property => {
                // send the success response to the user
                return res.status(200).json({ status: 200, message: `Property Added Successfully`, property });
            })
            .catch(err => {  // error while saving the user in User model
                return res.status(500).json({ status: 500, message: "Property Not Added", errors: err });
            });

    } catch (err) {  // unrecogonized errors
        return res.status(500).json({ message: "Internal Server Error!!", errors: err });
    }
}

// export all the controllers
module.exports = { addProperty };