/**
 * SingleInputAction — label + input + primary button.
 * Used in: CreateTripScreen, JoinTripScreen.
 *
 * Props:
 *   id          – unique DOM id prefix
 *   label       – field label text
 *   placeholder – input placeholder
 *   value       – controlled value
 *   onChange(val)
 *   buttonText  – CTA label
 *   onSubmit()
 *   loading     – boolean
 *   disabled    – boolean
 *   hint        – optional helper text below button
 *   inputType   – 'text' | 'search' (default 'text')
 *   maxLength   – max chars
 */

import React from 'react';
import './SingleInputAction.css';

const SingleInputAction = ({
  id = 'single-input',
  label,
  placeholder = '',
  value = '',
  onChange,
  buttonText = 'Submit',
  onSubmit,
  loading = false,
  disabled = false,
  hint,
  inputType = 'text',
  maxLength,
}) => {
  const handleKey = (e) => {
    if (e.key === 'Enter' && !loading && !disabled && value.trim()) {
      onSubmit?.();
    }
  };

  return (
    <div className="single-input-action">
      {label && (
        <label className="input-label" htmlFor={`${id}-input`}>
          {label}
        </label>
      )}
      <input
        id={`${id}-input`}
        className="input-field single-input-action__input"
        type={inputType}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        onKeyDown={handleKey}
        maxLength={maxLength}
        autoComplete="off"
        autoFocus
      />
      <button
        id={`${id}-btn`}
        className="btn-primary single-input-action__btn"
        onClick={onSubmit}
        disabled={disabled || loading || !value.trim()}
        type="button"
      >
        {loading ? (
          <span className="single-input-action__spinner" aria-label="Loading" />
        ) : null}
        {loading ? 'Please wait…' : buttonText}
      </button>
      {hint && <p className="single-input-action__hint">{hint}</p>}
    </div>
  );
};

export default SingleInputAction;
