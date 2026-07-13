// require("dotenv").config();

// const mongoose = require("mongoose");
// const cloudinary = require("cloudinary").v2;

// const Subject = require("../models/Subject");
// const PYQ = require("../models/Pyq");

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// async function importPYQs() {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);

//     console.log("Connected to MongoDB");

//     let skipped = 0;
//     let imported = 0;
//     let duplicate = 0;
//     let noSubject = 0;
//     let noCode = 0;
//     let errors = 0;

//     // ==========================================
//     // FETCH ALL CLOUDINARY FILES
//     // ==========================================

//     let allFiles = [];
//     let nextCursor = null;

//     do {
//       let search = cloudinary.search
//         // .expression("resource_type:raw")
//         .expression('resource_type:raw')
//         .max_results(500);

//       if (nextCursor) {
//         search = search.next_cursor(nextCursor);
//       }

//       const result = await search.execute();
//       console.log(
//   "Fetched:",
//   result.resources.length,
//   "Next Cursor:",
//   result.next_cursor
// );

//       allFiles.push(...result.resources);
//       console.log("Total files fetched:", allFiles.length);
//       nextCursor = result.next_cursor;
//     } while (nextCursor);
//     const unique = new Set(allFiles.map(f => f.public_id));

// console.log("Fetched :", allFiles.length);
// console.log("Unique  :", unique.size);
// console.log("First 10 public_ids:");
// console.log(allFiles.slice(0, 10).map(f => f.public_id));
//     console.log(`Found ${allFiles.length} files`);
//     console.log(allFiles.slice(0, 5).map(f => f.filename));

//     // ==========================================
//     // PROCESS FILES
//     // ==========================================

//     for (const file of allFiles) {
//       const filename = file.filename;

//       let code = null;

//       // =====================================
//       // Pattern 1
//       // BCS501
//       // BCAI051
//       // BCDS501
//       // KEC054
//       // KIT501
//       // =====================================

//       let match = filename.match(/[A-Z]{3,5}\d{3}/);

//       if (match) {
//         code = match[0];
//       }

//       // =====================================
//       // Pattern 2
//       // NCS-501
//       // NEC-504
//       // RME-051
//       // KIT-501
//       // KEC-054
//       // =====================================

//       if (!code) {
//         match = filename.match(/([A-Z]{3,5})-(\d{3})/);

//         if (match) {
//           code = match[1] + match[2];
//         }
//       }

//       // =====================================
//       // Pattern 3
//       // 2021-WEB-TECHNOLOGY-KIT-501-1
//       // 2021-XYZ-NCS-504-2
//       // =====================================

//       if (!code) {
//         match = filename.match(/([A-Z]{3,5})-(\d{3})(?:-\d+)?$/);

//         if (match) {
//           code = match[1] + match[2];
//         }
//       }

//       if (!code) {
//         console.log(`❌ Could not extract code from: ${filename}`);
//         noCode++;
// continue;
//       }

//       // =====================================
//       // YEAR
//       // =====================================

//       const yearMatch = filename.match(/\b(20\d{2})\b/);

//       // const year = yearMatch ? yearMatch[1] : "Unknown";
//       const year = yearMatch ? Number(yearMatch[1]) : null;


//       console.log(`📄 ${filename} -> ${code}`);

//       // =====================================
//       // FIND SUBJECT
//       // =====================================

//       const subject = await Subject.findOne({
//         code: code.toUpperCase(),
//       });

//       if (!subject) {
//         console.log(`❌ Subject not found: ${code}`);
//         noSubject++;
// continue;
//       }

//       // =====================================
//       // DUPLICATE CHECK
//       // =====================================

//       const existing = await PYQ.findOne({
//         // fileUrl: file.secure_url,
//         fileId: file.public_id
//       });

//       if (existing) {
//         console.log(`⏭ Already imported: ${filename}`);
//         duplicate++;
// continue;
//       }

//       // =====================================
//       // CREATE PYQ
//       // =====================================

//       try {
//     await PYQ.create({
//         title: subject.name,
//         subject: subject._id,
//         semester: subject.semester,
//         year,
//         fileUrl: file.secure_url,
//         fileId: file.public_id,
//     });

