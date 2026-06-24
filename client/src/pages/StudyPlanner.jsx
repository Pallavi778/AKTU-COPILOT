import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import {
  Calendar,
  Sparkles,
  CheckCircle,
  Clock,
  Layers,
  TrendingUp,
  AlertCircle,
  ListTodo,
  Activity
} from 'lucide-react';

const StudyPlanner = () => {
  const { user } = useContext(AuthContext);
  const [subjectsList, setSubjectsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [planGenerated, setPlanGenerated] = useState(false);

  // Form Inputs
  const [examDate, setExamDate] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [hoursPerDay, setHoursPerDay] = useState(3);
  const [formError, setFormError] = useState('');

  // Planner Outputs
  const [totalDays, setTotalDays] = useState(0);
  const [hoursPerSubject, setHoursPerSubject] = useState(0);
  const [dailyPlan, setDailyPlan] = useState([]);
  const [weeklyPlan, setWeeklyPlan] = useState([]);
  const [revisionTracker, setRevisionTracker] = useState([]);

  // Active Tab state: 'daily' | 'weekly' | 'revision'
  const [activeTab, setActiveTab] = useState('daily');

  // Load subjects to populate selection checklist
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const { data } = await API.get(`/subjects?branch=${user?.branch || ''}&semester=${user?.semester || ''}`);
        if (data.success && data.data.length > 0) {
          setSubjectsList(data.data);
          // Auto select first 3 subjects by default
          setSelectedSubjects(data.data.slice(0, 3).map(s => s.name));
        } else {
          const generalList = ['Data Structures', 'Operating Systems', 'Discrete Mathematics'];
          setSubjectsList(generalList.map((n, i) => ({ _id: i, name: n, code: `KCS${301+i}` })));
          setSelectedSubjects(generalList);
        }
      } catch (err) {
        console.error('Failed to fetch subjects', err);
      }
    };
    if (user) {
      fetchSubjects();
    }
  }, [user]);

  const handleSubjectToggle = (subjName) => {
    if (selectedSubjects.includes(subjName)) {
      setSelectedSubjects(prev => prev.filter(n => n !== subjName));
    } else {
      setSelectedSubjects(prev => [...prev, subjName]);
    }
  };

  const handleGeneratePlan = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!examDate) {
      setFormError('Please select your exam date.');
      return;
    }
    if (selectedSubjects.length === 0) {
      setFormError('Please check at least one subject.');
      return;
    }

    try {
      setLoading(true);
      const { data } = await API.post('/ai/planner', {
        examDate,
        subjects: selectedSubjects,
        hoursPerDay,
      });

      if (data.success) {
        setTotalDays(data.data.totalDays);
        setHoursPerSubject(data.data.hoursPerSubject);
        setDailyPlan(data.data.dailyPlan);
        setWeeklyPlan(data.data.weeklyPlan);
        setRevisionTracker(data.data.revisionTracker);
        setPlanGenerated(true);
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to generate study plan.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle checklist tasks completion locally for visual interaction
  const toggleDailyTask = (index) => {
    setDailyPlan(prev => {
      const copy = [...prev];
      copy[index].isCompleted = !copy[index].isCompleted;
      return copy;
    });
  };

  const toggleWeeklyTask = (index) => {
    setWeeklyPlan(prev => {
      const copy = [...prev];
      copy[index].isCompleted = !copy[index].isCompleted;
      return copy;
    });
  };

  const handleRevisionProgress = (subjId, val) => {
    setRevisionTracker(prev => {
      return prev.map(item => {
        if (item.id === subjId) {
          const newVal = Math.max(0, Math.min(100, item.revisionPercentage + val));
          return {
            ...item,
            revisionPercentage: newVal,
            status: newVal === 100 ? 'Completed' : newVal > 0 ? 'Pending' : 'Not Started',
          };
        }
        return item;
      });
    });
  };

  // Calculate overall planner progress
  const getOverallProgress = () => {
    if (dailyPlan.length === 0) return 0;
    const completed = dailyPlan.filter(t => t.isCompleted).length;
    return Math.round((completed / dailyPlan.length) * 100);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title Header */}
      <div>
        <p className="text-xs text-primary-400 font-semibold uppercase tracking-wider">Algorithmic schedule generator</p>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-100 flex items-center space-x-2">
          <Calendar className="w-8 h-8 text-primary-500" />
          <span>Study Planner</span>
        </h1>
      </div>

      {!planGenerated ? (
        /* INPUT PANEL SCREEN */
        <div className="glass-panel rounded-3xl p-8 max-w-2xl mx-auto space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-slate-200">Configure Study Schedule</h2>
            <p className="text-xs text-slate-500">Provide your target examination date, check the topics to include, and select your study capacity per day.</p>
          </div>

          <form onSubmit={handleGeneratePlan} className="space-y-6">
            {formError && (
              <div className="p-4 bg-red-950/40 border border-red-900/50 rounded-2xl flex items-center space-x-2 text-red-300 text-xs">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Exam Date */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase">Target Exam Date</label>
                <input
                  type="date"
                  required
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300 focus:outline-none cursor-pointer"
                />
              </div>

              {/* Study Hours */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase">Hours Available Per Day</label>
                <select
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-350 focus:outline-none cursor-pointer"
                >
                  <option value="1">1 Hour</option>
                  <option value="2">2 Hours</option>
                  <option value="3">3 Hours</option>
                  <option value="4">4 Hours</option>
                  <option value="5">5 Hours (Intense)</option>
                  <option value="6">6 Hours (Crash Prep)</option>
                </select>
              </div>
            </div>

            {/* Subject Checkbox Grid */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-2.5 uppercase">Select subjects to include</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto p-2 bg-slate-950/40 border border-slate-850 rounded-2xl">
                {subjectsList.map((sub, idx) => (
                  <label
                    key={idx}
                    className="flex items-center space-x-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-primary-500/30 transition-all cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSubjects.includes(sub.name)}
                      onChange={() => handleSubjectToggle(sub.name)}
                      className="w-4 h-4 accent-primary-500"
                    />
                    <span className="text-xs text-slate-300 font-medium">
                      {sub.code ? `[${sub.code}] ` : ''}{sub.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full glass-button-primary flex items-center justify-center space-x-2 py-3.5 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Customized Study Plan</span>
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        /* OUTPUT REPORT BOARD */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Overall Stats and Tabs */}
          <div className="space-y-6 lg:col-span-1">
            <div className="glass-panel rounded-3xl p-6 space-y-5">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Plan Overview</h2>
              
              {/* Progress Dial */}
              <div className="p-4 bg-slate-950/40 rounded-2xl border border-slate-850 space-y-3">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-400">Total Completion</span>
                  <span className="text-primary-400">{getOverallProgress()}%</span>
                </div>
                <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-indigo-500 transition-all duration-350"
                    style={{ width: `${getOverallProgress()}%` }}
                  ></div>
                </div>
              </div>

              {/* Stats parameters */}
              <div className="divide-y divide-slate-800 text-xs">
                <div className="py-2.5 flex justify-between font-semibold">
                  <span className="text-slate-500">Days to Examination:</span>
                  <span className="text-slate-200">{totalDays} Days</span>
                </div>
                <div className="py-2.5 flex justify-between font-semibold">
                  <span className="text-slate-500">Selected Course Count:</span>
                  <span className="text-slate-200">{selectedSubjects.length} subjects</span>
                </div>
                <div className="py-2.5 flex justify-between font-semibold">
                  <span className="text-slate-500">Hours per Subject:</span>
                  <span className="text-slate-200">{hoursPerSubject} Hours</span>
                </div>
                <div className="py-2.5 flex justify-between font-semibold">
                  <span className="text-slate-500">Daily Study Target:</span>
                  <span className="text-primary-400 font-bold">{hoursPerDay} Hrs/day</span>
                </div>
              </div>

              {/* Tab Selector Links */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => setActiveTab('daily')}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-between border cursor-pointer transition-all ${
                    activeTab === 'daily'
                      ? 'bg-primary-650/15 border-primary-500/40 text-primary-400'
                      : 'bg-slate-950/20 border-transparent text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <span className="flex items-center"><ListTodo className="w-4 h-4 mr-2" /> Daily Plan</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-bold">{dailyPlan.length}</span>
                </button>

                <button
                  onClick={() => setActiveTab('weekly')}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-between border cursor-pointer transition-all ${
                    activeTab === 'weekly'
                      ? 'bg-indigo-650/15 border-indigo-500/40 text-indigo-400'
                      : 'bg-slate-950/20 border-transparent text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <span className="flex items-center"><Layers className="w-4 h-4 mr-2" /> Weekly Milestones</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-bold">{weeklyPlan.length}</span>
                </button>

                <button
                  onClick={() => setActiveTab('revision')}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-between border cursor-pointer transition-all ${
                    activeTab === 'revision'
                      ? 'bg-emerald-650/15 border-emerald-500/40 text-emerald-400'
                      : 'bg-slate-950/20 border-transparent text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <span className="flex items-center"><Activity className="w-4 h-4 mr-2" /> Revision Tracker</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-bold">{revisionTracker.length}</span>
                </button>
              </div>

              {/* Reset button */}
              <button
                onClick={() => setPlanGenerated(false)}
                className="w-full text-center text-xs font-bold text-slate-400 hover:text-slate-200 pt-3 border-t border-slate-800"
              >
                Create New Planner Setup
              </button>
            </div>
          </div>

          {/* Right Column - Tab Content panels */}
          <div className="lg:col-span-2">
            {activeTab === 'daily' && (
              <div className="glass-panel rounded-3xl p-6 space-y-4 h-full">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-base font-extrabold text-slate-200">Daily Study Timeline (Preview)</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Tick off daily checklist tasks as you study.</p>
                </div>

                <div className="space-y-3 pt-2">
                  {dailyPlan.map((task, idx) => (
                    <div
                      key={idx}
                      onClick={() => toggleDailyTask(idx)}
                      className={`p-4 rounded-2xl border flex items-start space-x-3 cursor-pointer transition-all ${
                        task.isCompleted
                          ? 'bg-slate-900/40 border-emerald-500/20 opacity-60'
                          : 'bg-slate-950/20 border-slate-800 hover:border-primary-500/20'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={task.isCompleted}
                        onChange={() => {}} // handled by parent onClick
                        className="w-4.5 h-4.5 accent-emerald-500 mt-0.5 flex-shrink-0 cursor-pointer"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] text-primary-400 font-bold uppercase">Day {task.day} • {task.subject}</span>
                        <h4 className={`text-xs font-bold mt-1 text-slate-200 ${task.isCompleted ? 'line-through text-slate-550' : ''}`}>
                          {task.task}
                        </h4>
                        <span className="text-[9px] text-slate-500 flex items-center mt-2">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>Duration: {task.duration}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'weekly' && (
              <div className="glass-panel rounded-3xl p-6 space-y-4 h-full">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-base font-extrabold text-slate-200">Weekly Milestones</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Long-term objectives over the planning duration.</p>
                </div>

                <div className="space-y-3 pt-2">
                  {weeklyPlan.map((milestone, idx) => (
                    <div
                      key={idx}
                      onClick={() => toggleWeeklyTask(idx)}
                      className={`p-4 rounded-2xl border flex items-start space-x-3 cursor-pointer transition-all ${
                        milestone.isCompleted
                          ? 'bg-slate-900/40 border-emerald-500/20 opacity-60'
                          : 'bg-slate-950/20 border-slate-800 hover:border-indigo-500/20'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={milestone.isCompleted}
                        onChange={() => {}}
                        className="w-4.5 h-4.5 accent-emerald-500 mt-0.5 flex-shrink-0 cursor-pointer"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] text-indigo-400 font-bold uppercase">Week {milestone.week} milestone</span>
                        <h4 className={`text-xs font-semibold mt-1 text-slate-200 ${milestone.isCompleted ? 'line-through text-slate-550' : ''}`}>
                          {milestone.milestone}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'revision' && (
              <div className="glass-panel rounded-3xl p-6 space-y-4 h-full">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-base font-extrabold text-slate-200">Subject Revision Progress</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Increment revision scales as you finish chapter reviews.</p>
                </div>

                <div className="space-y-5 pt-3">
                  {revisionTracker.map((subject) => (
                    <div key={subject.id} className="p-4 bg-slate-950/30 border border-slate-850 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-200">{subject.subject}</h4>
                          <span className="text-[9px] text-slate-500 mt-0.5 block">{subject.topicsCount} core topics to review</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                          subject.status === 'Completed'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : subject.status === 'Pending'
                              ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                              : 'bg-slate-800 text-slate-500'
                        }`}>
                          {subject.status}
                        </span>
                      </div>

                      {/* Slider Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className="text-slate-500">Revision Coverage</span>
                          <span className="text-primary-400">{subject.revisionPercentage}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                          <div className="h-full bg-primary-550 transition-all duration-300" style={{ width: `${subject.revisionPercentage}%` }}></div>
                        </div>
                      </div>

                      {/* Controls to mock change */}
                      <div className="flex gap-2 justify-end pt-1">
                        <button
                          onClick={() => handleRevisionProgress(subject.id, -20)}
                          disabled={subject.revisionPercentage === 0}
                          className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-[10px] text-slate-400 rounded-lg cursor-pointer disabled:opacity-30"
                        >
                          -20%
                        </button>
                        <button
                          onClick={() => handleRevisionProgress(subject.id, 20)}
                          disabled={subject.revisionPercentage === 100}
                          className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-[10px] text-slate-200 rounded-lg cursor-pointer disabled:opacity-30"
                        >
                          +20%
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyPlanner;
