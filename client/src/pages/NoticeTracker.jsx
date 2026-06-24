import React, { useEffect, useState } from 'react';
import API from '../services/api';
import {
  Bell,
  Search,
  Calendar,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  X,
  FileText
} from 'lucide-react';

const NoticeTracker = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search input
  const [search, setSearch] = useState('');

  // Reader modal state
  const [selectedNotice, setSelectedNotice] = useState(null);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data } = await API.get(`/notices?search=${search}`);
      if (data.success) {
        setNotices(data.data);
      }
    } catch (err) {
      setError('Could not retrieve university circulars feed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [search]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title Header */}
      <div>
        <p className="text-xs text-primary-400 font-semibold uppercase tracking-wider font-sans">Official University Circulars</p>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-100 flex items-center space-x-2">
          <Bell className="w-8 h-8 text-primary-500" />
          <span>Notice Tracker</span>
        </h1>
      </div>

      {/* Search Filter */}
      <div className="glass-panel rounded-2xl p-5 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950/40 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 text-slate-200 placeholder-slate-650"
            placeholder="Search notices (e.g. B.Tech Result)..."
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
        </div>
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-850">
          Source: AKTU ERP Circular Feed
        </span>
      </div>

      {error && (
        <div className="p-4 bg-red-950/30 border border-red-900/40 rounded-xl flex items-center space-x-3 text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Notices Timeline Feed */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(n => (
            <div key={n} className="glass-panel p-6 h-24 skeleton rounded-2xl"></div>
          ))}
        </div>
      ) : notices.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl space-y-3">
          <Bell className="w-12 h-12 text-slate-600 mx-auto" />
          <h2 className="text-lg font-bold text-slate-400">No recent circulars found</h2>
          <p className="text-slate-500 text-xs max-w-sm mx-auto">Verify your search keywords or try reloading the feed.</p>
        </div>
      ) : (
        <div className="space-y-4 relative pl-4 sm:pl-6 border-l border-slate-850">
          {notices.map((notice) => (
            <div
              key={notice._id}
              onClick={() => setSelectedNotice(notice)}
              className="relative p-5 bg-slate-900/50 hover:bg-slate-900 border border-slate-850 hover:border-primary-500/20 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer transition-all hover:translate-x-1 group"
            >
              {/* Timeline Indicator node */}
              <div className="absolute left-[-21px] sm:left-[-29px] top-7 w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-slate-700 group-hover:border-primary-500 group-hover:bg-primary-500 transition-all"></div>

              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center space-x-3 text-[10px] text-slate-500 font-bold uppercase">
                  <span className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    {new Date(notice.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="px-1.5 py-0.2 bg-slate-950 text-primary-400 rounded">Official Circular</span>
                </div>
                <h3 className="font-extrabold text-slate-200 text-sm truncate group-hover:text-primary-400 transition-colors">
                  {notice.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-1">
                  {notice.description}
                </p>
              </div>

              <div className="flex items-center text-xs text-primary-400 font-semibold self-end sm:self-auto flex-shrink-0">
                <span>Read Full Circular</span>
                <ChevronRight className="w-4 h-4 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FULL NOTICE READER MODAL */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-6 relative animate-slide-up">
            {/* Close Button */}
            <button
              onClick={() => setSelectedNotice(null)}
              className="absolute top-5 right-5 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-500 uppercase">
                <Calendar className="w-3.5 h-3.5" />
                <span>Published: {new Date(selectedNotice.publishDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <h2 className="text-base font-extrabold text-slate-100 flex items-start space-x-2.5 leading-snug">
                <FileText className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
                <span>{selectedNotice.title}</span>
              </h2>
            </div>

            <div className="p-4 bg-slate-950/60 border border-slate-850 rounded-2xl text-xs text-slate-300 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-line font-medium">
              {selectedNotice.description}
            </div>

            <div className="flex gap-3 pt-3 border-t border-slate-850 justify-end">
              <button
                onClick={() => setSelectedNotice(null)}
                className="glass-button-secondary text-xs px-4 py-2"
              >
                Close Reader
              </button>
              {selectedNotice.link && (
                <a
                  href={selectedNotice.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-button-primary flex items-center space-x-1.5 text-xs px-4 py-2"
                >
                  <span>Open ERP Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticeTracker;
