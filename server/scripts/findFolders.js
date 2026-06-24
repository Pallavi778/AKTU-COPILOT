const axios = require("axios");

async function test() {
  const { data } = await axios.get(
    "https://www.abesit.in/library/question-paper-bank/?dir=18721"
  );

  const matches = data.match(/admin-ajax\.php/g);

  console.log("admin-ajax matches:", matches?.length || 0);

  const idx = data.indexOf("admin-ajax");

  if (idx !== -1) {
    console.log(data.substring(idx - 500, idx + 1500));
  }
}

test();