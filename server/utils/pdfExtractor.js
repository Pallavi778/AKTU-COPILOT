const axios = require("axios");
const pdf = require("pdf-parse");

const extractPDFText = async (fileUrl) => {
    try {
        console.log(fileUrl);

        const response = await axios.get(fileUrl, {
            responseType: "arraybuffer",
        });

        const data = await pdf(response.data);

        return data.text;

    } catch (error) {
        console.error("Error extracting PDF:", error);
        throw error;
    }
};

module.exports = { extractPDFText };