const Subject = require('../models/Subject');

// Helper to get subjects preset details for realistic mock data
const getSubjectMockData = (subjectCode) => {
  const code = (subjectCode || '').toUpperCase();
  
  if (code.includes('KCS301') || code.includes('DATA STRUCTURES')) {
    return {
      topics: [
        { topic: 'Singly & Doubly Linked Lists', count: 14, weightage: 18, probability: 95, unit: 1, rank: 1, desc: 'Reversal, insertion, and deletion algorithms are highly repeated.' },
        { topic: 'Stack Operations & Postfix Eval', count: 11, weightage: 15, probability: 88, unit: 2, rank: 2, desc: 'Infix to postfix conversion algorithms appear in almost every semester exam.' },
        { topic: 'Binary Tree Traversals', count: 10, weightage: 14, probability: 85, unit: 3, rank: 3, desc: 'Inorder, preorder, and postorder traversal recursive implementations.' },
        { topic: 'Dijkstras Shortest Path Algorithm', count: 9, weightage: 13, probability: 82, unit: 4, rank: 4, desc: 'Matrix and graph representations, tracing path steps.' },
        { topic: 'Hashing & Collision Resolution', count: 8, weightage: 10, probability: 78, unit: 5, rank: 5, desc: 'Chaining vs open addressing comparisons.' }
      ],
      viva: [
        { q: 'What is the difference between an Array and a Linked List?', a: 'Arrays are stored in contiguous memory locations and have constant time access, while Linked Lists are stored in non-contiguous nodes linked by pointers, requiring O(N) traversal but allowing constant time insertion/deletion.' },
        { q: 'Explain the working of a Queue. Which principle does it follow?', a: 'A queue is a linear data structure that follows the FIFO (First In First Out) principle, where insertions happen at the rear end and deletions happen at the front.' },
        { q: 'What is a binary search tree (BST)?', a: 'A binary tree where the left child of a node contains values less than the parent node, and the right child contains values greater than or equal to the parent node.' }
      ]
    };
  } else if (code.includes('KCS401') || code.includes('OPERATING SYSTEM')) {
    return {
      topics: [
        { topic: 'CPU Scheduling Algorithms', count: 13, weightage: 20, probability: 92, unit: 1, rank: 1, desc: 'Numerical questions on Round Robin, SJF, and Priority Scheduling.' },
        { topic: 'Bankers Algorithm for Deadlock', count: 12, weightage: 18, probability: 90, unit: 2, rank: 2, desc: 'Safety state calculations and resource request algorithms.' },
        { topic: 'Page Replacement (FIFO, LRU, Optimal)', count: 10, weightage: 15, probability: 85, unit: 3, rank: 3, desc: 'Calculations of page faults using reference strings.' },
        { topic: 'Semaphores & Producer-Consumer', count: 8, weightage: 12, probability: 75, unit: 4, rank: 4, desc: 'Process synchronization concepts using mutexes and semaphores.' },
        { topic: 'Disk Scheduling (FCFS, SCAN, C-SCAN)', count: 7, weightage: 10, probability: 70, unit: 5, rank: 5, desc: 'Total head movement computations.' }
      ],
      viva: [
        { q: 'What is thrashing in operating systems?', a: 'Thrashing occurs when a virtual memory system spends more time swapping pages in and out of secondary storage than executing processes, leading to low CPU utilization.' },
        { q: 'What is a deadlock? What are the four necessary conditions for it?', a: 'A deadlock is a situation where a set of processes are blocked because each holds a resource and waits for another resource held by another. Conditions: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait.' },
        { q: 'What is the difference between a process and a thread?', a: 'A process is an independent execution unit with its own address space, while a thread is a lightweight subprocess that shares the memory address space of its parent process.' }
      ]
    };
  } else {
    // Default fallback mock data
    return {
      topics: [
        { topic: 'Fundamental Architectures & Models', count: 9, weightage: 20, probability: 88, unit: 1, rank: 1, desc: 'Core block diagrams and definitions are regularly tested.' },
        { topic: 'Standard Algorithms & Numerical Methods', count: 7, weightage: 18, probability: 82, unit: 2, rank: 2, desc: 'Practice numerical iterations and flowchart structures.' },
        { topic: 'System Implementations & Operations', count: 6, weightage: 15, probability: 78, unit: 3, rank: 3, desc: 'Comparative study between different implementations.' },
        { topic: 'Performance Metrics & Validations', count: 5, weightage: 12, probability: 70, unit: 4, rank: 4, desc: 'Evaluating complexity parameters and boundary cases.' },
        { topic: 'Modern Applications & Advancements', count: 4, weightage: 10, probability: 65, unit: 5, rank: 5, desc: 'General theory questions on future trends.' }
      ],
      viva: [
        { q: 'What is the primary objective of this subject?', a: 'To understand the fundamental systems, design principles, and algorithms used to solve engineering problems in this domain.' },
        { q: 'Define the core parameters that measure system performance.', a: 'Time complexity, space overhead, reliability, throughput, and error tolerance capacity under high loading conditions.' },
        { q: 'Name some standard protocols or interfaces used here.', a: 'Common specifications include standardized APIs, standard hardware interfaces, and communication network protocols.' }
      ]
    };
  }
};

