require("dotenv").config();
const mongoose = require("mongoose");
const Paper = require("../models/Pyq"); // Change to your model name/path

async function countUnknownPapers() {
  try {
    await mongoose.connect(process.env.MONGO_URI); // Use your env variable

    const papers = await Paper.find({
    $or: [
        { subjectCode: "UNKNOWN" },
        { title: /unknown/i }
    ]
}).select("title semester year subjectCode subject");

    console.log(`\nFound ${papers.length} UNKNOWN papers:\n`);

    papers.forEach((paper, index) => {
      console.log(
        `${index + 1}. ${paper.title} | Sem ${paper.semester} | ${paper.year}`
      );
    });

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
    await mongoose.disconnect();
  }
}

countUnknownPapers();