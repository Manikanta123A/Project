const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary (replace with your own credentials)
cloudinary.config({
  cloud_name:"dq0k1tvey",
  api_key:"847419429111187",
  api_secret:"kSFag9RIv0Hjxe_o6mCIH_tCzmQ",
});

// Create a storage engine using Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'your-folder', // Set your desired folder
    allowedFormats: ['jpg', 'png', 'gif'], // Specify allowed file formats
  },
});
module.exports = {
    storage
}