// @desc    Simulate AI Chatbot responses
// @route   POST /api/ai/chat
// @access  Private
exports.chat = async (req, res) => {
  try {
    const { message, subjectCode, history } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Please provide a message' });
    }

    let responseText = '';
    const cleanMsg = message.toLowerCase();

    if (cleanMsg.includes('hello') || cleanMsg.includes('hi ')) {
      responseText = `Hello! I am your **AKTU Academic Copilot**. I can help you summarize topics, draft study plans, explain codes, or prepare for upcoming exams. What subject are we focusing on today?`;
    } else if (cleanMsg.includes('exam pattern') || cleanMsg.includes('syllabus')) {
      responseText = `AKTU semester exams typically consist of a 3-hour paper totaling **100 marks** (or 70 marks for some years). It is split into three sections:
- **Section A**: 10 short questions of 2 marks each (compulsory).
- **Section B**: 5 long-answer questions (attempt 3, 10 marks each).
- **Section C**: 5 sets of choice questions (attempt 1 from each unit, 10 marks each).

Would you like to analyze the key high-probability questions for your specific semester subjects?`;
    } else if (cleanMsg.includes('grace marks') || cleanMsg.includes('rule')) {
      responseText = `Under AKTU regulations, a student is eligible for a maximum of **7 grace marks** in an academic year, provided they have passed all other subjects and have a clean record. Grace marks can only be applied to theory external exams, not practicals or sessionals.`;
    } else if (subjectCode) {
      const data = getSubjectMockData(subjectCode);
      const topTopic = data.topics[0].topic;
      responseText = `That is a great query regarding **${subjectCode}**. 
Based on AKTU historical analysis, the most frequently repeated topic in this section is **${topTopic}** (which has appeared in ${data.topics[0].count} papers over the last 5 years). 

For a comprehensive explanation:
1. Review the core definitions and proofs (usually worth 10 marks in Section C).
2. Memorize the standard algorithm steps.
3. Solve at least 2 numerical problems from previous years.

Is there a specific concept or algorithm from this topic that you want me to explain with a code block or step-by-step logic?`;
    } else {
      responseText = `I understand you have questions about academic topics. To give you the most accurate AKTU-specific advice:
- Make sure to select your **Subject** from the dropdown menu above.
- Let me know if you need a chapter summary, key topics list, or specific coding/numerical walkthroughs!`;
    }

    // Simulate small latency for realistic experience
    setTimeout(() => {
      res.json({
        success: true,
        data: {
          response: responseText,
          timestamp: new Date(),
        },
      });
    }, 400);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get PYQ analytics (Topic Frequency & weightages)
// @route   GET /api/ai/analytics/:subjectCode
// @access  Private
exports.getAnalytics = async (req, res) => {
  try {
    const { subjectCode } = req.params;
    const data = getSubjectMockData(subjectCode);

    res.json({
      success: true,
      data: {
        subjectCode,
        frequencyData: data.topics.map(t => ({ name: t.topic, value: t.count })),
        weightageData: [
          { name: 'Unit 1', value: 25 },
          { name: 'Unit 2', value: 20 },
          { name: 'Unit 3', value: 18 },
          { name: 'Unit 4', value: 22 },
          { name: 'Unit 5', value: 15 }
        ],
        importantTopics: data.topics,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Question Predictions (forecast repeated and high probability topics)
// @route   GET /api/ai/predictions/:subjectCode
// @access  Private
exports.getPredictions = async (req, res) => {
  try {
    const { subjectCode } = req.params;
    const data = getSubjectMockData(subjectCode);

    const predictions = data.topics.map((t, idx) => ({
      rank: t.rank,
      topic: t.topic,
      confidenceScore: t.probability,
      importance: idx === 0 || idx === 1 ? 'Critical' : idx === 2 || idx === 3 ? 'High' : 'Medium',
      historicalOccurrence: `${t.count}/5 years`,
      details: t.desc,
    }));

    res.json({
      success: true,
      data: {
        subjectCode,
        predictions,
        vivaReadyScore: 82, // placeholder progress metrics
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Start dynamic Viva Session
// @route   POST /api/ai/viva/start
// @access  Private
exports.startViva = async (req, res) => {
  try {
    const { subjectCode, unit } = req.body;
    const data = getSubjectMockData(subjectCode);

    // Return the first question
    res.json({
      success: true,
      data: {
        questionIndex: 0,
        totalQuestions: data.viva.length,
        question: data.viva[0].q,
        sessionToken: `viva-${Date.now()}-${Math.floor(Math.random()*1000)}`,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Evaluate student answer and yield next question or final scorecard
// @route   POST /api/ai/viva/submit
// @access  Private
exports.submitVivaAnswer = async (req, res) => {
  try {
    const { subjectCode, questionIndex, answer, sessionToken } = req.body;
    const data = getSubjectMockData(subjectCode);
    const qIndex = Number(questionIndex);

    if (qIndex < 0 || qIndex >= data.viva.length) {
      return res.status(400).json({ success: false, message: 'Invalid question index' });
    }

    const currentQuestionObj = data.viva[qIndex];
    const cleanAns = (answer || '').toLowerCase().trim();
    
    // Simplistic grading comparison for mock logic
    let score = 0; // out of 10
    let feedback = '';
    
    if (cleanAns.length < 5) {
      score = 2;
      feedback = 'Answer is too brief. Please define the key terms and expand on your explanation.';
    } else {
      // Look for keyword matches from the mock answer
      const keywords = currentQuestionObj.a.toLowerCase().split(/[ ,.]+/).filter(w => w.length > 4);
      let matches = 0;
      keywords.forEach(word => {
        if (cleanAns.includes(word)) matches++;
      });

      const matchRatio = matches / Math.max(1, keywords.length);
      if (matchRatio > 0.4) {
        score = Math.floor(8 + Math.random() * 3); // 8 to 10
        feedback = 'Excellent response! You touched on the core technical concepts and accurately explained the working process.';
      } else if (matchRatio > 0.15) {
        score = Math.floor(5 + Math.random() * 3); // 5 to 7
        feedback = 'Partially correct. You mentioned some relevant terms, but your explanation could be structurally sounder. Note: ' + currentQuestionObj.a;
      } else {
        score = Math.floor(3 + Math.random() * 2); // 3 to 4
        feedback = 'Incorrect or incomplete. You need to focus on the technical definition. Here is the suggested answer: ' + currentQuestionObj.a;
      }
    }

    const nextIndex = qIndex + 1;
    const isCompleted = nextIndex >= data.viva.length;

    if (isCompleted) {
      // Calculate final scorecard
      res.json({
        success: true,
        data: {
          isCompleted: true,
          feedback,
          score,
          scorecard: {
            overallGrade: 'B+',
            totalScore: 23, // mock score summation
            maxScore: 30,
            strengths: ['Solid conceptual baseline', 'Understands memory allocations'],
            improvements: ['Needs standard algorithmic proofs', 'Elaborate definitions with operational parameters'],
          }
        }
      });
    } else {
      res.json({
        success: true,
        data: {
          isCompleted: false,
          feedback,
          score,
          nextQuestionIndex: nextIndex,
          nextQuestion: data.viva[nextIndex].q,
        }
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate a custom Study Planner checklist
// @route   POST /api/ai/planner
// @access  Private
exports.generatePlan = async (req, res) => {
  try {
    const { examDate, subjects, hoursPerDay } = req.body;

    if (!examDate || !subjects || subjects.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide exam date and at least one subject' });
    }

    const targetDate = new Date(examDate);
    const today = new Date();
    const diffTime = Math.abs(targetDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return res.status(400).json({ success: false, message: 'Exam date must be in the future!' });
    }

    // Build plan algorithmically based on total days available
    const hours = Number(hoursPerDay || 2);
    const totalStudyHours = diffDays * hours;
    const hoursPerSubject = Math.floor(totalStudyHours / subjects.length);

    const dailyPlan = [];
    const weeklyPlan = [];
    const revisionTracker = [];

    // 1. Generate Daily Timeline Tasks for the first 5 days (as a preview list)
    const phases = ['Theory Intake', 'Core Derivations', 'Formula Practice', 'PYQ Solving', 'Viva Mock Drill'];
    for (let i = 1; i <= Math.min(diffDays, 5); i++) {
      const subject = subjects[(i - 1) % subjects.length];
      const phase = phases[(i - 1) % phases.length];
      dailyPlan.push({
        day: i,
        subject,
        task: `Study ${phase} for ${subject} - Target 5 key topics`,
        duration: `${hours} hours`,
        isCompleted: false,
      });
    }

    // 2. Generate Weekly Milestones
    const weeksCount = Math.max(1, Math.ceil(diffDays / 7));
    for (let w = 1; w <= weeksCount; w++) {
      weeklyPlan.push({
        week: w,
        milestone: `Complete syllabus coverage for ${subjects[(w - 1) % subjects.length]} and solve 2 years of question papers.`,
        isCompleted: false,
      });
    }

    // 3. Generate Revision Tracker
    subjects.forEach((subj, idx) => {
      revisionTracker.push({
        id: idx + 1,
        subject: subj,
        topicsCount: 12,
        revisionPercentage: 0,
        status: 'Not Started', // Pending / Completed
      });
    });

    res.json({
      success: true,
      data: {
        totalDays: diffDays,
        hoursPerSubject,
        dailyPlan,
        weeklyPlan,
        revisionTracker,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
