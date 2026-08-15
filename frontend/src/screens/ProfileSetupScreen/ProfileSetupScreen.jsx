/**
 * ProfileSetupScreen — post-login profile configuration.
 * Blurred mountain background, dismissible glass card with AvatarInputForm.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AvatarInputForm from '../../components/AvatarInputForm/AvatarInputForm';
import mountainBg from '../../assets/mountain_road_bg.png';
import './ProfileSetupScreen.css';

const ProfileSetupScreen = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('Rider Name');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAvatarChange = (file) => {
    const url = URL.createObjectURL(file);
    setAvatarUrl(url);
  };

  const handleSave = async () => {
    setSaving(true);
    // TODO: persist to backend / Firebase
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    navigate('/home');
  };

  const handleSkip = () => {
    navigate('/home');
  };

  return (
    <div className="profile-setup-screen screen screen--fullscreen">
      {/* Blurred background */}
      <div
        className="profile-setup-screen__bg"
        style={{ backgroundImage: `url(${mountainBg})` }}
        aria-hidden="true"
      />

      <main className="profile-setup-screen__content z-content">
        <AvatarInputForm
          name={name}
          avatarUrl={avatarUrl}
          onNameChange={setName}
          onAvatarChange={handleAvatarChange}
          onSave={handleSave}
          onSkip={handleSkip}
          saving={saving}
        />
      </main>
    </div>
  );
};

export default ProfileSetupScreen;
