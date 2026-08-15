/**
 * Avatar — circular image with initials fallback.
 * Used in: Profile Setup, Trip List rows, Map markers.
 *
 * Props:
 *   src      – image URL (optional)
 *   name     – display name (used for initials + aria-label)
 *   size     – pixel diameter (default 48)
 *   ring     – show a border ring (boolean, default false)
 *   ringColor– CSS color for ring (default primary)
 *   className– extra CSS class names
 */

import React, { useState } from 'react';
import './Avatar.css';

function getInitials(name = '') {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  if (parts[0]?.length) return parts[0].slice(0, 2).toUpperCase();
  return '?';
}

function hashColor(name = '') {
  const palette = [
    '#4a7c9e', '#5b8fa8', '#6a9fb5',
    '#7aafbf', '#8abfca', '#4a8c7e',
    '#5a9c8e', '#6aac9e',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return palette[Math.abs(hash) % palette.length];
}

const Avatar = ({
  src,
  name = '',
  size = 48,
  ring = false,
  ringColor,
  className = '',
  style = {},
}) => {
  const [imgError, setImgError] = useState(false);
  const showImg = src && !imgError;
  const initials = getInitials(name);
  const bgColor = hashColor(name);
  const fontSize = Math.max(10, Math.floor(size * 0.38));

  const containerStyle = {
    width: size,
    height: size,
    flexShrink: 0,
    borderRadius: '50%',
    border: ring ? `3px solid ${ringColor || 'var(--color-primary)'}` : 'none',
    boxShadow: ring ? '0 0 0 2px white' : 'none',
    overflow: 'hidden',
    position: 'relative',
    ...style,
  };

  return (
    <div
      className={`kafila-avatar ${className}`}
      style={containerStyle}
      aria-label={name || 'Avatar'}
      title={name}
    >
      {showImg ? (
        <img
          src={src}
          alt={name}
          onError={() => setImgError(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        <div
          className="kafila-avatar__initials"
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: bgColor,
            color: '#ffffff',
            fontFamily: 'var(--font-headline)',
            fontSize: fontSize,
            fontWeight: 700,
            userSelect: 'none',
          }}
        >
          {initials}
        </div>
      )}
    </div>
  );
};

export default Avatar;
