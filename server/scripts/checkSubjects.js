require("dotenv").config({ path: __dirname + "/../.env" });
const mongoose = require("mongoose");
const PYQ = require("../models/PYQ");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected");

    const docs = await PYQ.find();
    let updated = 0;

    for (let doc of docs) {

      let raw = doc.fileName;

      // fallback: extract from URL if fileName missing
      if (!raw && doc.fileUrl) {
        const parts = doc.fileUrl.split("/");
        raw = parts[parts.length - 1].split(".")[0];
      }

      if (!raw) {
        console.log("Skipping invalid doc:", doc._id);
        continue;
      }

      // extract year
      const yearMatch = raw.match(/\d{4}/);
      const year = yearMatch ? Number(yearMatch[0]) : null;

      // clean name
      let cleaned = raw
        .replace(/^\d{4}-/, "")
        .replace(/\.(pdf|PDF)$/, "")
        .replace(/-/g, " ")
        .trim();

      const parts = cleaned.split(" ");

      const subjectCode = parts.length > 1 ? parts.pop() : "UNKNOWN";
      let subjectName = parts.join(" ").trim();

      // extra cleanup for better readability
      subjectName = subjectName
        .replace(/\bBCS|BEC|BME|BNC|NCS|NEC|NEE|NCE\b/g, "")
        .replace(/\s+/g, " ")
        .trim();

      const displayName = `${subjectName} (${subjectCode}) - ${year || "Unknown"}`;

      await PYQ.updateOne(
        { _id: doc._id },
        {
          $set: {
            subjectName,
            subjectCode,
            year,
            displayName,
            searchText: `${subjectName} ${subjectCode} ${year} ${cleaned}`
          }
        }
      );

      updated++;
      console.log("Updated:", doc._id);
    }

    console.log(`\nMigration done. Total updated: ${updated}`);
    process.exit();
  })
  .catch(err => {
    console.log("Error:", err);
  });