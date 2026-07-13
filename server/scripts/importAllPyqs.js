// require("dotenv").config();

// const mongoose = require("mongoose");
// const axios = require("axios");
// const cheerio = require("cheerio");

// const Subject = require("../models/Subject");
// const PYQ = require("../models/PYQ");

// const DIRS = [
//   // ====================
//   // SEM 1
//   // ====================
//   { dir: 6196, semester: 1, year: 2017 },
//   { dir: 6195, semester: 1, year: 2018 },
//   { dir: 6194, semester: 1, year: 2019 },
//   { dir: 6193, semester: 1, year: 2020 },
//   { dir: 6192, semester: 1, year: 2021 },
//   { dir: 13885, semester: 1, year: 2022 },
//   { dir: 16523, semester: 1, year: 2023 },
//   { dir: 17714, semester: 1, year: 2024 },
//   { dir: 18691, semester: 1, year: 2025 },

//   // ====================
//   // SEM 2
//   // ====================
//   { dir: 6105, semester: 2, year: 2017 },
//   { dir: 6104, semester: 2, year: 2018 },
//   { dir: 6103, semester: 2, year: 2019 },
//   { dir: 6102, semester: 2, year: 2022 },
//   { dir: 15206, semester: 2, year: 2023 },
//   { dir: 16984, semester: 2, year: 2024 },
//   { dir: 18352, semester: 2, year: 2025 },

//   // ====================
//   // SEM 3
//   // ====================
//   { dir: 6010, semester: 3, year: 2017 },
//   { dir: 6009, semester: 3, year: 2018 },
//   { dir: 6008, semester: 3, year: 2019 },
//   { dir: 6007, semester: 3, year: 2020 },
//   { dir: 13895, semester: 3, year: 2022 },
//   { dir: 16533, semester: 3, year: 2023 },
//   { dir: 17724, semester: 3, year: 2024 },
//   { dir: 18701, semester: 3, year: 2025 },

//   // ====================
//   // SEM 4
//   // ====================
//   { dir: 5836, semester: 4, year: 2017 },
//   { dir: 5835, semester: 4, year: 2018 },
//   { dir: 5834, semester: 4, year: 2019 },
//   { dir: 5833, semester: 4, year: 2022 },
//   { dir: 15217, semester: 4, year: 2023 },
//   { dir: 16994, semester: 4, year: 2024 },
//   { dir: 18362, semester: 4, year: 2025 },

//   // ====================
//   // SEM 5
//   // ====================
//   { dir: 5662, semester: 5, year: 2017 },
//   { dir: 5661, semester: 5, year: 2018 },
//   { dir: 5660, semester: 5, year: 2019 },
//   { dir: 5659, semester: 5, year: 2020 },
//   { dir: 5658, semester: 5, year: 2021 },
//   { dir: 5657, semester: 5, year: 2022 },
//   { dir: 16564, semester: 5, year: 2023 },
//   { dir: 17744, semester: 5, year: 2024 },
//   { dir: 18721, semester: 5, year: 2025 },

//   // ====================
//   // SEM 6
//   // ====================
//   { dir: 5406, semester: 6, year: 2017 },
//   { dir: 5405, semester: 6, year: 2018 },
//   { dir: 5404, semester: 6, year: 2019 },
//   { dir: 5403, semester: 6, year: 2022 },
//   { dir: 15250, semester: 6, year: 2023 },
//   { dir: 17026, semester: 6, year: 2024 },
//   { dir: 18397, semester: 6, year: 2025 },

//   // ====================
//   // SEM 7
//   // ====================
//   { dir: 5255, semester: 7, year: 2017 },
//   { dir: 5256, semester: 7, year: 2018 },
//   { dir: 5254, semester: 7, year: 2019 },
//   { dir: 5253, semester: 7, year: 2020 },
//   { dir: 5252, semester: 7, year: 2021 },
//   { dir: 5251, semester: 7, year: 2022 },
//   { dir: 16634, semester: 7, year: 2023 },
//   { dir: 17800, semester: 7, year: 2024 },
//   { dir: 18746, semester: 7, year: 2025 },

//   // ====================
//   // SEM 8
//   // ====================
//   { dir: 5087, semester: 8, year: 2017 },
//   { dir: 5086, semester: 8, year: 2018 },
//   { dir: 5085, semester: 8, year: 2019 },
//   { dir: 5084, semester: 8, year: 2022 },
//   { dir: 15301, semester: 8, year: 2023 },
//   { dir: 17063, semester: 8, year: 2024 },
//   { dir: 18456, semester: 8, year: 2025 }
// ];
// async function importAll() {
//   await mongoose.connect(process.env.MONGO_URI);

