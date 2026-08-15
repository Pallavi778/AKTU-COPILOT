// const Subject = require("../models/Subject");
// const Pyq = require("../models/Pyq");
// const { generateContent } = require("../services/aiService");
// const { extractPDFText } = require("../utils/pdfExtractor");

// /*
// |--------------------------------------------------------------------------
// | NORMALIZE TEXT
// |--------------------------------------------------------------------------
// | Converts different ways of writing the same subject into a comparable
// | format.
// |
// | Example:
// | "Design & Analysis of Algorithms"
// | "Design and Analysis Of Algorithm"
// |
// | become roughly:
// | "design analysis algorithms"
// |--------------------------------------------------------------------------
// */

// const normalizeText = (text = "") => {
//     return text
//         .toString()
//         .toLowerCase()
//         .normalize("NFKD")
//         .replace(/[\u0300-\u036f]/g, "")
//         .replace(/&/g, " and ")
//         .replace(/[^a-z0-9\s]/g, " ")
//         .replace(/\b(and|of|the|for|in|on|a|an)\b/g, " ")
//         .replace(/\s+/g, " ")
//         .trim();
// };


// /*
// |--------------------------------------------------------------------------
// | GET WORDS
// |--------------------------------------------------------------------------
// */

// const getWords = (text = "") => {
//     return normalizeText(text)
//         .split(" ")
//         .filter(Boolean);
// };


// /*
// |--------------------------------------------------------------------------
// | CREATE ACRONYM
// |--------------------------------------------------------------------------
// |
// | Design and Analysis of Algorithms
// |        ↓
// | DAA
// |
// |--------------------------------------------------------------------------
// */

// const getAcronym = (text = "") => {
//     return getWords(text)
//         .map(word => word[0])
//         .join("");
// };


// /*
// |--------------------------------------------------------------------------
// | LEVENSHTEIN DISTANCE
// |--------------------------------------------------------------------------
// | Used for small spelling differences.
// |
// | Example:
// | algorithm
// | algorithms
// |
// | are considered very similar.
// |--------------------------------------------------------------------------
// */

// const levenshteinDistance = (a = "", b = "") => {
//     const matrix = Array.from(
//         { length: a.length + 1 },
//         () => Array(b.length + 1).fill(0)
//     );

//     for (let i = 0; i <= a.length; i++) {
//         matrix[i][0] = i;
//     }

//     for (let j = 0; j <= b.length; j++) {
//         matrix[0][j] = j;
//     }

//     for (let i = 1; i <= a.length; i++) {
//         for (let j = 1; j <= b.length; j++) {

//             const cost = a[i - 1] === b[j - 1] ? 0 : 1;

//             matrix[i][j] = Math.min(
//                 matrix[i - 1][j] + 1,
//                 matrix[i][j - 1] + 1,
//                 matrix[i - 1][j - 1] + cost
//             );
//         }
//     }

//     return matrix[a.length][b.length];
// };


// /*
// |--------------------------------------------------------------------------
// | SIMILARITY SCORE
// |--------------------------------------------------------------------------
// */

// const similarity = (a = "", b = "") => {

//     const first = normalizeText(a);
//     const second = normalizeText(b);

//     if (!first || !second) {
//         return 0;
//     }

//     if (first === second) {
//         return 1;
//     }

//     /*
//     |--------------------------------------------------------------------------
//     | Direct contains match
//     |--------------------------------------------------------------------------
//     */

//     if (first.includes(second) || second.includes(first)) {
//         return 0.95;
//     }

//     /*
//     |--------------------------------------------------------------------------
//     | Acronym match
//     |--------------------------------------------------------------------------
//     */

//     const firstAcronym = getAcronym(a);
//     const secondAcronym = getAcronym(b);

//     if (
//         first.length <= 6 &&
//         first === secondAcronym
//     ) {
//         return 0.98;
//     }

//     if (
//         second.length <= 6 &&
//         second === firstAcronym
//     ) {
//         return 0.98;
//     }

//     /*
//     |--------------------------------------------------------------------------
//     | Token overlap
//     |--------------------------------------------------------------------------
//     */

//     const firstWords = [...new Set(getWords(a))];
//     const secondWords = [...new Set(getWords(b))];

