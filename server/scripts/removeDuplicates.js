require("dotenv").config();
const mongoose = require("mongoose");
const PYQ = require("../models/Pyq");

async function clean() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected");

  const duplicates = await PYQ.aggregate([
    {
      $group: {
        _id: {
          subject: "$subject",
          year: "$year",
          semester: "$semester"
        },
        ids: { $push: "$_id" },
        count: { $sum: 1 }
      }
    },
    {
      $match: { count: { $gt: 1 } }
    }
  ]);

  console.log("Duplicate groups:", duplicates.length);

  let totalDeleted = 0;

  for (const g of duplicates) {
    const [keep, ...remove] = g.ids;

    const res = await PYQ.deleteMany({
      _id: { $in: remove }
    });

    totalDeleted += res.deletedCount;

    console.log(
      `Kept 1, deleted ${res.deletedCount} for subject=${g._id.subject}, year=${g._id.year}`
    );
  }

  console.log("DONE. Total deleted:", totalDeleted);

  process.exit(0);
}

clean().catch(console.error);