/**
 * LiveMapScreen — full-screen map with rider markers, message drawer & toasts.
 * Integrates react-leaflet, socket.io, and the MessageToast component.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useGeolocated } from 'react-geolocated';
import 'leaflet/dist/leaflet.css';
import Avatar from '../../components/Avatar/Avatar';
import MessageToast from '../../components/MessageToast/MessageToast';
import socket from '../../features/location/util/socket';
import './LiveMapScreen.css';

// ── Fix default Leaflet icon paths broken by Vite ──────────────
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon    from 'leaflet/dist/images/marker-icon.png';
import markerShadow  from 'leaflet/dist/images/marker-shadow.png';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: markerIcon2x, iconUrl: markerIcon, shadowUrl: markerShadow });

// ── SVG icons ──────────────────────────────────────────────────
const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
const MessageIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const CenterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
    <line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/>
    <line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/>
  </svg>
);
const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

// ── Custom avatar marker factory ────────────────────────────────
function createAvatarMarkerIcon(name, avatarUrl, isMe = false) {
  const initials = name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const ring = isMe ? '#2f6384' : '#4a7c9e';
  const img = avatarUrl
    ? `<img src="${avatarUrl}" alt="${name}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block"/>`
    : `<div style="width:100%;height:100%;border-radius:50%;background:#4a7c9e;display:flex;align-items:center;justify-content:center;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:14px;color:white">${initials}</div>`;

  const html = `
    <div class="rider-marker">
      <div class="rider-marker__photo" style="border-color:${ring}">${img}</div>
      <div class="rider-marker__tail" style="border-top-color:${ring}"></div>
      <div class="rider-marker__label">${name}</div>
    </div>`;

  return L.divIcon({ html, className: '', iconAnchor: [24, 52], popupAnchor: [0, -54] });
}

// ── Map re-centerer sub-component ───────────────────────────────
function RecenterMap({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.setView([coords.latitude, coords.longitude], map.getZoom(), { animate: true });
  }, [coords, map]);
  return null;
}

// ── Quick message definitions ───────────────────────────────────
const QUICK_MESSAGES = [
  { key: 'emergency', label: '🚨 Emergency', type: 'emergency' },
  { key: 'refuel',    label: '⛽ Refueling',  type: 'refuel'    },
  { key: 'break',     label: '☕ Break',       type: 'break'     },
];

const LiveMapScreen = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();

  // Local user info (replace with auth context)
  const myUserId   = useRef(crypto.randomUUID()).current;
  const myName     = 'Me';
  const myAvatar   = '';

  // Riders state: { userId: { lat, lng, name, avatarUrl } }
  const [riders, setRiders] = useState({});

  // Message drawer & toasts
  const [drawerOpen, setDrawerOpen]     = useState(false);
  const [customMsg, setCustomMsg]       = useState('');
  const [toasts, setToasts]             = useState([]);
  const [recenter, setRecenter]         = useState(false);

  // Geolocation
  const { coords } = useGeolocated({
    positionOptions: { enableHighAccuracy: true },
    watchPosition: true,
    userDecisionTimeout: 10000,
  });

  // Join trip room
  useEffect(() => {
    if (tripId) socket.emit('join-room', tripId);
  }, [tripId]);

  // Broadcast own location
  useEffect(() => {
    if (coords && tripId) {
      socket.emit('location-update', {
        groupId: tripId,
        userId:  myUserId,
        name:    myName,
        avatarUrl: myAvatar,
        lat: coords.latitude,
        lng: coords.longitude,
      });
    }
  }, [coords, tripId, myUserId, myName, myAvatar]);

  // Listen for other riders' locations
  useEffect(() => {
    const handler = ({ userId, lat, lng, name, avatarUrl }) => {
      setRiders((prev) => ({ ...prev, [userId]: { lat, lng, name: name || userId, avatarUrl: avatarUrl || '' } }));
    };
    socket.on('rider-location', handler);
    return () => socket.off('rider-location', handler);
  }, []);

  // Listen for incoming messages
  useEffect(() => {
    const handler = ({ senderName, text, type }) => {
      addToast({ senderName, text, type });
      // Play notification sound for emergency
      if (type === 'emergency') {
        try { new Audio('/notify.mp3').play(); } catch { /* ignore */ }
      }
    };
    socket.on('group-message', handler);
    return () => socket.off('group-message', handler);
  }, []);

  // ── Toast helpers ─────────────────────────────────────────────
  const addToast = useCallback((msg) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [{ id, ...msg }, ...prev].slice(0, 4)); // max 4
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── Send message ──────────────────────────────────────────────
  const sendMessage = useCallback((text, type = 'info') => {
    if (!text.trim()) return;
    socket.emit('group-message', { groupId: tripId, senderName: myName, text: text.trim(), type });
    // Show locally too
    addToast({ senderName: 'You', text: text.trim(), type });
    setCustomMsg('');
    setDrawerOpen(false);
  }, [tripId, myName, addToast]);

  const handleQuickSend = (qm) => sendMessage(qm.label.replace(/^.+? /, ''), qm.type);
  const handleCustomSend = () => sendMessage(customMsg, 'info');

  // ── Render ────────────────────────────────────────────────────
  const defaultCenter = [28.6139, 77.2090]; // Delhi fallback

  return (
    <div className="live-map-screen screen screen--fullscreen">
      {/* Map */}
      <MapContainer
        center={coords ? [coords.latitude, coords.longitude] : defaultCenter}
        zoom={14}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* My marker */}
        {coords && (
          <Marker
            position={[coords.latitude, coords.longitude]}
            icon={createAvatarMarkerIcon(myName, myAvatar, true)}
          >
            <Popup>{myName} (You)</Popup>
          </Marker>
        )}

        {/* Other riders */}
        {Object.entries(riders).map(([uid, rider]) => (
          <Marker
            key={uid}
            position={[rider.lat, rider.lng]}
            icon={createAvatarMarkerIcon(rider.name, rider.avatarUrl, false)}
          >
            <Popup>{rider.name}</Popup>
          </Marker>
        ))}

        {/* Re-center effect */}
        {recenter && coords && (
          <RecenterMap coords={coords} />
        )}
      </MapContainer>

      {/* Toast stack */}
      <MessageToast messages={toasts} onDismiss={dismissToast} />

      {/* Back button */}
      <button
        id="map-back-btn"
        className="live-map-screen__back btn-icon"
        onClick={() => navigate('/my-trips')}
        aria-label="Back to trips"
        type="button"
      >
        <BackIcon />
      </button>

      {/* Trip ID badge */}
      {tripId && (
        <div className="live-map-screen__trip-badge glass-card">
          <span className="font-mono">{tripId}</span>
        </div>
      )}

      {/* Floating controls (bottom-right) */}
      <div className="live-map-screen__fab-stack">
        <button
          id="map-center-btn"
          className="live-map-screen__center-btn btn-icon"
          onClick={() => { setRecenter(false); setTimeout(() => setRecenter(true), 50); }}
          aria-label="Center on my location"
          type="button"
        >
          <CenterIcon />
        </button>
        <button
          id="map-message-btn"
          className="live-map-screen__message-fab"
          onClick={() => setDrawerOpen(true)}
          aria-label="Send a message to the group"
          type="button"
        >
          <MessageIcon />
        </button>
      </div>

      {/* ── Message Drawer ──────────────────────────────────────── */}
      {drawerOpen && (
        <>
          <div
            className="live-map-screen__drawer-backdrop"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <div
            className="live-map-screen__drawer surface-card"
            role="dialog"
            aria-modal="true"
            aria-label="Send a message to the group"
          >
            <div className="live-map-screen__drawer-handle" aria-hidden="true" />

            <div className="live-map-screen__drawer-header">
              <h2 className="live-map-screen__drawer-title">Quick Message</h2>
              <button
                id="drawer-close-btn"
                className="btn-icon"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close message drawer"
                type="button"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Quick chips */}
            <div className="live-map-screen__quick-btns">
              {QUICK_MESSAGES.map((qm) => (
                <button
                  id={`quick-msg-${qm.key}`}
                  key={qm.key}
                  className={`chip chip--${qm.type === 'emergency' ? 'emergency' : 'neutral'} live-map-screen__quick-chip`}
                  onClick={() => handleQuickSend(qm)}
                  type="button"
                >
                  {qm.label}
                </button>
              ))}
            </div>

            <div className="divider" aria-hidden="true" />

            {/* Custom message */}
            <div className="live-map-screen__custom-row">
              <input
                id="custom-msg-input"
                className="input-field live-map-screen__custom-input"
                type="text"
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder="Custom message…"
                onKeyDown={(e) => e.key === 'Enter' && handleCustomSend()}
                maxLength={200}
              />
              <button
                id="custom-msg-send-btn"
                className="live-map-screen__send-btn btn-primary"
                onClick={handleCustomSend}
                disabled={!customMsg.trim()}
                type="button"
                aria-label="Send message"
              >
                <SendIcon />
                Send
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LiveMapScreen;