//     const commonWords = firstWords.filter(word =>
//         secondWords.includes(word)
//     );

//     const tokenScore =
//         commonWords.length /
//         Math.max(firstWords.length, secondWords.length);

//     /*
//     |--------------------------------------------------------------------------
//     | Overall spelling similarity
//     |--------------------------------------------------------------------------
//     */

//     const maxLength = Math.max(first.length, second.length);

//     const distance = levenshteinDistance(first, second);

//     const spellingScore =
//         maxLength === 0
//             ? 0
//             : 1 - distance / maxLength;

//     return Math.max(tokenScore, spellingScore);
// };


// /*
// |--------------------------------------------------------------------------
// | FIND BEST SUBJECT
// |--------------------------------------------------------------------------
// */

// const findBestSubject = async (subjectName) => {

//     const subjects = await Subject.find({})
//     .select("name code")
//     .lean();

//     if (!subjects.length) {
//         return null;
//     }

//     let bestSubject = null;
//     let bestScore = 0;

//     for (const subject of subjects) {

//         if (!subject.name) {
//             continue;
//         }

//         /*
//         |--------------------------------------------------------------------------
//         | Exact code match
//         |--------------------------------------------------------------------------
//         */

//         if (
//             subject.code &&
//             normalizeText(subject.code) === normalizeText(subjectName)
//         ) {
//             return subject;
//         }

//         /*
//         |--------------------------------------------------------------------------
//         | Name similarity
//         |--------------------------------------------------------------------------
//         */

//         const score = similarity(
//             subjectName,
//             subject.name
//         );

//         if (score > bestScore) {
//             bestScore = score;
//             bestSubject = subject;
//         }
//     }

//     /*
//     |--------------------------------------------------------------------------
//     | Require a reasonable match.
//     |--------------------------------------------------------------------------
//     */

//     if (bestScore >= 0.45) {
//         console.log(
//             "BEST SUBJECT:",
//             bestSubject,
//             "SCORE:",
//             bestScore
//         );

//         return bestSubject;
//     }

//     return null;
// };


// /*
// |--------------------------------------------------------------------------
// | FIND PYQs USING SUBJECT NAME
// |--------------------------------------------------------------------------
// | This is the important fallback.
// |
// | Even if Subject collection doesn't contain the subject,
// | the PYQ collection may still contain the papers.
// |--------------------------------------------------------------------------
// */

// const findPyqsBySubjectName = async (subjectName) => {

//     const pyqs = await Pyq.find({})
//         .select("title subjectCode fileUrl semester year")
//         .lean();

//     const matched = [];

//     for (const pyq of pyqs) {

//         const title = pyq.title || "";
//         const code = pyq.subjectCode || "";

//         const titleScore = similarity(
//             subjectName,
//             title
//         );

//         const codeScore = similarity(
//             subjectName,
//             code
//         );

//         const score = Math.max(
//             titleScore,
//             codeScore
//         );

//         /*
//         |--------------------------------------------------------------------------
//         | Keep reasonably matching papers.
//         |--------------------------------------------------------------------------
//         */

//         if (score >= 0.40) {
//             matched.push({
//                 ...pyq,
//                 matchScore: score
//             });
//         }
//     }

//     /*
//     |--------------------------------------------------------------------------
//     | Highest matching papers first
//     |--------------------------------------------------------------------------
//     */

//     matched.sort(
//         (a, b) => b.matchScore - a.matchScore
//     );

//     return matched;
// };


// /*
// |--------------------------------------------------------------------------
// | MAIN PREDICT FUNCTION
// |--------------------------------------------------------------------------
// */

// const predict = async (req, res) => {

//     try {

//         /*
//         |--------------------------------------------------------------------------
//         | 1. Get subject from frontend
//         |--------------------------------------------------------------------------
//         */

//         const { subject_name } = req.body;

//         console.log(
//             "SUBJECT RECEIVED:",
//             subject_name
//         );

//         if (!subject_name || !subject_name.trim()) {

//             return res.status(400).json({
//                 success: false,
//                 message: "Please enter a subject name"
//             });
//         }

//         const cleanSubjectName =
//             subject_name.trim();


//         /*
//         |--------------------------------------------------------------------------
//         | 2. Try finding subject in Subject collection
//         |--------------------------------------------------------------------------
//         */

