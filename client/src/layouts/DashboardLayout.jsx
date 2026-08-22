import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  BookOpen,
  Award,
  User,
  LogOut,
  Menu,
  X,
  Sparkles
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'AI Predictor', path: '/predictor', icon: Sparkles,badge: 'AI' },
  { name: 'PYQ Repository', path: '/pyqs', icon: FileText },
  // { name: 'Study Resources', path: '/notes', icon: BookOpen },
  { name: 'Scholarship Hub', path: '/scholarships', icon: Award },
  { name: 'Profile', path: '/profile', icon: User },
];

  // Helper to map route path to readable name
  const getPageTitle = () => {
    const item = navItems.find((n) => n.path === location.pathname);
    return item ? item.name : 'AKTU Copilot';
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* SIDEBAR FOR DESKTOP */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-slate-900 border-r border-slate-800 flex-shrink-0">
        {/* Brand Logo */}
        <div className="h-20 flex items-center px-6 border-b border-slate-800 space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-primary-400">
              AKTU AI Academic Assistant
            </h1>
            <span className="text-xs text-slate-500 font-medium tracking-wide">AKTU STUDY PORTAL</span>
          </div>
        </div>

        {/* User Card */}
        <div className="p-5 border-b border-slate-800/60">
          <div className="flex items-center space-x-3 p-2 bg-slate-950/40 rounded-xl border border-slate-800/30">
            <div className="w-10 h-10 rounded-lg bg-primary-950/80 border border-primary-800/50 flex items-center justify-center text-primary-400 font-bold uppercase">
              {user?.name ? user.name[0] : 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-semibold text-slate-200 truncate">{user?.name}</h2>
              <p className="text-xs text-slate-500 truncate">{user?.branch}</p>
            </div>
            <div className="px-2 py-0.5 bg-primary-500/10 border border-primary-500/20 rounded-md text-[10px] text-primary-400 font-semibold uppercase">
              S{user?.semester}
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-600/15 to-indigo-600/5 border-l-4 border-primary-500 text-primary-400 font-semibold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 border-l-4 border-transparent'
                  }`
                }
              >
                <div className="flex items-center space-x-3">
                  <IconComponent className="w-5 h-5 transition-transform duration-200 group-hover:scale-105" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded bg-primary-500/10 text-primary-400 border border-primary-500/20">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout bottom */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/20 border border-transparent hover:border-red-900/30 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MOBILE DRAWER DRAWER SIDEBAR */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative flex flex-col w-72 max-w-xs bg-slate-900 border-r border-slate-800 animate-slide-in">
            {/* Close Button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Brand Logo */}
            <div className="h-20 flex items-center px-6 border-b border-slate-800 space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">AKTU Copilot</h1>
                <span className="text-xs text-slate-500 font-medium tracking-wide">ACADEMIC ASSISTANT</span>
              </div>
            </div>

            {/* User Info */}
            <div className="p-5 border-b border-slate-800/60">
              <div className="flex items-center space-x-3 p-2 bg-slate-950/40 rounded-xl border border-slate-800/30">
                <div className="w-9 h-9 rounded-lg bg-primary-950/80 border border-primary-800/50 flex items-center justify-center text-primary-400 font-bold uppercase">
                  {user?.name ? user.name[0] : 'U'}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-semibold text-slate-200 truncate">{user?.name}</h2>
                  <p className="text-xs text-slate-500 truncate">{user?.branch}</p>
                </div>
                <div className="px-1.5 py-0.5 bg-primary-500/10 border border-primary-500/20 rounded-md text-[9px] text-primary-400 font-semibold uppercase">
                  S{user?.semester}
                </div>
              </div>
            </div>

            {/* Links */}
            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                        isActive
                          ? 'bg-primary-600/15 border-l-4 border-primary-500 text-primary-400 font-semibold'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 border-l-4 border-transparent'
                      }`
                    }
                  >
                    <div className="flex items-center space-x-3">
                      <IconComponent className="w-5 h-5" />
                      <span>{item.name}</span>
                    </div>
                  </NavLink>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/20 border border-transparent hover:border-red-900/30 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Bar */}
        <header className="h-20 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 z-10">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-slate-100 font-sans tracking-tight">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs text-slate-400 font-medium">AKTU STUDY PORTAL</span>
              <span className="text-xs text-primary-400 font-semibold">Semester {user?.semester}</span>
            </div>
            <div className="h-8 w-px bg-slate-800 hidden sm:block"></div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-indigo-950 border border-indigo-800 flex items-center justify-center text-xs font-semibold text-indigo-300 uppercase">
                {user?.name ? user.name[0] : 'U'}
              </div>
              <span className="text-sm font-semibold text-slate-300 hidden md:block">{user?.name}</span>
            </div>
          </div>
        </header>

        {/* Inner Content Outlet */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
       
      </div>
    </div>
  );
};

export default DashboardLayout;
