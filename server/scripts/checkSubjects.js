require("dotenv").config();
const mongoose = require("mongoose");
const Subject = require("../models/Subject");

mongoose.connect(process.env.MONGO_URI);

async function run() {
  const codes = [
    "BCS501",
    "BCS502",
    "BCS503",
    "BCAI501",
    "BCDS501"
  ];

  const subjects = await Subject.find({
    code: { $in: codes }
  });

  console.log(subjects);
  process.exit();
}

run();