import { Select } from "antd";
import { useState, useEffect } from "react";
import { Button } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  WarningOutlined,
  SnippetsOutlined
} from "@ant-design/icons";
// import { useData } from "../context/DataContext.jsx";
import { DatePicker, ConfigProvider, Input, Modal, Result } from "antd";
import locale from "antd/es/locale/es_ES"; // Importa el idioma español para Ant Design
import dayjs from "dayjs"; // Asegúrate de tener Day.js instalado
import "dayjs/locale/es"; // Configura el idioma español para Day.js
import customParseFormat from "dayjs/plugin/customParseFormat";
import FormularioEditarReclamo from "../components/FormularioEditarReclamo";
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
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalVerOpen, setIsModalVerOpen] = useState(false);
  const [isModalEditarOpen, setIsModalEditarOpen] = useState(false);
  const [isModalEliminarOpen, setIsModalEliminarOpen] = useState(false);
  const [isModalExitoOpen, setIsModalExitoOpen] = useState(false);
  const[habilitarBotonBuscar, setHabilitarBotonBuscar] = useState(false)

  const showModalVer = () => {
    setIsModalVerOpen(true);
  };
  const closeModalVer = () => {
    setIsModalVerOpen(false);
  };

  const showModalEliminar = () => {
    setIsModalEliminarOpen(true);
  };
  const closeModalEliminar = () => {
    setIsModalEliminarOpen(false);
  };


  const showModalExito = () => {
    setIsModalExitoOpen(true);
  };

  const showModalEditar = () => {
    setIsModalEditarOpen(true);
  };
  const closeModalEditar = () => {
    setIsModalEditarOpen(false);
  };


  // const closeModalEliminar = () => {
  //   setIsModalEliminarOpen(false);
  // };

  const handleBuscar = async () => {
    try {
      if (valorSeleccionado === "ID" && id) {
        console.log(valorSeleccionado);
        console.log(data.filter((e) => String(e.idReclamo) === String(id)));
        setDatosMostrar(data.filter((e) => String(e.idReclamo) === String(id)));
        return datosMostrar.filter((e) => e.ID === id);
      } else if (valorSeleccionado === "DOC RECLAMO") {
        console.log(valorSeleccionado);
        setDatosMostrar(
          data.filter((e) => String(e.DNI_RECLAMO) === String(docReclamo))
        );
        return data.filter((e) => e.DNI_RECLAMO === docReclamo);
      } else if (valorSeleccionado === "DOC DEUDOR") {
        console.log(valorSeleccionado);
        setDatosMostrar(
          data.filter((e) => String(e.DNI_DEUDOR) === String(docDeudor))
        );
        return data.filter((e) => e.DNI_DEUDOR === docDeudor);
      } else if (valorSeleccionado === "FECHA" && fechaInicio && fechaFinal) {
        console.log(valorSeleccionado);
        const fechaInicioDate = new Date(fechaInicio);
        const fechaFinalDate = new Date(fechaFinal);

        const filteredData = data.filter((e) => {
          const fecha = new Date(e.fecReclamo); // Convierte el campo `Fecha` a un objeto Date
          return fecha >= fechaInicioDate && fecha <= fechaFinalDate; // Compara con el rango
        });

        setDatosMostrar(filteredData);
        return filteredData;
      } else if (valorSeleccionado === "VIA RECLAMO") {
        console.log(valorSeleccionado);
        console.log(viaReclamo);
        setDatosMostrar(
          data.filter((e) => String(e.via) === String(viaReclamo))
        );
        return data.filter((e) => e.via === viaReclamo);
      }
    } catch (error) {
      console.error("Error al realizar la búsqueda:", error);
    }
  };

  const handelEliminar = async () => {
    try {
      const body = {
        accion: "ELIMINAR", // Ejemplo de campo con valor
        idReclamo: selectedRow.idReclamo, // Ejemplo de campo nulo
        fecReclamo: null, // Otro campo con un valor
        viaReclamo: null, // Otro campo nulo
        esCliente: null, // Otro campo nulo
        DNI_reclamo: null, // Otro campo nulo
        nombreReferencial: null, // Otro campo nulo
        estadoReclamo: null, // Otro campo nulo
        canal: null, // Otro campo nulo
        motivo: null, // Otro campo nulo
        usuario: null, // Otro campo nulo
        DNI_deudor: null, // Otro campo nulo
        fecSuceso: null, // Otro campo nulo
        observacion: null, // Otro campo nulo
      };

      const response = await fetch("http://localhost:3005/eliminarReclamo", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el recurso.");
      }

      const data = await response.json();
      console.log("Respuesta del servidor:", data);
      closeModalEliminar();     
      showModalExito();
      window.location.reload();
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  useEffect(() => {
    const obtenerViasReclamo = async () => {
     
      setListaVia([
        "Ministerio público",
        "Indecopi",
        "Carta notarial ",
        "Web Expertis ",
        "Telefónico ",
      ]);
    };

    obtenerViasReclamo();
  }, []);

  const obtenerDatos = async () => {
    try {
      const respuesta = await fetch("http://localhost:3005/reclamos", {
        method: "GET",
      });

      if (!respuesta.ok) {
        throw new Error("Error al obtener los datos");
      }

      const datos = await respuesta.json();
      console.log(datos.data);
      setData(datos.data);
      setDatosMostrar(datos.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    obtenerDatos();
  }, [valorSeleccionado]);

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
      setHabilitarBotonBuscar(true) 
    } else {
      setFechaInicio(null);
      setFechaFinal(null);
    }
  };

  const handleChangeId = (event) => {
    setId(event.target.value); // Guarda el texto del input     
    
      
  };

  useEffect(() => {
    setHabilitarBotonBuscar( id && id.trim() !== "");
  
  }, [id]);

  useEffect(() => {
    setHabilitarBotonBuscar( docReclamo && docReclamo.trim() !== "");
  
  }, [docReclamo]);

  useEffect(() => {
    setHabilitarBotonBuscar( docDeudor && docDeudor.trim() !== "");
  
  }, [docDeudor]);
  
 

  const handleChangeDocReclamo = (event) => {
    setDocReclamo(event.target.value); // Guarda el texto del input

  };

  const handleChangeDocDeudor = (event) => {
    setDocDeudor(event.target.value); // Guarda el texto del input
     
  };

  const handleChangeViaReclamo = (value) => {
    setViaReclamo(value);

  };

  const reiniciarComponente = () => {
    setValorSeleccionado("ID");
    setFechaInicio("");
    setFechaFinal("");
    setId("");
    setDocReclamo("");
    setDocDeudor("");
    setViaReclamo("Ministerio público");
    obtenerDatos();
  };

  const handleRowClick = (row, index) => {
    // Actualizar la fila seleccionada
    setSelectedRow(row);

    // Aquí puedes realizar cualquier acción adicional con los datos de la fila
    console.log("Fila seleccionada:", index);
  };

  return (
    <ConfigProvider locale={locale}>
      <div className="w-full   flex items-center justify-center">
        <div className="w-2/3 flex  gap-8  items-center justify-betweenr">
          <div>
            <label className="font-bold text-xl">Buscar Por:</label>
          </div>
          <div>
            <Select
              defaultValue="ID" // Valor por defecto
              style={{ width: 200 }} // Ancho del selector
              onChange={handleChange} // Manejo del cambio
              value={valorSeleccionado}            >
              <Option value="ID">ID</Option>
              <Option value="DOC RECLAMO">DOC RECLAMO</Option>
              <Option value="DOC DEUDOR">DOC DEUDOR</Option>
              <Option value="FECHA">FECHA</Option>
              <Option value="VIA RECLAMO">VIA RECLAMO</Option>
            </Select>
          </div>
          <div className="w-1/3 flex gap-3  items-center justify-center ">
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
                    placeholder="Ingrese el id Reclamo"
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
        <div className="w-1/3 flex  gap-3   items-center justify-center">
          <button
            className={`px-4 py-2 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 ${
              habilitarBotonBuscar
                ? "bg-gray-800 hover:bg-gray-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            onClick={handleBuscar}
            disabled={!habilitarBotonBuscar}
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
      <div className="tabla-container h-4/5">
        <table className="tabla text-xs">
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
              <th>Acciones</th> {/* Nueva columna */}
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
                  <td>{row.idReclamo}</td>
                  <td>{row.fecReclamo}</td>
                  <td>{row.fecSuceso}</td>
                  <td>{row.via}</td>
                  <td>{row.DNI_RECLAMO}</td>
                  <td>{row.esCliente}</td>
                  <td>{row.nombreReferencial}</td>
                  <td>{row.estadoReclamo}</td>
                  <td>{row.canal}</td>
                  <td>{row.DNI_DEUDOR}</td>
                  <td className="flex gap-2 justify-center">
                    <Button
                      className="bg-blue-600"
                      icon={<EyeOutlined style={{ color: "white" }} />}
                      onClick={() => showModalVer(row)}
                    />
                    <Button
                      className="bg-green-800"
                      icon={<EditOutlined style={{ color: "white" }} />}
                      onClick={() => showModalEditar(row)}
                    />
                    <Button
                      className="bg-red-600"
                      icon={<DeleteOutlined style={{ color: "white" }} />}
                      onClick={() => showModalEliminar(row)}
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
        {isModalVerOpen && (
          <Modal
          title={
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <SnippetsOutlined style={{ color: "blue", fontSize: "20px" }} />
              <span style={{ color: "blue", fontWeight: "bold" }}>DETALLE DEL RECLAMO</span>
            </div>
          }
            open={isModalVerOpen}
            onCancel={closeModalVer}
            width={800}
            footer={null}
          >
            <div className="flex flex-col gap-2 mt-5">
              <div className="flex w-full items-center">
                <div className=" flex gap-5 w-1/2">
                  <label className="  bg-gray-700 pl-3 pr-3 text-white rounded-lg">
                    {" "}
                    ID :{" "}
                  </label>
                  <label className="">{selectedRow.idReclamo}</label>
                </div>
                <div className=" flex gap-5 w-1/2">
                  <label className=" bg-gray-700 pl-3 pr-3 text-white rounded-lg">
                    {" "}
                    Nombre :{" "}
                  </label>
                  <label className="">{selectedRow.nombreReferencial}</label>
                </div>
              </div>
              <div className="flex ">
                <div className=" flex gap-5 w-1/2">
                  <label className=" bg-gray-700 pl-3 pr-3 text-white rounded-lg">
                    {" "}
                    Fecha Reclamo :{" "}
                  </label>
                  <label className="">{selectedRow.fecReclamo}</label>
                </div>
                <div className=" flex gap-5 w-1/2">
                  <label className=" bg-gray-700 pl-3 pr-3 text-white rounded-lg">
                    {" "}
                    Fecha Suceso :{" "}
                  </label>
                  <label className="">{selectedRow.fecSuceso}</label>
                </div>
              </div>
              <div className="flex">
                <div className=" flex gap-5 w-1/2">
                  <label className=" bg-gray-700 pl-3 pr-3 text-white rounded-lg">
                    {" "}
                    Vía :{" "}
                  </label>
                  <label className=" ">{selectedRow.via}</label>
                </div>
                <div className=" flex gap-5 w-1/2">
                  <label className=" bg-gray-700 pl-3 pr-3 text-white rounded-lg">
                    {" "}
                    DNI Reclamo :{" "}
                  </label>
                  <label className=" ">{selectedRow.DNI_RECLAMO}</label>
                </div>
              </div>

              <div className="flex">
                <div className=" flex gap-5 w-1/2">
                  <label className=" bg-gray-700 pl-3 pr-3 text-white rounded-lg">
                    {" "}
                    Es Cliente ? :{" "}
                  </label>
                  <label className=" ">{selectedRow.esCliente}</label>
                </div>

                <div className=" flex gap-5 w-1/2">
                  <label className=" bg-gray-700 pl-3 pr-3 text-white rounded-lg">
                    {" "}
                    Estado reclamo :{" "}
                  </label>
                  <label
                    className={
                      selectedRow.estadoReclamo === "Resuelto"
                        ? "bg-green-700 text-white pl-3 pr-3 rounded-lg"
                        : "bg-red-500 text-white pl-3 pr-3 rounded-lg"
                    }
                  >
                    {selectedRow.estadoReclamo}
                  </label>
                </div>
              </div>

              <div className="flex">
                <div className=" flex gap-5 w-1/2">
                  <label className=" bg-gray-700 pl-3 pr-3 text-white rounded-lg">
                    {" "}
                    Canal :{" "}
                  </label>
                  <label className=" ">{selectedRow.canal}</label>
                </div>
                <div className=" flex gap-5 w-1/2">
                  <label className=" bg-gray-700 pl-3 pr-3 text-white rounded-lg">
                    {" "}
                    DNI Deudor :{" "}
                  </label>
                  <label className=" ">{selectedRow.DNI_DEUDOR}</label>
                </div>
              </div>

              <div className=" flex gap-5 mt-5">
                <label className=" bg-gray-700 pl-3 pr-3 text-white rounded-lg">
                  {" "}
                  Motivo :{" "}
                </label>
                <label className=" ">{selectedRow.motivo}</label>
              </div>
              <div className=" flex w-full ">
                <div className=" flex gap-5 mt-5 items-center w-full  ">
                  <label className=" w-2/12 bg-gray-700 pl-3 pr-3 text-white rounded-lg">
                    {" "}
                    Observación :{" "}
                  </label>
                  <label className=" w-10/12 ">{selectedRow.observacion}</label>
                </div>
              </div>
            </div>
          </Modal>
        )}
          {isModalEditarOpen && (
          <Modal
          title={
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <EditOutlined style={{ color: "green", fontSize: "20px" }} />
              <span style={{ color: "green", fontWeight: "bold" }}>EDITANDO RECLAMO</span>
            </div>
          }
            open={isModalEditarOpen}
            onCancel={closeModalEditar}
            width={1000}
            centered
            footer={null}
          >
            <div>
              <div>
                <FormularioEditarReclamo selectRow={selectedRow} closeModal={closeModalEditar}></FormularioEditarReclamo>
              </div>
           
            </div>
            
          </Modal>
        )}
        {isModalEliminarOpen && (
          <Modal
          title={
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <DeleteOutlined style={{ color: "red", fontSize: "20px" }} />
              <span style={{ color: "red", fontWeight: "bold" }}>ELIMINACIÓN DE RECLAMO</span>
            </div>
          }
            open={isModalEliminarOpen}
            onCancel={closeModalEliminar}
            width={600}
            footer={null}
          >
            <div className="flex justify-center gap-10 items-center ">
              <label className="font-semibold">
                ¿Estás seguro que deseas eliminar el reclamo Nº{" "}
                {selectedRow.idReclamo}?
              </label>
              <WarningOutlined style={{ color: "red", fontSize: "30px" }} />
            </div>
            <div className="flex items-center justify-center gap-5 mt-5">
              <Button onClick={handelEliminar}>Si</Button>
              <Button onClick={closeModalEliminar}>No</Button>
              <Button onClick={closeModalEliminar}>Cancelar</Button>
            </div>
          </Modal>
        )}

        {isModalExitoOpen && (
         <Modal
         title="Resultado"
         open={isModalExitoOpen}
         footer={null}
         onCancel={() => setIsModalExitoOpen(false)}
       >
         <Result
           status="success"
           title="Se eliminó el reclamo con éxito!"          
         />
       </Modal>
       
        )}
      </div>
    </ConfigProvider>
  );
};

export default Reclamos;
