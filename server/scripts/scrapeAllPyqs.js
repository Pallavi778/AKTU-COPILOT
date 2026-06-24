require("dotenv").config();
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key:", process.env.CLOUDINARY_API_KEY);
console.log("Secret Length:", process.env.CLOUDINARY_API_SECRET?.length);
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const axios = require("axios");
const cheerio = require("cheerio");
console.log(process.cwd());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
}); 
console.log("API Key:", process.env.CLOUDINARY_API_KEY);

// --------------------
// SEED STRUCTURE
// --------------------
// const SEED_STRUCTURE = [
//   { semester: 1, dir: "5083" },
//   { semester: 2, dir: "5082" },
//   { semester: 3, dir: "5081" },
//   { semester: 4, dir: "5080" },
//   { semester: 5, dir: "5079" },
//   { semester: 6, dir: "5078" },
//   { semester: 7, dir: "5077" },
//   { semester: 8, dir: "5076" }
// ];
const SEED_STRUCTURE = [
  { semester: 5, dir: "18721" }
];
// --------------------
// MAIN FUNCTION (IMPORTANT FIX)
// --------------------

async function uploadBufferToCloudinary(buffer, fileName) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        folder: "aktu pyq",
        public_id: fileName.replace(".pdf", "")
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

async function scrapeAllPyqs() {

  for (const item of SEED_STRUCTURE) {
    console.log(`Processing Semester ${item.semester}`);

    const url = `https://www.abesit.in/library/question-paper-bank/?dir=${item.dir}`;

    const { data } = await axios.get(url);  // ✅ now inside async function
    const $ = cheerio.load(data);

    const papers = [];

$("a[href*='wpdocs_dl']").each((i, el) => {
    const link = $(el).attr("href");

    // try to extract filename from closest text
    let title = $(el).text().trim();

if (!title) {
    title = $(el)
        .closest("div")
        .find("figcaption")
        .text()
        .trim();
}

if (!title) {
    title = $(el)
        .closest("div")
        .find("small")
        .text()
        .trim();
}

if (!title) {
    title = $(el)
        .closest("div")
        .attr("title");
}
papers.push({
    title: title || "Unknown",
    link,
    semester: item.semester
});

if (!title) {
    console.log("=================================");
    console.log("Missing title:", link);

    console.log("PARENT:");
    console.log($.html($(el).parent()));

    console.log("DIV:");
    console.log($.html($(el).closest("div")));

    console.log("=================================");

    process.exit(); // stop after first missing title
}
});
    console.log(`Found ${papers.length} papers`);
    const uniquePapers = [
  ...new Map(
    papers.map(p => [p.title, p])
  ).values()
];

console.log(
  `Unique papers: ${uniquePapers.length}`
);
  console.log(uniquePapers.map(p => p.title));
    for (const paper of uniquePapers) {
  try {
    console.log(`Uploading: ${paper.title}`);

    const pdfResponse = await axios.get(paper.link, {
      responseType: "arraybuffer",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        Referer: url
      }
    });

    const uploadResult = await uploadBufferToCloudinary(
      Buffer.from(pdfResponse.data),
      paper.title
    );

    console.log(`SUCCESS: ${paper.title}`);
    console.log(uploadResult.secure_url);

  } catch (err) {
    console.log(`FAILED: ${paper.title}`);
    console.error(err.message || err);
  }
}
  }

  console.log("DONE FULL IMPORT");
}

// --------------------
// RUN IT
// --------------------
scrapeAllPyqs().catch(console.error);



// require("dotenv").config();
// const fs = require("fs");
// const path = require("path");
// const mongoose = require("mongoose");

// const Subject = require("../models/Subject");
// const PYQ = require("../models/PYQ");

// /**
//  * =========================================================================
//  * AKTU PYQ DATA AUDIT SCRIPT
//  * =========================================================================
//  * This script does NOT touch your scraper and does NOT modify any data.
//  * It only READS what is already in MongoDB (Subjects + PYQs) and produces
//  * a report of records that look suspicious and should be reviewed by a
//  * human before you trust them in production.
//  *
//  * Run:   node scripts/auditPyqData.js
//  *
//  * Output:
//  *   - Console tables (quick look)
//  *   - reports/audit-report-<timestamp>.json   (full machine-readable report)
//  *   - reports/suspicious-subjects-<timestamp>.csv (open in Excel/Sheets)
//  * =========================================================================
//  */

