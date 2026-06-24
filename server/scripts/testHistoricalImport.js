const axios = require("axios");
const cheerio = require("cheerio");

async function run() {
  const dir = 18352;

  const { data } = await axios.get(
    `https://www.abesit.in/library/question-paper-bank/?dir=${dir}`
  );

  const $ = cheerio.load(data);

  let count = 0;

  $("a[href*='wpdocs_dl']").each((i, el) => {
    if (count >= 20) return;

    const href = $(el).attr("href");

    let title =
      $(el).closest(".file_view").find("figcaption").text().trim();

    if (!title) {
      title = $(el).parent().text().trim();
    }

    console.log(title);
    console.log(href);
    console.log("----------------");

    count++;
  });
}

run();