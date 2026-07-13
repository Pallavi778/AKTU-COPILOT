require("dotenv").config();
const mongoose = require("mongoose");
const PYQ = require("../models/PyqModel");

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const count = await PYQ.countDocuments();

  console.log("PYQ Count =", count);

  process.exit();
})();