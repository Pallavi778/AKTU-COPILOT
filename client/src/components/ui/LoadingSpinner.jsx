import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '', label = '' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-[1.5px]',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-2',
    xl: 'w-12 h-12 border-[3px]',
  };

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className={`${sizes[size]} border-current border-t-transparent rounded-full animate-spin opacity-70`}
      />
      {label && <span className="text-sm font-body opacity-70">{label}</span>}
    </span>
  );
};

export default LoadingSpinner;
