require("dotenv").config();
const mongoose = require("mongoose");
const Pyq = require("../models/Pyq");

async function deleteUnknownPapers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const result = await Pyq.deleteMany({
      subjectCode: "UNKNOWN",
      title: /Unknown$/i
    });

    console.log(`✅ Deleted ${result.deletedCount} placeholder papers.`);

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
    await mongoose.disconnect();
  }
}

deleteUnknownPapers();