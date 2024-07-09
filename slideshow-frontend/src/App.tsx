// src/App.tsx
import React, { useEffect, useState } from 'react';
import Slideshow from './components/Slideshow';
import Weather from './components/Weather';
import DateTime from './components/DateTime';
import initializeConfig from './config';
import './App.css';

const App: React.FC = () => {
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    const loadConfig = async () => {
      const config = await initializeConfig();
      setConfig(config);
    };
    loadConfig();
  }, []);

  if (!config) {
    return <div>Loading...</div>;
  }
  
const {
  IMMICH_API_BASE_URL,
  OPENWEATHERMAP_API_KEY,
  IMMICH_API_KEY,
  IMMICH_ALBUM_IDS,
  EXCLUDED_FILE_TYPES,
  SLIDESHOW_INTERVAL_SECONDS,
  ALBUM_UPDATE_INTERVAL_MINUTES,
  FALLBACK_COORDINATES
} = config;

  const slideshowInterval = SLIDESHOW_INTERVAL_SECONDS * 1000;
  const albumUpdateInterval = ALBUM_UPDATE_INTERVAL_MINUTES * 60 * 1000;

  return (
    <div className="app">
      <Slideshow
        albumIds={IMMICH_ALBUM_IDS}
        apiKey={IMMICH_API_KEY}
        baseUrl={IMMICH_API_BASE_URL}
        slideshowInterval={slideshowInterval}
        albumUpdateInterval={albumUpdateInterval}
        excludedFileTypes={EXCLUDED_FILE_TYPES}
      />
      <div className="datetime-container">
        <DateTime />
      </div>
      <div className="weather-container">
        <Weather apiKey={OPENWEATHERMAP_API_KEY} fallbackCoordinates={FALLBACK_COORDINATES} />
      </div>
    </div>
  );
};

export default App;
