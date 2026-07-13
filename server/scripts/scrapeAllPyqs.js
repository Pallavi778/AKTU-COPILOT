require("dotenv").config();

const cloudinary = require("cloudinary").v2;
const axios = require("axios");
const cheerio = require("cheerio");
const streamifier = require("streamifier");

// --------------------



  function extractSubject(title) {
  if (!title) return "Unknown";

  // Remove codes like BAS101, BCS301 etc
  return title
    .replace(/^[A-Z]{2,5}[0-9]{2,4}[- ]?/, "")
    .replace(/[-_]/g, " ")
    .trim();
}
// --------------------
// CLOUDINARY CONFIG
// --------------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --------------------
// SEED STRUCTURE
// --------------------
const SEED_STRUCTURE = [
  //SEM 1
  { dir: 6196, semester: 1, year: 2017 },
  { dir: 6195, semester: 1, year: 2018 },
  { dir: 6194, semester: 1, year: 2019 },
  { dir: 6193, semester: 1, year: 2020 },
  { dir: 6192, semester: 1, year: 2021 },
  { dir: 13885, semester: 1, year: 2022 },
  { dir: 16523, semester: 1, year: 2023 },
  { dir: 17714, semester: 1, year: 2024 },
  { dir: 18691, semester: 1, year: 2025 },
  // SEM 2
  { dir: 6105, semester: 2, year: 2017 },
  { dir: 6104, semester: 2, year: 2018 },
  { dir: 6103, semester: 2, year: 2019 },
  { dir: 6102, semester: 2, year: 2022 },
  { dir: 15206, semester: 2, year: 2023 },
  { dir: 16984, semester: 2, year: 2024 },
  { dir: 18352, semester: 2, year: 2025 },

  // SEM 3
  { dir: 6010, semester: 3, year: 2017 },
  { dir: 6009, semester: 3, year: 2018 },
  { dir: 6008, semester: 3, year: 2019 },
  { dir: 6007, semester: 3, year: 2020 },
  { dir: 13895, semester: 3, year: 2022 },
  { dir: 16533, semester: 3, year: 2023 },
  { dir: 17724, semester: 3, year: 2024 },
  { dir: 18701, semester: 3, year: 2025 },

  // SEM 4
  { dir: 5836, semester: 4, year: 2017 },
  { dir: 5835, semester: 4, year: 2018 },
  { dir: 5834, semester: 4, year: 2019 },
  { dir: 5833, semester: 4, year: 2022 },
  { dir: 15217, semester: 4, year: 2023 },
  { dir: 16994, semester: 4, year: 2024 },
  { dir: 18362, semester: 4, year: 2025 },
  //SEM 5
  { dir: 5662, semester: 5, year: 2017 },
  { dir: 5661, semester: 5, year: 2018 },
  { dir: 5660, semester: 5, year: 2019 },
  { dir: 5659, semester: 5, year: 2020 },
  { dir: 5658, semester: 5, year: 2021 },
  { dir: 5657, semester: 5, year: 2022 },
  { dir: 16564, semester: 5, year: 2023 },
  { dir: 17744, semester: 5, year: 2024 },
  { dir: 18721, semester: 5, year: 2025 },
   // SEM 6
  { dir: 5406, semester: 6, year: 2017 },
  { dir: 5405, semester: 6, year: 2018 },
  { dir: 5404, semester: 6, year: 2019 },
  { dir: 5403, semester: 6, year: 2022 },
  { dir: 15250, semester: 6, year: 2023 },
  { dir: 17026, semester: 6, year: 2024 },
  { dir: 18397, semester: 6, year: 2025 },

  // SEM 7
  { dir: 5255, semester: 7, year: 2017 },
  { dir: 5256, semester: 7, year: 2018 },
  { dir: 5254, semester: 7, year: 2019 },
  { dir: 5253, semester: 7, year: 2020 },
  { dir: 5252, semester: 7, year: 2021 },
  { dir: 5251, semester: 7, year: 2022 },
  { dir: 16634, semester: 7, year: 2023 },
  { dir: 17800, semester: 7, year: 2024 },
  { dir: 18746, semester: 7, year: 2025 },

  // SEM 8
  { dir: 5087, semester: 8, year: 2017 },
  { dir: 5086, semester: 8, year: 2018 },
  { dir: 5085, semester: 8, year: 2019 },
  { dir: 5084, semester: 8, year: 2022 },
  { dir: 15301, semester: 8, year: 2023 },
  { dir: 17063, semester: 8, year: 2024 },
  { dir: 18456, semester: 8, year: 2025 }
];

