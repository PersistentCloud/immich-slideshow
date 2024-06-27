// src/App.tsx
import React from 'react';
import './App.css';
import Slideshow from './components/Slideshow';
import Weather from './components/Weather';
import DateTime from './components/DateTime';

const App: React.FC = () => {
  const IMMICH_API_BASE_URL = process.env.REACT_APP_IMMICH_API_BASE_URL!;
  const OPENWEATHERMAP_API_KEY = process.env.REACT_APP_OPENWEATHERMAP_API_KEY!;
  const IMMICH_API_KEY = process.env.REACT_APP_IMMICH_API_KEY!;
  const IMMICH_ALBUM_IDS = process.env.REACT_APP_IMMICH_ALBUM_IDS!.split(', ');
  const EXCLUDED_FILE_TYPES = process.env.REACT_APP_EXCLUDED_FILE_TYPES?.split(', ') || ['ORF', 'PDF'];
  const SLIDESHOW_INTERVAL_SECONDS = parseInt(process.env.REACT_APP_SLIDESHOW_INTERVAL_SECONDS || '5', 10);
  const ALBUM_UPDATE_INTERVAL_MINUTES = parseInt(process.env.REACT_APP_ALBUM_UPDATE_INTERVAL_MINUTES || '60', 10);

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
        <Weather apiKey={OPENWEATHERMAP_API_KEY} />
      </div>
    </div>
  );
};

export default App;
