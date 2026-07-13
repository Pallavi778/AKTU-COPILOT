// import React, { useContext, useEffect, useState } from 'react';
// import { AuthContext } from '../context/AuthContext';
// import API from '../services/api';
// import {
//   GraduationCap,
//   Sparkles,
//   Play,
//   ArrowRight,
//   BookOpen,
//   CheckCircle,
//   FileCheck,
//   RotateCcw,
//   UserCheck,
//   AlertCircle
// } from 'lucide-react';

// const VivaPrep = () => {
//   const { user } = useContext(AuthContext);
//   const [subjects, setSubjects] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Setup state
//   const [selectedSubject, setSelectedSubject] = useState('');
//   const [selectedUnit, setSelectedUnit] = useState('1');

//   // Session state: 'setup' | 'active' | 'result'
//   const [stage, setStage] = useState('setup');
//   const [sessionToken, setSessionToken] = useState('');
//   const [questionIndex, setQuestionIndex] = useState(0);
//   const [totalQuestions, setTotalQuestions] = useState(0);
//   const [currentQuestion, setCurrentQuestion] = useState('');
//   const [studentAnswer, setStudentAnswer] = useState('');
//   const [evaluationFeedback, setEvaluationFeedback] = useState('');
//   const [evaluating, setEvaluating] = useState(false);
//   const [lastScore, setLastScore] = useState(0);
//   const [answered, setAnswered] = useState(false);

//   // Results state
//   const [scorecard, setScorecard] = useState(null);

//   // Load subjects
//   useEffect(() => {
//     const fetchSubjects = async () => {
//       try {
//         const { data } = await API.get(`/subjects?branch=${user?.branch || ''}&semester=${user?.semester || ''}`);
//         if (data.success && data.data.length > 0) {
//           setSubjects(data.data);
//           setSelectedSubject(data.data[0].code);
//         } else {
//           const generalList = [
//             { code: 'KCS301', name: 'Data Structures' },
//             { code: 'KCS401', name: 'Operating Systems' },
//           ];
//           setSubjects(generalList);
//           setSelectedSubject(generalList[0].code);
//         }
//       } catch (err) {
//         console.error('Failed to load subjects', err);
//       }
//     };
//     if (user) {
//       fetchSubjects();
//     }
//   }, [user]);

//   const handleStartSession = async () => {
//     try {
//       setLoading(true);
//       const { data } = await API.post('/ai/viva/start', {
//         subjectCode: selectedSubject,
//         unit: Number(selectedUnit),
//       });

//       if (data.success) {
//         setSessionToken(data.data.sessionToken);
//         setQuestionIndex(data.data.questionIndex);
//         setTotalQuestions(data.data.totalQuestions);
//         setCurrentQuestion(data.data.question);
//         setStudentAnswer('');
//         setEvaluationFeedback('');
//         setAnswered(false);
//         setStage('active');
//       }
//     } catch (error) {
//       console.error('Failed to start viva session', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmitAnswer = async (e) => {
//     e.preventDefault();
//     if (!studentAnswer.trim() || evaluating) return;

//     try {
//       setEvaluating(true);
//       const { data } = await API.post('/ai/viva/submit', {
//         subjectCode: selectedSubject,
//         questionIndex,
//         answer: studentAnswer,
//         sessionToken,
//       });

//       if (data.success) {
//         setEvaluationFeedback(data.data.feedback);
//         setLastScore(data.data.score);
//         setAnswered(true);

//         if (data.data.isCompleted) {
//           setScorecard(data.data.scorecard);
//         } else {
//           // Store next question coordinates to load on click
//           setNextQuestionData({
//             index: data.data.nextQuestionIndex,
//             question: data.data.nextQuestion,
//           });
//         }
//       }
//     } catch (error) {
//       console.error('Failed to evaluate answer', error);
//     } finally {
//       setEvaluating(false);
//     }
//   };

//   const [nextQuestionData, setNextQuestionData] = useState(null);

//   const handleNextQuestion = () => {
//     if (scorecard) {
//       setStage('result');
//     } else if (nextQuestionData) {
//       setQuestionIndex(nextQuestionData.index);
//       setCurrentQuestion(nextQuestionData.question);
//       setStudentAnswer('');
//       setEvaluationFeedback('');
//       setAnswered(false);
//       setNextQuestionData(null);
//     }
//   };

