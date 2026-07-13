// require("dotenv").config();
// const mongoose = require("mongoose");
// const Subject = require("../models/Subject");

// const subjectsList = [
//   { name: "Data Structures", code: "KCS301", semester: 3, branch: "Computer Science" },
//   { name: "Computer Organization & Architecture", code: "KCS302", semester: 3, branch: "Computer Science" },
//   { name: "Operating Systems", code: "KCS401", semester: 4, branch: "Computer Science" },
//   { name: "Theory of Automata & Formal Languages", code: "KCS402", semester: 4, branch: "Computer Science" },
//   { name: "Database Management Systems", code: "KCS501", semester: 5, branch: "Computer Science" },
//   { name: "Compiler Design", code: "KCS502", semester: 5, branch: "Computer Science" },
//   { name: "Software Engineering", code: "KCS601", semester: 6, branch: "Computer Science" },
//   { name: "Web Technology", code: "KCS602", semester: 6, branch: "Computer Science" },
// ];

// async function seedSubjects() {
//   try {
//     const connStr =
//       process.env.MONGO_URI || "mongodb://127.0.0.1:27017/aktu-copilot";

//     await mongoose.connect(connStr);
//     console.log("Connected to MongoDB");

//     // SAFE UPSERT (NO DELETE)
//     const result = await Subject.bulkWrite(
//       subjectsList.map((subject) => ({
//         updateOne: {
//           filter: { code: subject.code },
//           update: { $set: subject },
//           upsert: true,
//         },
//       }))
//     );

//     console.log("Subjects inserted/updated successfully");
//     console.log(result);

//     process.exit(0);
//   } catch (error) {
//     console.error("Subject seeding failed:", error.message);
//     process.exit(1);
//   }
// }

// seedSubjects();


require("dotenv").config();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Subject = require("../models/Subject");

dotenv.config();

const subjectsList = [
  { name: "Data Structures", code: "KCS301", semester: 3, branch: "Computer Science" },
  { name: "Computer Organization & Architecture", code: "KCS302", semester: 3, branch: "Computer Science" },
  { name: "Operating Systems", code: "KCS401", semester: 4, branch: "Computer Science" },
  { name: "Theory of Automata & Formal Languages", code: "KCS402", semester: 4, branch: "Computer Science" },
  { name: "Database Management Systems", code: "KCS501", semester: 5, branch: "Computer Science" },
  { name: "Compiler Design", code: "KCS502", semester: 5, branch: "Computer Science" },
  { name: "Software Engineering", code: "KCS601", semester: 6, branch: "Computer Science" },
  { name: "Web Technology", code: "KCS602", semester: 6, branch: "Computer Science" },
];

async function seedSubjects() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const bulkOps = subjectsList.map((subject) => ({
      updateOne: {
        filter: { code: subject.code },
        update: { $set: subject },
        upsert: true,
      },
    }));

    const result = await Subject.bulkWrite(bulkOps);

    console.log("Subjects inserted/updated successfully");
    console.log(result);

    process.exit(0);
  } catch (err) {
    console.error("Error seeding subjects:", err);
    process.exit(1);
  }
}

seedSubjects();