// // -------------------------------------------------------------------------
// // CONFIG: known AKTU subject-code prefixes (extend this list any time you
// // discover a new legitimate prefix — it does not require touching any
// // scraping/parsing logic).
// // -------------------------------------------------------------------------
// const KNOWN_PREFIXES = new Set([
//   // ---- Old scheme (pre-2018, "N" series) ----
//   "NCS", "NEC", "NEE", "NME", "NCE", "NAS", "NHU", "NOE",
//   "NCH", "NIT", "NPH", "NMA", "NFE", "NID",
//   // ---- Old scheme ("E" series, some private/affiliated colleges) ----
//   "ECS", "ECE", "EEE", "EME", "EAS", "EOE", "ECIE", "EHU", "ECH",
//   // ---- Old scheme ("R" series) ----
//   "RCS", "RAS", "ROE", "REC", "REE", "RME", "RCE",
//   // ---- New scheme (2018+ AICTE flexible curriculum, "K" series) ----
//   "KCS", "KEC", "KEE", "KME", "KCE", "KAS", "KOE", "KVE", "KIT",
//   "KHU", "KCH", "KEF", "KEN", "KNC", "KAI", "KDS", "KCD",
//   // ---- New scheme ("B" series, current B.Tech regular scheme) ----
//   "BCS", "BEC", "BEE", "BME", "BCE", "BAS", "BOE", "BVE", "BCC",
//   "BCD", "BIT", "BHU", "BCH", "BEN", "BNC",
//   // ---- AI/DS/ML & emerging branches ----
//   "ACSE", "ACSD", "ACSML", "ACSAI", "AIT", "ADS", "AML",
//   "BCDS", "BCAI", "BCSD",
//   // ---- Common humanities / mandatory courses ----
//   "BVE", "BNC", "BHM", "BSH"
// ]);

// // Acceptable final shape (same gate your parser already enforces).
// const VALID_CODE_REGEX = /^[A-Z]{2,5}\d{3,4}[A-Z]?$/;

// const REPORT_DIR = path.join(__dirname, "..", "reports");

// // -------------------------------------------------------------------------
// // Small dependency-free Levenshtein distance + similarity ratio,
// // used to catch near-duplicate subject names (e.g. "DATA STRUCTURE" vs
// // "DATA STRUCTURES", "COMPUTER NETWORK" vs "COMPUTER NETWORKS").
// // -------------------------------------------------------------------------
// function levenshtein(a, b) {
//   if (a === b) return 0;
//   if (!a.length) return b.length;
//   if (!b.length) return a.length;

//   const prev = new Array(b.length + 1);
//   const curr = new Array(b.length + 1);

//   for (let j = 0; j <= b.length; j++) prev[j] = j;

//   for (let i = 1; i <= a.length; i++) {
//     curr[0] = i;
//     for (let j = 1; j <= b.length; j++) {
//       const cost = a[i - 1] === b[j - 1] ? 0 : 1;
//       curr[j] = Math.min(
//         curr[j - 1] + 1,      // insertion
//         prev[j] + 1,          // deletion
//         prev[j - 1] + cost    // substitution
//       );
//     }
//     for (let j = 0; j <= b.length; j++) prev[j] = curr[j];
//   }
//   return prev[b.length];
// }

// function similarityRatio(a, b) {
//   const longer = Math.max(a.length, b.length);
//   if (longer === 0) return 1;
//   return 1 - levenshtein(a, b) / longer;
// }

// function normalizeName(name) {
//   return (name || "")
//     .toUpperCase()
//     .replace(/[^A-Z\s]/g, "")
//     .replace(/\s+/g, " ")
//     .trim();
// }

// // -------------------------------------------------------------------------
// // Individual checks. Each returns null (ok) or a finding object.
// // -------------------------------------------------------------------------