//   const handleReset = () => {
//     setStage('setup');
//     setStudentAnswer('');
//     setEvaluationFeedback('');
//     setScorecard(null);
//     setNextQuestionData(null);
//   };

//   return (
//     <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
//       {/* Title Header */}
//       <div>
//         <p className="text-xs text-primary-400 font-semibold uppercase tracking-wider">Viva prep simulator</p>
//         <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-100 flex items-center space-x-2">
//           <GraduationCap className="w-8 h-8 text-primary-500" />
//           <span>Viva Preparation</span>
//         </h1>
//       </div>

//       {/* STAGE 1: SETUP SELECTOR SCREEN */}
//       {stage === 'setup' && (
//         <div className="glass-panel rounded-3xl p-8 space-y-6">
//           <div className="space-y-2">
//             <h2 className="text-lg font-bold text-slate-200">Start Your Interactive Mock Viva</h2>
//             <p className="text-xs text-slate-500">
//               Select your subject and syllabus unit to begin. The engine will ask 3 core questions, evaluate your text responses, and yield a breakdown scorecard.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase">Select Subject</label>
//               <select
//                 value={selectedSubject}
//                 onChange={(e) => setSelectedSubject(e.target.value)}
//                 className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none text-slate-350 cursor-pointer"
//               >
//                 {subjects.map(s => (
//                   <option key={s.code} value={s.code}>{s.code} - {s.name}</option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase">Select Unit</label>
//               <select
//                 value={selectedUnit}
//                 onChange={(e) => setSelectedUnit(e.target.value)}
//                 className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none text-slate-350 cursor-pointer"
//               >
//                 <option value="1">Unit 1 - Introduction</option>
//                 <option value="2">Unit 2 - Middle Chapters</option>
//                 <option value="3">Unit 3 - Advanced Structures</option>
//                 <option value="4">Unit 4 - Applications</option>
//                 <option value="5">Unit 5 - Specialized Topics</option>
//               </select>
//             </div>
//           </div>

//           <button
//             onClick={handleStartSession}
//             disabled={loading || !selectedSubject}
//             className="w-full glass-button-primary flex items-center justify-center space-x-2 py-3.5 mt-4"
//           >
//             {loading ? (
//               <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//             ) : (
//               <>
//                 <Play className="w-4 h-4" />
//                 <span>Begin Viva Session</span>
//               </>
//             )}
//           </button>
//         </div>
//       )}

//       {/* STAGE 2: ACTIVE EXAM SIMULATION */}
//       {stage === 'active' && (
//         <div className="glass-panel rounded-3xl p-6 lg:p-8 space-y-6">
//           {/* Header tracker */}
//           <div className="flex items-center justify-between border-b border-slate-800 pb-4">
//             <span className="px-3 py-1 bg-primary-500/10 border border-primary-500/25 rounded-full text-xs font-semibold text-primary-400 uppercase tracking-wide">
//               {selectedSubject} - Unit {selectedUnit}
//             </span>
//             <span className="text-xs font-bold text-slate-500">
//               Question {questionIndex + 1} of {totalQuestions}
//             </span>
//           </div>

//           {/* Question Prompt */}
//           <div className="p-5 bg-slate-950/40 border border-slate-850 rounded-2xl space-y-2">
//             <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center">
//               <Sparkles className="w-3.5 h-3.5 text-primary-400 mr-1 animate-pulse" />
//               <span>Examiner Question</span>
//             </span>
//             <p className="text-sm font-extrabold text-slate-200 leading-relaxed font-sans">
//               {currentQuestion}
//             </p>
//           </div>

//           {/* Answer Inputs Form */}
//           <form onSubmit={handleSubmitAnswer} className="space-y-4">
//             <div>
//               <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase">Your Technical Explanation</label>
//               <textarea
//                 rows="4"
//                 value={studentAnswer}
//                 onChange={(e) => setStudentAnswer(e.target.value)}
//                 disabled={answered || evaluating}
//                 className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-550 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/35 transition-all disabled:opacity-60"
//                 placeholder="Type your answer here in detail. Use correct terminologies..."
//               ></textarea>
//             </div>

