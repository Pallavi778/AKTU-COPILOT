import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import {
  TrendingUp,
  Award,
  AlertTriangle,
  Brain,
  CheckCircle,
  HelpCircle,
  BarChart,
  Gauge
} from 'lucide-react';

const PYQAnalytics = () => {
  const { user } = useContext(AuthContext);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [predictionsData, setPredictionsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const { data } = await API.get(`/subjects?branch=${user?.branch || ''}&semester=${user?.semester || ''}`);
        if (data.success && data.data.length > 0) {
          setSubjects(data.data);
          setSelectedSubject(data.data[0].code);
        } else {
          // Fallback if no subject is found
          const generalList = [
            { code: 'KCS301', name: 'Data Structures' },
            { code: 'KCS401', name: 'Operating Systems' },
          ];
          setSubjects(generalList);
          setSelectedSubject(generalList[0].code);
        }
      } catch (err) {
        console.error('Failed to load subjects list', err);
      }
    };
    if (user) {
      fetchSubjects();
    }
  }, [user]);

  // Load analytics when subject changes
  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!selectedSubject) return;
      try {
        setLoading(true);
        setError(null);
        
        const analRes = await API.get(`/ai/analytics/${selectedSubject}`);
        const predRes = await API.get(`/ai/predictions/${selectedSubject}`);

        if (analRes.data.success && predRes.data.success) {
          setAnalyticsData(analRes.data.data);
          setPredictionsData(predRes.data.data);
        }
      } catch (err) {
        setError('Error loading prediction metrics for selected subject.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [selectedSubject]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <p className="text-xs text-primary-400 font-semibold uppercase tracking-wider font-sans">Exam Insights & Forecasts</p>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-100">PYQ Analytics</h1>
        </div>

        {/* Subject Selector dropdown */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-semibold">Active Subject:</span>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-350 text-xs rounded-xl px-4 py-2.5 focus:outline-none cursor-pointer"
          >
            {subjects.map((sub) => (
              <option key={sub.code} value={sub.code}>
                {sub.code} - {sub.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-950/30 border border-red-900/40 rounded-xl flex items-center space-x-3 text-red-400 text-sm">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-panel p-6 h-80 skeleton rounded-3xl"></div>
          <div className="glass-panel p-6 h-80 skeleton rounded-3xl"></div>
          <div className="glass-panel lg:col-span-2 p-6 h-80 skeleton rounded-3xl"></div>
        </div>
      ) : analyticsData && predictionsData ? (
        <div className="space-y-6">
          {/* Top Row - Frequency Chart & Unit Weightage Card */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Topic Frequency Bar Chart (using Tailwind bars for perfect responsiveness) */}
            <div className="glass-panel rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                <h2 className="text-sm font-extrabold text-slate-200 uppercase tracking-wide flex items-center space-x-2">
                  <BarChart className="w-4.5 h-4.5 text-primary-400" />
                  <span>Topic Frequency Analysis (Last 5 Years)</span>
                </h2>
                <span className="text-[10px] text-slate-500 font-bold bg-slate-950 px-2.5 py-1 rounded">5 Papers</span>
              </div>
              <div className="space-y-4 pt-2">
                {analyticsData.frequencyData.map((item, idx) => {
                  // Max count is typically 15 for normalization
                  const percentage = Math.min(100, Math.round((item.value / 15) * 100));
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-350 truncate max-w-[80%]">{item.name}</span>
                        <span className="text-primary-400">{item.value} times</span>
                      </div>
                      <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary-500 to-indigo-500 transition-all duration-1000"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Unit-wise Exam Weightage (Polar/Grid stats) */}
            <div className="glass-panel rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                <h2 className="text-sm font-extrabold text-slate-200 uppercase tracking-wide flex items-center space-x-2">
                  <Gauge className="w-4.5 h-4.5 text-indigo-400" />
                  <span>Unit-wise Weightage distribution</span>
                </h2>
                <span className="text-[10px] text-slate-500 font-bold bg-slate-950 px-2.5 py-1 rounded">Total 100 Marks</span>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2 h-full items-center">
                {/* Custom SVG Circular Progress List */}
                <div className="space-y-3">
                  {analyticsData.weightageData.map((unit, idx) => {
                    const colors = [
                      'bg-sky-400',
                      'bg-indigo-400',
                      'bg-emerald-400',
                      'bg-amber-400',
                      'bg-red-400'
                    ];
                    return (
                      <div key={idx} className="flex items-center space-x-2.5 text-xs font-semibold">
                        <div className={`w-3 h-3 rounded-full ${colors[idx % colors.length]}`}></div>
                        <span className="text-slate-400">{unit.name}:</span>
                        <span className="text-slate-200">{unit.value}% marks</span>
                      </div>
                    );
                  })}
                </div>
                {/* SVG Visual Pie/Gauge */}
                <div className="flex justify-center">
                  <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 100 100">
                    {/* Ring 1 - Unit 1 (25%) */}
                    <circle cx="50" cy="50" r="40" stroke="#0c4869" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset="62.8" />
                    {/* Ring 2 - Unit 2 (20% offset) */}
                    <circle cx="50" cy="50" r="30" stroke="#475569" strokeWidth="8" fill="transparent" strokeDasharray="188.4" strokeDashoffset="50.2" />
                    {/* Ring 3 - Unit 3 (18% offset) */}
                    <circle cx="50" cy="50" r="20" stroke="#059669" strokeWidth="8" fill="transparent" strokeDasharray="125.6" strokeDashoffset="31.4" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row - Question Predictions Hub */}
          <div className="glass-panel rounded-3xl p-6 space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Brain className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-slate-100">High Probability Exam Topics (Forecast)</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-medium border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 uppercase font-bold">
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4">Topic Name</th>
                    <th className="py-3 px-4">Confidence Score</th>
                    <th className="py-3 px-4">Priority Tag</th>
                    <th className="py-3 px-4">Historical Occurrence</th>
                    <th className="py-3 px-4">Topic Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 text-slate-350">
                  {predictionsData.predictions.map((pred, index) => {
                    const isCritical = pred.importance === 'Critical';
                    const isHigh = pred.importance === 'High';
                    
                    return (
                      <tr key={index} className="hover:bg-slate-900/30 transition-colors">
                        <td className="py-4 px-4 font-bold text-slate-400">#{pred.rank}</td>
                        <td className="py-4 px-4 font-extrabold text-slate-200">{pred.topic}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-primary-400">{pred.confidenceScore}%</span>
                            <div className="w-16 h-1.5 bg-slate-950 rounded-full overflow-hidden">
                              <div className="h-full bg-primary-500" style={{ width: `${pred.confidenceScore}%` }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                            isCritical 
                              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                              : isHigh
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          }`}>
                            {pred.importance}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-semibold text-slate-400">{pred.historicalOccurrence}</td>
                        <td className="py-4 px-4 text-[11px] text-slate-500 max-w-xs truncate" title={pred.details}>
                          {pred.details}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* AI readiness disclaimer */}
            <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-2xl flex items-start space-x-3 text-slate-500 mt-4 text-[11px]">
              <HelpCircle className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
              <p>
                **Copilot Engine Insights**: Confidence scores are simulated using repeated keyword occurrences, topic weights in Section C, and time elapsed since the topic was last tested. No real AI processing or LLM logic is utilized in this version.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-slate-500">Could not retrieve analytics.</div>
      )}
    </div>
  );
};

export default PYQAnalytics;
