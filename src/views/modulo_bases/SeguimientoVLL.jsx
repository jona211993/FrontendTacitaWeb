/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useData } from "../../context/DataContext.jsx";
import axios from "axios"; // Importar Axios

const SeguimientoVLL = () => {
    const { user , setCliente} = useData();
    const [datos, setDatos] = useState([]); // Estado para almacenar los datos
    const API_URL = import.meta.env.VITE_BACKEND_URL;
  
    // Función para obtener los datos desde la API
    const obtenerDatos = async () => {
      console.log("datos: ", user.alias);
      try {
        const response = await axios.post(
          `${API_URL}/bases/seguimientoVLL`,
          {
            ASESOR: user.alias, // Campo id_cargo enviado desde el contexto o prop
          }
        );
  
        if (response.status === 200 && response.data.data) {
          console.log("Se obtuvo de la api: ", response.data.data);
          setDatos(response.data.data); // Actualizar el estado con los datos recibidos
        } else {
          console.warn("No se obtuvieron datos desde la API.");
          setDatos([]); // Vaciar el estado en caso de error
        }
      } catch (error) {
        console.error("Error al obtener datos desde la API:", error.message);
        setDatos([]); // Manejar el error limpiando el estado
      }
    };
  
    // Ejecutar la función al cargar el componente
    useEffect(() => {
      obtenerDatos();
    }, []);
  
     // Para abrir la pestaña nueva para el boton detalle
  const handelVer = async (row) => {
    //Actualizar el cliente que estas elijiendo en el context
    // ENPOINT DONDE MANDO EL DOCUMENTO DEL CLIENTE Y USO UN GET CON LOS DATOS DEL CLIENTE
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/obtenerCliente/${
          row.documento
        }`
      );
      console.log("Datos obtenidos:", response.data.data[0]);
      setCliente(response.data.data[0]);
      // message.success("Datos obtenidos correctamente");
      window.open("/expertisERP/detalleCliente", "_blank");
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      // message.error("Error al obtener los datos");
    }
    alert(row.documento)
  };
    return (
      <div>
        <div className="flex flex-col items-center  justify-center ">
          <h1 className="font-bold text-xl m-4">Seguimiento  VLL</h1>
          <div className="flex items-center justify-center w-3/4 bg-red-500">
            <table className="tabla text-xs border-2 border-blue-900">
              <thead>
                <tr >                  
                  <th>DOCUMENTO</th>
                  <th>CARTERA</th>
                  <th>ASESOR</th>
                  <th>SEGUIMIENTO</th>
                </tr>
              </thead>
              <tbody>
                {datos.length > 0 ? (
                  datos.map((row) => (
                    <tr key={row.documento}
                    onDoubleClick={() => handelVer(row)}
                    style={{
                      backgroundColor: row.REALIZO_SEG === "SI" ? "#a8ef84" : "#e97d65",
                      color:   "black " ,
                    }}
                    >
                      <td>{row.documento}</td>
                      <td>{row.cartera}</td>
                      <td>{row.asesor}</td>
                      <td>{row.REALIZO_SEG}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8">No se pudo obtener los datos.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
}

export default SeguimientoVLL