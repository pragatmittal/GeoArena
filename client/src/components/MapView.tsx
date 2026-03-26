import React from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import useGameStore from '../hooks/useGameStore';
import { useSocket } from '../hooks/useSocket';
import { GuessMarker } from './GuessMarker';
import AnswerReveal from './AnswerReveal';

const MapClickHandler = () => {
  const { phase, setMyGuess, myGuess, roomCode } = useGameStore();
  const socket = useSocket();

  useMapEvents({
    click(e) {
      if (phase === 'question' && !myGuess) {
        setMyGuess(e.latlng.lat, e.latlng.lng);
        if (socket) {
          socket.emit('submit_guess', { roomId: roomCode, lat: e.latlng.lat, lng: e.latlng.lng });
        }
      }
    },
  });

  return null;
};

const MapView: React.FC = () => {
  const { myGuess, phase } = useGameStore();

  return (
    <div className="map-wrapper">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: '100%', width: '100%' }}
        worldCopyJump={true}
        maxBounds={[[-90, -180], [90, 180]]}
      >
        <TileLayer
          attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          noWrap={true}
        />
        <MapClickHandler />
        {phase === 'question' && myGuess && <GuessMarker lat={myGuess.lat} lng={myGuess.lng} />}
        <AnswerReveal />
      </MapContainer>
    </div>
  );
};

export default MapView;
