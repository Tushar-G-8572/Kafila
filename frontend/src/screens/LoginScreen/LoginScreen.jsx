/**
 * LoginScreen — full-bleed mountain background + centered glass card.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleSignInButton from '../../components/GoogleSignInButton/GoogleSignInButton';
import mountainBg from '../../assets/mountain_road_bg.png';
import './LoginScreen.css';

const KafilaLogo = () => (
  <svg className="login__logo-icon" width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="18" cy="18" r="18" fill="var(--color-primary)" opacity="0.12"/>
    {/* Winding road / route icon */}
    <path d="M10 28 Q14 20 18 18 Q22 16 26 8" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    <circle cx="18" cy="18" r="3" fill="var(--color-primary)"/>
    <circle cx="10" cy="28" r="2" fill="var(--color-primary)" opacity="0.5"/>
    <circle cx="26" cy="8"  r="2" fill="var(--color-primary)" opacity="0.5"/>
  </svg>
);

const LoginScreen = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = () => {
    // In production: trigger Firebase/Google OAuth flow.
    // For now: navigate to profile setup (first-time) or dashboard.
    navigate('/profile-setup');
  };

  return (
    <div className="login-screen screen screen--fullscreen">
      {/* Full-bleed background */}
      <div
        className="login-screen__bg"
        style={{ backgroundImage: `url(${mountainBg})` }}
        aria-hidden="true"
      />
      {/* Overlay for readability */}
      <div className="login-screen__overlay" aria-hidden="true" />

      {/* Centered glass card */}
      <main className="login-screen__content z-content">
        <div className="login-card glass-card" role="main">
          <div className="login-card__brand">
            <KafilaLogo />
            <h1 className="login-card__appname">Kafila</h1>
          </div>
          <p className="login-card__tagline">Ride together, never get lost.</p>

          <div className="login-card__divider" aria-hidden="true" />

          <GoogleSignInButton onClick={handleGoogleSignIn} />

          <p className="login-card__legal">
            By continuing, you agree to our&nbsp;
            <a href="#" className="login-card__link">Terms</a>
            &nbsp;and&nbsp;
            <a href="#" className="login-card__link">Privacy Policy</a>.
          </p>
        </div>
      </main>
    </div>
  );
};

export default LoginScreen;