//   console.log("✅ MongoDB Connected");

//   let imported = 0;
//   let skipped = 0;

//   for (const folder of DIRS) {
//     console.log(
//       `\n========== Semester ${folder.semester} | DIR ${folder.dir} ==========\n`
//     );

//     const url =
//       `https://www.abesit.in/library/question-paper-bank/?dir=${folder.dir}`;

//     let data;

// try {
//   const response = await axios.get(url, {
//   headers: {
//     "User-Agent":
//       "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36",
//     Accept:
//       "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
//     "Accept-Language": "en-US,en;q=0.5",
//     Referer: "https://www.abesit.in/"
//   },
//   timeout: 30000,
//   validateStatus: () => true
// });

//   data = response.data;
// } catch (err) {
//   console.log(`❌ Failed DIR ${folder.dir}`);

//   if (err.response) {
//     console.log("Status:", err.response.status);
//   }

//   continue;
// }
//     const $ = cheerio.load(data);

//     const papers = [];

//     $("a[href*='wpdocs_dl']").each((i, el) => {
//       let title = $(el).text().trim();

//       if (!title) {
//         title = $(el)
//           .closest("div")
//           .find("figcaption")
//           .text()
//           .trim();
//       }

//       const link = $(el).attr("href");

//       if (title && link) {
//         papers.push({
//           title,
//           link
//         });
//       }
//     });

//     console.log(`Found ${papers.length} papers`);
//     papers.slice(0, 10).forEach(p =>
//   console.log("Paper:", p.title)
// );

//     for (const paper of papers) {
//       const fileName = paper.title.replace(".pdf", "");

// let code = null;

// // Pattern 1: BCS301-DATA-STRUCTURES
// let match = fileName.match(/^([A-Z0-9]{5,10})[-_]/);

// if (match) {
//   code = match[1];
// }

// // Pattern 2: DATA-STRUCTURES-KCS-301
// if (!code) {
//   match = fileName.match(/([A-Z]{2,5}-?\d{3,4}[A-Z]?)$/i);

//   if (match) {
//     code = match[1].replace("-", "");
//   }
// }

// // Pattern 3: BCS403OBJECT-ORIENTED...
// if (!code) {
//   match = fileName.match(/^([A-Z]{3,6}\d{3,4}[A-Z]?)/);

//   if (match) {
//     code = match[1];
//   }
// }

// if (!code) {
//   console.log("Could not extract code:", fileName);
//   continue;
// }
      

// // Better subject code extraction

//       const subjectName = fileName
//   .replace(code, "")
//   .replace(/[-_]/g, " ")
//   .trim();
//       let subject = await Subject.findOne({ code });

//       if (!subject) {
//         subject = await Subject.create({
//           name: subjectName,
//           code,
//           semester: folder.semester
//         });

//         console.log("Created Subject:", code);
//       }

//       const exists = await PYQ.findOne({
//         fileUrl: paper.link
//       });

//       if (exists) {
//         skipped++;
//         continue;
//       }

//       await PYQ.create({
//         title: subjectName,
//         subject: subject._id,
//         semester: folder.semester,
//         year: folder.year,
//         fileUrl: paper.link
//       });

//       imported++;

//       console.log("Imported:", code);
//     }
//     await new Promise(resolve => setTimeout(resolve, 2000));
//   }

//   console.log("\n====================");
//   console.log("Imported:", imported);
//   console.log("Skipped:", skipped);
//   console.log("====================\n");

//   process.exit();
// }

// importAll().catch((err) => {
//   console.error(err);
//   process.exit(1);
// });

// require("dotenv").config();
// const mongoose = require("mongoose");
// const axios = require("axios");
// const cheerio = require("cheerio");

// const Subject = require("../models/Subject");
// const PYQ = require("../models/PYQ");

// /**
//  * =========================================================================
//  * AKTU PYQ FILENAME PARSER
//  * =========================================================================
//  * Extracts a normalized subject code + cleaned subject name from messy,
//  * inconsistently formatted AKTU question-paper filenames.
//  *
//  * Handles:
//  *   1. Classic prefix:        BCS301-DATA-STRUCTURES.pdf
//  *   2. Code-at-end:           DATA-STRUCTURES-NCS085.pdf
//  *   3. Hyphenated code + version noise:
//  *                             ENGINEERING-HYDROLOGY-NCE-035-1.pdf
//  *   4. Reversed/hyphenated:   ARTIFICIAL-INTELLIGENCE-NCS-702.pdf
//  *   5. Merged/broken:         BCDS601BIG-DATA-AND-ANALYTICS.pdf
//  *                             NEC702BEEC-702.pdf
//  * =========================================================================
//  */

