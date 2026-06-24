require("dotenv").config();

const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;

const Subject = require("../models/Subject");
const PYQ = require("../models/PYQ");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function importPYQs() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const result = await cloudinary.search
      .expression("resource_type:raw")
      .max_results(100)
      .execute();

    console.log(`Found ${result.resources.length} files`);

    let imported = 0;
    let skipped = 0;

    for (const file of result.resources) {
      const filename = file.filename;

      const code = filename.split("-")[0];

      const subject = await Subject.findOne({ code });

      if (!subject) {
        console.log(`❌ Subject not found: ${code}`);
        skipped++;
        continue;
      }

      const existing = await PYQ.findOne({
        fileUrl: file.secure_url,
      });

      if (existing) {
        console.log(`⏭ Already imported: ${filename}`);
        skipped++;
        continue;
      }

      await PYQ.create({
        title: subject.name,
        subject: subject._id,
        semester: subject.semester,
        year: paper.year, // temporary default
        fileUrl: file.secure_url,
      });

      console.log(`✅ Imported: ${filename}`);
      imported++;
    }

    console.log("\n====================");
    console.log(`Imported: ${imported}`);
    console.log(`Skipped : ${skipped}`);
    console.log("====================");

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

importPYQs();