// function checkCodeShape(subject) {
//   if (!VALID_CODE_REGEX.test(subject.code)) {
//     return {
//       type: "INVALID_CODE_SHAPE",
//       severity: "high",
//       subjectId: subject._id,
//       code: subject.code,
//       name: subject.name,
//       reason: `Code "${subject.code}" does not match expected shape (2-5 letters + 3-4 digits + optional letter).`,
//       suggestion: "Manually inspect the source PDF title and correct the code, or delete if bogus."
//     };
//   }
//   return null;
// }

// function checkKnownPrefix(subject) {
//   const prefixMatch = subject.code.match(/^[A-Z]+/);
//   const prefix = prefixMatch ? prefixMatch[0] : "";

//   if (!KNOWN_PREFIXES.has(prefix)) {
//     return {
//       type: "UNKNOWN_PREFIX",
//       severity: "medium",
//       subjectId: subject._id,
//       code: subject.code,
//       name: subject.name,
//       reason: `Prefix "${prefix}" is not in the known AKTU prefix list.`,
//       suggestion: "If this is a legitimate new AKTU branch code, add it to KNOWN_PREFIXES. Otherwise review manually."
//     };
//   }
//   return null;
// }

// function checkSubjectName(subject) {
//   const name = (subject.name || "").trim();

//   if (!name || name === "UNKNOWN SUBJECT") {
//     return {
//       type: "BAD_NAME_UNKNOWN",
//       severity: "high",
//       subjectId: subject._id,
//       code: subject.code,
//       name: subject.name,
//       reason: "Subject name is empty or literally 'UNKNOWN SUBJECT'.",
//       suggestion: "Look up the original PDF title/link and set the correct name manually."
//     };
//   }

//   if (name.length < 4) {
//     return {
//       type: "BAD_NAME_TOO_SHORT",
//       severity: "medium",
//       subjectId: subject._id,
//       code: subject.code,
//       name: subject.name,
//       reason: `Name "${name}" is suspiciously short (<4 chars) — likely truncated during parsing.`,
//       suggestion: "Verify against source filename and correct."
//     };
//   }

//   const words = name.split(" ").filter(Boolean);
//   if (words.length === 1 && words[0].length < 6) {
//     return {
//       type: "BAD_NAME_SINGLE_SHORT_WORD",
//       severity: "low",
//       subjectId: subject._id,
//       code: subject.code,
//       name: subject.name,
//       reason: `Name "${name}" is a single short word — may be an incomplete extraction.`,
//       suggestion: "Cross-check with source filename."
//     };
//   }

//   if (/\d/.test(name)) {
//     return {
//       type: "BAD_NAME_CONTAINS_DIGITS",
//       severity: "low",
//       subjectId: subject._id,
//       code: subject.code,
//       name: subject.name,
//       reason: `Name "${name}" still contains digits — cleaning step may have missed something.`,
//       suggestion: "Remove stray digits manually."
//     };
//   }

//   if (name.includes(subject.code)) {
//     return {
//       type: "BAD_NAME_CONTAINS_CODE",
//       severity: "low",
//       subjectId: subject._id,
//       code: subject.code,
//       name: subject.name,
//       reason: `Name still contains the subject code "${subject.code}".`,
//       suggestion: "Strip the code out of the name."
//     };
//   }

//   return null;
// }

// // -------------------------------------------------------------------------
// // MAIN AUDIT
// // -------------------------------------------------------------------------
// async function runAudit() {
//   await mongoose.connect(process.env.MONGO_URI);
//   console.log("✅ MongoDB Connected\n");

//   const subjects = await Subject.find().lean();
//   const pyqs = await PYQ.find().lean();

//   console.log(`Loaded ${subjects.length} subjects and ${pyqs.length} PYQs.\n`);

//   // ---- Paper count per subject ----
//   const paperCountBySubject = new Map();
//   const subjectIdSet = new Set(subjects.map((s) => String(s._id)));
//   const orphanPapers = [];

//   for (const pyq of pyqs) {
//     const subjId = pyq.subject ? String(pyq.subject) : null;

