const cloudinary = require('cloudinary').v2;
// we r requiring cloudinary which we have already installed and now we need the version 2 of that so we did v2
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// here i am telling cloudinary that these three things are needed to connect with my cloudinary account , and this is the configuration for that 
module.exports = cloudinary;