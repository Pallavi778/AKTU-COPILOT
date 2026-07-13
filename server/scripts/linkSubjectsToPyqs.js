require("dotenv").config();

const mongoose = require("mongoose");
const Subject = require("../models/Subject");
const PYQ = require("../models/Pyq");

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected\n");

    // Load all subjects
    const subjects = await Subject.find();

    // Build lookup map
    const subjectMap = new Map();

    for (const subject of subjects) {
      const key = `${subject.code.toUpperCase()}_${subject.semester}`;
      subjectMap.set(key, subject._id);
    }

    console.log(`Loaded ${subjects.length} subjects\n`);

    // Load all papers
    const pyqs = await PYQ.find();

    let linked = 0;
    let alreadyLinked = 0;
    let notFound = 0;

    for (const pyq of pyqs) {

      if (pyq.subject) {
        alreadyLinked++;
        continue;
      }

      const key = `${(pyq.subjectCode || "").toUpperCase()}_${pyq.semester}`;

      const subjectId = subjectMap.get(key);

      if (!subjectId) {
        console.log(
          `❌ No subject found -> ${pyq.subjectCode} (Semester ${pyq.semester})`
        );
        notFound++;
        continue;
      }

      pyq.subject = subjectId;
      await pyq.save();

      linked++;

      console.log(`✅ Linked: ${pyq.publicId}`);
    }

    console.log("\n========================");
    console.log("Linked        :", linked);
    console.log("Already Linked:", alreadyLinked);
    console.log("Not Found     :", notFound);
    console.log("========================");

    process.exit(0);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();