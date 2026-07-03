import React, { useEffect, useState } from 'react';
import API from '../services/api';
import {
  Search,
  Award,
  Calendar,
  AlertCircle,
  ExternalLink,
  Info,
  Clock
} from 'lucide-react';

const ScholarshipHub = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [eligibility, setEligibility] = useState('All');

  const fetchScholarships = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = `?search=${search}`;
      if (eligibility !== 'All') {
        query += `&eligibility=${eligibility}`;
      }

      const { data } = await API.get(`/scholarships${query}`);
      if (data.success) {
        setScholarships(data.data);
      }
    } catch (err) {
      setError('Could not retrieve scholarship list. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScholarships();
  }, [search, eligibility]);

  // Calculate days remaining till deadline
  // const getDaysRemaining = (dateStr) => {
  //   const target = new Date(dateStr);
  //   const today = new Date();
  //   const diff = target - today;
  //   const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  //   return days > 0 ? `${days} days left` : 'Deadline passed';
  // };
  const getDaysRemaining = () => {
  return "Check official website for deadline";
  };

  const getDaysBadgeColor = (daysStr) => {
    if (daysStr.includes('passed')) return 'bg-red-500/10 text-red-400 border border-red-500/20';
    const num = parseInt(daysStr);
    if (num < 15) return 'bg-rose-500/15 text-rose-400 border border-rose-500/20 animate-pulse';
    return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
  };

  const eligibilityOptions = [
    { label: 'All Eligibility Groups', value: 'All' },
    { label: 'SC / ST Category', value: 'SC/ST' },
    { label: 'OBC Category', value: 'OBC' },
    { label: 'General / Minority', value: 'General' },
    { label: 'Female Students Only', value: 'Female' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title Header */}
      <div>
        <p className="text-xs text-primary-400 font-semibold uppercase tracking-wider font-sans">Financial Aid & Scholarship Tracker</p>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-100 flex items-center space-x-2">
          <Award className="w-8 h-8 text-primary-500" />
          <span>Scholarship Hub</span>
        </h1>
      </div>

      {/* Filters */}
      <div className="glass-panel rounded-2xl p-5 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950/40 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 text-slate-200 placeholder-slate-650"
            placeholder="Search scholarships (e.g. Pragati)..."
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          <span className="text-xs text-slate-400 font-semibold hidden sm:inline">Eligibility:</span>
          <select
            value={eligibility}
            onChange={(e) => setEligibility(e.target.value)}
            className="w-full sm:w-56 bg-slate-900 border border-slate-800 text-slate-350 text-xs rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
          >
            {eligibilityOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-950/30 border border-red-900/40 rounded-xl flex items-center space-x-3 text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map(n => (
            <div key={n} className="glass-panel p-6 h-56 skeleton rounded-3xl"></div>
          ))}
        </div>
      ) : scholarships.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl space-y-3">
          <Award className="w-12 h-12 text-slate-600 mx-auto" />
          <h2 className="text-lg font-bold text-slate-400">No active scholarship programs found</h2>
          <p className="text-slate-500 text-xs max-w-sm mx-auto">Try matching other eligibility category tags or search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {scholarships.map((sch) => {
            const daysLeftStr = getDaysRemaining(sch.lastDate);
            return (
              <div
                key={sch._id}
                className="glass-card p-6 rounded-2xl flex flex-col justify-between space-y-5 hover:translate-y-[-2px] hover:shadow-2xl transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold uppercase flex items-center ${getDaysBadgeColor(daysLeftStr)}`}>
                      <Clock className="w-3 h-3 mr-1" />
                      <span>Check details on official site</span>
                    </span>
                      <span className="text-[10px] text-slate-500">
  Visit official portal for deadline
</span>
                    
                  </div>

                  <h3 className="font-extrabold text-slate-200 text-sm tracking-tight">
                    {sch.title}
                  </h3>

                  <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center">
                      <Info className="w-3.5 h-3.5 text-primary-400 mr-1" />
                      <span>Eligibility Criteria</span>
                    </span>
                    <p className="text-xs text-slate-450 leading-relaxed font-medium">
                      {sch.eligibility}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/60 flex items-center justify-end">
                  <a
                    href={sch.applicationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-button-primary flex items-center space-x-1.5 text-xs px-4 py-2 bg-gradient-to-r"
                  >
                    <span>Apply Now</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ScholarshipHub;
