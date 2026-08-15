/**
 * HomeScreen — Dashboard with blurred bg, Create/Join Trip CTAs, user avatar.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../../components/Avatar/Avatar';
import mountainBg from '../../assets/mountain_road_bg.png';
import './HomeScreen.css';

const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const GroupIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const ListIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);

const HomeScreen = () => {
  const navigate = useNavigate();
  // TODO: pull from auth context
  const userName = 'Rider Name';
  const userAvatar = '';

  return (
    <div className="home-screen screen screen--fullscreen">
      {/* Blurred background */}
      <div
        className="home-screen__bg"
        style={{ backgroundImage: `url(${mountainBg})` }}
        aria-hidden="true"
      />

      {/* Top-right user chip */}
      <header className="home-screen__header z-content">
        <div className="home-screen__user-chip glass-card">
          <Avatar src={userAvatar} name={userName} size={32} />
          <span className="home-screen__user-name">{userName}</span>
        </div>
      </header>

      {/* Main content */}
      <main className="home-screen__main z-content">
        <div className="home-screen__hero">
          <h1 className="home-screen__title">Kafila</h1>
          <p className="home-screen__subtitle">Where are your riders?</p>
        </div>

        <div className="home-screen__actions">
          {/* Create Trip */}
          <button
            id="home-create-trip-btn"
            className="home-screen__action-card glass-card"
            onClick={() => navigate('/create-trip')}
            type="button"
          >
            <span className="home-screen__action-icon home-screen__action-icon--primary">
              <PlusIcon />
            </span>
            <div>
              <div className="home-screen__action-title">Create Trip</div>
              <div className="home-screen__action-desc">Start a new group ride</div>
            </div>
          </button>

          {/* Join Trip */}
          <button
            id="home-join-trip-btn"
            className="home-screen__action-card glass-card"
            onClick={() => navigate('/join-trip')}
            type="button"
          >
            <span className="home-screen__action-icon home-screen__action-icon--secondary">
              <GroupIcon />
            </span>
            <div>
              <div className="home-screen__action-title">Join Trip</div>
              <div className="home-screen__action-desc">Enter a trip code or link</div>
            </div>
          </button>
        </div>

        {/* My Trips link */}
        <button
          id="home-my-trips-btn"
          className="home-screen__my-trips glass-card"
          onClick={() => navigate('/my-trips')}
          type="button"
        >
          <ListIcon />
          <span>My Trips</span>
        </button>
      </main>
    </div>
  );
};

export default HomeScreen;
