import { useState, useEffect } from "react";
import axios from "axios"; // Importar Axios
import { useData } from "../context/DataContext.jsx";
import { Button,} from "antd";
import { SyncOutlined} from "@ant-design/icons";


const ExcepcionesAsesor = () => {
  const { user } = useData();
  const [datos, setDatos] = useState([]); // Estado para almacenar los datos
  const API_URL = import.meta.env.VITE_BACKEND_URL;
  


  // Función para obtener los datos desde la API
  const obtenerDatos = async () => {
    console.log("datos: ", user);
    try {
      const response = await axios.post(
        `${API_URL}/excepciones/listaExcepcionesHistoricaAsesor`,
        {
          idgestor: user.idMovEmpleado, // Campo id_cargo enviado desde el contexto o prop          
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

  // Función para determinar la clase de la fila según el estado
  const determinarClaseFila = (encargado) => {
    if (encargado === "A_SUPERIOR") {
      return "bg-blue-300 border-2"; // Clase para celeste
    }
    return "bg-green-400 border-2"; // Clase para verde
  };

  return (
    <div className="h-full flex-col">
      <div className="bp-2 flex pl-10 pr-16 justify-between">
        <label className="text-xl font-bold"> EXCEPCIONES ASESOR</label>
        <Button
          className="bg-gray-500  text-white"
          icon={<SyncOutlined />}
          onClick={obtenerDatos} // Botón para actualizar los datos manualmente
        >
          Actualizar
        </Button>
        <div className="flex gap-2 items-center">
          <label className="font-semibold">USUARIO :</label>
          <div className="border-dashed border-2 border-cyan-700">
            <label className="p-2">{user.alias}</label>
          </div>
        </div>
      </div>
      <div className="mt-2 p-4">
        <table className="tabla text-xs border-2 border-blue-900">
          <thead>
            <tr>
              <th>FEC. EXCEPCIÓN</th>
              <th>CODIGO IDC</th>
              <th>CARTERA</th>
              <th>FEC. POS. PAGO</th>
              <th>MTO. SOLI..</th>
              <th>CTA.SOLI..</th>
              <th>FECHA.APROBADA</th>
              <th>MTO. APR..</th>
              <th>CTA. APR..</th>
              <th>ESTADO</th>
            </tr>
          </thead>
          <tbody>
            {datos.length > 0 ? (
              datos.map((row) => (
                <tr
                  key={row.idExcepcion}
                  className={determinarClaseFila(row.ENCARGADO)}
                >
                  <td>{row.fecExcepcion}</td>
                  <td>{row.documento}</td>
                  <td>{row.cartera}</td>
                  <td>{row.fecPosiblePag}</td>
                  <td>{row.mtoSolicitado}</td>
                  <td>{row.cuotSolicitado}</td>
                  <td>{row.fecAprobacion}</td>
                  <td>{row.mtoAprobado}</td>
                  <td>{row.coutAprobado}</td>
                  <td>{row.estado}</td>
                 
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">
                  No se pudo obtener los datos para este usuario.
                </td>
              </tr>
            )}
          </tbody>
        </table>
       
      </div>
    </div>
  );
};

export default ExcepcionesAsesor;