// // Final shape every AKTU subject code must match before we trust it.
// const VALID_CODE_REGEX = /^[A-Z]{2,5}\d{3,4}[A-Z]?$/;

// // Primary extractor:
// //   letters(2-5) + optional hyphen + digits(3-4)
// //   + optional trailing single letter (only if NOT followed by another
// //     letter — stops us eating into the next word in merged filenames)
// //   + optional "-N" re-upload/version noise (e.g. "-1", "-2")
// const CODE_REGEX = /([A-Z]{2,5})-?(\d{3,4})(?:([A-Z])(?![A-Z]))?(-\d{1,2})?/g;

// // Looser fallback used ONLY if the primary regex finds nothing at all.
// const FALLBACK_CODE_REGEX = /([A-Z]{2,4})\d{2,4}/gi;

// // Filler words that sometimes leak into scraped titles.
// const NOISE_WORDS = /\b(PAPER|EXAM|EXAMINATION|QUESTION|AKTU|SEM|SEMESTER|ODD|EVEN|SET|SOLVED|SOLUTION|ANSWER|KEY)\b/gi;

// function collectMatches(str, regex) {
//   const matches = [];
//   let m;
//   regex.lastIndex = 0;
//   while ((m = regex.exec(str)) !== null) {
//     matches.push({
//       full: m[0],
//       letters: m[1],
//       digits: m[2],
//       trailingLetter: m[3] || null,
//       versionNoise: m[4] || null,
//       index: m.index,
//       end: m.index + m[0].length
//     });
//     if (m.index === regex.lastIndex) regex.lastIndex++; // guard vs zero-length match loops
//   }
//   return matches;
// }

// function pickBestMatch(matches, strLen) {
//   if (matches.length === 0) return null;

//   // Prefix format wins outright (classic or merged at index 0)
//   const prefixMatch = matches.find((m) => m.index === 0);
//   if (prefixMatch) return { match: prefixMatch, reason: "prefix" };

//   // Otherwise prefer the match nearest the end (suffix format)
//   const last = matches[matches.length - 1];
//   const isNearEnd = strLen - last.end <= 2;
//   if (isNearEnd) return { match: last, reason: "suffix" };

//   // Fallback: last match found anywhere
//   return { match: last, reason: "middle" };
// }

// function buildCode(match) {
//   return `${match.letters}${match.digits}`.toUpperCase();
// }

// function cleanSubjectName(fileName, match) {
//   let name = fileName.slice(0, match.index) + " " + fileName.slice(match.end);

//   name = name
//     .replace(/[0-9]/g, "")
//     .replace(NOISE_WORDS, "")
//     .replace(/[-_]+/g, " ")
//     .replace(/\s+/g, " ")
//     .trim();

//   return name || "UNKNOWN SUBJECT";
// }

// function rejected() {
//   return {
//     subjectCode: null,
//     subjectName: null,
//     confidenceScore: 0,
//     status: "rejected"
//   };
// }

// /**
//  * @param {string} rawTitle - scraped link text / filename
//  * @returns {{subjectCode: string|null, subjectName: string|null, confidenceScore: number, status: "valid"|"rejected"}}
//  */
// function parsePyqFilename(rawTitle) {
//   if (!rawTitle || typeof rawTitle !== "string") return rejected();

//   const fileName = rawTitle.replace(/\.pdf$/i, "").trim().toUpperCase();
//   if (!fileName) return rejected();

//   let matches = collectMatches(fileName, CODE_REGEX);
//   let usedFallback = false;

//   if (matches.length === 0) {
//     matches = collectMatches(fileName, FALLBACK_CODE_REGEX);
//     usedFallback = true;
//   }

//   if (matches.length === 0) return rejected();

//   const picked = pickBestMatch(matches, fileName.length);
//   if (!picked) return rejected();

//   const code = buildCode(picked.match);

//   // Hard safety gate: never let an invalid-shaped code reach MongoDB.
//   if (!VALID_CODE_REGEX.test(code)) return rejected();

//   const subjectName = cleanSubjectName(fileName, picked.match);

//   let confidence =
//     picked.reason === "prefix" ? 0.95 :
//     picked.reason === "suffix" ? 0.9 :
//     0.7;

//   if (picked.match.versionNoise) confidence -= 0.03;
//   if (usedFallback) confidence -= 0.2;
//   if (subjectName === "UNKNOWN SUBJECT") confidence -= 0.2;

//   confidence = Math.max(0, Math.min(1, Number(confidence.toFixed(2))));

