// require("dotenv").config();
// const mongoose = require("mongoose");
// const PYQ = require("../models/PYQ");

// async function run() {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("✅ Connected to MongoDB");

//     const docs = await PYQ.find({ semester: null });

//     console.log("Found:", docs.length);

//     let updated = 0;

//     for (const doc of docs) {
//       // -------------------------
//       // FIX SEMESTER FROM SUBJECT CODE
//       // -------------------------
//       const code = doc.subjectCode || "";

//       const match = code.match(/(\d{3})$/);

//       if (match) {
//         const num = parseInt(match[1]);

//         // New AKTU Codes
//         if (num >= 501 && num <= 599)
//           doc.semester = 5;
//         else if (num >= 601 && num <= 699)
//           doc.semester = 6;
//         else if (num >= 701 && num <= 799)
//           doc.semester = 7;
//         else if (num >= 801 && num <= 899)
//           doc.semester = 8;

//         // Old AKTU Codes (051–059 etc.)
//         else if (num >= 51 && num <= 59)
//           doc.semester = 5;
//         else if (num >= 61 && num <= 69)
//           doc.semester = 6;
//         else if (num >= 71 && num <= 79)
//           doc.semester = 7;
//         else if (num >= 81 && num <= 89)
//           doc.semester = 8;
//       }

//       // -------------------------
//       // FIX YEAR FROM TITLE
//       // -------------------------
//       const yearMatch = doc.title.match(/20\d{2}/);

//       if (yearMatch) {
//         doc.year = Number(yearMatch[0]);
//       }

//       // -------------------------
//       // FIX UNIQUE KEY
//       // -------------------------
//       doc.uniqueKey = `${doc.subjectCode}_${doc.semester}_${doc.year}`;

//       await doc.save();
//       updated++;
//     }

//     console.log("\n========================");
//     console.log("Documents Updated:", updated);
//     console.log("========================");

//     process.exit(0);

//   } catch (err) {
//     console.error(err);
//     process.exit(1);
//   }
// }

// run();

require("dotenv").config();
const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;
const DRY_RUN = process.env.DRY_RUN !== "false";

if (!MONGO_URI) {
  console.error("Missing MONGO_URI env var. Set it in a .env file.");
  process.exit(1);
}

const schema = new mongoose.Schema({}, { strict: false });
const PYQ = mongoose.model("pyqs", schema);

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to DB:", mongoose.connection.name);

  const docs = await PYQ.find({
    uniqueKey: { $regex: /^[A-Za-z0-9]+_5_\d{4}$/ }
  });

  console.log(`Found ${docs.length} documents matching the expected pattern.`);
  console.log(`Mode: ${DRY_RUN ? "DRY RUN (no writes)" : "LIVE (will write to DB)"}`);

  let updated = 0;
  let skipped = 0;
  const bulkOps = [];

  for (const doc of docs) {
    const parts = doc.uniqueKey.split("_");

    if (parts.length !== 3) {
      console.warn(`Skipping malformed uniqueKey: ${doc.uniqueKey}`);
      skipped++;
      continue;
    }

    const [subjectCode, semester, year] = parts;

    const semesterNum = Number(semester);
    const yearNum = Number(year);
    const validSemester = Number.isInteger(semesterNum) && semesterNum > 0 && semesterNum <= 8;
    const validYear = Number.isInteger(yearNum) && yearNum >= 2000 && yearNum <= 2100;

    if (!validSemester || !validYear) {
      console.warn(`Skipping suspicious values from ${doc.uniqueKey}: semester=${semester}, year=${year}`);
      skipped++;
      continue;
    }

    const noChangeNeeded = doc.semester === semester && doc.year === year;
    if (noChangeNeeded) {
      skipped++;
      continue;
    }

    console.log(
      `${doc.uniqueKey}: semester "${doc.semester}" -> "${semester}", year "${doc.year}" -> "${year}"`
    );

    bulkOps.push({
      updateOne: {
        filter: { _id: doc._id },
        update: { $set: { semester, year } }
      }
    });

    updated++;
  }

  if (!DRY_RUN && bulkOps.length > 0) {
    const result = await PYQ.collection.bulkWrite(bulkOps);
    console.log("BulkWrite result:", result.modifiedCount, "modified");
  }

  console.log(`\nDone. ${DRY_RUN ? "Would have updated" : "Updated"}: ${updated}. Skipped: ${skipped}.`);
  process.exit();
}

run().catch((err) => {
  console.error("Script failed:", err);
  process.exit(1);
});