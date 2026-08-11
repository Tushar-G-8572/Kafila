import React, { useEffect, useRef } from "react";
import { useGeolocated } from "react-geolocated";
import socket from "../location/util/socket";

const Demo = () => {
  const groupId = "test-room"; // abhi ke liye hardcode, baad me URL param/auth se aayega
  const userId = useRef(crypto.randomUUID()).current; // temp id jab tak auth nahi bana

  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: { enableHighAccuracy: false },
      userDecisionTimeout: 5000,
      watchPosition: true, // 👈 ye zaroor add karo, warna sirf ek baar location milegi
    });

  // room join — connect hote hi ek baar
  useEffect(() => {
    socket.emit("join-room", groupId);
  }, []);

  // jab bhi coords change ho, server ko bhejo
  useEffect(() => {
    if (coords) {
      socket.emit("location-update", {
        groupId,
        userId,
        lat: coords.latitude,
        lng: coords.longitude,
      });
    }
  }, [coords]);

  // baaki riders ki location sunna (abhi sirf console log, map next step me)
  useEffect(() => {
    socket.on("rider-location", (data) => {
      console.log("Other rider:", data);
    });
    return () => socket.off("rider-location");
  }, []);

  return !isGeolocationAvailable ? (
    <div>Your browser does not support Geolocation</div>
  ) : !isGeolocationEnabled ? (
    <div>Geolocation is not enabled</div>
  ) : coords ? (
    <table>
      <tbody>
        <tr><td>latitude</td><td>{coords.latitude}</td></tr>
        <tr><td>longitude</td><td>{coords.longitude}</td></tr>
      </tbody>
    </table>
  ) : (
    <div>Getting the location data&hellip;</div>
  );
};

export default Demo;