//     if (!subjId || !subjectIdSet.has(subjId)) {
//       orphanPapers.push({
//         pyqId: pyq._id,
//         title: pyq.title,
//         fileUrl: pyq.fileUrl,
//         semester: pyq.semester,
//         year: pyq.year,
//         reason: !subjId
//           ? "PYQ has no subject reference."
//           : "PYQ references a subject ID that no longer exists."
//       });
//       continue;
//     }

//     paperCountBySubject.set(subjId, (paperCountBySubject.get(subjId) || 0) + 1);
//   }

//   // ---- Per-subject checks ----
//   const findings = [];
//   const singlePaperSubjects = [];

//   for (const subject of subjects) {
//     const id = String(subject._id);
//     const count = paperCountBySubject.get(id) || 0;

//     [checkCodeShape, checkKnownPrefix, checkSubjectName].forEach((fn) => {
//       const result = fn(subject);
//       if (result) findings.push(result);
//     });

//     if (count === 0) {
//       findings.push({
//         type: "SUBJECT_HAS_ZERO_PAPERS",
//         severity: "medium",
//         subjectId: subject._id,
//         code: subject.code,
//         name: subject.name,
//         reason: "Subject exists but has no linked PYQ papers.",
//         suggestion: "Likely created in error, or all its papers were later deleted. Consider removing."
//       });
//     } else if (count === 1) {
//       singlePaperSubjects.push({
//         subjectId: subject._id,
//         code: subject.code,
//         name: subject.name,
//         semester: subject.semester,
//         paperCount: count
//       });
//     }
//   }

//   // ---- Duplicate subject detection ----
//   // 1) Exact normalized-name collisions across different codes/IDs.
//   // 2) Fuzzy near-duplicates (similarity >= 0.88) across different codes.
//   const duplicateCandidates = [];
//   const byNormalizedName = new Map();

//   for (const subject of subjects) {
//     const norm = normalizeName(subject.name);
//     if (!norm) continue;
//     if (!byNormalizedName.has(norm)) byNormalizedName.set(norm, []);
//     byNormalizedName.get(norm).push(subject);
//   }

//   for (const [norm, group] of byNormalizedName.entries()) {
//     if (group.length > 1) {
//       duplicateCandidates.push({
//         type: "EXACT_NAME_DUPLICATE",
//         normalizedName: norm,
//         subjects: group.map((s) => ({ id: s._id, code: s.code, name: s.name })),
//         suggestion: "Same name under multiple codes — verify these aren't the same subject re-imported with a different code, or merge them."
//       });
//     }
//   }

//   const namesArr = subjects
//     .map((s) => ({ id: s._id, code: s.code, name: s.name, norm: normalizeName(s.name) }))
//     .filter((s) => s.norm);

//   const SIMILARITY_THRESHOLD = 0.88;
//   const seenPairs = new Set();

//   for (let i = 0; i < namesArr.length; i++) {
//     for (let j = i + 1; j < namesArr.length; j++) {
//       const a = namesArr[i];
//       const b = namesArr[j];
//       if (a.norm === b.norm) continue; // already caught as exact duplicate
//       if (a.code === b.code) continue;

//       const ratio = similarityRatio(a.norm, b.norm);
//       if (ratio >= SIMILARITY_THRESHOLD) {
//         const pairKey = [a.id, b.id].sort().join("|");
//         if (seenPairs.has(pairKey)) continue;
//         seenPairs.add(pairKey);

//         duplicateCandidates.push({
//           type: "FUZZY_NAME_DUPLICATE",
//           similarity: Number(ratio.toFixed(2)),
//           subjects: [
//             { id: a.id, code: a.code, name: a.name },
//             { id: b.id, code: b.code, name: b.name }
//           ],
//           suggestion: "Names are very similar but not identical (possible singular/plural or spelling variant) — review and merge if same subject."
//         });
//       }
//     }
//   }

//   // -----------------------------------------------------------------------
//   // BUILD REPORT
//   // -----------------------------------------------------------------------
//   const severityCount = { high: 0, medium: 0, low: 0 };
//   findings.forEach((f) => severityCount[f.severity]++);