//     imported++;
// } catch (err) {
//     errors++;
//     console.log(err.message);
// }

//       console.log(`✅ Imported: ${filename}`);
//     }

//     console.log("\n====================");
//     console.log(`Imported: ${imported}`);
//     console.log(`Skipped : ${skipped}`);
//     console.log("====================");

//     process.exit(0);
//   } catch (err) {
//     console.error(err);
//     process.exit(1);
//   }
// }

// importPYQs();


// scripts/importCloudinaryPyqs.js

require("dotenv").config();
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const PYQ = require("../models/Pyq");

// ─────────────────────────────
// CLOUDINARY CONFIG
// ─────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─────────────────────────────
// HELPERS
// ─────────────────────────────

const extractSubjectCode = (raw) => {
  const name = raw.toUpperCase();

  let m = name.match(/([A-Z]{2,5})-(\d{3})/);
  if (m) return m[1] + m[2];

  m = name.match(/([A-Z]{2,5}\d{3})/);
  if (m) return m[1];

  return "UNKNOWN";
};

const extractSemester = (publicId) => {
  const m = publicId.match(/(?:^|\/)([1-8])-/);
  return m ? parseInt(m[1]) : null;
};

const extractYear = (name) => {
  const m = name.match(/\b(20\d{2})\b/);
  return m ? parseInt(m[1]) : null;
};

const buildUniqueKey = (semester, subjectCode, year) => {
  return `${semester || "X"}_${subjectCode || "UNKNOWN"}_${year || "XXXX"}`;
};

// ─────────────────────────────
// FETCH CLOUDINARY FILES
// ─────────────────────────────

const fetchAllFiles = async (prefix) => {
  let all = [];
  let nextCursor = undefined;

  do {
    const res = await cloudinary.api.resources({
      resource_type: "raw",     // <-- IMPORTANT
      type: "upload",
      prefix,
      max_results: 500,
      next_cursor: nextCursor,
    });

    console.log(
      `Fetched ${res.resources.length} | Total ${all.length + res.resources.length}`
    );

    all.push(...res.resources);
    nextCursor = res.next_cursor;
  } while (nextCursor);

  return all;
  const rawFiles = await fetchAllFiles();

console.log("TOTAL FROM CLOUDINARY:", rawFiles.length);
};

// ─────────────────────────────
// MAIN IMPORT
// ─────────────────────────────

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    const cloudFiles1 = await fetchAllFiles("aktu_pyq/");
const cloudFiles2 = await fetchAllFiles("aktu pyq/");

const cloudFiles = [...cloudFiles1, ...cloudFiles2];

console.log("Total Cloudinary files:", cloudFiles.length);
    console.log("\nTOTAL CLOUDINARY FILES:", cloudFiles.length);

    // Get DB files
    const dbFiles = await PYQ.find({}, { publicId: 1 });
    const dbSet = new Set(dbFiles.map((f) => f.publicId));

    console.log("TOTAL IN DB:", dbSet.size);

    let inserted = 0;
    let skipped = 0;
    let errored = 0;

    for (const file of cloudFiles) {
      const publicId = file.public_id;
      const url = file.secure_url;

      if (dbSet.has(publicId)) {
        skipped++;
        continue;
      }

      const subjectCode = extractSubjectCode(publicId);
      const semester = extractSemester(publicId);
      const year = extractYear(publicId);
      const uniqueKey = buildUniqueKey(semester, subjectCode, year);

      try {
        await PYQ.create({
          title: publicId,
          publicId,
          fileUrl: url,
          subjectCode,
          semester,
          year,
          uniqueKey,
          source: "cloudinary",
        });

        console.log("📄 Inserted:", publicId);
        inserted++;
      } catch (err) {
        console.log("❌ Error:", publicId, err.message);
        errored++;
      }
    }

    console.log("\n====================");
    console.log("Inserted :", inserted);
    console.log("Skipped  :", skipped);
    console.log("Errored  :", errored);
    console.log("====================");

    process.exit(0);
  } catch (err) {
  console.error("FULL ERROR:");
  console.error(err);
  process.exit(1);
}
};

run();