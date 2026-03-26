import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const guessIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface GuessMarkerProps {
  lat: number;
  lng: number;
  label?: string;
}

export const GuessMarker: React.FC<GuessMarkerProps> = ({ lat, lng, label }) => {
  return (
    <Marker position={[lat, lng]} icon={guessIcon}>
      {label && <Popup>{label}</Popup>}
    </Marker>
  );
};
