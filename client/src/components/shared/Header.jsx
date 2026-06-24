import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';
import { useNavigate } from 'react-router-dom';

const Header = ({ onMenuClick, title = '' }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-surface-200 px-4 lg:px-6 h-14 flex items-center gap-3">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg hover:bg-surface-100 text-surface-600 transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Page title */}
      {title && (
        <h1 className="font-display font-semibold text-surface-900 text-base truncate flex-1">
          {title}
        </h1>
      )}

      <div className="ml-auto flex items-center gap-2">
        <button className="relative p-2 rounded-lg hover:bg-surface-100 text-surface-600 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-500" />
        </button>
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-surface-100 transition-colors"
        >
          <Avatar name={user?.name} size="sm" />
          <span className="hidden sm:block text-sm font-display font-medium text-surface-800 max-w-[120px] truncate">
            {user?.name}
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;
