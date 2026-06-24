const axios = require("axios");
const cheerio = require("cheerio");

async function test() {
    try {
        const url = "https://www.abesit.in/library/question-paper-bank/?dir=18721";

        const { data } = await axios.get(url);

        const $ = cheerio.load(data);

        const papers = [];

        $(".is_file").each((i, el) => {
            const title = $(el).find("figcaption").text().trim();

            let link = $(el).find("a.file").attr("href");

            if (link) {
                // Fix HTML entities
                link = link.replace(/&#038;/g, "&");
            }

            if (title && link) {
                papers.push({ title, link });
            }
        });

        console.log(`Found ${papers.length} papers\n`);

        papers.slice(0, 5).forEach((paper, index) => {
            console.log(`${index + 1}. ${paper.title}`);
            console.log(paper.link);
            console.log("-------------------");
        });

    } catch (err) {
        console.error(err.message);
    }
}

test();