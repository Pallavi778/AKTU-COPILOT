require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function count(folder) {
  let total = 0;
  let next;

  do {
    const res = await cloudinary.api.resources({
      resource_type: "raw",
      type: "upload",
      prefix: folder + "/",
      max_results: 500,
      next_cursor: next,
    });

    total += res.resources.length;
    next = res.next_cursor;
  } while (next);

  console.log(folder, ":", total);
}

(async () => {
  await count("aktu_pyq");
  await count("1228");
  await count("342");
})();