//   const report = {
//     generatedAt: new Date().toISOString(),
//     summary: {
//       totalSubjects: subjects.length,
//       totalPapers: pyqs.length,
//       totalFindings: findings.length,
//       findingsBySeverity: severityCount,
//       duplicateCandidateGroups: duplicateCandidates.length,
//       orphanPapers: orphanPapers.length,
//       subjectsWithOnlyOnePaper: singlePaperSubjects.length,
//       subjectsWithZeroPapers: findings.filter((f) => f.type === "SUBJECT_HAS_ZERO_PAPERS").length
//     },
//     findings,
//     duplicateCandidates,
//     singlePaperSubjects,
//     orphanPapers
//   };

//   // -----------------------------------------------------------------------
//   // CONSOLE OUTPUT
//   // -----------------------------------------------------------------------
//   console.log("====================================================");
//   console.log("                AUDIT SUMMARY");
//   console.log("====================================================");
//   console.table([report.summary]);

//   if (findings.length) {
//     console.log("\n---------------- SUSPICIOUS SUBJECTS ----------------");
//     console.table(
//       findings.map((f) => ({
//         type: f.type,
//         severity: f.severity,
//         code: f.code,
//         name: (f.name || "").slice(0, 40),
//         reason: f.reason
//       }))
//     );
//   } else {
//     console.log("\n✅ No suspicious subjects found.");
//   }

//   if (duplicateCandidates.length) {
//     console.log("\n---------------- DUPLICATE CANDIDATES ----------------");
//     console.table(
//       duplicateCandidates.map((d) => ({
//         type: d.type,
//         similarity: d.similarity ?? "exact",
//         subjects: d.subjects.map((s) => `${s.code} (${s.name})`).join("  |  ")
//       }))
//     );
//   } else {
//     console.log("\n✅ No duplicate subject candidates found.");
//   }

//   if (singlePaperSubjects.length) {
//     console.log("\n---------------- SUBJECTS WITH ONLY 1 PAPER ----------------");
//     console.table(
//       singlePaperSubjects.map((s) => ({
//         code: s.code,
//         name: (s.name || "").slice(0, 40),
//         semester: s.semester,
//         paperCount: s.paperCount
//       }))
//     );
//   } else {
//     console.log("\n✅ No single-paper subjects found.");
//   }

//   if (orphanPapers.length) {
//     console.log("\n---------------- ORPHAN PAPERS (broken subject ref) ----------------");
//     console.table(
//       orphanPapers.map((o) => ({
//         title: (o.title || "").slice(0, 40),
//         semester: o.semester,
//         year: o.year,
//         reason: o.reason
//       }))
//     );
//   } else {
//     console.log("\n✅ No orphan papers found.");
//   }

//   // -----------------------------------------------------------------------
//   // WRITE FILES (full JSON + CSV for manual review — no data is modified)
//   // -----------------------------------------------------------------------
//   if (!fs.existsSync(REPORT_DIR)) fs.mkdirSync(REPORT_DIR, { recursive: true });

//   const stamp = new Date().toISOString().replace(/[:.]/g, "-");
//   const jsonPath = path.join(REPORT_DIR, `audit-report-${stamp}.json`);
//   const csvPath = path.join(REPORT_DIR, `suspicious-subjects-${stamp}.csv`);

//   fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));

//   const csvHeader = "type,severity,code,name,reason,suggestion\n";
//   const csvRows = findings
//     .map((f) =>
//       [f.type, f.severity, f.code, `"${(f.name || "").replace(/"/g, '""')}"`, `"${f.reason.replace(/"/g, '""')}"`, `"${f.suggestion.replace(/"/g, '""')}"`].join(",")
//     )
//     .join("\n");
//   fs.writeFileSync(csvPath, csvHeader + csvRows);

//   console.log("\n====================================================");
//   console.log(`Full JSON report:        ${jsonPath}`);
//   console.log(`Suspicious subjects CSV: ${csvPath}`);
//   console.log("====================================================");
//   console.log("\nNo data was modified. Review the report and fix manually.");

//   process.exit(0);
// }

// runAudit().catch((err) => {
//   console.error("❌ Audit failed:", err);
//   process.exit(1);
// });