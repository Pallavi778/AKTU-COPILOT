require("dotenv").config();

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

(async () => {
  try {
    const asset = await cloudinary.api.resource(
  "aktu_pyq/4-2022-OPERATING-SYSTEMS-KCS401",
  {
    resource_type: "raw",
  }
);

    console.log(asset);

  } catch (err) {
    console.error(err);
  }
})();