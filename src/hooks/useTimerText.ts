import { useState, useEffect } from 'react';

export function useTimerText(initialTime = 300) {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime === 1) clearInterval(intervalId);
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  // Formatting time into mm:ss
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return formattedTime;
}
