const axios = require("axios");

async function checkDir() {
  const url =
    "https://www.abesit.in/library/question-paper-bank/?dir=5079";

  const { data } = await axios.get(url);

  const matches = data.match(/dir=\d+/g);

  console.log("Found:");
  console.log([...new Set(matches || [])]);
}

checkDir();