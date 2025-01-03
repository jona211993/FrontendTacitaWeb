import { useState,useEffect } from "react";
import "../styles/Tabla.css"; // Importamos los estilos
import { DatePicker, ConfigProvider ,  Input} from "antd";
const { RangePicker } = DatePicker;
import { Select } from "antd";
import { useData } from "../context/DataContext.jsx";
const { Option } = Select;
import locale from "antd/es/locale/es_ES"; // Importa el idioma español para Ant Design
import dayjs from "dayjs"; // Asegúrate de tener Day.js instalado
import "dayjs/locale/es"; // Configura el idioma español para Day.js
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
dayjs.locale("es"); // Establece español como idioma por defecto




const ModuloPagosReconocidos = () => {
  const { user } = useData();
  const [selectedRow, setSelectedRow] = useState(null);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");
  const [listaCanal, setListaCanal] = useState([]);
  const [datosMostrar, setDatosMostrar] = useState([]); 
  const [canal, setCanal] = useState("AREQUIPA SOLES");
  const [monto, setMonto] = useState("");
  const [idpago, setIdPago] = useState("");
  const [identificacion, setIdentificacion] = useState("");
  const [numOperacion, setNumOperacion] = useState("");
  const [valorSeleccionado, setValorSeleccionado] = useState("PAGO");
  const [estadoBotonTodo, setEstadoBotonTodo] = useState(0);

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
      const obtenerDatos = async () => {
        try {
          const cuerpoSolicitud = {
            tipo: "TODO",
            fec_inicio: "",
            fec_fin: "",
            canal:"",
            documento: "",
            TIPO_A:"",
            USUARIO: user.alias          
          };
  
          const respuesta = await fetch(`${import.meta.env.VITE_BACKEND_URL}/buscarPagosREC`, {
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
    }, []); // El array vacío asegura que el efecto solo se ejecute al montar el componente
   
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


  const handleRowClick = (row, index) => {
    setSelectedRow(index);
    console.log("Valores de la fila seleccionada:", row);
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

  const handleChange = (value) => {
     setMonto("")
     setIdPago("")
     if(value==="FECHA DE PAGO"){
      setValorSeleccionado("PAGO"); // Actualiza el estado con la opción seleccionada
     }
     else if(value==="CANAL DE PAGO"){
      setValorSeleccionado("CANAL"); // Actualiza el estado con la opción seleccionada
     }
     else if(value==="FECHA/CANAL"){
      setValorSeleccionado("AMBOS"); // Actualiza el estado con la opción seleccionada
     }
     else if(value==="DOCUMENTO"){
      setValorSeleccionado("DOCUMENTO"); // Actualiza el estado con la opción seleccionada
     }
     else if(value==="NUM OPERACION"){
      setValorSeleccionado("NUMOPE"); // Actualiza el estado con la opción seleccionada
     }
     else if(value==="MONTO DE PAGO"){
      setValorSeleccionado("MONTO"); // Actualiza el estado con la opción seleccionada
     }
     else if(value==="ID PAGO"){
      setValorSeleccionado("IDPAGO"); // Actualiza el estado con la opción seleccionada
     }
     else {
      setValorSeleccionado("TODO"); // Actualiza el estado con la opción seleccionada
     }

    
  
  };

 
 const handleChangeCanal = (value) => {   
  setCanal(value) 
};

const handleChangeMonto = (event) => {
  setMonto(event.target.value); // Guarda el texto del input
};

const  handleChangeIdPago = (event) => {
  setIdPago(event.target.value); // Guarda el texto del input
};

const handleChangeDocumento = (event) => {
  setIdentificacion(event.target.value); // Guarda el texto del input
};
const handleChangeNumOperacion = (event) => {
  setNumOperacion(event.target.value); // Guarda el texto del input
};

  const handelBuscar=async() => {
      
    try {
      const cuerpoSolicitud = {
        tipo: valorSeleccionado,
        fec_inicio: fechaInicio,
        fec_fin: fechaFinal,
        canal: canal,
        documento: valorSeleccionado==="MONTO"? monto : 
        valorSeleccionado === "IDPAGO"? idpago: 
        valorSeleccionado === "DOCUMENTO"? identificacion: 
        valorSeleccionado === "NUMOPE"? idpago: 
        valorSeleccionado === "PAGO"? "":         
        "",
        TIPO_A:"",
        USUARIO: user.alias,
      };

      console.log("Estamos enviando desde el front esto:; ", cuerpoSolicitud) 

      const respuesta = await fetch(`${import.meta.env.VITE_BACKEND_URL}/buscarPagosREC`, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cuerpoSolicitud),
      });

      if (!respuesta.ok) {
        throw new Error("Error al obtener los datos");
      }

      const datos = await respuesta.json();
      console.log("Dando click al boton buscar: ")
      // console.log(datos)
      setDatosMostrar(datos);
    } catch (error) {
      console.error("Error:", error);
    }

  }

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
              <Option value="DOCUMENTO">DOCUMENTO</Option>
              <Option value="NUM OPERACION">NUM OPERACION</Option>
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
                    format="YYYY-MM-DD"
                    disabledDate={disabledDate}
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
          {valorSeleccionado === "DOCUMENTO" && (
            <>
              <div className="w-1/2 ">
                <div style={{ margin: "20px" }}>
                <Input value={identificacion} onChange={handleChangeDocumento} placeholder="Ingrese el documento" />
                </div>
              </div>
            
            </>
          )}
          {valorSeleccionado === "NUMOPE" && (
            <>
              <div className="w-1/2 ">
                <div style={{ margin: "20px" }}>
                <Input value={numOperacion} onChange={handleChangeNumOperacion} placeholder="Ingrese el num oper." />
                </div>
              </div>
            
            </>
          )}
          {valorSeleccionado === "MONTO" && (
            <>
              <div className="w-1/2 ">
                <div style={{ margin: "20px" }}>
                <Input value={monto} onChange={handleChangeMonto} placeholder="Ingrese el monto" />
                </div>
              </div>
            
            </>
          )}
          {valorSeleccionado === "IDPAGO" && (
            <>
              <div className="w-1/2 ">
                <div style={{ margin: "20px" }}>
                <Input value={idpago} onChange={handleChangeIdPago} placeholder="ID Pago" />
                </div>
              </div>
            
            </>
          )}
        </div>


        <div className="w-1/4 flex  gap-3  items-center justify-center">
          <button className="px-4 py-2 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
          onClick={handelBuscar}
          >
            Buscar
          </button>
          <button className="px-4 py-2 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
           onClick={reiniciarComponente}
          >
            TOTAL
          </button>
        </div>
      </div>

      <div className="text-lg font-semibold mt-4">
        Módulo De Pagos Reconocidos
      </div>

      <div className="tabla-container">
      <table className="tabla">
        <thead>
          <tr>
            <th>ID Pago</th>
            <th>FECHA PAGO</th>
            <th>HORA PAGO</th>
            <th>NUM OPER</th>
            <th>DOCUMENTO</th>
            <th>MONTO PAGO</th>
            <th>FECHA REC</th>
            <th>CANAL PAGO</th>
            <th>USUARIO</th>
          </tr>
        </thead>
        <tbody>
          {datosMostrar.data ? (
            datosMostrar.data.map((row, index) => (
              <tr
                key={row.idPago}
                className={selectedRow === index ? "fila-seleccionada" : ""}
                onClick={() => handleRowClick(row, index)}
              >
                <td>{row.idPago}</td>
                <td>{row.FEC_PAGO}</td>
                <td>{row.HORA_PAGO}</td>
                <td>{row.NUM_OPE}</td>
                <td>{row.DOCUMENTO}</td>
                <td>{row.MONTO_PAGO}</td>
                <td>{row.FEC_RECON}</td>
                <td>{row.MODALIDAD}</td>
                <td>{row.USUARIO}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">Cargando datos...</td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    </ConfigProvider>
  );
};

export default ModuloPagosReconocidos;
