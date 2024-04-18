const { Property } = require("../models/Property.model");
const User = require("../models/User.model");
const { uploadOnCloudinary, deleteMultipleImages } = require("../services/cloudinary");
const { fetchImageNames } = require("../utils");


// to add a new property
const addProperty = async (req, res) => {
    try {
        // fetch all the information from the request body
        const { desc, propertyType, furnishing, area, propertyAge, flooring } = req.body;
        const price = JSON.parse(req.body.price);
        const preferredTenant = JSON.parse(req.body.preferredTenant)
        const location = JSON.parse(req.body.location);

        // fetching file
        const imageLocalPath = req.file?.path;

        // find the user
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ status: 404, message: "User Not Found" });

        // only owner can upload pics
        if (user.userType !== 'owner') return res.status(403).json({ status: 403, message: "Permission Denied, Change your Role!!" });

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
            propertyAge,
            flooring: flooring.trim(),
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

// to fetch a single property
const fetchOneProperty = async (req, res) => {
    try {
        // fetch the property id from params
        const { propertyId } = req.params;

        // check that the property exists
        const property = await Property.findById(propertyId);
        if (!property) return res.status(404).json({ status: 404, message: "Property Not Found" });

        // now, return the property 
        return res.status(200).json({ status: 200, message: "Property Found", property });

    } catch (err) {  // unrecogonized errors
        return res.status(500).json({ message: "Internal Server Error!!", errors: err });
    }
}

// to upload more images to property
const addMoreImage = async (req, res) => {
    try {
        // fetch the image file and propertyId
        const imageLocalPath = req.file?.path;
        const propertyId = req.params.propertyId;

        // find the user
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ status: 404, message: "User Not Found" });

        // check that the property exists 
        const property = await Property.findById(propertyId);
        if (!property) return res.status(404).json({ status: 404, message: "Property Not Found" });

        // check that the user is authorized to upload image
        if (user._id.toString() !== property.user.toString()) return res.status(403).json({ status: 403, message: "Unauthorized Access" });

        // validate that we get the image on our server
        if (!imageLocalPath) return res.status(400).json({ status: 400, message: "Image is required" });

        // upload the image on cloudinary
        const image = await uploadOnCloudinary(imageLocalPath);

        // validate the image
        if (!image) return res.status(400).json({ status: 400, message: "Image is required" });

        // now, save the image url to the db
        property.images.push(image.secure_url);
        await property.save();

        // update the user role as owner
        if (user.userType !== 'owner') {
            user.userType = "owner";
            user.save();
        }

        // image uploaded successfully, success response to user
        return res.status(200).json({ status: 200, message: "Image Uploaded Successfully!", image: image.secure_url, images: property.images });

    } catch (err) {  // unrecogonized errors
        return res.status(500).json({ message: "Internal Server Error!!", errors: err });
    }
};

// to delete the property
const deleteProperty = async (req, res) => {
    try {
        // fetch the propertyId
        const propertyId = req.params.propertyId;

        // check that the property exists 
        const property = await Property.findById(propertyId);
        if (!property) return res.status(404).json({ status: 404, message: "Property Not Found" });

        // check that the user exists
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ status: 404, message: "User Not Found" });

        // check that the user is authorized to delete the property
        if (user._id.toString() !== property.user.toString()) return res.status(403).json({ status: 403, message: "Unauthorized Access" });

        // update the user role as owner, because user is trying to delete properties
        if (user.userType !== 'owner') {
            user.userType = "owner";
            user.save();
        }

        // fetching image names from the image array
        const imageNames = fetchImageNames(property.images);

        // now, delete all the images
        const isImageDeleted = deleteMultipleImages(imageNames);

        if (!isImageDeleted) {
            return res.status(504).json({ status: 504, message: "Cloudinary could not delete the images." });
        }

        // delete the property now
        await Property.findByIdAndDelete(propertyId);

        // send success response, after deleting the property
        return res.status(200).json({ status: 200, message: "Property Deleted Successfully", propertyId });

    } catch (err) {  // unrecogonized errors
        return res.status(500).json({ message: "Internal Server Error!!", errors: err });
    }
}

