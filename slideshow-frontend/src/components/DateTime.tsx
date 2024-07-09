import React, { useEffect, useState, useCallback } from 'react';

const DateTime: React.FC = () => {
  const [dateTime, setDateTime] = useState(new Date());

  const updateDateTime = useCallback(() => {
    setDateTime(new Date());
  }, []);

  useEffect(() => {
    const interval = setInterval(updateDateTime, 1000); // Update every second

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [updateDateTime]);

  return (
    <div className="datetime">
      <div className="date">
        {dateTime.toLocaleDateString("de-DE", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })}
      </div>
      <div className="time">
        {dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
};

export default DateTime;
