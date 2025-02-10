/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useData } from "../context/DataContext.jsx";
import axios from "axios"; // Importar Axios
import { Button } from "antd";
import dayjs from "dayjs";

const Agendados = () => {
  const { user, setCliente } = useData();
  const [datos, setDatos] = useState([]); // Estado para almacenar los datos
  const [observacion, setObservacion] = useState(""); // Estado para almacenar los datos
  const [filaSeleccionada, setFilaSelecionada] = useState(null);
  const [botonhabilitado, seBotonHabilitado] = useState(false);
  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const [diaActual, setDiaActual] = useState("");


  useEffect(() => {
    const fechaHoy = dayjs().format("DD-MM-YYYY"); // Obtiene la fecha en formato 'AAAA-MM-DD'
    setDiaActual(fechaHoy);
  }, []);
  // Función para obtener los datos desde la API
  const obtenerDatos = async () => {
    console.log("datos: ", user.alias);
    let response;
    try {
      if (user.idCargo === 2) {
        // ESTO ES PARA LOS SUPERVISORES
        response = await axios.post(`${API_URL}/agendadosSup`, {
          ID_GESTOR: user.idMovEmpleado, // Campo id_cargo enviado desde el contexto o prop
        });
      } else {
        //PARA ASESORES
        response = await axios.post(`${API_URL}/agendados`, {
          idGestor: user.idMovEmpleado, // Campo id_cargo enviado desde el contexto o prop
        });
      }

      if (response.status === 200 && response.data.data) {
        console.log("Se obtuvo de la api: ", response.data.data[0]);
        setDatos(response.data.data[0]); // Actualizar el estado con los datos recibidos
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
  const handelVer = async () => {
    //Actualizar el cliente que estas elijiendo en el context
    // ENPOINT DONDE MANDO EL DOCUMENTO DEL CLIENTE Y USO UN GET CON LOS DATOS DEL CLIENTE
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/obtenerCliente/${
          filaSeleccionada.DOCUMENTO
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
  };

  return (
    <div>
      <div className="flex flex-col items-center  justify-center ">
        <h1 className="font-bold text-xl m-4">AGENDA</h1>
        <div className="flex items-center justify-center w-3/4 ">
          <table className="tabla text-xs border-2 border-blue-900">
            <thead>
              <tr>
                <th>FecIngreso</th>
                <th>HoraIngreso</th>
                <th>Documento</th>
                <th>Cartera</th>
                <th>FecAgenda</th>
                <th>Asesor</th>
              </tr>
            </thead>
            <tbody>
              {datos.length > 0 ? (
                datos.map((row) => (
                  <tr
                    key={row.idAgendamiento}
                    onClick={() => {
                      setFilaSelecionada(row);
                      seBotonHabilitado(true);
                      setObservacion(row.OBSERVACION);
                    }}
                    style={{
                      backgroundColor:
                        filaSeleccionada === row
                          ? "#3b82f6"
                          : row.FEC_AGENDA === diaActual
                          ? "#a8ef84"
                          : "#fbf700 ",
                      color: filaSeleccionada === row ? "white" : "black",
                    }}
                  >
                    <td>{row.FEC_INGRESO}</td>
                    <td>{row.HORA_INGRESO}</td>
                    <td>{row.DOCUMENTO}</td>
                    <td>{row.CARTERA}</td>
                    <td>{row.FEC_AGENDA}</td>
                    <td>{row.ASESOR}</td>
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
        <div className="flex flex-col justify-center  w-3/4 gap-2 mt-5">
          <div className="flex justify-between ">
            <h1 className="text-left font-semibold text-lg">Observación</h1>
            <Button
              className="bg-blue-950  text-white"
              disabled={!botonhabilitado}
              onClick={handelVer}
            >
              Detalle
            </Button>
          </div>
          <textarea
            className="border-2 border-gray-500 ml-10 mr-10 rounded-lg p-2"
            value={observacion}
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default Agendados;