//   return {
//     subjectCode: code,
//     subjectName,
//     confidenceScore: confidence,
//     status: "valid"
//   };
// }

// /**
//  * =========================================================================
//  * SCRAPE TARGETS
//  * =========================================================================
//  */
// const DIRS = [
//   // SEM 1
//   { dir: 6196, semester: 1, year: 2017 },
//   { dir: 6195, semester: 1, year: 2018 },
//   { dir: 6194, semester: 1, year: 2019 },
//   { dir: 6193, semester: 1, year: 2020 },
//   { dir: 6192, semester: 1, year: 2021 },
//   { dir: 13885, semester: 1, year: 2022 },
//   { dir: 16523, semester: 1, year: 2023 },
//   { dir: 17714, semester: 1, year: 2024 },
//   { dir: 18691, semester: 1, year: 2025 },

//   // SEM 2
//   { dir: 6105, semester: 2, year: 2017 },
//   { dir: 6104, semester: 2, year: 2018 },
//   { dir: 6103, semester: 2, year: 2019 },
//   { dir: 6102, semester: 2, year: 2022 },
//   { dir: 15206, semester: 2, year: 2023 },
//   { dir: 16984, semester: 2, year: 2024 },
//   { dir: 18352, semester: 2, year: 2025 },

//   // SEM 3
//   { dir: 6010, semester: 3, year: 2017 },
//   { dir: 6009, semester: 3, year: 2018 },
//   { dir: 6008, semester: 3, year: 2019 },
//   { dir: 6007, semester: 3, year: 2020 },
//   { dir: 13895, semester: 3, year: 2022 },
//   { dir: 16533, semester: 3, year: 2023 },
//   { dir: 17724, semester: 3, year: 2024 },
//   { dir: 18701, semester: 3, year: 2025 },

//   // SEM 4
//   { dir: 5836, semester: 4, year: 2017 },
//   { dir: 5835, semester: 4, year: 2018 },
//   { dir: 5834, semester: 4, year: 2019 },
//   { dir: 5833, semester: 4, year: 2022 },
//   { dir: 15217, semester: 4, year: 2023 },
//   { dir: 16994, semester: 4, year: 2024 },
//   { dir: 18362, semester: 4, year: 2025 },

//   // SEM 5
//   { dir: 5662, semester: 5, year: 2017 },
//   { dir: 5661, semester: 5, year: 2018 },
//   { dir: 5660, semester: 5, year: 2019 },
//   { dir: 5659, semester: 5, year: 2020 },
//   { dir: 5658, semester: 5, year: 2021 },
//   { dir: 5657, semester: 5, year: 2022 },
//   { dir: 16564, semester: 5, year: 2023 },
//   { dir: 17744, semester: 5, year: 2024 },
//   { dir: 18721, semester: 5, year: 2025 },

//   // SEM 6
//   { dir: 5406, semester: 6, year: 2017 },
//   { dir: 5405, semester: 6, year: 2018 },
//   { dir: 5404, semester: 6, year: 2019 },
//   { dir: 5403, semester: 6, year: 2022 },
//   { dir: 15250, semester: 6, year: 2023 },
//   { dir: 17026, semester: 6, year: 2024 },
//   { dir: 18397, semester: 6, year: 2025 },

//   // SEM 7
//   { dir: 5255, semester: 7, year: 2017 },
//   { dir: 5256, semester: 7, year: 2018 },
//   { dir: 5254, semester: 7, year: 2019 },
//   { dir: 5253, semester: 7, year: 2020 },
//   { dir: 5252, semester: 7, year: 2021 },
//   { dir: 5251, semester: 7, year: 2022 },
//   { dir: 16634, semester: 7, year: 2023 },
//   { dir: 17800, semester: 7, year: 2024 },
//   { dir: 18746, semester: 7, year: 2025 },

//   // SEM 8
//   { dir: 5087, semester: 8, year: 2017 },
//   { dir: 5086, semester: 8, year: 2018 },
//   { dir: 5085, semester: 8, year: 2019 },
//   { dir: 5084, semester: 8, year: 2022 },
//   { dir: 15301, semester: 8, year: 2023 },
//   { dir: 17063, semester: 8, year: 2024 },
//   { dir: 18456, semester: 8, year: 2025 }
// ];

// /**
//  * =========================================================================
//  * MAIN IMPORT JOB
//  * =========================================================================
//  */
// async function importAllPyqs() {
//   await mongoose.connect(process.env.MONGO_URI);
//   console.log("✅ MongoDB Connected");

//   let imported = 0;
//   let skipped = 0;
//   let rejectedCount = 0;
//   let lowConfidence = 0;

