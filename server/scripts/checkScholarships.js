const mongoose = require("mongoose");

const MONGO_URI = "mongodb://pallavi:pallavi778@ac-kluab7b-shard-00-00.p7jznyh.mongodb.net:27017,ac-kluab7b-shard-00-01.p7jznyh.mongodb.net:27017,ac-kluab7b-shard-00-02.p7jznyh.mongodb.net:27017/?ssl=true&replicaSet=atlas-1lynif-shard-0&authSource=admin&appName=Cluster0";

const pyqs = new mongoose.Schema({}, { strict: false });
const Pyq = mongoose.model("pyqs", pyqs);

// CLEAN FUNCTION
function cleanText(text) {
  if (!text) return text;

  return text
    .toString()
    .toLowerCase()
    .replace(/^aktu[_\s]*pyq\//i, "")
    .replace(/^akt[u]?[_\s]*pyq\//i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected");

  const docs = await Pyq.find({});
  console.log("Total docs:", docs.length);

  let updated = 0;

  for (const doc of docs) {
    let changed = false;

    // FIX ALL POSSIBLE FIELDS
    const fields = ["title", "semester", "year", "subject"];

    for (const field of fields) {
      if (doc[field]) {
        const cleaned = cleanText(doc[field]);

        if (cleaned && cleaned !== doc[field]) {
          doc[field] = cleaned;
          changed = true;
        }
      }
    }

    if (changed) {
      await doc.save();
      updated++;
    }
  }

  console.log("DONE UPDATED:", updated);
  process.exit();
}

run().catch(console.error);