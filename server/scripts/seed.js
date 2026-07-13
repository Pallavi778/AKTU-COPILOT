const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Models
const Subject = require('../models/Subject');
const PYQ = require('../models/PYQ');
const Notes = require('../models/Notes');
const Scholarship = require('../models/Scholarship');
const Notice = require('../models/Notice');

// Load environment variables
dotenv.config();

// Ensure folders exist and write sample PDFs
const prepareDirectoriesAndFiles = () => {
  const pyqsDir = path.join(__dirname, '..', 'uploads', 'pyqs');
  const notesDir = path.join(__dirname, '..', 'uploads', 'notes');

  fs.mkdirSync(pyqsDir, { recursive: true });
  fs.mkdirSync(notesDir, { recursive: true });

  const dummyPdfText = `%PDF-1.4
1 0 obj
  << /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
  << /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
  << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>
endobj
4 0 obj
  << /Length 75 >>
stream
  BT
    /F1 12 Tf
    72 712 Td
    (AKTU Academic Copilot - Sample Academic Document) Tj
  ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000201 00000 n 
trailer
  << /Size 5 /Root 1 0 R >>
startxref
326
%%EOF`;

  fs.writeFileSync(path.join(pyqsDir, 'sample-ds-pyq-2023.pdf'), dummyPdfText);
  fs.writeFileSync(path.join(pyqsDir, 'sample-os-pyq-2022.pdf'), dummyPdfText);
  fs.writeFileSync(path.join(pyqsDir, 'sample-dbms-pyq-2023.pdf'), dummyPdfText);
  fs.writeFileSync(path.join(notesDir, 'sample-ds-notes-u1.pdf'), dummyPdfText);
  fs.writeFileSync(path.join(notesDir, 'sample-os-notes-u2.pdf'), dummyPdfText);

  console.log('Static mock PDF files successfully generated in uploads/ directory.');
};

