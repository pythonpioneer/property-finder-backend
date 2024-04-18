// importing requirements
const multer = require("multer");
const path = require('path');


// store the images using multer in diskstorage
const _storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, "./public/uploads")
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

// filtering file, only accept images with extension png, jpeg, jpg
const _filterFile = (req, file, cb) => {
    const imageExt = ['image/png', 'image/jpeg', 'image/jpg'];

    if (imageExt.some(ext => ext === file.mimetype)) cb(null, true);
    else cb(null, false);
};

// multer configuration to upload the image
const _upload = multer({ 
    storage: _storage,
    limits: {
        fileSize: 1024 * 1024 * 15,  // maximum image size will be 15 Mb
    },
    fileFilter: _filterFile
});

// to upload the image
const uploadImage = (image) => _upload.single(image);


// export the upload image function
module.exports = { uploadImage };