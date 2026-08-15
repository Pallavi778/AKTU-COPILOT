require("dotenv").config();
const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary");
const Pyq = require("../models/Pyq");

mongoose.connect(process.env.MONGO_URI);

async function fixUrls() {
    try {
        // const papers = await Pyq.find();
        const papers = await Pyq.find().limit(5);

        console.log(`Found ${papers.length} papers`);

        let updated = 0;

        for (const paper of papers) {

            try {

                const result = await cloudinary.api.resource(
                    paper.publicId,
                    {
                        resource_type: "raw"
                    }
                );

                paper.fileUrl = result.secure_url;

                await paper.save();

                updated++;

                console.log(`${updated}. Updated ${paper.title}`);

            } catch (err) {

                console.log(`Couldn't find ${paper.publicId}`);

            }

        }

        console.log("Done!");

    } catch (err) {
        console.error(err);
    }

    mongoose.disconnect();
}

fixUrls();