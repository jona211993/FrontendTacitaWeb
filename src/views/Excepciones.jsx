import { useState, useEffect } from "react";
import axios from "axios"; // Importar Axios
import { useData } from "../context/DataContext.jsx";
import { Button, Modal } from "antd";
import { SyncOutlined, EyeOutlined, EditOutlined } from "@ant-design/icons";
import FormExcepcion from "../components/DatosExcepcion/FormExcepcion.jsx";

const Excepciones = () => {
  const { user } = useData();
  const [datos, setDatos] = useState([]); // Estado para almacenar los datos
  const [verModalVer, setVerModalVer] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const showModalVer = (row) => {
    setSelectedRow(row); // Guardar la fila seleccionada
    if (user.idCargo !== 4) {
      if (user.alias === "NATHALY JIMENEZ") {
        setVerModalVer(true);
      } else {
        if (row.ENCARGADO === "A_SUPERIOR") {
          alert("EXCEPCION NO SE ENCUENTRA EN EL RANGO DE APROBACION");
        } else {
          setVerModalVer(true);
        }
      }
    } else {
      setVerModalVer(true);
    }
  };

  const closeModalVer = () => {
    setVerModalVer(false);
  };
 
 const recargarPagina= () => {
    window.location.reload();
}


  // Función para obtener los datos desde la API
  const obtenerDatos = async () => {
    console.log("datos: ", user);
    try {
      const response = await axios.post(
        "http://localhost:3005/excepciones/listaExcepciones",
        {
          id_cargo: user.idCargo, // Campo id_cargo enviado desde el contexto o prop
          usuario: user.alias, // Campo usuario enviado desde el contexto o prop
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
        <label className="text-xl font-bold"> EXCEPCIONES</label>
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
              <th>Fecha Solicitud</th>
              <th>Hora Solicitud</th>
              <th>Código IDC</th>
              <th>Cartera</th>
              <th>Canal</th>
              <th>Asesor</th>
              <th>Monto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {datos.length > 0 ? (
              datos.map((row) => (
                <tr
                  key={row.idExcepcion}
                  className={determinarClaseFila(row.ENCARGADO)}
                >
                  <td>{row.FEC_EXCEPCION}</td>
                  <td>{row.HORA_EXCEPCION}</td>
                  <td>{row.DOCUMENTO}</td>
                  <td>{row.CARTERA}</td>
                  <td>{row.CANAL}</td>
                  <td>{row.SOLICITANTE}</td>
                  <td>
                    {row.MONTO_SOLICITADO?.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="flex justify-center items-center border-0 gap-5">
                    <Button
                      className="bg-yellow-300"
                      icon={<EyeOutlined style={{ color: "white" }} />}
                      onClick={() => showModalVer(row)}
                    />
                 
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">
                  No se pudo obtener los datos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {verModalVer && (
          <Modal
            title={
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <EditOutlined style={{ color: "black", fontSize: "20px" }} />
                <span style={{ color: "black", fontWeight: "bold" }}>
                  DETALLE EXCEPCIÓN
                </span>
              </div>
            }
            open={verModalVer}
            onCancel={closeModalVer}
            width={1000}
            centered
            footer={null}
          >
            <FormExcepcion selectedRow={selectedRow} closeModalVer={closeModalVer} recargarPagina={recargarPagina}></FormExcepcion>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Excepciones;
