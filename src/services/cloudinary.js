// importing all requirements
const { v2 } = require('cloudinary');
const dotenv = require('dotenv').config();       
const cloudinary = v2;
const fs = require('fs');


// cloudinary configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// to upload the file from local server to cloudinary server
const uploadOnCloudinary = async (localFilePath) => {
    try {
        // check for file
        if (!localFilePath) return null;

        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });

        // file has been uploaded successfull, unlink file from our server
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {  // remove the locally saved temporary file as the upload operation got failed
        fs.unlinkSync(localFilePath);
        return null;
    }
}

// delete a image from cloudinary
const _deleteImage = (image) => {
    cloudinary.uploader.destroy(image, (error, result) => {
        
        // image deleted successfully, here
        if (error) console.log(error);
    });
}

// delete images from cloudinary
const deleteMultipleImages = (images) => {

    // traverse in the images and delete one by one
    images.forEach(image => {
        
        _deleteImage(image);
    });

    // send confirmation after deleting all images
    return true;
}

// export the cloudinary upload service
module.exports = { uploadOnCloudinary, deleteMultipleImages };