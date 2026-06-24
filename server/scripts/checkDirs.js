require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function check() {
  const result = await cloudinary.search
    .expression("resource_type:raw")
    .max_results(50)
    .execute();

  result.resources.forEach((file) => {
    console.log("-------------------");
    console.log("Filename:", file.filename);
    console.log("Public ID:", file.public_id);
    console.log("URL:", file.secure_url);
  });
}

check();