//         const subject =
//             await findBestSubject(
//                 cleanSubjectName
//             );

//         console.log(
//             "MATCHING SUBJECT:",
//             subject
//         );


//         /*
//         |--------------------------------------------------------------------------
//         | 3. Find PYQs
//         |--------------------------------------------------------------------------
//         */

//         let pyqs = [];


//         /*
//         |--------------------------------------------------------------------------
//         | CASE A:
//         | Subject exists
//         |--------------------------------------------------------------------------
//         */

//         if (subject) {

//             pyqs = await Pyq.find({
//     subjectCode: subject.code,
//     year: { $gte: "2023" }
// })
//                 .select(
//                     "title subjectCode fileUrl semester year"
//                 )
//                 .lean();

//             console.log(
//                 "PYQs FOUND USING SUBJECT CODE:",
//                 pyqs.length
//             );
//         }
//         /*
//         |--------------------------------------------------------------------------
//         | CASE B:
//         | Subject collection didn't match OR no PYQs found.
//         |
//         | Search directly inside PYQ titles.
//         |--------------------------------------------------------------------------
//         */

        


//         /*
//         |--------------------------------------------------------------------------
//         | 4. No PYQs found
//         |--------------------------------------------------------------------------
//         */

//         if (!pyqs.length) {

//             return res.status(404).json({
//                 success: false,
//                 message:
//                     `No previous year papers found for "${cleanSubjectName}".`
//             });
//         }


//         /*
//         |--------------------------------------------------------------------------
//         | 5. Remove duplicate papers
//         |--------------------------------------------------------------------------
//         */

//         const uniquePyqs = [];

//         const seen = new Set();

//         for (const pyq of pyqs) {

//             const key =
//                 pyq.fileUrl ||
//                 `${pyq.title}-${pyq.year}`;

//             if (!seen.has(key)) {

//                 seen.add(key);

//                 uniquePyqs.push(pyq);
//             }
//         }


//         /*
//         |--------------------------------------------------------------------------
//         | 6. Extract text from every PDF
//         |--------------------------------------------------------------------------
//         */

//         let allQuestions = "";

//         console.log(
//             "Number of papers:",
//             uniquePyqs.length
//         );


//         /*
//         |--------------------------------------------------------------------------
//         | Extract PDFs in parallel
//         |--------------------------------------------------------------------------
//         */

//         const extractedPapers =
//             await Promise.all(

//                 uniquePyqs.map(
//                     async (pyq, index) => {

//                         try {

//                             console.log(
//                                 `Extracting paper ${index + 1}/${uniquePyqs.length}:`,
//                                 pyq.title
//                             );

//                             const text =
//                                 await extractPDFText(
//                                     pyq.fileUrl
//                                 );

//                             return `
// ----------------------------------------
// QUESTION PAPER ${index + 1}
// Title: ${pyq.title || "Unknown"}
// Year: ${pyq.year || "Unknown"}
// Subject Code: ${pyq.subjectCode || "Unknown"}
// ----------------------------------------

// ${text}
// `;

//                         } catch (error) {

//                             console.error(
//                                 `Failed to extract PDF: ${pyq.title}`,
//                                 error.message
//                             );

//                             return "";
//                         }
//                     }
//                 )
//             );


//         allQuestions =
//             extractedPapers
//                 .filter(Boolean)
//                 .join("\n\n");


//         /*
//         |--------------------------------------------------------------------------
//         | 7. Make sure we actually extracted something
//         |--------------------------------------------------------------------------
//         */

//         if (!allQuestions.trim()) {

//             return res.status(500).json({
//                 success: false,
//                 message:
//                     "Could not extract text from the available question papers."
//             });
//         }


//         /*
//         |--------------------------------------------------------------------------
//         | 8. Create AI prompt
//         |--------------------------------------------------------------------------
//         */

//         const prompt = `
// You are an AKTU Examination Expert.

// You are analyzing previous year question papers for:

// SUBJECT:
// ${cleanSubjectName}

// Your task is to analyze ONLY the supplied previous year question papers and identify repeated patterns, important topics, and likely questions for the next examination.

// IMPORTANT RULES:

// 1. Base your analysis ONLY on the supplied question papers.
// 2. Do not invent questions unrelated to the papers.
// 3. Do not use outside knowledge.
// 4. Give higher importance to topics/questions that appear repeatedly.
// 5. Clearly distinguish repeated topics from predicted questions.
// 6. Do not mention that these predictions are guaranteed.
// 7. Do not include unnecessary introductory text.
// 8. Keep the response structured and easy for a student to read.
// 9. Use proper Markdown headings, numbered lists and bullet points.
// 10. Return ONLY the following sections.

// # Most Repeated Topics

// Identify the topics that appear repeatedly across the supplied papers.

// For each topic, briefly explain why it is important based on the papers.

// # Frequently Asked Long Questions

// List the major long-answer questions or question patterns that repeatedly appear.

// # Frequently Asked Short Questions

// List important short-answer questions or concepts that repeatedly appear.

// # Predicted Questions for Next Exam

// Based ONLY on repetition and patterns in the supplied papers, provide the most likely questions/topics for the next examination.

// Organize them clearly.

// # Confidence Score

// Give an overall confidence percentage based on how strongly the supplied papers support the prediction.

// Also briefly explain why the confidence is high, medium, or low.

// QUESTION PAPERS:

// ${allQuestions}
// `;


//         /*
//         |--------------------------------------------------------------------------
//         | 9. Log prompt information
//         |--------------------------------------------------------------------------
//         */

//         console.log(
//             "Prompt length:",
//             prompt.length
//         );

//         console.log(
//             "Number of papers sent to AI:",
//             uniquePyqs.length
//         );


//         /*
//         |--------------------------------------------------------------------------
//         | 10. Generate prediction
//         |--------------------------------------------------------------------------
//         */

//         const prediction =
//             await generateContent(prompt);


//         console.log(
//             "After generateContent"
//         );

//         console.log(
//             "Prediction type:",
//             typeof prediction
//         );


//         /*
//         |--------------------------------------------------------------------------
//         | 11. Return prediction
//         |--------------------------------------------------------------------------
//         */

//         return res.json({
//             success: true,
//             subject: cleanSubjectName,
//             papersAnalyzed: uniquePyqs.length,
//             prediction
//         });


//     } catch (err) {

//         console.error(
//             "AI PREDICT ERROR:",
//             err
//         );

//         return res.status(500).json({
//             success: false,
//             message:
//                 err.message ||
//                 "Failed to generate prediction"
//         });
//     }
// };


// module.exports = {
//     predict
// };


const Subject = require("../models/Subject");
const Pyq = require("../models/Pyq");
const { generateContent } = require("../services/aiService");
const { extractPDFText } = require("../utils/pdfExtractor");

/*
|--------------------------------------------------------------------------
| NORMALIZE TEXT
|--------------------------------------------------------------------------
| Converts different ways of writing the same subject into a comparable
| format.
|
| Example:
| "Design & Analysis of Algorithms"
| "Design and Analysis Of Algorithm"
|
| become roughly:
| "design analysis algorithms"
|--------------------------------------------------------------------------
*/

const normalizeText = (text = "") => {
    return text
        .toString()
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/&/g, " and ")
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\b(and|of|the|for|in|on|a|an)\b/g, " ")
        .replace(/\s+/g, " ")
        .trim();
};


/*
|--------------------------------------------------------------------------
| GET WORDS
|--------------------------------------------------------------------------
*/

const getWords = (text = "") => {
    return normalizeText(text)
        .split(" ")
        .filter(Boolean);
};


/*
|--------------------------------------------------------------------------
| CREATE ACRONYM
|--------------------------------------------------------------------------
|
| Design and Analysis of Algorithms
|        ↓
| DAA
|
|--------------------------------------------------------------------------
*/

const getAcronym = (text = "") => {
    return getWords(text)
        .map(word => word[0])
        .join("");
};


/*
|--------------------------------------------------------------------------
| LEVENSHTEIN DISTANCE
|--------------------------------------------------------------------------
| Used for small spelling differences.
|
| Example:
| algorithm
| algorithms
|
| are considered very similar.
|--------------------------------------------------------------------------
*/