const runSeeder = async () => {
  try {
    // 1. Connect to Database
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/aktu-copilot';
    await mongoose.connect(connStr);
    console.log(`Connected to database for seeding: ${connStr}`);

    // 2. Prepare folders & files
    prepareDirectoriesAndFiles();

    // 3. Clear existing collections
    await Subject.deleteMany();
    await PYQ.deleteMany();
    await Notes.deleteMany();
    // await Scholarship.deleteMany();
    await Notice.deleteMany();
    console.log('Existing DB collections wiped clean.');

    // Seed Subjects
    const subjectsList = [
      { name: 'Data Structures', code: 'KCS301', semester: 3, branch: 'Computer Science' },
      { name: 'Computer Organization & Architecture', code: 'KCS302', semester: 3, branch: 'Computer Science' },
      { name: 'Operating Systems', code: 'KCS401', semester: 4, branch: 'Computer Science' },
      { name: 'Theory of Automata & Formal Languages', code: 'KCS402', semester: 4, branch: 'Computer Science' },
      { name: 'Database Management Systems', code: 'KCS501', semester: 5, branch: 'Computer Science' },
      { name: 'Compiler Design', code: 'KCS502', semester: 5, branch: 'Computer Science' },
      { name: 'Software Engineering', code: 'KCS601', semester: 6, branch: 'Computer Science' },
      { name: 'Web Technology', code: 'KCS602', semester: 6, branch: 'Computer Science' },
    ];
    const seededSubjects = await Subject.insertMany(subjectsList);
    console.log(`Successfully seeded ${seededSubjects.length} subjects.`);

    const dsSubj = seededSubjects.find(s => s.code === 'KCS301');
    const osSubj = seededSubjects.find(s => s.code === 'KCS401');
    const dbmsSubj = seededSubjects.find(s => s.code === 'KCS501');

    // 5. Seed PYQs
    const pyqsList = [
      {
        title: 'Data Structures (2022-23) Semester Examination Paper',
        branch: 'Computer Science',
        semester: 3,
        subject: dsSubj._id,
        year: 2023,
        fileUrl: '/uploads/pyqs/sample-ds-pyq-2023.pdf',
      },
      {
        title: 'Operating Systems (2021-22) Semester Examination Paper',
        branch: 'Computer Science',
        semester: 4,
        subject: osSubj._id,
        year: 2022,
        fileUrl: '/uploads/pyqs/sample-os-pyq-2022.pdf',
      },
      {
        title: 'Database Management Systems (2022-23) Semester Examination Paper',
        branch: 'Computer Science',
        semester: 5,
        subject: dbmsSubj._id,
        year: 2023,
        fileUrl: '/uploads/pyqs/sample-dbms-pyq-2023.pdf',
      },
    ];
    const seededPYQs = await PYQ.insertMany(pyqsList);
    console.log(`Successfully seeded ${seededPYQs.length} Previous Year Papers.`);

    // 6. Seed Notes
    const notesList = [
      {
        title: 'Unit 1: Introduction to Data Structures & Array Representations',
        subject: dsSubj._id,
        semester: 3,
        branch: 'Computer Science',
        chapter: 'Unit 1 - Basics & Arrays',
        fileUrl: '/uploads/notes/sample-ds-notes-u1.pdf',
      },
      {
        title: 'Unit 2: Process Management & CPU Scheduling Algorithms',
        subject: osSubj._id,
        semester: 4,
        branch: 'Computer Science',
        chapter: 'Unit 2 - CPU Scheduling',
        fileUrl: '/uploads/notes/sample-os-notes-u2.pdf',
      },
    ];
    const seededNotes = await Notes.insertMany(notesList);
    console.log(`Successfully seeded ${seededNotes.length} notes documents.`);

    // 7. Seed Scholarships
    const scholarshipsList = [
      {
        title: 'UP Post-Matric Scholarship Scheme 2026',
        eligibility: 'AKTU enrolled students, UP domicile, Family income < Rs. 2.5 LPA (SC/ST) or < Rs. 2.0 LPA (General/OBC/Minority)',
        note: 'Check official website for latest deadline and updates',
        applicationLink: 'https://scholarship.up.gov.in',
      },
      {
        title: 'National Scholarship Portal (NSP) - Central Sector Scheme',
        eligibility: 'Top 20th percentile college students, standard graduate course, family income < Rs. 4.5 LPA',
        note: 'Check official website for latest deadline and updates',
        applicationLink: 'https://scholarships.gov.in',
      },
      {
        title: 'Pragati Scholarship Scheme for Girl Students',
        eligibility: 'Female students admitted to B.Tech 1st year (or lateral entry), family income < Rs. 8 LPA',
        category: "Female",
        note: 'Check official website for latest deadline and updates',
        applicationLink: 'https://scholarships.gov.in',
      },
      {
    title: "Saksham Scholarship (AICTE)",
    eligibility:
      "Specially-abled students, family income < 8 LPA, BTech/Diploma",
    note: 'Check official website for latest deadline and updates',
    applicationLink: "https://www.aicte-saksham-gov.in/",
  },
    ];
    const seededScholarships = await Scholarship.insertMany(scholarshipsList);
    console.log(`Successfully seeded ${seededScholarships.length} scholarships.`);

    // 8. Seed Notices
    const noticesList = [
      {
        title: 'Regarding Online Submission of Examination Form (Even Semester 2025-26)',
        description: 'All regular and carry-over students are hereby informed that the portal for exam form filling will remain open from June 10, 2026, to June 25, 2026. Please complete the process and pay the examination fee in time to avoid penalty charges.',
        publishDate: new Date('2026-06-05'),
        link: 'https://aktu.ac.in/circulars.html',
      },
      {
        title: 'Declaration of B.Tech 8th Semester Theory Results (Regular Exams 2025-26)',
        description: 'AKTU has declared the regular theory examination results for B.Tech Final Year (8th Semester). Students can access their results on the AKTU OneView portal using their university roll numbers.',
        publishDate: new Date('2026-06-02'),
        link: 'https://oneview.aktu.ac.in',
      },
      {
        title: 'Circular Regarding Digitally Evaluated Answer Sheet Challenge Valuation',
        description: 'Guidelines for challenge valuation of answer sheets of B.Tech Odd Semester exams are released. Students can submit their application online through ERP portal within 30 days of this notice.',
        publishDate: new Date('2026-05-28'),
        link: 'https://aktu.ac.in/circulars.html',
      },
    ];
    const seededNotices = await Notice.insertMany(noticesList);
    console.log(`Successfully seeded ${seededNotices.length} notices.`);

    console.log('Database seeding successfully finished.');
    process.exit(0);
  } catch (error) {
    console.error(`Database seeding failed: ${error.message}`);
    process.exit(1);
  }
};

runSeeder();