//   for (const folder of DIRS) {
//     console.log(`\n========== SEM ${folder.semester} | DIR ${folder.dir} ==========\n`);

//     const url = `https://www.abesit.in/library/question-paper-bank/?dir=${folder.dir}`;

//     let data;

//     try {
//       const response = await axios.get(url, {
//         headers: {
//           "User-Agent":
//             "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36",
//           Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
//           "Accept-Language": "en-US,en;q=0.5",
//           Referer: "https://www.abesit.in/"
//         },
//         timeout: 30000,
//         validateStatus: () => true
//       });

//       data = response.data;
//     } catch (err) {
//       console.log(`❌ Failed DIR ${folder.dir}`);
//       continue;
//     }

//     const $ = cheerio.load(data);
//     const papers = [];

//     $("a[href*='wpdocs_dl']").each((i, el) => {
//       let title = $(el).text().trim();

//       if (!title) {
//         title = $(el).closest("div").find("figcaption").text().trim();
//       }

//       const link = $(el).attr("href");

//       if (title && link) {
//         papers.push({ title, link });
//       }
//     });

//     console.log(`Found ${papers.length} papers`);

//     for (const paper of papers) {
//       const result = parsePyqFilename(paper.title);

//       // STEP 1: REJECT UNPARSEABLE FILENAMES
//       if (result.status === "rejected") {
//         console.log("❌ Rejected (no valid code found):", paper.title);
//         rejectedCount++;
//         continue;
//       }

//       // Flag low-confidence parses without blocking ingestion
//       if (result.confidenceScore < 0.75) {
//         console.log(
//           `⚠️  Low-confidence parse (${result.confidenceScore}):`,
//           paper.title,
//           "->",
//           result.subjectCode
//         );
//         lowConfidence++;
//       }

//       const { subjectCode: code, subjectName } = result;

//       // STEP 2: FIND OR CREATE SUBJECT
//       let subject = await Subject.findOne({ code });

//       if (!subject) {
//         subject = await Subject.create({
//           name: subjectName,
//           code,
//           semester: folder.semester
//         });

//         console.log("Created Subject:", code);
//       }

//       // STEP 3: AVOID DUPLICATES
//       const exists = await PYQ.findOne({ fileUrl: paper.link });

//       if (exists) {
//         skipped++;
//         continue;
//       }

//       // STEP 4: SAVE PYQ
//       await PYQ.create({
//         title: subjectName,
//         subject: subject._id,
//         semester: folder.semester,
//         year: folder.year,
//         fileUrl: paper.link
//         // Optional: add `parseConfidence: Number` to your PYQ schema
//         // and store `parseConfidence: result.confidenceScore` here.
//       });

//       imported++;
//       console.log("Imported:", code, `(confidence: ${result.confidenceScore})`);
//     }

//     await new Promise((r) => setTimeout(r, 1500));
//   }

//   console.log("\n====================");
//   console.log("Imported:", imported);
//   console.log("Skipped (duplicates):", skipped);
//   console.log("Rejected (invalid filenames):", rejectedCount);
//   console.log("Low-confidence (flagged, still imported):", lowConfidence);
//   console.log("====================\n");

//   process.exit();
// }

// importAllPyqs().catch((err) => {
//   console.error(err);
//   process.exit(1);
// });


require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const Subject = require("../models/Subject");
const PYQ = require("../models/PyqModel");

/**
 * =========================================================================
 * AKTU PYQ DATA AUDIT SCRIPT
 * =========================================================================
 * This script does NOT touch your scraper and does NOT modify any data.
 * It only READS what is already in MongoDB (Subjects + PYQs) and produces
 * a report of records that look suspicious and should be reviewed by a
 * human before you trust them in production.
 *
 * Run:   node scripts/auditPyqData.js
 *
 * Output:
 *   - Console tables (quick look)
 *   - reports/audit-report-<timestamp>.json   (full machine-readable report)
 *   - reports/suspicious-subjects-<timestamp>.csv (open in Excel/Sheets)
 * =========================================================================
 */

