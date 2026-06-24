import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  BookOpen,
  FileText,
  ChevronLeft,
  ChevronRight,
  LogOut,
  GraduationCap,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/subjects', icon: BookOpen, label: 'Subjects' },
  { to: '/pyq', icon: FileText, label: 'PYQ Repository' },
  { to: '/profile', icon: User, label: 'My Profile' },
];

const Sidebar = ({ mobileOpen, onMobileClose }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarContent = (
    <div
      className={`flex flex-col h-full bg-surface-950 text-white transition-all duration-300
        ${collapsed ? 'w-16' : 'w-64'}`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/10 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shrink-0 shadow-glow">
          <GraduationCap size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="font-display font-bold text-sm leading-tight truncate">AKTU Copilot</p>
            <p className="text-[10px] text-white/40 font-body truncate">Academic Assistant</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onMobileClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-display font-medium
              transition-all duration-150 group
              ${isActive
                ? 'bg-brand-600/90 text-white shadow-glow'
                : 'text-white/60 hover:text-white hover:bg-white/8'
              }
              ${collapsed ? 'justify-center' : ''}`
            }
          >
            <Icon size={17} className="shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className={`border-t border-white/10 p-3 space-y-1 ${collapsed ? 'items-center flex flex-col' : ''}`}>
        {!collapsed && user && (
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-white/5 transition-colors">
            <Avatar name={user.name} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-display font-semibold truncate">{user.name}</p>
              <p className="text-[10px] text-white/40 truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-display font-medium
            text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150
            ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={16} className="shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>

        {/* Collapse toggle — desktop only */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className={`hidden lg:flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm
            text-white/30 hover:text-white/60 hover:bg-white/5 transition-all duration-150
            ${collapsed ? 'justify-center' : ''}`}
        >
          {collapsed ? <ChevronRight size={15} /> : (
            <>
              <ChevronLeft size={15} />
              <span className="text-xs">Collapse</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex h-screen sticky top-0 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          <aside className="relative flex h-full z-10">
            {sidebarContent}
          </aside>
          <button
            onClick={onMobileClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/10 text-white"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </>
  );
};

export default Sidebar;
