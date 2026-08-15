/**
 * AvatarInputForm — name + circular photo input form.
 * Used in: ProfileSetupScreen, and future profile-edit screens.
 *
 * Props:
 *   name        – current display name string
 *   avatarUrl   – current photo URL
 *   onNameChange(val)
 *   onAvatarChange(file) – file object from input
 *   onSave()
 *   onSkip()    – close/dismiss without saving
 *   saving      – boolean loading state
 */

import React, { useRef } from 'react';
import Avatar from '../Avatar/Avatar';
import './AvatarInputForm.css';

const CameraIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const AvatarInputForm = ({
  name = '',
  avatarUrl = '',
  onNameChange,
  onAvatarChange,
  onSave,
  onSkip,
  saving = false,
}) => {
  const fileRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onAvatarChange) onAvatarChange(file);
  };

  return (
    <div className="avatar-form glass-card">
      {/* Skip / close button */}
      {onSkip && (
        <button
          id="profile-skip-btn"
          className="avatar-form__skip btn-icon"
          onClick={onSkip}
          aria-label="Skip profile setup"
          type="button"
        >
          <CloseIcon />
        </button>
      )}

      <h2 className="avatar-form__title">Set Up Your Profile</h2>
      <p className="avatar-form__subtitle">This photo appears as your map marker to other riders.</p>

      {/* Avatar preview with map-marker wrapper */}
      <div className="avatar-form__marker-preview">
        <div className="map-marker-pin">
          <div className="map-marker-pin__avatar">
            <Avatar src={avatarUrl} name={name} size={72} ring ringColor="var(--color-primary)" />
          </div>
          <div className="map-marker-pin__tail" />
        </div>
        <span className="map-marker-pin__label">{name || 'Your Name'}</span>
      </div>

      {/* Change photo tap target */}
      <button
        id="avatar-change-photo-btn"
        className="avatar-form__change-photo"
        onClick={() => fileRef.current?.click()}
        type="button"
      >
        <CameraIcon />
        Change Photo
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
        aria-hidden="true"
      />

      {/* Username field */}
      <div className="avatar-form__field">
        <label className="input-label" htmlFor="profile-username-input">Username</label>
        <input
          id="profile-username-input"
          className="input-field"
          type="text"
          value={name}
          onChange={(e) => onNameChange?.(e.target.value)}
          placeholder="Your display name"
          maxLength={40}
          autoComplete="off"
        />
      </div>

      {/* Save button */}
      <button
        id="profile-save-btn"
        className="btn-primary avatar-form__save"
        onClick={onSave}
        disabled={saving || !name.trim()}
        type="button"
      >
        {saving ? 'Saving…' : 'Save Profile'}
      </button>
    </div>
  );
};

export default AvatarInputForm;