// -------------------------------------------------------------------------
// CONFIG: known AKTU subject-code prefixes (extend this list any time you
// discover a new legitimate prefix — it does not require touching any
// scraping/parsing logic).
// -------------------------------------------------------------------------
const KNOWN_PREFIXES = new Set([
  // ---- Old scheme (pre-2018, "N" series) ----
  "NCS", "NEC", "NEE", "NME", "NCE", "NAS", "NHU", "NOE",
  "NCH", "NIT", "NPH", "NMA", "NFE", "NID",
  // ---- Old scheme ("E" series, some private/affiliated colleges) ----
  "ECS", "ECE", "EEE", "EME", "EAS", "EOE", "ECIE", "EHU", "ECH",
  // ---- Old scheme ("R" series) ----
  "RCS", "RAS", "ROE", "REC", "REE", "RME", "RCE",
  // ---- New scheme (2018+ AICTE flexible curriculum, "K" series) ----
  "KCS", "KEC", "KEE", "KME", "KCE", "KAS", "KOE", "KVE", "KIT",
  "KHU", "KCH", "KEF", "KEN", "KNC", "KAI", "KDS", "KCD",
  // ---- New scheme ("B" series, current B.Tech regular scheme) ----
  "BCS", "BEC", "BEE", "BME", "BCE", "BAS", "BOE", "BVE", "BCC",
  "BCD", "BIT", "BHU", "BCH", "BEN", "BNC",
  // ---- AI/DS/ML & emerging branches ----
  "ACSE", "ACSD", "ACSML", "ACSAI", "AIT", "ADS", "AML",
  "BCDS", "BCAI", "BCSD",
  // ---- Common humanities / mandatory courses ----
  "BVE", "BNC", "BHM", "BSH"
]);

// Acceptable final shape (same gate your parser already enforces).
const VALID_CODE_REGEX = /^[A-Z]{2,5}\d{3,4}[A-Z]?$/;

const REPORT_DIR = path.join(__dirname, "..", "reports");

// -------------------------------------------------------------------------
// Small dependency-free Levenshtein distance + similarity ratio,
// used to catch near-duplicate subject names (e.g. "DATA STRUCTURE" vs
// "DATA STRUCTURES", "COMPUTER NETWORK" vs "COMPUTER NETWORKS").
// -------------------------------------------------------------------------
function levenshtein(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const prev = new Array(b.length + 1);
  const curr = new Array(b.length + 1);

  for (let j = 0; j <= b.length; j++) prev[j] = j;

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        curr[j - 1] + 1,      // insertion
        prev[j] + 1,          // deletion
        prev[j - 1] + cost    // substitution
      );
    }
    for (let j = 0; j <= b.length; j++) prev[j] = curr[j];
  }
  return prev[b.length];
}

function similarityRatio(a, b) {
  const longer = Math.max(a.length, b.length);
  if (longer === 0) return 1;
  return 1 - levenshtein(a, b) / longer;
}

