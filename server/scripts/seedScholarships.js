const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Scholarship = require("../models/Scholarship");

dotenv.config();

const data = [
  {
    title: "Pragati Scholarship (AICTE)",
    eligibility: "Female students, BTech/Diploma, income < 8 LPA",
    note: "Check official website for latest updates",
    applicationLink: "https://scholarships.gov.in",
  },
  {
    title: "Saksham Scholarship (AICTE)",
    eligibility: "Specially-abled students, BTech/Diploma, income < 8 LPA",
    note: "Check official website for latest updates",
    applicationLink:  "https://scholarships.gov.in",
  },
  {
    title: "UP Post Matric Scholarship",
    eligibility: "UP students, income based eligibility",
    note: "Check official website for latest updates",
    applicationLink: "https://scholarship.up.gov.in/",
  },
  {
    title: "NSP Central Sector Scheme",
    eligibility: "Top percentile students, UG/PG",
    note: "Check official website for latest updates",
    applicationLink: "https://scholarships.gov.in/",
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  await Scholarship.deleteMany({});
  await Scholarship.insertMany(data);

  console.log("Scholarships seeded successfully");
  process.exit();
}

seed();