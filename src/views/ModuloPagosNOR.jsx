/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import "../styles/Tabla.css"; // Importamos los estilos
import { DatePicker, ConfigProvider, Input } from "antd";
import { Modal, Button } from "antd";
import {FormOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;
import { Select } from "antd";
import { useData } from "../context/DataContext.jsx";
const { Option } = Select;
import locale from "antd/es/locale/es_ES"; // Importa el idioma español para Ant Design
import dayjs from "dayjs"; // Asegúrate de tener Day.js instalado
import "dayjs/locale/es"; // Configura el idioma español para Day.js
import customParseFormat from "dayjs/plugin/customParseFormat";
import ModalReconocimiento from "../components/ModalReconocimiento.jsx";
import InformacionPagos from "../components/InformacionPagos.jsx";

dayjs.extend(customParseFormat);
dayjs.locale("es"); // Establece español como idioma por defecto

const ModuloPagosNOR = () => {
  const { user } = useData();
  const [selectedRow, setSelectedRow] = useState(null);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");
  const [listaCanal, setListaCanal] = useState([]);
  const [datosMostrar, setDatosMostrar] = useState([]);
  const [canal, setCanal] = useState("AREQUIPA SOLES");
  const [monto, setMonto] = useState("");
  const [idpago, setIdPago] = useState("");

  const [valorSeleccionado, setValorSeleccionado] = useState("PAGO");
  const [estadoBotonTodo, setEstadoBotonTodo] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);

  const [modalInformacionPago, setModalInformacionPago] = useState(false);

  // FILTROS CABECERA TABLA 
  // POR CANAL
  const [canalFiltro, setCanalFiltro] = useState(""); // Estado para el filtro
  // FILTRO POR MONTO CABECERA 
 const [montoFiltro, setMontoFiltro] = useState(""); // Estado para el filtro de monto

  // Filtrar los datos según el filtro aplicado
  const datosFiltrados = datosMostrar.data
    ? datosMostrar.data.filter(row =>{
      const filtroCanal = canalFiltro ? row.MODALIDAD.includes(canalFiltro) : true;
      const filtroMonto = montoFiltro ? row.MONTO_PAGO.toString().includes(montoFiltro) : true;
      return filtroCanal && filtroMonto;
})
    : [];

    const handleCanalFiltroChange = (e) => {
      setCanalFiltro(e.target.value);
    };
    const handleMontoFiltroChange = (e) => {
      setMontoFiltro(e.target.value);
    };

 
  const handleVerInformacion = () => {
    console.log("Se entrando al modal de informacion")
    setModalInformacionPago(true);
  };

  const handleOcultarInformacion = () => {
    setModalInformacionPago(false);
  };


  const handleRowClick = (row) => {
    setSelectedRow(row);
    // Aquí puedes manejar la lógica de la fila seleccionada
  };
  const showModal = (row) => {
    setSelectedRow(row); // Guardar los datos de la fila seleccionada
    setIsModalOpen(true); // Abrir el modal
  };

  const handleOk = () => {
    setIsModalOpen(false); // Cerrar el modal al confirmar
  };

  const handleCancel = () => {
    setIsModalOpen(false); // Cerrar el modal al cancelar
    // Actualizar la clave para forzar remount
    setModalKey((prevKey) => prevKey + 1);
  };

  // Para bloquear las fechas:
  const today = dayjs(); // Fecha actual.
  const startOfMonth = today.startOf("month"); // Inicio del mes actual.
  // const endOfMonth = today.endOf("month"); // Fin del mes actual.

  // Función para deshabilitar fechas fuera del rango permitido.
  const disabledDate = (current) => {
    return (
      current &&
      (current.isBefore(startOfMonth, "day") || // Antes del inicio del mes.
        current.isAfter(today.subtract(1, "day"), "day")) // Después del día anterior a hoy.
    );
  };

  useEffect(() => {
    const obtenerListaCanal = async () => {
      try {
        const respuesta = await fetch(`${import.meta.env.VITE_BACKEND_URL}/listarCanales`, {
          method: "GET", // Cambia el método según lo que necesites (POST, PUT, etc.)
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!respuesta.ok) {
          throw new Error("Error al obtener los datos");
        }

        const datos = await respuesta.json();
        console.log(datos.data);
        setListaCanal(datos.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    obtenerListaCanal();
  }, []);
  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const cuerpoSolicitud = {
          tipo: "TODO",
          fec_inicio: "",
          fec_fin: "",
          documento: "",
          usuario: user.alias,
        };

        const respuesta = await fetch(`${import.meta.env.VITE_BACKEND_URL}/buscarPagosNOR`, {
          method: "POST", // Cambia el método según lo que necesites (POST, PUT, etc.)
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cuerpoSolicitud),
        });

        if (!respuesta.ok) {
          throw new Error("Error al obtener los datos");
        }

        const datos = await respuesta.json();
        // console.log(datos)
        setDatosMostrar(datos);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    obtenerDatos();
  }, [estadoBotonTodo]); // El array vacío asegura que el efecto solo se ejecute al montar el componente

  const handleDateChange = (dates) => {
    if (dates) {
      setFechaInicio(dates[0].format("YYYY-MM-DD")); // Guardamos como string con formato
      setFechaFinal(dates[1].format("YYYY-MM-DD"));
    } else {
      setFechaInicio(null);
      setFechaFinal(null);
    }
  };

  const handleChange = (value) => {
    setMonto("");
    setIdPago("");
    setCanal("AREQUIPA SOLES");
    if (value === "FECHA DE PAGO") {
      setValorSeleccionado("PAGO"); // Actualiza el estado con la opción seleccionada
    } else if (value === "CANAL DE PAGO") {
      setValorSeleccionado("CANAL"); // Actualiza el estado con la opción seleccionada
    } else if (value === "FECHA/CANAL") {
      setValorSeleccionado("AMBOS"); // Actualiza el estado con la opción seleccionada
    } else if (value === "MONTO DE PAGO") {
      setValorSeleccionado("MONTO"); // Actualiza el estado con la opción seleccionada
    } else if (value === "ID PAGO") {
      setValorSeleccionado("IDPAGO"); // Actualiza el estado con la opción seleccionada
    } else {
      setValorSeleccionado("TODO"); // Actualiza el estado con la opción seleccionada
    }
  };

  const handleChangeCanal = (value) => {
    setCanal(value);
  };

  const handleChangeMonto = (event) => {
    setMonto(event.target.value); // Guarda el texto del input
  };

  const handleChangeIdPago = (event) => {
    setIdPago(event.target.value); // Guarda el texto del input
  };

  const handelBuscar = async () => {
    try {
      const cuerpoSolicitud = {
        tipo: valorSeleccionado,
        fec_inicio: fechaInicio,
        fec_fin: fechaFinal,
        documento:
          valorSeleccionado === "CANAL" || valorSeleccionado === "AMBOS"
            ? canal
            : valorSeleccionado === "MONTO"
            ? monto
            : valorSeleccionado === "IDPAGO"
            ? idpago
            : valorSeleccionado === "PAGO"
            ? ""
            : "",
        usuario: user.alias,
      };

      console.log("Estamos enviando desde el front esto:; ", cuerpoSolicitud);

      const respuesta = await fetch(`${import.meta.env.VITE_BACKEND_URL}/buscarPagosNOR`, {
        method: "POST", // Cambia el método según lo que necesites (POST, PUT, etc.)
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cuerpoSolicitud),
      });

      if (!respuesta.ok) {
        throw new Error("Error al obtener los datos");
      }

      const datos = await respuesta.json();
      console.log("Dando click al boton buscar: ");
      console.log(datos);
      setDatosMostrar(datos);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const reiniciarComponente = () => {
    setEstadoBotonTodo(estadoBotonTodo + 1);
  };

  return (
    <ConfigProvider locale={locale}>
      <div className="w-full  flex items-center justify-center">
        <div className="w-1/4 flex  gap-8  items-center justify-center">
          <div>
            <label>Buscar Por:</label>
          </div>
          <div>
            <Select
              defaultValue="FECHA DE PAGO" // Valor por defecto
              style={{ width: 200 }} // Ancho del selector
              onChange={handleChange} // Manejo del cambio
            >
              <Option value="FECHA DE PAGO">FECHA DE PAGO</Option>
              <Option value="CANAL DE PAGO">CANAL DE PAGO</Option>
              <Option value="FECHA/CANAL">FECHA/CANAL</Option>
              <Option value="MONTO DE PAGO">MONTO DE PAGO</Option>
              <Option value="ID PAGO">ID PAGO</Option>
            </Select>
          </div>
        </div>
        <div className="w-1/2 flex gap-3  items-center justify-center">
          {valorSeleccionado === "PAGO" && (
            <div style={{ margin: "20px" }}>
              <RangePicker
                onChange={handleDateChange}
                disabledDate={disabledDate}
                format="YYYY-MM-DD"
                style={{ width: "100%" }}
              />
            </div>
          )}
          {valorSeleccionado === "CANAL" && (
            <Select
              value={canal} // Valor por defecto basado en el primer elemento del array
              style={{ width: 200 }} // Ancho del selector
              onChange={handleChangeCanal} // Manejo del cambio
            >
              {listaCanal.map((canal, index) => (
                <Option key={index} value={canal.descripcion}>
                  {canal.descripcion}
                </Option>
              ))}
            </Select>
          )}
          {valorSeleccionado === "AMBOS" && (
            <>
              <div className="w-1/2 ">
                <div style={{ margin: "20px" }}>
                  <RangePicker
                    onChange={handleDateChange}
                    disabledDate={disabledDate}
                    format="YYYY-MM-DD"
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
              <div className="w-1/2 flex justify-center">
                <Select
                  value={canal} // Valor por defecto basado en el primer elemento del array
                  style={{ width: 200 }} // Ancho del selector
                  onChange={handleChangeCanal} // Manejo del cambio
                >
                  {listaCanal.map((canal, index) => (
                    <Option key={index} value={canal.descripcion}>
                      {canal.descripcion}
                    </Option>
                  ))}
                </Select>
              </div>
            </>
          )}
          {valorSeleccionado === "MONTO" && (
            <>
              <div className="w-1/2 ">
                <div style={{ margin: "20px" }}>
                  <Input
                    value={monto}
                    onChange={handleChangeMonto}
                    placeholder="Ingrese el monto"
                  />
                </div>
              </div>
            </>
          )}
          {valorSeleccionado === "IDPAGO" && (
            <>
              <div className="w-1/2 ">
                <div style={{ margin: "20px" }}>
                  <Input
                    value={idpago}
                    onChange={handleChangeIdPago}
                    placeholder="ID Pago"
                  />
                </div>
              </div>
            </>
          )}
        </div>
        <div className="w-1/4 flex  gap-3  items-center justify-center">
          <button
            className="px-4 py-2 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
            onClick={handelBuscar}
          >
            Buscar
          </button>
          <button
            className="px-4 py-2 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
            onClick={reiniciarComponente}
          >
            TOTAL
          </button>
        </div>
      </div>

      <div className="flex justify-between mr-20 items-center mt-4">
        <label className="text-lg font-semibold ">Módulo De Pagos No Reconocidos</label>
        <div>
           <Button className="" onClick={handleVerInformacion}>Información</Button>
        </div>
      </div>
      <Modal
          title={"Informacon pagos"}
          width={1200}
          open={modalInformacionPago}
          footer={null}    
          onCancel={handleOcultarInformacion}               
        >
          <InformacionPagos></InformacionPagos>
        </Modal>

      <div className="tabla-container">
        <table className="tabla">
          <thead>
            <tr>
              <th>ID Pago</th>
              <th>FECHA PAGO</th>
              <th>HORA PAGO</th>
              <th>  MONTO
            <br />
            <input
              className="text-blue-600 rounded-lg"
              type="text"
              value={montoFiltro}
              onChange={handleMontoFiltroChange}
              placeholder="Buscar monto"
              style={{ width: "50%" , textAlign:"center"}}
            /></th>
              <th> CANAL PAGO
            <br />
            <select
              className="text-black w-1/4 rounded-lg p-1"
              value={canalFiltro}
              onChange={handleCanalFiltroChange}
              style={{ width: "50%" }}
            >
              <option value="">Todos</option>
              {/* Agregar las opciones dinámicamente según los datos */}
              {Array.from(new Set(datosMostrar.data?.map(row => row.MODALIDAD)))
                .filter(Boolean)
                .map((canal, index) => (
                  <option key={index} value={canal}>
                    {canal}
                  </option>
                ))}
            </select></th>
              <th>Reconocer</th> {/* Nueva columna */}
            </tr>
          </thead>
          <tbody>
          {datosFiltrados.length > 0 ? (
          datosFiltrados.map((row, index) => (
            <tr
              key={row.idPago}
              className={selectedRow === index ? "fila-seleccionada" : ""}
              onClick={() => handleRowClick(row, index)}
            >
              <td>{row.idPago}</td>
              <td>{row.FEC_PAGO}</td>
              <td>{row.HORA_PAGO}</td>
              <td>{row.MONTO_PAGO}</td>
              <td>{row.MODALIDAD}</td>
              <td>
                <Button
                  icon={<FormOutlined  style={{ color: "green" }}/>}
                  onClick={() => showModal(row)}
                />
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6">Cargando datos...</td>
          </tr>
        )}
          </tbody>
        </table>
        {/* Modal */}
        <Modal
          title={
            <div
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                textAlign: "start",
              }}
            >
              Reconocimiento
            </div>
          }
          open={isModalOpen}
          width={1200}
          footer={null}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          {selectedRow ? (
            <ModalReconocimiento
              elejida={selectedRow}
              cerrarModal={handleCancel}             
              key={modalKey}
            ></ModalReconocimiento>
          ) : (
            <p>No se seleccionó ninguna fila.</p>
          )}
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default ModuloPagosNOR;