//             {!answered && (
//               <button
//                 type="submit"
//                 disabled={!studentAnswer.trim() || evaluating}
//                 className="w-full glass-button-primary flex items-center justify-center space-x-2 py-3"
//               >
//                 {evaluating ? (
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                 ) : (
//                   <>
//                     <UserCheck className="w-4 h-4" />
//                     <span>Submit Answer for Assessment</span>
//                   </>
//                 )}
//               </button>
//             )}
//           </form>

//           {/* Evaluation Feedback block */}
//           {answered && (
//             <div className="space-y-4 animate-slide-up">
//               <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
//                 <div className="flex items-center justify-between">
//                   <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center">
//                     <FileCheck className="w-4 h-4 text-emerald-400 mr-1" />
//                     <span>Evaluation Feedback</span>
//                   </span>
//                   <span className="text-xs font-bold text-primary-400 bg-primary-500/10 px-2 py-0.5 rounded border border-primary-500/25">
//                     Score: {lastScore}/10
//                   </span>
//                 </div>
//                 <p className="text-xs text-slate-350 leading-relaxed">
//                   {evaluationFeedback}
//                 </p>
//               </div>

//               <button
//                 onClick={handleNextQuestion}
//                 className="w-full glass-button-primary flex items-center justify-center space-x-2 py-3"
//               >
//                 <span>{scorecard ? 'View Final Scorecard' : 'Next Question'}</span>
//                 <ArrowRight className="w-4 h-4" />
//               </button>
//             </div>
//           )}
//         </div>
//       )}

//       {/* STAGE 3: FINAL EVALUATION REPORT CARD */}
//       {stage === 'result' && scorecard && (
//         <div className="glass-panel rounded-3xl p-8 space-y-6 animate-slide-up">
//           <div className="text-center space-y-2">
//             <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
//               <CheckCircle className="w-8 h-8" />
//             </div>
//             <h2 className="text-xl font-bold text-slate-200">Viva Session Completed</h2>
//             <p className="text-xs text-slate-500">Here is your academic grade evaluation report.</p>
//           </div>

//           {/* Grading Stats Display */}
//           <div className="grid grid-cols-2 gap-4 p-5 bg-slate-950/40 rounded-2xl border border-slate-850">
//             <div className="text-center border-r border-slate-800/80">
//               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Overall Grade</span>
//               <p className="text-3xl font-extrabold text-primary-400 mt-1">{scorecard.overallGrade}</p>
//             </div>
//             <div className="text-center">
//               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Cumulative Score</span>
//               <p className="text-3xl font-extrabold text-emerald-400 mt-1">{scorecard.totalScore} <span className="text-xs text-slate-650">/ {scorecard.maxScore}</span></p>
//             </div>
//           </div>

//           {/* Strengths & Improvements */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//             <div className="space-y-2.5">
//               <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center">
//                 <CheckCircle className="w-4 h-4 mr-1.5" />
//                 <span>Conceptual Strengths</span>
//               </h3>
//               <ul className="space-y-1.5 text-xs text-slate-350 list-disc list-inside">
//                 {scorecard.strengths.map((str, idx) => (
//                   <li key={idx} className="leading-relaxed">{str}</li>
//                 ))}
//               </ul>
//             </div>

//             <div className="space-y-2.5">
//               <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center">
//                 <AlertCircle className="w-4 h-4 mr-1.5" />
//                 <span>Areas of Improvement</span>
//               </h3>
//               <ul className="space-y-1.5 text-xs text-slate-350 list-disc list-inside">
//                 {scorecard.improvements.map((imp, idx) => (
//                   <li key={idx} className="leading-relaxed">{imp}</li>
//                 ))}
//               </ul>
//             </div>
//           </div>

//           <div className="flex gap-4 pt-4 border-t border-slate-850">
//             <button
//               onClick={handleReset}
//               className="flex-1 glass-button-secondary flex items-center justify-center space-x-2 py-3"
//             >
//               <RotateCcw className="w-4 h-4" />
//               <span>Retry Session</span>
//             </button>
//             <button
//               onClick={handleReset}
//               className="flex-1 glass-button-primary flex items-center justify-center space-x-2 py-3"
//             >
//               <BookOpen className="w-4 h-4" />
//               <span>Go to Subjects</span>
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VivaPrep;