const levenshteinDistance = (a = "", b = "") => {
    const matrix = Array.from(
        { length: a.length + 1 },
        () => Array(b.length + 1).fill(0)
    );

    for (let i = 0; i <= a.length; i++) {
        matrix[i][0] = i;
    }

    for (let j = 0; j <= b.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {

            const cost = a[i - 1] === b[j - 1] ? 0 : 1;

            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + cost
            );
        }
    }

    return matrix[a.length][b.length];
};


/*
|--------------------------------------------------------------------------
| SIMILARITY SCORE
|--------------------------------------------------------------------------
*/

const similarity = (a = "", b = "") => {

    const first = normalizeText(a);
    const second = normalizeText(b);

    if (!first || !second) {
        return 0;
    }

    if (first === second) {
        return 1;
    }

    /*
    |--------------------------------------------------------------------------
    | Direct contains match
    |--------------------------------------------------------------------------
    */

    if (first.includes(second) || second.includes(first)) {
        return 0.95;
    }

    /*
    |--------------------------------------------------------------------------
    | Acronym match
    |--------------------------------------------------------------------------
    */

    const firstAcronym = getAcronym(a);
    const secondAcronym = getAcronym(b);

    if (
        first.length <= 6 &&
        first === secondAcronym
    ) {
        return 0.98;
    }

    if (
        second.length <= 6 &&
        second === firstAcronym
    ) {
        return 0.98;
    }

    /*
    |--------------------------------------------------------------------------
    | Token overlap
    |--------------------------------------------------------------------------
    */

    const firstWords = [...new Set(getWords(a))];
    const secondWords = [...new Set(getWords(b))];

    const commonWords = firstWords.filter(word =>
        secondWords.includes(word)
    );

    const tokenScore =
        commonWords.length /
        Math.max(firstWords.length, secondWords.length);

    /*
    |--------------------------------------------------------------------------
    | Overall spelling similarity
    |--------------------------------------------------------------------------
    */

    const maxLength = Math.max(first.length, second.length);

    const distance = levenshteinDistance(first, second);

    const spellingScore =
        maxLength === 0
            ? 0
            : 1 - distance / maxLength;

    return Math.max(tokenScore, spellingScore);
};


/*
|--------------------------------------------------------------------------
| YEAR HELPERS
|--------------------------------------------------------------------------
| Years in the DB might be stored as numbers, clean strings ("2023"),
| or messy strings ("2023-24", "23", " 2023 "). This pulls out the first
| 4-digit year it can find and compares numerically, so filtering is
| reliable no matter how the data was entered.
|--------------------------------------------------------------------------
*/

const MIN_YEAR = 2023;

const extractYear = (value) => {

    if (value === undefined || value === null) {
        return null;
    }

    const match = value.toString().match(/\d{4}/);

    if (!match) {
        return null;
    }

    return parseInt(match[0], 10);
};

const isYearAllowed = (value) => {
    const year = extractYear(value);
    return year !== null && year >= MIN_YEAR;
};


/*
|--------------------------------------------------------------------------
| FIND BEST SUBJECT
|--------------------------------------------------------------------------
*/