// --------------------
// HEADERS (IMPORTANT FOR 406 FIX)
// --------------------
const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
  "Accept": "application/pdf,*/*",
  "Referer": "https://www.abesit.in/",
};

// --------------------
// STEP 1: SAFE PDF DOWNLOAD
// --------------------
async function downloadPDF(url, referer) {
  try {
    const res = await axios.get(url, {
      responseType: "arraybuffer",
      maxRedirects: 5,
      timeout: 20000,
      headers: {
        ...headers,
        Referer: referer,
      },
    });

    const buffer = Buffer.from(res.data);

    // 🔥 VALIDATION: must be real PDF
    const header = buffer.toString("utf8", 0, 10);
    if (!header.includes("%PDF")) {
      console.log("❌ Invalid PDF (HTML or blocked response)");
      return null;
    }

    return buffer;

  } catch (err) {
    console.log("❌ Download failed:", err.message);
    return null;
  }
}

// --------------------
// STEP 2: SAFE CLOUDINARY UPLOAD
// --------------------
async function uploadToCloudinary(buffer, fileName, year, semester) {
  const cleanName = fileName
    .replace(".pdf", "")
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9-_]/g, "_");

  const publicId = `${semester}-${year}-${cleanName}`;

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
  {
    resource_type: "raw",
    folder: "aktu_pyq",
    public_id: publicId,
    overwrite: false,
  },
    (err, result) => {
      if (err) {
        console.log("❌ Cloudinary error:", err.message);
        return reject(err);
      }
      resolve(result);
    }
  );

  streamifier.createReadStream(buffer).pipe(stream);
});
}

// --------------------
// SCRAPER
// --------------------
async function scrapeAllPyqs() {
  for (const item of SEED_STRUCTURE) {
    console.log(`\n============================`);
    console.log(`Semester ${item.semester} | Year ${item.year}`);
    console.log(`============================\n`);

    const url = `https://www.abesit.in/library/question-paper-bank/?dir=${item.dir}`;

    let data;
try {
  const res = await axios.get(url, { headers, timeout: 20000 });
  data = res.data;
} catch (err) {
  console.log("❌ Skipping semester page:", item.semester, item.year);
  continue;
}

    const $ = cheerio.load(data);

    const papers = [];

    $("a[href*='wpdocs_dl']").each((i, el) => {
      const link = $(el).attr("href");
      let title = $(el).text().trim();

      if (!title)
        title = $(el).closest("div").find("figcaption").text().trim();

      papers.push({
        title: title || "Unknown",
        link,
        semester: item.semester,
        year: item.year,
      });
    });

    console.log(`Found: ${papers.length}`);

    const uniquePapers = [...new Map(papers.map(p => [p.title, p])).values()];
    console.log(`Unique: ${uniquePapers.length}`);

    for (const paper of uniquePapers) {
      try {
        console.log(`\nProcessing: ${paper.title}`);

        // 🔥 DOWNLOAD SAFE PDF
        const buffer = await downloadPDF(paper.link, url);

        if (!buffer) {
          console.log("⏭ Skipped (invalid PDF)");
          continue;
        }

        // 🔥 UPLOAD TO CLOUDINARY
        const uploadResult = await uploadToCloudinary(
          buffer,
          paper.title,
          paper.year,
          paper.semester
        );

        console.log("✅ Uploaded:", uploadResult.secure_url);

        // 🔥 SAVE TO MONGO
        

      } catch (err) {
        console.log("❌ FAILED:", paper.title);
        console.log("   →", err.message);
      }
    }
  }

  console.log("\n🎉 DONE FULL IMPORT (CLEAN + SAFE)");
}

// --------------------
// RUN
// --------------------
(async () => {
  await scrapeAllPyqs();
})().catch(console.error);