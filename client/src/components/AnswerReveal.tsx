import React from 'react';
import { Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import useGameStore from '../hooks/useGameStore';

const correctIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const guessIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const AnswerReveal: React.FC = () => {
  const { phase, correctLocation, allGuesses } = useGameStore();

  if (phase !== 'reveal' || !correctLocation) return null;

  return (
    <>
      <Marker position={[correctLocation.lat, correctLocation.lng]} icon={correctIcon}>
        <Popup>✅ Correct Location</Popup>
      </Marker>

      {allGuesses.map((g, i) => (
        <React.Fragment key={i}>
          <Marker position={[g.lat, g.lng]} icon={guessIcon}>
            <Popup>
              {g.username}: {g.distanceKm.toFixed(1)} km ({g.points} pts)
            </Popup>
          </Marker>
          <Polyline
            positions={[
              [g.lat, g.lng],
              [correctLocation.lat, correctLocation.lng],
            ]}
            pathOptions={{ color: '#ef4444', weight: 2, dashArray: '5, 10' }}
          />
        </React.Fragment>
      ))}
    </>
  );
};

export default AnswerReveal;
