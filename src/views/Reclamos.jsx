import { Select } from "antd";
import { useState, useEffect } from "react";
import { useData } from "../context/DataContext.jsx";
import { DatePicker, ConfigProvider, Input } from "antd";
import locale from "antd/es/locale/es_ES"; // Importa el idioma español para Ant Design
import dayjs from "dayjs"; // Asegúrate de tener Day.js instalado
import "dayjs/locale/es"; // Configura el idioma español para Day.js
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
dayjs.locale("es"); // Establece español como idioma por defecto

const { Option } = Select;
const { RangePicker } = DatePicker;

const Reclamos = () => {
  const [valorSeleccionado, setValorSeleccionado] = useState("ID");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");
  const [id, setId] = useState("");
  const [docReclamo, setDocReclamo] = useState("");
  const [docDeudor, setDocDeudor] = useState("");
  const [viaReclamo, setViaReclamo] = useState("Ministerio publico");
  const [listaVia, setListaVia] = useState([]);
  const [datosMostrar, setDatosMostrar] = useState([]);

  useEffect(() => {
    const obtenerViasReclamo = async () => {
      // try {
      //   const respuesta = await fetch("http://localhost:3005/listarCanales", {
      //     method: "GET", // Cambia el método según lo que necesites (POST, PUT, etc.)
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   });

      //   if (!respuesta.ok) {
      //     throw new Error("Error al obtener los datos");
      //   }

      //   const datos = await respuesta.json();
      //   console.log(datos.data);
      //   setListaCanal(datos.data);
      // } catch (error) {
      //   console.error("Error:", error);
      // }
      setListaVia([
        "Ministerio publico",
        "Indecopi",
        "Carta Notarial",
        "Web Expertis",
        "Telefónico",
      ]);
    };

    obtenerViasReclamo();
  }, []);

  useEffect(() => {
    const obtenerDatos = async () => {
      //   try {
      //     const cuerpoSolicitud = {
      //       tipo: "TODO",
      //       fec_inicio: "",
      //       fec_fin: "",
      //       documento: "",
      //       usuario: user.alias,
      //     };

      //     const respuesta = await fetch("http://localhost:3005/buscarPagosNOR", {
      //       method: "POST", // Cambia el método según lo que necesites (POST, PUT, etc.)
      //       headers: {
      //         "Content-Type": "application/json",
      //       },
      //       body: JSON.stringify(cuerpoSolicitud),
      //     });

      //     if (!respuesta.ok) {
      //       throw new Error("Error al obtener los datos");
      //     }

      //     const datos = await respuesta.json();
      //     // console.log(datos)
      //     setDatosMostrar(datos);
      //   } catch (error) {
      //     console.error("Error:", error);
      //   }
      setDatosMostrar([]);
    };

    obtenerDatos();
  }, []);

  const handleChange = (value) => {
    if (value === "ID") {
      setValorSeleccionado("ID"); // Actualiza el estado con la opción seleccionada
    } else if (value === "DOC RECLAMO") {
      setValorSeleccionado("DOC RECLAMO"); // Actualiza el estado con la opción seleccionada
    } else if (value === "DOC DEUDOR") {
      setValorSeleccionado("DOC DEUDOR"); // Actualiza el estado con la opción seleccionada
    } else if (value === "FECHA") {
      setValorSeleccionado("FECHA"); // Actualiza el estado con la opción seleccionada
    } else if (value === "VIA RECLAMO") {
      setValorSeleccionado("VIA RECLAMO"); // Actualiza el estado con la opción seleccionada
    } else {
      setValorSeleccionado("TODO"); // Actualiza el estado con la opción seleccionada
    }
  };

  const handleDateChange = (dates) => {
    if (dates) {
      setFechaInicio(dates[0].format("YYYY-MM-DD")); // Guardamos como string con formato
      setFechaFinal(dates[1].format("YYYY-MM-DD"));
    } else {
      setFechaInicio(null);
      setFechaFinal(null);
    }
  };

  const handleChangeId = (event) => {
    setId(event.target.value); // Guarda el texto del input
  };

  const handleChangeDocReclamo = (event) => {
    setDocReclamo(event.target.value); // Guarda el texto del input
  };

  const handleChangeDocDeudor = (event) => {
    setDocDeudor(event.target.value); // Guarda el texto del input
  };

  const handleChangeViaReclamo = (value) => {
    setViaReclamo(value);
  };

  return (
    <ConfigProvider locale={locale}>
      <div className="w-full  bg-red-400 flex items-center justify-center">
        <div className="w-2/3 bg-yellow-300 flex  gap-8  items-center justify-betweenr">
          <div>
            <label>Buscar Por:</label>
          </div>
          <div>
            <Select
              defaultValue="ID" // Valor por defecto
              style={{ width: 200 }} // Ancho del selector
              onChange={handleChange} // Manejo del cambio
            >
              <Option value="ID">ID</Option>
              <Option value="DOC RECLAMO">DOC RECLAMO</Option>
              <Option value="DOC DEUDOR">DOC DEUDOR</Option>
              <Option value="FECHA">FECHA</Option>
              <Option value="VIA RECLAMO">VIA RECLAMO</Option>
            </Select>
          </div>
          <div className="w-1/3 flex gap-3  items-center justify-center bg-cyan-300">
            {valorSeleccionado === "FECHA" && (
              <div style={{ margin: "20px" }}>
                <RangePicker
                  onChange={handleDateChange}
                  format="YYYY-MM-DD"
                  style={{ width: "100%" }}
                />
              </div>
            )}
            {valorSeleccionado === "ID" && (
              <div className="">
                <div style={{ margin: "20px" }}>
                  <Input
                    value={id}
                    onChange={handleChangeId}
                    placeholder="Ingrese el monto"
                  />
                </div>
              </div>
            )}
            {valorSeleccionado === "DOC RECLAMO" && (
              <div className="">
                <div style={{ margin: "20px" }}>
                  <Input
                    value={docReclamo}
                    onChange={handleChangeDocReclamo}
                    placeholder="Ingrese doc Reclamo"
                  />
                </div>
              </div>
            )}
            {valorSeleccionado === "DOC DEUDOR" && (
              <div className="">
                <div style={{ margin: "20px" }}>
                  <Input
                    value={docDeudor}
                    onChange={handleChangeDocDeudor}
                    placeholder="Ingrese doc Deudor"
                  />
                </div>
              </div>
            )}
            {valorSeleccionado === "VIA RECLAMO" && (
              <Select
                value={viaReclamo} // Valor por defecto basado en el primer elemento del array
                style={{ width: 200 }} // Ancho del selector
                onChange={handleChangeViaReclamo} // Manejo del cambio
              >
                {listaVia.map((canal, index) => (
                  <Option key={index} value={canal}>
                    {canal}
                  </Option>
                ))}
              </Select>
            )}
          </div>
        </div>
        <div className="w-1/3 flex  gap-3  bg-green-600 items-center justify-center">
          <button
            className="px-4 py-2 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
            // onClick={handelBuscar}
          >
            Buscar
          </button>
          <button
            className="px-4 py-2 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
            // onClick={reiniciarComponente}
          >
            TOTAL
          </button>
        </div>
        
      </div>
      <div className="tabla-container">
          <table className="tabla">
            <thead>
              <tr>
                <th>ID</th>
                <th>fecRec</th>
                <th>fecSuc</th>
                <th> Vía</th>
                <th> DOC Rec</th>
                <th>esCliente</th>
                <th>Nombre</th>
                <th>Estado</th>
                <th>Canal</th>
                <th> DOC Deu</th>
                <th>Acción</th> {/* Nueva columna */}
              </tr>
            </thead>
            <tbody>
              {datosMostrar.length > 0 ? (
                datosMostrar.map((row, index) => (
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
                        icon={<EyeOutlined />}
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
        </div>
    </ConfigProvider>
  );
};

export default Reclamos;