function normalizeName(name) {
  return (name || "")
    .toUpperCase()
    .replace(/[^A-Z\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// -------------------------------------------------------------------------
// Individual checks. Each returns null (ok) or a finding object.
// -------------------------------------------------------------------------

function checkCodeShape(subject) {
  if (!VALID_CODE_REGEX.test(subject.code)) {
    return {
      type: "INVALID_CODE_SHAPE",
      severity: "high",
      subjectId: subject._id,
      code: subject.code,
      name: subject.name,
      reason: `Code "${subject.code}" does not match expected shape (2-5 letters + 3-4 digits + optional letter).`,
      suggestion: "Manually inspect the source PDF title and correct the code, or delete if bogus."
    };
  }
  return null;
}

function checkKnownPrefix(subject) {
  const prefixMatch = subject.code.match(/^[A-Z]+/);
  const prefix = prefixMatch ? prefixMatch[0] : "";

  if (!KNOWN_PREFIXES.has(prefix)) {
    return {
      type: "UNKNOWN_PREFIX",
      severity: "medium",
      subjectId: subject._id,
      code: subject.code,
      name: subject.name,
      reason: `Prefix "${prefix}" is not in the known AKTU prefix list.`,
      suggestion: "If this is a legitimate new AKTU branch code, add it to KNOWN_PREFIXES. Otherwise review manually."
    };
  }
  return null;
}

function checkSubjectName(subject) {
  const name = (subject.name || "").trim();

  if (!name || name === "UNKNOWN SUBJECT") {
    return {
      type: "BAD_NAME_UNKNOWN",
      severity: "high",
      subjectId: subject._id,
      code: subject.code,
      name: subject.name,
      reason: "Subject name is empty or literally 'UNKNOWN SUBJECT'.",
      suggestion: "Look up the original PDF title/link and set the correct name manually."
    };
  }

  if (name.length < 4) {
    return {
      type: "BAD_NAME_TOO_SHORT",
      severity: "medium",
      subjectId: subject._id,
      code: subject.code,
      name: subject.name,
      reason: `Name "${name}" is suspiciously short (<4 chars) — likely truncated during parsing.`,
      suggestion: "Verify against source filename and correct."
    };
  }

  const words = name.split(" ").filter(Boolean);
  if (words.length === 1 && words[0].length < 6) {
    return {
      type: "BAD_NAME_SINGLE_SHORT_WORD",
      severity: "low",
      subjectId: subject._id,
      code: subject.code,
      name: subject.name,
      reason: `Name "${name}" is a single short word — may be an incomplete extraction.`,
      suggestion: "Cross-check with source filename."
    };
  }

  if (/\d/.test(name)) {
    return {
      type: "BAD_NAME_CONTAINS_DIGITS",
      severity: "low",
      subjectId: subject._id,
      code: subject.code,
      name: subject.name,
      reason: `Name "${name}" still contains digits — cleaning step may have missed something.`,
      suggestion: "Remove stray digits manually."
    };
  }

  if (name.includes(subject.code)) {
    return {
      type: "BAD_NAME_CONTAINS_CODE",
      severity: "low",
      subjectId: subject._id,
      code: subject.code,
      name: subject.name,
      reason: `Name still contains the subject code "${subject.code}".`,
      suggestion: "Strip the code out of the name."
    };
  }

  return null;
}

// -------------------------------------------------------------------------
// MAIN AUDIT
// -------------------------------------------------------------------------
async function runAudit() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB Connected\n");

  const subjects = await Subject.find().lean();
  const pyqs = await PYQ.find().lean();

  console.log(`Loaded ${subjects.length} subjects and ${pyqs.length} PYQs.\n`);

  // ---- Paper count per subject ----
  const paperCountBySubject = new Map();
  const subjectIdSet = new Set(subjects.map((s) => String(s._id)));
  const orphanPapers = [];

  for (const pyq of pyqs) {
    const subjId = pyq.subject ? String(pyq.subject) : null;

    if (!subjId || !subjectIdSet.has(subjId)) {
      orphanPapers.push({
        pyqId: pyq._id,
        title: pyq.title,
        fileUrl: pyq.fileUrl,
        semester: pyq.semester,
        year: pyq.year,
        reason: !subjId
          ? "PYQ has no subject reference."
          : "PYQ references a subject ID that no longer exists."
      });
      continue;
    }

    paperCountBySubject.set(subjId, (paperCountBySubject.get(subjId) || 0) + 1);
  }

  // ---- Per-subject checks ----
  const findings = [];
  const singlePaperSubjects = [];

  for (const subject of subjects) {
    const id = String(subject._id);
    const count = paperCountBySubject.get(id) || 0;

    [checkCodeShape, checkKnownPrefix, checkSubjectName].forEach((fn) => {
      const result = fn(subject);
      if (result) findings.push(result);
    });

    if (count === 0) {
      findings.push({
        type: "SUBJECT_HAS_ZERO_PAPERS",
        severity: "medium",
        subjectId: subject._id,
        code: subject.code,
        name: subject.name,
        reason: "Subject exists but has no linked PYQ papers.",
        suggestion: "Likely created in error, or all its papers were later deleted. Consider removing."
      });
    } else if (count === 1) {
      singlePaperSubjects.push({
        subjectId: subject._id,
        code: subject.code,
        name: subject.name,
        semester: subject.semester,
        paperCount: count
      });
    }
  }

  // ---- Duplicate subject detection ----
  // 1) Exact normalized-name collisions across different codes/IDs.
  // 2) Fuzzy near-duplicates (similarity >= 0.88) across different codes.
  const duplicateCandidates = [];
  const byNormalizedName = new Map();

  for (const subject of subjects) {
    const norm = normalizeName(subject.name);
    if (!norm) continue;
    if (!byNormalizedName.has(norm)) byNormalizedName.set(norm, []);
    byNormalizedName.get(norm).push(subject);
  }

  for (const [norm, group] of byNormalizedName.entries()) {
    if (group.length > 1) {
      duplicateCandidates.push({
        type: "EXACT_NAME_DUPLICATE",
        normalizedName: norm,
        subjects: group.map((s) => ({ id: s._id, code: s.code, name: s.name })),
        suggestion: "Same name under multiple codes — verify these aren't the same subject re-imported with a different code, or merge them."
      });
    }
  }

  const namesArr = subjects
    .map((s) => ({ id: s._id, code: s.code, name: s.name, norm: normalizeName(s.name) }))
    .filter((s) => s.norm);

  const SIMILARITY_THRESHOLD = 0.88;
  const seenPairs = new Set();

  for (let i = 0; i < namesArr.length; i++) {
    for (let j = i + 1; j < namesArr.length; j++) {
      const a = namesArr[i];
      const b = namesArr[j];
      if (a.norm === b.norm) continue; // already caught as exact duplicate
      if (a.code === b.code) continue;

      const ratio = similarityRatio(a.norm, b.norm);
      if (ratio >= SIMILARITY_THRESHOLD) {
        const pairKey = [a.id, b.id].sort().join("|");
        if (seenPairs.has(pairKey)) continue;
        seenPairs.add(pairKey);

        duplicateCandidates.push({
          type: "FUZZY_NAME_DUPLICATE",
          similarity: Number(ratio.toFixed(2)),
          subjects: [
            { id: a.id, code: a.code, name: a.name },
            { id: b.id, code: b.code, name: b.name }
          ],
          suggestion: "Names are very similar but not identical (possible singular/plural or spelling variant) — review and merge if same subject."
        });
      }
    }
  }

  // -----------------------------------------------------------------------
  // BUILD REPORT
  // -----------------------------------------------------------------------
  const severityCount = { high: 0, medium: 0, low: 0 };
  findings.forEach((f) => severityCount[f.severity]++);

  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalSubjects: subjects.length,
      totalPapers: pyqs.length,
      totalFindings: findings.length,
      findingsBySeverity: severityCount,
      duplicateCandidateGroups: duplicateCandidates.length,
      orphanPapers: orphanPapers.length,
      subjectsWithOnlyOnePaper: singlePaperSubjects.length,
      subjectsWithZeroPapers: findings.filter((f) => f.type === "SUBJECT_HAS_ZERO_PAPERS").length
    },
    findings,
    duplicateCandidates,
    singlePaperSubjects,
    orphanPapers
  };

  // -----------------------------------------------------------------------
  // CONSOLE OUTPUT
  // -----------------------------------------------------------------------
  console.log("====================================================");
  console.log("                AUDIT SUMMARY");
  console.log("====================================================");
  console.table([report.summary]);

  if (findings.length) {
    console.log("\n---------------- SUSPICIOUS SUBJECTS ----------------");
    console.table(
      findings.map((f) => ({
        type: f.type,
        severity: f.severity,
        code: f.code,
        name: (f.name || "").slice(0, 40),
        reason: f.reason
      }))
    );
  } else {
    console.log("\n✅ No suspicious subjects found.");
  }

  if (duplicateCandidates.length) {
    console.log("\n---------------- DUPLICATE CANDIDATES ----------------");
    console.table(
      duplicateCandidates.map((d) => ({
        type: d.type,
        similarity: d.similarity ?? "exact",
        subjects: d.subjects.map((s) => `${s.code} (${s.name})`).join("  |  ")
      }))
    );
  } else {
    console.log("\n✅ No duplicate subject candidates found.");
  }

  if (singlePaperSubjects.length) {
    console.log("\n---------------- SUBJECTS WITH ONLY 1 PAPER ----------------");
    console.table(
      singlePaperSubjects.map((s) => ({
        code: s.code,
        name: (s.name || "").slice(0, 40),
        semester: s.semester,
        paperCount: s.paperCount
      }))
    );
  } else {
    console.log("\n✅ No single-paper subjects found.");
  }

  if (orphanPapers.length) {
    console.log("\n---------------- ORPHAN PAPERS (broken subject ref) ----------------");
    console.table(
      orphanPapers.map((o) => ({
        title: (o.title || "").slice(0, 40),
        semester: o.semester,
        year: o.year,
        reason: o.reason
      }))
    );
  } else {
    console.log("\n✅ No orphan papers found.");
  }

  // -----------------------------------------------------------------------
  // WRITE FILES (full JSON + CSV for manual review — no data is modified)
  // -----------------------------------------------------------------------
  if (!fs.existsSync(REPORT_DIR)) fs.mkdirSync(REPORT_DIR, { recursive: true });

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const jsonPath = path.join(REPORT_DIR, `audit-report-${stamp}.json`);
  const csvPath = path.join(REPORT_DIR, `suspicious-subjects-${stamp}.csv`);

  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));

  const csvHeader = "type,severity,code,name,reason,suggestion\n";
  const csvRows = findings
    .map((f) =>
      [f.type, f.severity, f.code, `"${(f.name || "").replace(/"/g, '""')}"`, `"${f.reason.replace(/"/g, '""')}"`, `"${f.suggestion.replace(/"/g, '""')}"`].join(",")
    )
    .join("\n");
  fs.writeFileSync(csvPath, csvHeader + csvRows);

  console.log("\n====================================================");
  console.log(`Full JSON report:        ${jsonPath}`);
  console.log(`Suspicious subjects CSV: ${csvPath}`);
  console.log("====================================================");
  console.log("\nNo data was modified. Review the report and fix manually.");

  process.exit(0);
}

runAudit().catch((err) => {
  console.error("❌ Audit failed:", err);
  process.exit(1);
});