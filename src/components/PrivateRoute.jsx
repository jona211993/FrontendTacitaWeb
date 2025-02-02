/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { useData } from "../context/DataContext";
import { useState, useEffect } from "react";

const PrivateRoute = ({ element }) => {
  const { autenticado } = useData(); // Estado global de autenticación
  const [cookie, setCookie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ConseguirCookie = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/verificacion`, {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();
        console.log("Cookie recibida:", data);

        setCookie(data); // Guardamos el resultado en el estado
      } catch (error) {
        console.error("Error en la verificación:", error);
        setCookie(null); // En caso de error, eliminamos la cookie
      } finally {
        setLoading(false);
      }
    };

    ConseguirCookie();
  }, []);

  if (loading) return <div>Cargando...</div>;

  if (!autenticado || !cookie) {
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default PrivateRoute;
