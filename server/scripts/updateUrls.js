require("dotenv").config();

const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const PYQ = require("../models/Pyq");

// --------------------
// CLOUDINARY CONFIG
// --------------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --------------------
// FETCH ALL RAW FILES
// --------------------
async function fetchAllRawFiles(prefix) {
  let allFiles = [];
  let nextCursor = undefined;

  do {
    const result = await cloudinary.api.resources({
      resource_type: "raw",
      type: "upload",
      prefix,
      max_results: 500,
      next_cursor: nextCursor,
    });

    allFiles.push(...result.resources);
    nextCursor = result.next_cursor;

    console.log(`Fetched ${allFiles.length} files from "${prefix}"`);
  } while (nextCursor);

  return allFiles;
}

// --------------------
// MAIN
// --------------------
async function updateUrls() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    // Fetch ALL raw assets from Cloudinary
    const files1 = await fetchAllRawFiles("aktu_pyq/");
    const files2 = await fetchAllRawFiles("aktu pyq/");

    const rawFiles = [...files1, ...files2];

    console.log("\nTotal Cloudinary files:", rawFiles.length);

    // Build Map: publicId -> secure_url
    const cloudinaryMap = new Map();

    for (const file of rawFiles) {
      cloudinaryMap.set(file.public_id, file.secure_url);
    }

    // Fetch all Mongo papers
    const papers = await PYQ.find({});

    console.log("Mongo papers:", papers.length);

    let updated = 0;
    let skipped = 0;
    let failed = 0;

    for (const paper of papers) {
      const newUrl = cloudinaryMap.get(paper.publicId);

      if (!newUrl) {
        failed++;
        console.log("❌ Missing:", paper.publicId);
        continue;
      }

      if (paper.fileUrl !== newUrl) {
        await PYQ.updateOne(
          { _id: paper._id },
          { $set: { fileUrl: newUrl } }
        );

        updated++;
        console.log("✅ Updated:", paper.publicId);
      } else {
        skipped++;
      }
    }

    console.log("\n==============================");
    console.log("Updated :", updated);
    console.log("Skipped :", skipped);
    console.log("Missing :", failed);
    console.log("==============================");

    process.exit(0);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

updateUrls();