import React from 'react';

const colorPalette = [
  'bg-blue-500',
  'bg-violet-500',
  'bg-rose-500',
  'bg-amber-500',
  'bg-emerald-500',
  'bg-cyan-500',
  'bg-pink-500',
  'bg-indigo-500',
];

const getColor = (name = '') => {
  const index = name.charCodeAt(0) % colorPalette.length;
  return colorPalette[index];
};

const getInitials = (name = '') =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

const sizes = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
  '2xl': 'w-20 h-20 text-2xl',
};

const Avatar = ({ name = '', src = null, size = 'md', className = '' }) => {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover shrink-0 ${className}`}
      />
    );
  }

  return (
    <span
      className={`${sizes[size]} ${getColor(name)} rounded-full inline-flex items-center justify-center
        text-white font-display font-bold shrink-0 select-none ${className}`}
    >
      {getInitials(name)}
    </span>
  );
};

export default Avatar;