// to update optional fiedls
const updateOtherOptionalFields = async (req, res) => {
    try {
        // fetch the propertyId, age and flooring
        const propertyId = req.params.propertyId;
        const { propertyAge, flooring } = req.body;

        // check that the property exists 
        const property = await Property.findById(propertyId);
        if (!property) return res.status(404).json({ status: 404, message: "Property Not Found" });

        // check that the user exists
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ status: 404, message: "User Not Found" });

        // check that the user is authorized to delete the property
        if (user._id.toString() !== property.user.toString()) return res.status(403).json({ status: 403, message: "Unauthorized Access" });

        // update the user role as owner
        if (user.userType !== 'owner') {
            user.userType = "owner";
            user.save();
        }

        // save the property details
        property.propertyAge = propertyAge;
        property.flooring = flooring.trim();
        await property.save();

        // after updating successfully, send success
        return res.status(200).json({ status: 200, message: "Property Updated!", property });

    } catch (err) {  // unrecogonized errors
        return res.status(500).json({ message: "Internal Server Error!!", errors: err });
    }
}

// to update the property fields
const udpateProperty = async (req, res) => {
    try {
        // fetch all the information from the request body
        const { desc, propertyType, furnishing, area, propertyAge, flooring } = req.body;
        const price = req.body?.price;
        const preferredTenant = req.body?.preferredTenant
        const location = req.body?.location;
        const propertyId = req.params?.propertyId;

        // find the user
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ status: 404, message: "User Not Found" });

        // check that the property exists 
        const property = await Property.findById(propertyId);
        if (!property) return res.status(404).json({ status: 404, message: "Property Not Found" });

        // update the user role as owner
        if (user.userType !== 'owner') {
            user.userType = "owner";
            user.save();
        }

        // to store all the updated data
        const propertyData = {
            desc,
            price,
            propertyType,
            furnishing,
            preferredTenant,
            area,
        };

        // check for the optional fields
        if (flooring) propertyData.flooring;
        if (propertyAge) propertyData.propertyAge;
        if (location) propertyData.location;

        // now, update the property
        const updatedProperty = await Property.findByIdAndUpdate(propertyId, { $set: propertyData }, { new: true });

        // now return the success response with updated user
        return res.status(200).json({ status: 200, message: "Porperty Updated", property: updatedProperty });

    } catch (err) {  // unrecogonized errors
        return res.status(500).json({ message: "Internal Server Error!!", errors: err });
    }
}

// to update the price of the property
const updatePrice = async (req, res) => {
    try {
        // fetch the propertyId, age and flooring
        const propertyId = req.params.propertyId;
        const price = req.body?.price;

        // check that the property exists 
        const property = await Property.findById(propertyId);
        if (!property) return res.status(404).json({ status: 404, message: "Property Not Found" });

        // check that the user exists
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ status: 404, message: "User Not Found" });

        // check that the user is authorized to delete the property
        if (user._id.toString() !== property.user.toString()) return res.status(403).json({ status: 403, message: "Unauthorized Access" });

        // update the user role as owner
        if (user.userType !== 'owner') {
            user.userType = "owner";
            user.save();
        }

        // now, update the property price
        property.price = price;
        await property.save();

        // property price updated
        return res.status(200).json({ status: 200, message: "Price updated successfully!", price: property.price, propertyId })

    } catch (err) {  // unrecogonized errors
        return res.status(500).json({ message: "Internal Server Error!!", errors: err });
    }
}

// to fetch all properties listed by any user
const fetchAllProperties = async (req, res) => {
    try {
        // Calculate the offset
        let page = Number(req.params.page) || 1;
        if (page <= 0) page = 1;

        let limit = 10;
        let skip = (page - 1) * limit;

        // Construct filter object based on req.query parameters
        const filter = {};

        // Location filters
        if (req.query.state) filter['location.state'] = req.query.state;
        if (req.query.city) filter['location.city'] = req.query.city;
        if (req.query.district) filter['location.district'] = req.query.district;
        if (req.query.sector) filter['location.sector'] = req.query.sector;

        // Price range filter
        if (req.query.minPrice || req.query.maxPrice) {
            filter['price.monthlyRent'] = {};
            if (req.query.minPrice) filter['price.monthlyRent'].$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) filter['price.monthlyRent'].$lte = Number(req.query.maxPrice);
        }

        // Property type filter
        if (req.query.propertyType) filter.propertyType = req.query.propertyType;

        // Furnishing filter
        if (req.query.furnishing) filter.furnishing = req.query.furnishing;

        // Preferred tenant filter
        if (req.query.preferredTenant) filter.preferredTenant = { $in: req.query.preferredTenant };

        // Find properties based on filter and pagination
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


// export all the controllers
module.exports = {
    addProperty,
    fetchOneProperty,
    addMoreImage,
    deleteProperty,
    updateOtherOptionalFields,
    udpateProperty,
    updatePrice,
    fetchAllProperties,
};