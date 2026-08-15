import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen        from '../screens/LoginScreen/LoginScreen';
import ProfileSetupScreen from '../screens/ProfileSetupScreen/ProfileSetupScreen';
import HomeScreen         from '../screens/HomeScreen/HomeScreen';
import CreateTripScreen   from '../screens/CreateTripScreen/CreateTripScreen';
import JoinTripScreen     from '../screens/JoinTripScreen/JoinTripScreen';
import MyTripsScreen      from '../screens/MyTripsScreen/MyTripsScreen';
import LiveMapScreen      from '../screens/LiveMapScreen/LiveMapScreen';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/"              element={<LoginScreen />}        />
      <Route path="/profile-setup" element={<ProfileSetupScreen />} />
      <Route path="/home"          element={<HomeScreen />}          />
      <Route path="/create-trip"   element={<CreateTripScreen />}   />
      <Route path="/join-trip"     element={<JoinTripScreen />}     />
      <Route path="/my-trips"      element={<MyTripsScreen />}      />
      <Route path="/map/:tripId"   element={<LiveMapScreen />}      />
      {/* Catch-all */}
      <Route path="*"              element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;