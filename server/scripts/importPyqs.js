const axios = require("axios");
const cheerio = require("cheerio");
const mongoose = require("mongoose");
const Subject = require("../models/Subject");
const PYQ = require("../models/PYQ");

const BASE_URL =
  "https://www.abesit.in/library/question-paper-bank/?dir=18721";

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB Connected");

  const { data } = await axios.get(BASE_URL);
  const $ = cheerio.load(data);

  const papers = [];

  $(".file_view").each((i, el) => {
    const title = $(el).find("figcaption").text().trim();
    const link = $(el).find("a.file").attr("href");

    if (title && link) {
      papers.push({ title, link });
    }
  });

  console.log("Found papers:", papers.length);

  for (const paper of papers) {
    const fileName = paper.title.replace(".pdf", "");

    // Extract subject code (first 6–7 chars like BCS501)
    const codeMatch = fileName.match(/^([A-Z]{2,5}[0-9]{3})/);
    if (!codeMatch) continue;

    const code = codeMatch[1];

    let subject = await Subject.findOne({ code });

    if (!subject) {
      subject = await Subject.create({
        name: fileName.replace(code, "").replace(/-/g, " ").trim(),
        code,
        semester: 5, // you can later improve mapping
      });

      console.log("Created Subject:", code);
    }

    const exists = await PYQ.findOne({ fileUrl: paper.link });
    if (exists) {
      console.log("Skipped duplicate:", fileName);
      continue;
    }

    await PYQ.create({
      title: fileName.replace(code, "").replace(/-/g, " ").trim(),
      subject: subject._id,
      semester: subject.semester,
      year: 2025,
      fileUrl: paper.link,
    });

    console.log("Imported:", fileName);
  }

  console.log("DONE IMPORT");
  process.exit();
}

run();