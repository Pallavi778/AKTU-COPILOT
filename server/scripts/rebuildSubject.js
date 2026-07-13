require("dotenv").config();

const mongoose = require("mongoose");

const PYQ = require("../models/Pyq");
const Subject = require("../models/Subject");

function extractName(title, code) {
    let name = title;

    name = name.replace(/^aktu_pyq\//i, "");
    name = name.replace(/^[1-8]-20\d{2}-/, "");

    name = name.replace(new RegExp(`-${code}$`, "i"), "");

    name = name.replace(/_/g, " ");

    name = name.replace(/-/g, " ");

    name = name.trim();

    name = name
        .toLowerCase()
        .replace(/\b\w/g, c => c.toUpperCase());

    return name;
}

async function run() {

    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected.\n");

    const pyqs = await PYQ.find();
    console.log(pyqs.slice(0, 20).map(p => ({
    title: p.title,
    subjectCode: p.subjectCode,
    semester: p.semester
})));

    console.log("PYQs:", pyqs.length);

    const map = new Map();

    for (const pyq of pyqs) {

        const key = `${pyq.subjectCode}_${pyq.semester}`;

        if (!map.has(key)) {

            map.set(key, {

                code: pyq.subjectCode,

                semester: pyq.semester,

                name: extractName(pyq.title, pyq.subjectCode)

            });

        }

    }

    console.log("Unique Subjects:", map.size);

    let created = 0;
    let linked = 0;

    for (const subjectData of map.values()) {

        let subject = await Subject.findOne({
            code: subjectData.code
        });

        if (!subject) {

            subject = await Subject.create({

                name: subjectData.name,

                code: subjectData.code,

                semester: subjectData.semester,

                branch: "Common"

            });

            created++;

        }

        const result = await PYQ.updateMany(

            {

                subjectCode: subject.code,

                semester: subject.semester

            },

            {

                $set: {

                    subject: subject._id

                }

            }

        );

        linked += result.modifiedCount;

    }

    console.log("\n==========================");

    console.log("Subjects Created :", created);

    console.log("PYQs Linked      :", linked);

    console.log("==========================");

    process.exit();

}

run().catch(err => {

    console.error(err);

    process.exit(1);

});