import { useEffect, useState } from 'react';

const useCurrentTime = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [error, setError] = useState(null);

  const fetchTime = async () => {
    try {
      const response = await fetch('http://worldtimeapi.org/api/timezone/America/New_York'); // Cambia la zona horaria según sea necesario
      if (!response.ok) throw new Error('Error al obtener la hora');
      const data = await response.json();
      setCurrentTime(new Date(data.datetime)); // Formato ISO 8601 convertido a Date
    } catch (err) {
      setError(err.message);
      setCurrentTime(new Date()); // Usa la hora local como respaldo
    }
  };

  useEffect(() => {
    fetchTime(); // Obtiene la hora al montar el componente
  }, []);

  return { currentTime, error, fetchTime }; // Devuelve la función fetchTime
};

export default useCurrentTime;
