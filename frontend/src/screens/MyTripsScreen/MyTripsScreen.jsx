/**
 * MyTripsScreen — WhatsApp-style list of trips.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../../components/Avatar/Avatar';
import './MyTripsScreen.css';

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

const BikeIcon = ({ color = '#2f6384' }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="5.5" cy="17.5" r="3.5"/>
    <circle cx="18.5" cy="17.5" r="3.5"/>
    <path d="M15 6a1 1 0 0 0-1 1v0a1 1 0 0 0 1 1h2l1.5 3.5"/>
    <path d="M5.5 14L9 8l2 4h5"/>
  </svg>
);

// Demo trips — replace with real data from context/API
const DEMO_TRIPS = [
  { id: 'KFL-A1B2', name: 'Manali Ride 2025',  members: 6, status: 'active'   },
  { id: 'KFL-C3D4', name: 'Leh Expedition',     members: 4, status: 'active'   },
  { id: 'KFL-E5F6', name: 'Weekend Getaway',    members: 3, status: 'ended'    },
  { id: 'KFL-G7H8', name: 'Coorg Coffee Trail', members: 5, status: 'ended'    },
];

const TripRow = ({ trip, onTap }) => (
  <button
    id={`trip-row-${trip.id}`}
    className="trip-row"
    onClick={() => onTap(trip.id)}
    type="button"
    aria-label={`Open ${trip.name}`}
  >
    {/* Avatar/icon */}
    <div className="trip-row__avatar">
      <Avatar name={trip.name} size={48} />
      <BikeIcon />
    </div>

    {/* Info */}
    <div className="trip-row__info">
      <span className="trip-row__name">{trip.name}</span>
      <span className="trip-row__meta">
        {trip.members} {trip.members === 1 ? 'member' : 'members'}
        {trip.status === 'active' && (
          <span className="trip-row__live-badge">● LIVE</span>
        )}
      </span>
    </div>

    {/* ID + chevron */}
    <div className="trip-row__right">
      <span className="trip-row__id font-mono">{trip.id}</span>
      <ChevronRight />
    </div>
  </button>
);

const MyTripsScreen = () => {
  const navigate = useNavigate();

  const handleTripTap = (tripId) => {
    navigate(`/map/${tripId}`);
  };

  return (
    <div className="my-trips-screen screen">
      {/* Header */}
      <header className="my-trips-screen__header">
        <button
          id="my-trips-back-btn"
          className="btn-icon"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          type="button"
        >
          <BackIcon />
        </button>
        <h1 className="my-trips-screen__title">My Trips</h1>
      </header>

      {/* Trip list */}
      <main className="my-trips-screen__list">
        {DEMO_TRIPS.length === 0 ? (
          <div className="my-trips-screen__empty">
            <span aria-hidden="true" style={{ fontSize: 48 }}>🏍️</span>
            <p>No trips yet. Create or join one!</p>
          </div>
        ) : (
          DEMO_TRIPS.map((trip, i) => (
            <React.Fragment key={trip.id}>
              <TripRow trip={trip} onTap={handleTripTap} />
              {i < DEMO_TRIPS.length - 1 && (
                <div className="divider" style={{ margin: '0 16px' }} aria-hidden="true" />
              )}
            </React.Fragment>
          ))
        )}
      </main>
    </div>
  );
};

export default MyTripsScreen;
