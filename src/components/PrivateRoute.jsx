/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie"; // Importa la librería para manejar cookies
import { useData } from "../context/DataContext";

// Este componente se encarga de proteger las rutas privadas
const PrivateRoute = ({ element }) => {
    const { autenticado } = useData(); // Usamos el estado autenticado del contexto

    // Verifica si el usuario está autenticado y si el token existe en las cookies
    if (autenticado===false || !Cookies.get("token")) {
      return <Navigate to="/login" replace />;
    }
  
    return element;
}

export default PrivateRoute