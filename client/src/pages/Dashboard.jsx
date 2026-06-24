import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import API from '../services/api';
import {
  Sparkles,
  BookOpen,
  FileText,
  Bell,
  Award,
  Calendar,
  ChevronRight,
  TrendingUp,
  BrainCircuit,
  MessageSquare
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    pyqCount: 3,
    notesCount: 2,
    scholarshipsCount: 3,
    noticesCount: 3,
  });
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch stats counts
        const pyqRes = await API.get(`/pyqs?branch=${user?.branch || ''}&semester=${user?.semester || ''}`);
        const notesRes = await API.get(`/notes?branch=${user?.branch || ''}&semester=${user?.semester || ''}`);
        const schRes = await API.get('/scholarships');
        const notRes = await API.get('/notices');

        setStats({
          pyqCount: pyqRes.data.count || 3,
          notesCount: notesRes.data.count || 2,
          scholarshipsCount: schRes.data.count || 3,
          noticesCount: notRes.data.count || 3,
        });

        // Get latest 3 notices
        setNotices(notRes.data.data ? notRes.data.data.slice(0, 3) : []);
      } catch (error) {
        console.error('Failed to load dashboard metrics', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const statCards = [
    { name: 'PYQ Papers', count: stats.pyqCount, icon: FileText, color: 'text-sky-400 bg-sky-500/10 border-sky-500/20', link: '/pyqs' },
    { name: 'Semester Notes', count: stats.notesCount, icon: BookOpen, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20', link: '/notes' },
    { name: 'Scholarships', count: stats.scholarshipsCount, icon: Award, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', link: '/scholarships' },
    { name: 'Active Notices', count: stats.noticesCount, icon: Bell, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', link: '/notices' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-primary-950 to-slate-900 border border-slate-800 p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-80 h-80 bg-primary-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/25 text-xs text-primary-400 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome Back, Copilot Ready</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-100">
            Hi, {user?.name}!
          </h1>
          <p className="text-slate-400 max-w-xl text-sm lg:text-base">
            Your academic portal for **{user?.branch}** (Semester {user?.semester}) is loaded. Get AI assistance, analyze high-frequency exam topics, or try the viva simulator.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 relative z-10">
          <Link to="/ai-assistant" className="glass-button-primary flex items-center space-x-2 text-sm px-5 py-3">
            <MessageSquare className="w-4 h-4" />
            <span>Ask Assistant</span>
          </Link>
          <Link to="/planner" className="glass-button-secondary flex items-center space-x-2 text-sm px-5 py-3">
            <Calendar className="w-4 h-4" />
            <span>Plan Study</span>
          </Link>
        </div>
      </div>

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Link
              key={stat.name}
              to={stat.link}
              className="glass-card p-5 flex items-center justify-between group hover:translate-y-[-2px] transition-all"
            >
              <div className="space-y-1">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{stat.name}</span>
                <p className="text-2xl lg:text-3xl font-extrabold text-slate-100">
                  {loading ? (
                    <span className="inline-block w-8 h-6 skeleton rounded"></span>
                  ) : (
                    stat.count
                  )}
                </p>
              </div>
              <div className={`p-3 rounded-xl border ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                <IconComponent className="w-6 h-6" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Main Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Columns - Quick Access Modules */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick AI Tools Section */}
          <div className="glass-panel rounded-3xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-200 flex items-center space-x-2">
              <BrainCircuit className="w-5 h-5 text-primary-400" />
              <span>Smart Study Features</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to="/pyq-analytics"
                className="p-5 bg-slate-950/40 hover:bg-slate-950/80 rounded-2xl border border-slate-800 hover:border-primary-500/20 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/25 flex items-center justify-center text-sky-400 mb-4 group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-200 group-hover:text-primary-400 transition-colors">PYQ Analytics</h3>
                  <p className="text-xs text-slate-500 mt-1">Review unit importance, topic repetitions, and confidence prediction scales.</p>
                </div>
                <div className="flex items-center text-xs font-semibold text-primary-400 mt-6 group-hover:translate-x-1 transition-transform">
                  <span>Analyze Papers</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </Link>

              <Link
                to="/viva"
                className="p-5 bg-slate-950/40 hover:bg-slate-950/80 rounded-2xl border border-slate-800 hover:border-primary-500/20 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                    <BrainCircuit className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-200 group-hover:text-primary-400 transition-colors">Viva Prep</h3>
                  <p className="text-xs text-slate-500 mt-1">Mock viva simulation with dynamic technical questions and local grading feedback.</p>
                </div>
                <div className="flex items-center text-xs font-semibold text-primary-400 mt-6 group-hover:translate-x-1 transition-transform">
                  <span>Start Mock Exam</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </Link>
            </div>
          </div>

          {/* Academic Actions Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/pyqs"
              className="p-6 bg-slate-900 border border-slate-800/70 hover:border-sky-500/25 rounded-2xl flex items-center justify-between group"
            >
              <div className="space-y-1">
                <h3 className="font-bold text-slate-200">Browse PYQ Repository</h3>
                <p className="text-xs text-slate-500">Download papers, check year patterns, filter by subject.</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/notes"
              className="p-6 bg-slate-900 border border-slate-800/70 hover:border-indigo-500/25 rounded-2xl flex items-center justify-between group"
            >
              <div className="space-y-1">
                <h3 className="font-bold text-slate-200">Access Notes Database</h3>
                <p className="text-xs text-slate-500">Unit-wise notes, chapter-wise documents, or upload your own.</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Right Column - University Announcements Feed */}
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 space-y-5 flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h2 className="text-lg font-bold text-slate-200 flex items-center space-x-2">
                  <Bell className="w-5 h-5 text-primary-400" />
                  <span>University Notices</span>
                </h2>
                <Link to="/notices" className="text-xs font-semibold text-primary-400 hover:text-primary-300">
                  View All
                </Link>
              </div>

              {/* Notice Timeline */}
              <div className="mt-4 space-y-4">
                {loading ? (
                  [1, 2, 3].map((n) => (
                    <div key={n} className="space-y-2">
                      <div className="h-4 w-3/4 skeleton rounded"></div>
                      <div className="h-3 w-1/2 skeleton rounded"></div>
                    </div>
                  ))
                ) : notices.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-6">No notices currently synced.</p>
                ) : (
                  notices.map((notice) => (
                    <div key={notice._id} className="relative pl-4 border-l-2 border-slate-800 group hover:border-primary-500 transition-colors py-1">
                      <span className="text-[10px] font-bold text-slate-500">
                        {new Date(notice.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <h3 className="text-sm font-semibold text-slate-300 group-hover:text-primary-400 transition-colors line-clamp-1">
                        {notice.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{notice.description}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/60 text-center mt-6">
              <Link
                to="/scholarships"
                className="inline-flex items-center text-xs font-bold text-emerald-400 hover:text-emerald-300 group"
              >
                <span>Track Scholarship Deadlines</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
