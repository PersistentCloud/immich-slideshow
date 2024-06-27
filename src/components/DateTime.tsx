// src/components/DateTime.tsx
import React, { useEffect, useState } from 'react';

const DateTime: React.FC = () => {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  return (
    <div className="datetime">
      <div className="date">{dateTime.toLocaleDateString()}</div>
      <div className="time">{dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
    </div>
  );
};

export default DateTime;
