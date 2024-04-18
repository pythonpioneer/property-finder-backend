/**
 * to fetch image names from the image-url array
 * @param {Array} images - an array of string, contain image urls `https://res.cloudinary.com/hrk/image/upload/v1713438994/rjwbc5jrmssp3wrurir7.jpg`
 * @returns {Array} - An array of string, with images names `rjwbc5jrmssp3wrurir7`
 */
const fetchImageNames = (images) => {

    // to store the image names
    const imageNames = [];
    let imageName;

    // traverse in the aray and pick the name
    images.forEach(image => {

        // now split the url by /
        imageName = image?.split('/');

        if (imageName.length === 0) return [];

        // extract the image name
        imageName = imageName[imageName.length - 1].split('.')[0];
        imageNames.push(imageName);
    });

    return imageNames;
}

// export all the utility methods
module.exports = { fetchImageNames };