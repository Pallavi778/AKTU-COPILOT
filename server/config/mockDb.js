const mockSubjects = [
  { _id: 'sub_1', name: 'Data Structures', code: 'KCS301', semester: 3, branch: 'Computer Science' },
  { _id: 'sub_2', name: 'Computer Organization & Architecture', code: 'KCS302', semester: 3, branch: 'Computer Science' },
  { _id: 'sub_3', name: 'Operating Systems', code: 'KCS401', semester: 4, branch: 'Computer Science' },
  { _id: 'sub_4', name: 'Theory of Automata & Formal Languages', code: 'KCS402', semester: 4, branch: 'Computer Science' },
  { _id: 'sub_5', name: 'Database Management Systems', code: 'KCS501', semester: 5, branch: 'Computer Science' },
  { _id: 'sub_6', name: 'Compiler Design', code: 'KCS502', semester: 5, branch: 'Computer Science' },
  { _id: 'sub_7', name: 'Software Engineering', code: 'KCS601', semester: 6, branch: 'Computer Science' },
  { _id: 'sub_8', name: 'Web Technology', code: 'KCS602', semester: 6, branch: 'Computer Science' },
];

const mockPYQs = [
  {
    _id: 'pyq_1',
    title: 'Data Structures (2022-23) Semester Examination Paper',
    branch: 'Computer Science',
    semester: 3,
    subject: mockSubjects[0], // KCS301 object
    year: 2023,
    fileUrl: '/uploads/pyqs/sample-ds-pyq-2023.pdf',
    uploadedBy: { name: 'Academic Seeder' },
  },
  {
    _id: 'pyq_2',
    title: 'Operating Systems (2021-22) Semester Examination Paper',
    branch: 'Computer Science',
    semester: 4,
    subject: mockSubjects[2], // KCS401 object
    year: 2022,
    fileUrl: '/uploads/pyqs/sample-os-pyq-2022.pdf',
    uploadedBy: { name: 'Academic Seeder' },
  },
  {
    _id: 'pyq_3',
    title: 'Database Management Systems (2022-23) Semester Examination Paper',
    branch: 'Computer Science',
    semester: 5,
    subject: mockSubjects[4], // KCS501 object
    year: 2023,
    fileUrl: '/uploads/pyqs/sample-dbms-pyq-2023.pdf',
    uploadedBy: { name: 'Academic Seeder' },
  },
];

const mockNotes = [
  {
    _id: 'note_1',
    title: 'Unit 1: Introduction to Data Structures & Array Representations',
    subject: mockSubjects[0],
    semester: 3,
    branch: 'Computer Science',
    chapter: 'Unit 1 - Basics & Arrays',
    fileUrl: '/uploads/notes/sample-ds-notes-u1.pdf',
    uploadedBy: { name: 'Academic Seeder' },
  },
  {
    _id: 'note_2',
    title: 'Unit 2: Process Management & CPU Scheduling Algorithms',
    subject: mockSubjects[2],
    semester: 4,
    branch: 'Computer Science',
    chapter: 'Unit 2 - CPU Scheduling',
    fileUrl: '/uploads/notes/sample-os-notes-u2.pdf',
    uploadedBy: { name: 'Academic Seeder' },
  },
];

const mockScholarships = [
  {
    _id: 'sch_1',
    title: 'UP Post-Matric Scholarship Scheme 2026',
    eligibility: 'AKTU enrolled students, UP domicile, Family income < Rs. 2.5 LPA (SC/ST) or < Rs. 2.0 LPA (General/OBC/Minority)',
    lastDate: new Date('2026-10-31'),
    applicationLink: 'https://scholarship.up.gov.in',
  },
  {
    _id: 'sch_2',
    title: 'National Scholarship Portal (NSP) - Central Sector Scheme',
    eligibility: 'Top 20th percentile college students, standard graduate course, family income < Rs. 4.5 LPA',
    lastDate: new Date('2026-11-15'),
    applicationLink: 'https://scholarships.gov.in',
  },
  {
    _id: 'sch_3',
    title: 'Pragati Scholarship Scheme for Girl Students',
    eligibility: 'Female students admitted to B.Tech 1st year (or lateral entry), family income < Rs. 8 LPA',
    lastDate: new Date('2026-11-30'),
    applicationLink: 'https://scholarships.gov.in',
  },
];

const mockNotices = [
  {
    _id: 'not_1',
    title: 'Regarding Online Submission of Examination Form (Even Semester 2025-26)',
    description: 'All regular and carry-over students are hereby informed that the portal for exam form filling will remain open from June 10, 2026, to June 25, 2026. Please complete the process and pay the examination fee in time to avoid penalty charges.',
    publishDate: new Date('2026-06-05'),
    link: 'https://aktu.ac.in/circulars.html',
  },
  {
    _id: 'not_2',
    title: 'Declaration of B.Tech 8th Semester Theory Results (Regular Exams 2025-26)',
    description: 'AKTU has declared the regular theory examination results for B.Tech Final Year (8th Semester). Students can access their results on the AKTU OneView portal using their university roll numbers.',
    publishDate: new Date('2026-06-02'),
    link: 'https://oneview.aktu.ac.in',
  },
  {
    _id: 'not_3',
    title: 'Circular Regarding Digitally Evaluated Answer Sheet Challenge Valuation',
    description: 'Guidelines for challenge valuation of answer sheets of B.Tech Odd Semester exams are released. Students can submit their application online through ERP portal within 30 days of this notice.',
    publishDate: new Date('2026-05-28'),
    link: 'https://aktu.ac.in/circulars.html',
  },
];

const mockUsers = [];

module.exports = {
  users: mockUsers,
  subjects: mockSubjects,
  pyqs: mockPYQs,
  notes: mockNotes,
  scholarships: mockScholarships,
  notices: mockNotices
};
