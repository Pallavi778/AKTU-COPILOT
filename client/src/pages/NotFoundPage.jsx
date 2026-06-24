import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => (
  <div className="min-h-screen bg-surface-50 flex items-center justify-center px-4">
    <div className="text-center max-w-sm">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-6">
        <GraduationCap size={28} className="text-brand-500" />
      </div>
      <h1 className="font-display font-bold text-4xl text-surface-900 mb-2">404</h1>
      <p className="font-display font-semibold text-surface-700 text-lg mb-2">Page not found</p>
      <p className="text-surface-700/50 font-body text-sm mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/dashboard" className="btn-primary inline-flex">
        <ArrowLeft size={15} /> Back to Dashboard
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
