/**
 * MessageToast — top-of-map notification banner.
 * Used in: LiveMapScreen.
 *
 * Props:
 *   messages  – array of { id, senderName, text, type: 'emergency'|'info'|'break'|'refuel' }
 *   onDismiss(id) – called when toast times out or is tapped
 */

import React, { useEffect, useRef } from 'react';
import './MessageToast.css';

const ICONS = {
  emergency: '🚨',
  refuel:    '⛽',
  break:     '☕',
  info:      '💬',
};

const AUTO_DISMISS_MS = {
  emergency: 8000,
  refuel:    5000,
  break:     5000,
  info:      5000,
};

const Toast = ({ message, onDismiss }) => {
  const { id, senderName, text, type = 'info' } = message;
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => onDismiss(id), AUTO_DISMISS_MS[type] ?? 5000);
    return () => clearTimeout(timerRef.current);
  }, [id, type, onDismiss]);

  return (
    <div
      className={`message-toast message-toast--${type}`}
      role="alert"
      aria-live="assertive"
      onClick={() => onDismiss(id)}
    >
      <span className="message-toast__icon" aria-hidden="true">{ICONS[type]}</span>
      <div className="message-toast__body">
        <span className="message-toast__sender">{senderName}</span>
        <span className="message-toast__text">{text}</span>
      </div>
      <button
        className="message-toast__close"
        onClick={(e) => { e.stopPropagation(); onDismiss(id); }}
        aria-label="Dismiss notification"
        type="button"
      >
        ✕
      </button>
    </div>
  );
};

const MessageToast = ({ messages = [], onDismiss }) => {
  if (!messages.length) return null;

  return (
    <div className="message-toast-stack" aria-label="Notifications">
      {messages.map((msg) => (
        <Toast key={msg.id} message={msg} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

export default MessageToast;
