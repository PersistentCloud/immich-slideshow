// src/components/Weather.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface WeatherProps {
  apiKey: string;
}

interface WeatherData {
  city: string;
  temp: number;
  icon: string;
  sunrise: string;
  sunset: string;
}

const Weather: React.FC<WeatherProps> = ({ apiKey }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async (latitude: number, longitude: number) => {
      try {
        const weatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
        );

        const temp = parseFloat(weatherResponse.data.main.temp.toFixed(1));
        const icon = weatherResponse.data.weather[0].icon;
        const city = weatherResponse.data.name;
        const sunrise = new Date(weatherResponse.data.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const sunset = new Date(weatherResponse.data.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        setWeather({ city, temp, icon, sunrise, sunset });
      } catch (error) {
        console.error('Error fetching weather data', error);
        setLocationError('Failed to fetch weather data');
      }
    };

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeather(latitude, longitude);
          },
          (error) => {
            setLocationError('Unable to retrieve your location');
            console.error('Error getting location', error);
            // Fallback to Stuttgart coordinates
            fetchWeather(48.7758, 9.1829); // Stuttgart coordinates
          }
        );
      } else {
        setLocationError('Geolocation is not supported by this browser');
        // Fallback to Stuttgart coordinates
        fetchWeather(48.7758, 9.1829); // Stuttgart coordinates
      }
    };

    getLocation();
    const interval = setInterval(getLocation, 1800000); // 30 Minuten
    return () => clearInterval(interval); // Clear interval on component unmount
  }, [apiKey]);

  if (locationError) return <div>{locationError}</div>;
  if (!weather) return <div>Loading weather...</div>;

  return (
    <div className="weather">
      <div className="location">{weather.city}</div>
      <img
        className="weather-icon"
        src={`http://openweathermap.org/img/wn/${weather.icon}.png`}
        alt="Weather Icon"
      />
      <span>{weather.temp}°C</span>
      <div className="sun-times">
        <div className="sunrise">
          <img src="/icons/sunrise.png" alt="Sunrise Icon" />
          {weather.sunrise}
        </div>
        <div className="sunset">
          <img src="/icons/sunset.png" alt="Sunset Icon" />
          {weather.sunset}
        </div>
      </div>
    </div>
  );
};

export default Weather;
