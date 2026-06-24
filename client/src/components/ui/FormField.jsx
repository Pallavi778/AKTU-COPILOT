import React from 'react';

const FormField = ({
  label,
  id,
  error,
  required,
  hint,
  className = '',
  children,
  ...inputProps
}) => {
  const isSelect = inputProps.as === 'select';

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="label">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      {children ? (
        children
      ) : isSelect ? null : (
        <input
          id={id}
          className={`input-field ${error ? 'error' : ''}`}
          {...inputProps}
        />
      )}

      {hint && !error && (
        <p className="text-xs text-surface-700/50 font-body">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-red-500 font-body flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
};

export default FormField;
