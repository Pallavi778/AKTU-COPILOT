import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  User,
  Sparkles,
  Mail,
  Lock,
  GraduationCap,
  Save,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const Profile = () => {
  const { user, updateProfile, loading, error } = useAuth();

  // Form states
  const [name, setName] = useState(user?.name || '');
  const [branch, setBranch] = useState(user?.branch || 'Computer Science');
  const [semester, setSemester] = useState(user?.semester || 3);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  const branches = [
    'Computer Science',
    'Information Technology',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering'
  ];

  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess(false);

    if (!name || !branch || !semester) {
      setFormError('Please fill in all profile parameters.');
      return;
    }

    if (password) {
      if (password.length < 6) {
        setFormError('New password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setFormError('Passwords do not match.');
        return;
      }
    }

    try {
      const payload = { name, branch, semester: Number(semester) };
      if (password) {
        payload.password = password;
      }

      await updateProfile(payload);
      setFormSuccess(true);
      setPassword('');
      setConfirmPassword('');
      
      // Clear success badge after duration
      setTimeout(() => {
        setFormSuccess(false);
      }, 3000);
    } catch (err) {
      setFormError(err.message || 'Failed to update profile settings.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <p className="text-xs text-primary-400 font-semibold uppercase tracking-wider">Student details management</p>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-100 flex items-center space-x-2">
          <User className="w-8 h-8 text-primary-500" />
          <span>Profile Settings</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Avatar Badge Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel rounded-3xl p-6 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary-600 to-indigo-650 flex items-center justify-center mx-auto border border-primary-500 shadow-xl">
              <span className="text-2xl font-extrabold text-white uppercase">{user?.name ? user.name[0] : 'U'}</span>
            </div>

            <div>
              <h2 className="text-base font-extrabold text-slate-200">{user?.name}</h2>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>

            <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-2xl divide-y divide-slate-800 text-xs">
              <div className="pb-2 flex justify-between font-semibold">
                <span className="text-slate-500">Branch:</span>
                <span className="text-slate-350 text-right truncate max-w-[60%]">{user?.branch}</span>
              </div>
              <div className="pt-2 flex justify-between font-semibold">
                <span className="text-slate-500">Semester:</span>
                <span className="text-primary-400 font-bold">Sem {user?.semester}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Form Update Editor */}
        <div className="lg:col-span-2">
          <div className="glass-panel rounded-3xl p-6 lg:p-8 space-y-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-3">Edit Profile Settings</h3>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {(formError || error) && (
                <div className="p-4 bg-red-950/40 border border-red-900/50 rounded-2xl flex items-center space-x-2 text-red-300 text-xs">
                  <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
                  <span>{formError || error}</span>
                </div>
              )}

              {formSuccess && (
                <div className="p-4 bg-emerald-950/40 border border-emerald-900/50 rounded-2xl flex items-center space-x-2 text-emerald-300 text-xs">
                  <CheckCircle className="w-4.5 h-4.5 flex-shrink-0" />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-primary-500"
                />
              </div>

              {/* Email (Disabled) */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">University Email (Read-only)</label>
                <div className="relative">
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full bg-slate-950/40 border border-slate-800/60 rounded-xl px-3 py-2.5 text-xs text-slate-550 focus:outline-none cursor-not-allowed"
                  />
                  <Mail className="absolute right-3 top-3 w-4 h-4 text-slate-600" />
                </div>
              </div>

              {/* Branch & Semester Dropdowns */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Branch</label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2.5 text-xs focus:outline-none text-slate-300 cursor-pointer"
                  >
                    {branches.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Semester</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2.5 text-xs focus:outline-none text-slate-300 cursor-pointer"
                  >
                    {semesters.map(s => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Change Password (Optional)</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">New Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-primary-500"
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-primary-500"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full glass-button-primary flex items-center justify-center space-x-2 py-3 shadow-md cursor-pointer"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Profile Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
