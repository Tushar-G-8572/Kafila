/**
 * CreateTripScreen — single field + Create button, then Trip ID display.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SingleInputAction from '../../components/SingleInputAction/SingleInputAction';
import './CreateTripScreen.css';

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

const CopyIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);

const ShareIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);

function generateTripId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = 'KFL-';
  for (let i = 0; i < 4; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

const CreateTripScreen = () => {
  const navigate = useNavigate();
  const [tripName, setTripName] = useState('');
  const [tripId, setTripId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    // TODO: call backend to create trip and get real ID
    await new Promise((r) => setTimeout(r, 700));
    const id = generateTripId();
    setTripId(id);
    setLoading(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(tripId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({ title: `Join my Kafila trip: ${tripName}`, text: `Trip ID: ${tripId}` });
    } catch {
      handleCopy();
    }
  };

  const handleGoToMap = () => {
    navigate(`/map/${tripId}`);
  };

  return (
    <div className="create-trip-screen screen">
      {/* Header */}
      <header className="create-trip-screen__header">
        <button
          id="create-trip-back-btn"
          className="btn-icon"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          type="button"
        >
          <BackIcon />
        </button>
        <h1 className="create-trip-screen__title">Create a Trip</h1>
      </header>

      <main className="create-trip-screen__body">
        {/* Step 1: Name input */}
        {!tripId && (
          <div className="surface-card create-trip-screen__card">
            <p className="create-trip-screen__desc">
              Give your ride a name. Your group will find it on the map.
            </p>
            <SingleInputAction
              id="create-trip"
              label="Trip Name"
              placeholder="e.g. Manali Ride 2025"
              value={tripName}
              onChange={setTripName}
              buttonText="Create Trip"
              onSubmit={handleCreate}
              loading={loading}
              maxLength={60}
            />
          </div>
        )}

        {/* Step 2: Trip ID display */}
        {tripId && (
          <div className="surface-card create-trip-screen__card">
            <div className="create-trip-screen__success-icon" aria-hidden="true">✅</div>
            <h2 className="create-trip-screen__success-title">Trip Created!</h2>
            <p className="create-trip-screen__success-name">{tripName}</p>

            <div className="create-trip-screen__id-section">
              <div className="code-block create-trip-screen__code">{tripId}</div>
              <div className="create-trip-screen__id-actions">
                <button
                  id="trip-copy-btn"
                  className="btn-outline create-trip-screen__action-btn"
                  onClick={handleCopy}
                  type="button"
                >
                  <CopyIcon />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  id="trip-share-btn"
                  className="btn-outline create-trip-screen__action-btn"
                  onClick={handleShare}
                  type="button"
                >
                  <ShareIcon />
                  Share
                </button>
              </div>
              <p className="create-trip-screen__id-hint">Share this code with your group.</p>
            </div>

            <button
              id="trip-go-to-map-btn"
              className="btn-primary create-trip-screen__go-map"
              onClick={handleGoToMap}
              type="button"
            >
              Open Live Map →
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default CreateTripScreen;