const findBestSubject = async (subjectName) => {

    const subjects = await Subject.find({})
    .select("name code")
    .lean();

    if (!subjects.length) {
        return null;
    }

    let bestSubject = null;
    let bestScore = 0;

    for (const subject of subjects) {

        if (!subject.name) {
            continue;
        }

        /*
        |--------------------------------------------------------------------------
        | Exact code match
        |--------------------------------------------------------------------------
        */

        if (
            subject.code &&
            normalizeText(subject.code) === normalizeText(subjectName)
        ) {
            return subject;
        }

        /*
        |--------------------------------------------------------------------------
        | Name similarity
        |--------------------------------------------------------------------------
        */

        const score = similarity(
            subjectName,
            subject.name
        );

        if (score > bestScore) {
            bestScore = score;
            bestSubject = subject;
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Require a reasonable match.
    |--------------------------------------------------------------------------
    */

    if (bestScore >= 0.45) {
        console.log(
            "BEST SUBJECT:",
            bestSubject,
            "SCORE:",
            bestScore
        );

        return bestSubject;
    }

    return null;
};


/*
|--------------------------------------------------------------------------
| FIND PYQs USING SUBJECT NAME
|--------------------------------------------------------------------------
| This is the important fallback.
|
| Even if Subject collection doesn't contain the subject,
| the PYQ collection may still contain the papers.
|--------------------------------------------------------------------------
*/

const findPyqsBySubjectName = async (subjectName) => {

    const pyqs = await Pyq.find({})
        .select("title subjectCode fileUrl semester year")
        .lean();

    const matched = [];

    for (const pyq of pyqs) {

        /*
        |--------------------------------------------------------------------------
        | Only keep 2023+ papers.
        |--------------------------------------------------------------------------
        */

        if (!isYearAllowed(pyq.year)) {
            continue;
        }

        const title = pyq.title || "";
        const code = pyq.subjectCode || "";

        const titleScore = similarity(
            subjectName,
            title
        );

        const codeScore = similarity(
            subjectName,
            code
        );

        const score = Math.max(
            titleScore,
            codeScore
        );

        /*
        |--------------------------------------------------------------------------
        | Keep reasonably matching papers.
        |--------------------------------------------------------------------------
        */

        if (score >= 0.40) {
            matched.push({
                ...pyq,
                matchScore: score
            });
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Highest matching papers first
    |--------------------------------------------------------------------------
    */

    matched.sort(
        (a, b) => b.matchScore - a.matchScore
    );

    return matched;
};


/*
|--------------------------------------------------------------------------
| MAIN PREDICT FUNCTION
|--------------------------------------------------------------------------
*/

const predict = async (req, res) => {

    try {

        /*
        |--------------------------------------------------------------------------
        | 1. Get subject from frontend
        |--------------------------------------------------------------------------
        */

        const { subject_name } = req.body;

        console.log(
            "SUBJECT RECEIVED:",
            subject_name
        );

        if (!subject_name || !subject_name.trim()) {

            return res.status(400).json({
                success: false,
                message: "Please enter a subject name"
            });
        }

        const cleanSubjectName =
            subject_name.trim();


        /*
        |--------------------------------------------------------------------------
        | 2. Try finding subject in Subject collection
        |--------------------------------------------------------------------------
        */

        const subject =
            await findBestSubject(
                cleanSubjectName
            );

        console.log(
            "MATCHING SUBJECT:",
            subject
        );


        /*
        |--------------------------------------------------------------------------
        | 3. Find PYQs
        |--------------------------------------------------------------------------
        */

        let pyqs = [];


        /*
        |--------------------------------------------------------------------------
        | CASE A:
        | Subject exists in the Subject collection - filter by its code.
        | Year filtering is done in JS (not in the Mongo query) because
        | "year" may not be a clean 4-digit string in every document.
        |--------------------------------------------------------------------------
        */

        if (subject && subject.code) {

            const byCode = await Pyq.find({
                subjectCode: subject.code
            })
                .select(
                    "title subjectCode fileUrl semester year"
                )
                .lean();

            pyqs = byCode.filter(pyq => isYearAllowed(pyq.year));

            console.log(
                "PYQs FOUND USING SUBJECT CODE (2023+):",
                pyqs.length
            );
        }

        /*
        |--------------------------------------------------------------------------
        | CASE B:
        | Subject collection didn't match, OR the subject code lookup
        | returned nothing. Fall back to searching directly inside PYQ
        | titles/codes.
        |--------------------------------------------------------------------------
        */

        if (!pyqs.length) {

            console.log(
                "Falling back to direct PYQ title/code search"
            );

            pyqs = await findPyqsBySubjectName(cleanSubjectName);

            console.log(
                "PYQs FOUND USING FALLBACK SEARCH (2023+):",
                pyqs.length
            );
        }


        /*
        |--------------------------------------------------------------------------
        | 4. No PYQs found
        |--------------------------------------------------------------------------
        */

        if (!pyqs.length) {

            return res.status(404).json({
                success: false,
                message:
                    `No previous year papers found for "${cleanSubjectName}" from 2023 onwards.`
            });
        }


        /*
        |--------------------------------------------------------------------------
        | 5. Remove duplicate papers
        |--------------------------------------------------------------------------
        */

        const uniquePyqs = [];

        const seen = new Set();

        for (const pyq of pyqs) {

            const key =
                pyq.fileUrl ||
                `${pyq.title}-${pyq.year}`;

            if (!seen.has(key)) {

                seen.add(key);

                uniquePyqs.push(pyq);
            }
        }


        /*
        |--------------------------------------------------------------------------
        | 6. Extract text from every PDF
        |--------------------------------------------------------------------------
        */

        let allQuestions = "";

        console.log(
            "Number of papers:",
            uniquePyqs.length
        );


        /*
        |--------------------------------------------------------------------------
        | Extract PDFs in parallel
        |--------------------------------------------------------------------------
        */

        const extractedPapers =
            await Promise.all(

                uniquePyqs.map(
                    async (pyq, index) => {

                        try {

                            console.log(
                                `Extracting paper ${index + 1}/${uniquePyqs.length}:`,
                                pyq.title
                            );

                            const text =
                                await extractPDFText(
                                    pyq.fileUrl
                                );

                            return `
----------------------------------------
QUESTION PAPER ${index + 1}
Title: ${pyq.title || "Unknown"}
Year: ${pyq.year || "Unknown"}
Subject Code: ${pyq.subjectCode || "Unknown"}
----------------------------------------

${text}
`;

                        } catch (error) {

                            console.error(
                                `Failed to extract PDF: ${pyq.title}`,
                                error.message
                            );

                            return "";
                        }
                    }
                )
            );


        allQuestions =
            extractedPapers
                .filter(Boolean)
                .join("\n\n");


        /*
        |--------------------------------------------------------------------------
        | 7. Make sure we actually extracted something
        |--------------------------------------------------------------------------
        */

        if (!allQuestions.trim()) {

            return res.status(500).json({
                success: false,
                message:
                    "Could not extract text from the available question papers."
            });
        }


        /*
        |--------------------------------------------------------------------------
        | 8. Create AI prompt
        |--------------------------------------------------------------------------
        */

        const prompt = `
You are an AKTU Examination Expert.

You are analyzing previous year question papers for:

SUBJECT:
${cleanSubjectName}

Your task is to analyze ONLY the supplied previous year question papers (2023 onwards) and identify repeated patterns, important topics, and likely questions for the next examination.

IMPORTANT RULES:

1. Base your analysis ONLY on the supplied question papers.
2. Do not invent questions unrelated to the papers.
3. Do not use outside knowledge.
4. Give higher importance to topics/questions that appear repeatedly.
5. Clearly distinguish repeated topics from predicted questions.
6. Do not mention that these predictions are guaranteed.
7. Do not include unnecessary introductory text.
8. Keep the response structured and easy for a student to read.
9. Use proper Markdown headings, numbered lists and bullet points.
10. Return ONLY the following sections.

# Most Repeated Topics

Identify the topics that appear repeatedly across the supplied papers.

For each topic, briefly explain why it is important based on the papers.

# Frequently Asked Long Questions

List the major long-answer questions or question patterns that repeatedly appear.

# Frequently Asked Short Questions

List important short-answer questions or concepts that repeatedly appear.

# Predicted Questions for Next Exam

Based ONLY on repetition and patterns in the supplied papers, provide the most likely questions/topics for the next examination.

Organize them clearly.

# Confidence Score

Give an overall confidence percentage based on how strongly the supplied papers support the prediction.

Also briefly explain why the confidence is high, medium, or low.

QUESTION PAPERS:

${allQuestions}
`;


        /*
        |--------------------------------------------------------------------------
        | 9. Log prompt information
        |--------------------------------------------------------------------------
        */

        console.log(
            "Prompt length:",
            prompt.length
        );

        console.log(
            "Number of papers sent to AI:",
            uniquePyqs.length
        );


        /*
        |--------------------------------------------------------------------------
        | 10. Generate prediction
        |--------------------------------------------------------------------------
        */

        const prediction =
            await generateContent(prompt);


        console.log(
            "After generateContent"
        );

        console.log(
            "Prediction type:",
            typeof prediction
        );


        /*
        |--------------------------------------------------------------------------
        | 11. Return prediction
        |--------------------------------------------------------------------------
        */

        return res.json({
            success: true,
            subject: cleanSubjectName,
            papersAnalyzed: uniquePyqs.length,
            prediction
        });


    } catch (err) {

        console.error(
            "AI PREDICT ERROR:",
            err
        );

        return res.status(500).json({
            success: false,
            message:
                err.message ||
                "Failed to generate prediction"
        });
    }
};


module.exports = {
    predict
};