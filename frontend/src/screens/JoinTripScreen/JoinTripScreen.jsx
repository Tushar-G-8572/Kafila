/**
 * JoinTripScreen — paste Trip ID / link + Join button.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SingleInputAction from '../../components/SingleInputAction/SingleInputAction';
import './JoinTripScreen.css';

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

const JoinTripScreen = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;

    setError('');
    setLoading(true);
    // TODO: verify trip ID with backend
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);

    // Naive extraction: accept either bare ID or URL containing an ID
    const match = trimmed.match(/KFL-[A-Z0-9]{4}/);
    const tripId = match ? match[0] : trimmed;
    navigate(`/map/${tripId}`);
  };

  return (
    <div className="join-trip-screen screen">
      {/* Header */}
      <header className="join-trip-screen__header">
        <button
          id="join-trip-back-btn"
          className="btn-icon"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          type="button"
        >
          <BackIcon />
        </button>
        <h1 className="join-trip-screen__title">Join a Trip</h1>
      </header>

      <main className="join-trip-screen__body">
        <div className="surface-card join-trip-screen__card">
          <div className="join-trip-screen__icon" aria-hidden="true">🗺️</div>
          <p className="join-trip-screen__desc">
            Ask your group leader for the trip code and paste it below to jump into the live map.
          </p>

          <SingleInputAction
            id="join-trip"
            label="Trip ID or Link"
            placeholder="e.g. KFL-4B2X or paste a link"
            value={code}
            onChange={(val) => { setCode(val); setError(''); }}
            buttonText="Join Trip"
            onSubmit={handleJoin}
            loading={loading}
            maxLength={200}
          />

          {error && (
            <p className="join-trip-screen__error" role="alert">{error}</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default JoinTripScreen;
