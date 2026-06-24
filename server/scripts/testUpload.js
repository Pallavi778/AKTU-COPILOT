require("dotenv").config();

const axios = require("axios");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadPdfFromUrl(pdfUrl) {
  try {
    // Download PDF into memory
    const response = await axios.get(pdfUrl, {
      responseType: "arraybuffer",
    });

    const buffer = Buffer.from(response.data);

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: "aktu pyq",
          public_id: "test_pdf",
          overwrite: true,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      streamifier.createReadStream(buffer).pipe(uploadStream);
    });

    console.log("Uploaded Successfully");
    console.log(result.secure_url);

  } catch (err) {
    console.error(err);
  }
}

// Put ONE PDF URL here
uploadPdfFromUrl("https://www.abesit.in/?wpdocs_dl=6232&wpdocs_nonce=923baafbcf");