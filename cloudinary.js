const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary (replace with your own credentials)
cloudinary.config({
  cloud_name:process.env.Api_name,
  api_key:process.env.Api_key,
  api_secret:process.env.Api_secrect,
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
