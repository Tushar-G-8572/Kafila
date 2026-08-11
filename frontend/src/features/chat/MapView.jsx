import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useGeolocated } from "react-geolocated";
import socket from "../location/util/socket";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const groupId = "test-room";

const MapView = () => {
  const userId = useRef(crypto.randomUUID()).current;
  const [riders, setRiders] = useState({}); // { userId: {lat, lng} }

  const { coords } = useGeolocated({
    positionOptions: { enableHighAccuracy: false },
    watchPosition: true,
  });

  useEffect(() => {
    socket.emit("join-room", groupId);
  }, []);

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

  useEffect(() => {
    socket.on("rider-location", ({ userId, lat, lng }) => {
      setRiders((prev) => ({ ...prev, [userId]: { lat, lng } }));
    });
    return () => socket.off("rider-location");
  }, []);

  if (!coords) return <div>Getting your location…</div>;

    let c1 = Math.floor(Math.random() * 256);
    let c2 = Math.floor(Math.random() * 256);
    let c3 = Math.floor(Math.random() * 256);


  return (
    <MapContainer
      center={[coords.latitude, coords.longitude]}
      zoom={10}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <Marker position={[coords.latitude, coords.longitude]}>
        <Popup>You</Popup>
      </Marker>

      {Object.entries(riders).map(([id, pos]) => (
        <Marker key={id} position={[pos.lat, pos.lng]}>
          <Popup>{id}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;