require("dotenv").config();
const mongoose = require("mongoose");
const Paper = require("../models/Pyq"); // Change path if needed

async function removeAktuPyqPrefix() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const papers = await Paper.find({
      title: { $regex: /^Aktu_pyq\//i }
    });

    console.log(`Found ${papers.length} papers.\n`);

    let updated = 0;

    for (const paper of papers) {
      const newTitle = paper.title.replace(/^Aktu_pyq\//i, "");

      await Paper.updateOne(
        { _id: paper._id },
        {
          $set: {
            title: newTitle
          }
        }
      );

      console.log(`✔ ${paper.title}`);
      console.log(`  → ${newTitle}\n`);

      updated++;
    }

    console.log("========================");
    console.log(`✅ Updated ${updated} papers`);
    console.log("========================");

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
    await mongoose.disconnect();
  }
}

removeAktuPyqPrefix();