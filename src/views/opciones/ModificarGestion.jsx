/* eslint-disable react/prop-types */
import { Checkbox } from "antd";
import { useData } from "../../context/DataContext.jsx";
import { useState, useEffect } from "react";
import { Modal, Input,message } from "antd";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const ModificarGestion = ({cerrarModal}) => {

  const navigate = useNavigate();
  const { cliente, gestionElegida, user } = useData();
  // Estado para almacenar el valor de Nivel 1
  const [nivel1, setNivel1] = useState("");
  // Estado para almacenar el valor de Nivel 2
  const [nivel2, setNivel2] = useState("");
  // Estado para almacenar las opciones de Nivel 2
  const [nivel2Options, setNivel2Options] = useState([]);
  // Estado para almacenar el valor de fecha llamada
  const [fechaLlamada, setFechaLlamada] = useState("");
  // // Estado para almacenar el valor de hora llamada
  // const [horaLlamada, setHoraLLamada] = useState("");
  // Estado para almacenar el valor de Nivel 2
  const [flagInvalidar, setFlagInvalidar] = useState(false);
  // Estado para almacenar el valor de Nivel 2
  const [fecCompromiso, setFecCompromiso] = useState("");
  // Estado para almacenar el valor de Nivel 2
  const [monto, setMonto] = useState("");
  // Estado para almacenar el valor de Nivel 2
  const [tipoInbound, setTipoInbound] = useState("");

  const [tipoLlamada, setTipoLlamada] = useState("");

  const [errors, setErrors] = useState({});

  const [motivo, setMotivo] = useState("");

  const [isModalVisible, setIsModalVisible] = useState(false); 

  useEffect(() => {
    setNivel1(gestionElegida.nvl1)
  }, [gestionElegida])
  

  const showModal = () => {
    setIsModalVisible(true); // Muestra el modal
  };

  const handleOk = async () => {    
       
    const datos = {
      documento: gestionElegida.documento,
      cartera: gestionElegida.cartera,
      asesor: gestionElegida.asesor,
      fechaLlamada: dayjs(gestionElegida.fechaLlamada, 'DD-MM-YYYY').format('YYYY-MM-DD'),
      horaLlamada: gestionElegida.hora,      
      nivel2: gestionElegida.nvl2,
      n_fechaLlamada: fechaLlamada,
      n_fechaCompromiso: (fecCompromiso==="" || !fecCompromiso)? null:  dayjs(fecCompromiso, 'DD-MM-YYYY').format('YYYY-MM-DD'),
      n_monto: (monto==="" || !monto)? 0: monto ,
      n_nivel1: nivel1,
      n_nivel2: nivel2,
      motivo: motivo,
      tipLlamada: tipoLlamada,
      tipInbound: tipoInbound==="" || !tipoInbound? null:  tipoInbound,
      usuario: user.alias,
    };
    console.log("Se enviara esto por el formulario con MODIFICAR:");
    console.log("documento:", datos.documento)
    console.log("cartera:", datos.cartera)
    console.log("asesor:", datos.asesor)
    console.log("Fecha de Llamada:",datos.fechaLlamada);
    console.log("Hora de Llamada:",datos.horaLlamada);    
    console.log("nivel 2:", datos.nivel2);
    console.log("n_fechaLlamada:",datos.n_fechaLlamada);
    console.log("n_fechaCompromiso:", datos.n_fechaCompromiso);
    console.log("n_monto:", datos.n_monto);
    console.log("n_nivel1:", datos.n_nivel1);
    console.log("n_nivel2:", datos.n_nivel2);
    console.log("motivo:", datos.motivo);      
    console.log("tipLlamada:", datos.tipLlamada);
    console.log("tipInbound", datos.tipInbound);
    console.log("usuario:", datos.usuario);      
      

      // enviando con el endpoint::

      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/modificarGestion`, {
          method: "PUT", // Método HTTP
          headers: {
            "Content-Type": "application/json", // Indica que el cuerpo es JSON
          },
          body: JSON.stringify(datos), // Convierte el objeto en una cadena JSON
        });
    
        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.status}`);
        }
    
        const data = await response.json(); // Procesa la respuesta en formato JSON
        console.log("Respuesta del servidor:", data);
        
        if (response.status===200) {
          // Si el insert fue exitoso, muestra un mensaje o realiza alguna acción
          console.log("Insert exitoso", data);
          message.success("Registro exitoso!");
          // Retrasa la redirección por 2 segundos
          setTimeout(() => {
           setIsModalVisible(false)
           cerrarModal()
            navigate("/expertisERP/clientes");
          }, 800);
        } else {
          // Si hubo un error, maneja el error
          console.error("Error en el insert");
          alert("Hubo un error al insertar la gestión");
        }
      } catch (error) {
        console.error("Error al enviar los datos:", error);
      }
      




  };

  const handleCancel = () => {
    setIsModalVisible(false); // Cierra el modal sin enviar el mensaje
    setMotivo("")
  };

  const validateFields = () => {
    const newErrors = {};

    if (!fechaLlamada)
      newErrors.fechaLlamada = "La fecha de llamada es obligatoria";
    if (!nivel1 && flagInvalidar === false)
      newErrors.nivel1 = "El nivel 1 es obligatorio";
    if (!nivel2 && flagInvalidar === false)
      newErrors.nivel2 = "El nivel 2 es obligatorio";
    if (
      !fecCompromiso &&
      flagInvalidar === false &&
      (nivel2 === "PAR" || nivel2 === "PPC" || nivel2 === "PPM")
    )
      newErrors.fecCompromiso = "La fecha de compromiso es obligatoria";
    if (
      flagInvalidar === false &&
      (nivel2 === "PAR" || nivel2 === "PPC" || nivel2 === "PPM") &&
      !monto
    ) {
      newErrors.monto = "El monto es obligatorio";
    }

    if (
      flagInvalidar === false &&
      (tipoLlamada === "INBOUND") &&
      (!tipoInbound || tipoInbound==="")
    ) {
      newErrors.tipoInbound = "El tipo inbound para este casos es obligatorio";
    }

    setErrors(newErrors);

    // Retorna true si no hay errores
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    console.log("Errores actualizados:", errors);
  }, [errors]);

  // Simulación de las opciones para Nivel 2
  const opcionesNivel2 = {
    CONTACTO_EFECTIVO: ["PPC", "PAR", "PPM", "TAT", "VLL", "REN", "RPP"],
    CONTACTO_NO_EFECTIVO: ["MCT", "FAL"],
    NO_CONTACTO: ["NOC", "GRB", "ILC", "DES", "NTT", "HOM"],
  };
  // Maneja el cambio de valor en Nivel 1
  const handleNivel1Change = (e) => {
    const selectedNivel1 = e.target.value;
    setNivel1(selectedNivel1);
    // Actualiza las opciones de Nivel 2 según el valor de Nivel 1
    setNivel2Options(opcionesNivel2[selectedNivel1] || []);
    setNivel2(""); // Reinicia el valor de Nivel 2
  };

  // Maneja el cambio de valor en Nivel 2
  const handleNivel2Change = (e) => {
    const selectedNivel2 = e.target.value;
    setNivel2(selectedNivel2);
    setMonto("");   
  };


  useEffect(() => {
    if(!(nivel2==="PAR" || nivel2==="PPC" ||nivel2==="PPM") )
      { 
        console.log("Estas cambiando el nivel 2 a: ",nivel2, "por lo tanto fecCompromiso debe ser:",fecCompromiso)
        setFecCompromiso("");
      }
  }, [nivel2])
  
  // Simulación de las opciones para Nivel 2
  const opcionesTipoInbound = {
    INBOUND: [
      "CARTA",
      "AGENCIA",
      "SMS",
      "REPROGRAMACCION",
      "CORREO",
      "ASIGNADO",
      "PREFIJO",
    ],
  };

  // Maneja el cambio de valor en tipo llamada
  const handleTipoLlamadaChange = (e) => {
    const eleccionTipoLlamada = e.target.value;
    setTipoLlamada(eleccionTipoLlamada);
    setTipoInbound("");
  };

  const handelChangeFechaLlamada = (e) => {
    const eleccionfechaLlamada = e.target.value;
    console.log("Se cambio en la fecha llamada a: ", eleccionfechaLlamada);
    setFechaLlamada(eleccionfechaLlamada);
  };

  const handelChangeFlagInvalidar = () => {
    setFlagInvalidar(!flagInvalidar);      
    setMonto("");
  };

  useEffect(() => {
    // Aquí defines la lógica para actualizar nivel2 cuando dependencia cambia
    if (flagInvalidar === true) {
      if (
        gestionElegida.nvl2 === "PAR" ||
        gestionElegida.nvl2 === "PPC" ||
        gestionElegida.nvl2 === "PPM"
      ) {
        setNivel2("PPV");
      } else {
        setNivel2("INV");
      }
      setNivel1("NO ESPECIFICADO")
    }
  }, [flagInvalidar]); // Se ejecuta cada vez que dependencia cambie

  const handelChangeFechaCompromiso = (e) => {
    const eleccionfechaCompromiso = e.target.value;
    setFecCompromiso(eleccionfechaCompromiso);
  };

  const handelChangeMonto = (e) => {
    const valorMonto = e.target.value;
    // Expresión regular para números enteros o con dos decimales
    const regex = /^\d*\.?\d{0,2}$/;
    if (regex.test(valorMonto)) {
      setMonto(valorMonto);
    }
  };

  const handelChangeTipoInbound = (e) => {
    const valorTI = e.target.value;
    setTipoInbound(valorTI);
  };

  // useEffect para inicializar el valor de Nivel 1 con el valor de gestionElegida.nvl1
  useEffect(() => {
    let valor = "";
    if (gestionElegida && gestionElegida.nvl1) {
      if (gestionElegida.nvl1 === "CONTACTO EFECTIVO") {
        valor = "CONTACTO_EFECTIVO";
        setNivel1(valor);
      } else if (gestionElegida.nvl1 === "CONTACTO NO EFECTIVO") {
        valor = "CONTACTO_NO_EFECTIVO";
        setNivel1(valor);
      } else {
        valor = "NO_CONTACTO";
        setNivel1(valor);
      }

      console.log("Ahora el nivel 1 es: ", nivel1);
      // Actualizar las opciones de Nivel 2 en función de Nivel 1
      setNivel2Options(opcionesNivel2[valor] || []);
    }
  }, [gestionElegida]);

  // useEffect para inicializar el valor de NIVEL2 con el valor de gestionElegida

  useEffect(() => {
    if (gestionElegida && gestionElegida.nvl2) {
      // Actualizar las opciones de Nivel 2 en función de Nivel 1
      setNivel2(gestionElegida.nvl2);
      console.log("Para nvl2 :  ", gestionElegida.nvl2);
    }
  }, [gestionElegida]);

  // useEffect para inicializar el valor de FECHA_LLAMADA con el valor de gestionElegida
  useEffect(() => {
    if (gestionElegida && gestionElegida.fechaLlamada) {
      // Actualizar las opciones de Nivel 2 en función de Nivel 1
      setFechaLlamada(
        gestionElegida.fechaLlamada
          ? dayjs(gestionElegida.fechaLlamada, "DD-MM-YYYY").format(
              "YYYY-MM-DD"
            )
          : ""
      );
    }
  }, [gestionElegida]);

  // useEffect para inicializar el valor de tIPOllAMDA con el valor de gestionElegida
  useEffect(() => {
    if (gestionElegida && gestionElegida.tipoLlamada) {
      let valor = "";
      if (gestionElegida.tipoLlamada === "O") {
        valor = "OUTBOUND";
        setTipoLlamada(valor);
      } else if (gestionElegida.tipoLlamada === "I") {
        console.log("Esta en I el tipo LLamada", gestionElegida.tipoLlamada);
        valor = "INBOUND";
        setTipoLlamada(valor);
      } else {
        valor = "";
        console.log(
          "Esta en vacio el tipo LLamada",
          gestionElegida.tipoLlamada
        );
        setTipoLlamada(valor);
      }
      // console.log("Ahora el nivel 1 es: ", nivel1);
      // Actualizar las opciones de Nivel 2 en función de Nivel 1
      // setNivel2Options(opcionesNivel2[valor] || []);
    } else {
      console.log("No encontramos nada en festionesElegida.tipollamada");
      setTipoLlamada("OUTBOUND");
    }
  }, [gestionElegida]);

  // useEffect para inicializar el valor de FECcOMPROMISO con el valor de gestionElegida
  useEffect(() => {
    if (gestionElegida && gestionElegida.fecCompromiso) {
      // Actualizar las opciones de Nivel 2 en función de Nivel 1
      setFecCompromiso(
        gestionElegida.fecCompromiso
          ? dayjs(gestionElegida.fecCompromiso, "DD-MM-YYYY").format(
              "YYYY-MM-DD"
            )
          : ""
      );
    }
    if (!gestionElegida.fecCompromiso || gestionElegida.fecCompromiso === "") {
      console.log("fecCompriso vacia");
      setFecCompromiso("");
      console.log(fecCompromiso);
    }
  }, [gestionElegida]);

  // useEffect para inicializar el valor de NIVEL2 con el valor de gestionElegida

  useEffect(() => {
    if (gestionElegida && gestionElegida.monto) {
      // Actualizar las opciones de Nivel 2 en función de Nivel 1
      setMonto(gestionElegida.monto);
    }
    if (!gestionElegida.monto || gestionElegida.monto === "") {
      console.log("monto vacia");
      setMonto("");
      console.log(monto);
    }
  }, [gestionElegida]);

  // Función para manejar el clic del botón
  const handleClick = async() => {
    if (!validateFields()) {
      alert("Debe completar algunos campos del formulario");
      return;
    }    

    if(flagInvalidar){
      const datos = {
        documento: gestionElegida.documento,
        cartera: gestionElegida.cartera,
        asesor: gestionElegida.asesor,
        fechaLlamada: dayjs(gestionElegida.fechaLlamada, 'DD-MM-YYYY').format('YYYY-MM-DD'),
        horaLlamada: gestionElegida.hora,      
        nivel2: gestionElegida.nvl2,
        n_fechaLlamada: dayjs(gestionElegida.fechaLlamada, 'DD-MM-YYYY').format('YYYY-MM-DD'),
        n_fechaCompromiso: (gestionElegida.fecCompromiso==="" || !gestionElegida.fecCompromiso)? null:  dayjs(gestionElegida.fecCompromiso, 'DD-MM-YYYY').format('YYYY-MM-DD'),
        n_monto: gestionElegida.monto,
        n_nivel1: "NO ESPECIFICADO",
        n_nivel2: nivel2,
        motivo: "es un motivo",
        tipLlamada: tipoLlamada,
        tipInbound: gestionElegida.tipInbound==="" || !gestionElegida.tipInbound? null:  gestionElegida.tipInbound,
        usuario: user.alias,
      };
      console.log("Se enviara esto por el formulario con INVALIDAR:");
      console.log("documento:", datos.documento)
      console.log("cartera:", datos.cartera)
      console.log("asesor:", datos.asesor)
      console.log("Fecha de Llamada:",datos.fechaLlamada);
      console.log("Hora de Llamada:",datos.horaLlamada);
      console.log("nivel 1:", gestionElegida.nvl1);
      console.log("nivel 2:", datos.nivel2);
      console.log("n_fechaLlamada:",datos.n_fechaLlamada);
      console.log("n_fechaCompromiso:", datos.n_fechaCompromiso);
      console.log("n_monto:", datos.n_monto);
      console.log("n_nivel1:", "NO ESPECIFICADO");
      console.log("n_nivel2:", datos.n_nivel2);
      console.log("motivo:", datos.motivo);      
      console.log("tipLlamada:", datos.tipLlamada);
      console.log("tipInbound", datos.tipInbound);
      console.log("usuario:", datos.usuario);      

      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/modificarGestion`, {
          method: "PUT", // Método HTTP
          headers: {
            "Content-Type": "application/json", // Indica que el cuerpo es JSON
          },
          body: JSON.stringify(datos), // Convierte el objeto en una cadena JSON
        });
    
        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.status}`);
        }
    
        const data = await response.json(); // Procesa la respuesta en formato JSON
        console.log("Respuesta del servidor:", data);
        
        if (response.status===200) {
          // Si el insert fue exitoso, muestra un mensaje o realiza alguna acción
          console.log("Insert exitoso", data);
          message.success("Registro exitoso!");
          // Retrasa la redirección por 2 segundos
          setTimeout(() => {
            cerrarModal(); // Cierra el modal después de una respuesta exitosa
            navigate("/expertisERP/clientes");
          }, 800);
        } else {
          // Si hubo un error, maneja el error
          console.error("Error en el insert");
          alert("Hubo un error al insertar la gestión");
        }
      } catch (error) {
        console.error("Error al enviar los datos:", error);
      }

    }else{
      showModal()
    }
    
  };

    // Función para manejar el clic del botón
    const handleClickRefrescar = () => {
       setFechaLlamada(gestionElegida.fechaLlamada
        ? dayjs(gestionElegida.fechaLlamada, "DD-MM-YYYY").format(
            "YYYY-MM-DD"
          )
        : "")
   
        if(gestionElegida.nvl1==="CONTACTO EFECTIVO"){
          setNivel1("CONTACTO_EFECTIVO")          
          setNivel2Options(opcionesNivel2["CONTACTO_EFECTIVO"] || []);
        } else if(gestionElegida.nvl1==="CONTACTO NO EFECTIVO"){
          setNivel1("CONTACTO_NO_EFECTIVO")
          setNivel2Options(opcionesNivel2["CONTACTO_NO_EFECTIVO"] || []);
          console.log("actualizando el n1 ahora debe ser: ", nivel1)
        }else{
          setNivel1("NO_CONTACTO")
          setNivel2Options(opcionesNivel2["NO_CONTACTO"] || []);
        }
      
          
      setNivel2(gestionElegida.nvl2)

       setFecCompromiso(gestionElegida.fecCompromiso
        ? dayjs(gestionElegida.fecCompromiso, "DD-MM-YYYY").format(
            "YYYY-MM-DD"
          )
        : "")
       setMonto(gestionElegida.monto)

       if(gestionElegida.tipoLlamada==="O"){
          setTipoLlamada("OUTBOUND")
       }else{
          setTipoLlamada("INBOUND")
       }
       
       setTipoInbound(gestionElegida.tipoInbound)
       alert("Se restauraron los valores")
    
    };
  return (
    <div className="flex flex-col w-full">
      <div className="flex  gap-10 w-full">
        <div className="flex gap-10  w-1/2">
          <label> DOCUMENTO</label>
          <input
            type="text"
            defaultValue={cliente.DOCUMENTO}
            readOnly
            className="text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-center"
          />
        </div>

        <div className="flex gap-10 w-1/2">
          <label> CARTERA</label>
          <input
            type="text"
            defaultValue={cliente.CARTERA}
            readOnly
            className="text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-center "
          />
        </div>
      </div>
      <div className=" flex gap-5 w-full  mt-5">
        <div className="w-1/2 flex flex-col items-center gap-2">
          <label className=" bg-gray-500 text-white w-full text-center p-1 mb-7 rounded-lg">
            {" "}
            ACTUAL
          </label>
          <div className="flex  w-full">
            <div className="w-1/2 ">
              <label> FECHA LLAMADA :</label>
            </div>
            <div className="w-1/2 ">
              <input
                type="text"
                value={gestionElegida?.fechaLlamada || ""}
                className=" text-center text-gray-900 border border-gray-300 rounded-lg bg-gray-300 focus:ring-blue-500 focus:border-blue-500 "
              />
            </div>
          </div>
          <div className="flex  w-full">
            <div className="w-1/2 ">
              <label>HORA LLAMADA :</label>
            </div>
            <div className="w-1/2 ">
              <input
                type="text"
                disabled
                value={gestionElegida?.hora || ""}
                className="text-center text-gray-900 border border-gray-300 rounded-lg bg-gray-300 focus:ring-blue-500 focus:border-blue-500 "
              />
            </div>
          </div>
          <div className="flex  w-full">
            <div className="w-1/2 ">
              <label> NIVEL 1 :</label>
            </div>
            <div className="w-1/2 ">
              <input
                type="text"
                disabled
                value={gestionElegida?.nvl1 || ""}
                className=" text-xs p-1 text-center text-gray-900 border border-gray-300 rounded-lg bg-gray-300 focus:ring-blue-500 focus:border-blue-500 "
              />
            </div>
          </div>
          <div className="flex  w-full">
            <div className="w-1/2 ">
              <label> NIVEL 2 :</label>
            </div>
            <div className="w-1/2 ">
              <input
                type="text"
                disabled
                value={gestionElegida?.nvl2 || ""}
                className="text-center text-gray-900 border border-gray-300 rounded-lg bg-gray-300 focus:ring-blue-500 focus:border-blue-500 "
              />
            </div>
          </div>
          <div className="flex  w-full">
            <div className="w-1/2 ">
              <label>FECHA COMPROMISO :</label>
            </div>
            <div className="w-1/2 ">
              <input
                type="text"
                disabled
                value={gestionElegida?.fecCompromiso || ""}
                className=" text-center text-gray-900 border border-gray-300 rounded-lg bg-gray-300 focus:ring-blue-500 focus:border-blue-500 "
              />
            </div>
          </div>
          <div className="flex  w-full">
            <div className="w-1/2 ">
              <label>MONTO :</label>
            </div>
            <div className="w-1/2 ">
              <input
                type="text"
                disabled
                value={gestionElegida?.monto || ""}
                className="text-center text-gray-900 border border-gray-300 rounded-lg bg-gray-300 focus:ring-blue-500 focus:border-blue-500 "
              />
            </div>
          </div>
          <div className="flex  w-full">
            <div className="w-1/2 ">
              <label>ASESOR :</label>
            </div>
            <div className="w-1/2 ">
              <input
                type="text"
                disabled
                value={gestionElegida?.asesor || ""}
                className="text-center text-gray-900 border border-gray-300 rounded-lg bg-gray-300 focus:ring-blue-500 focus:border-blue-500 "
              />
            </div>
          </div>
          <div className="flex  w-full">
            <div className="w-1/2 ">
              <label>CANAL :</label>
            </div>
            <div className="w-1/2 ">
              <input
                type="text"
                disabled
                value={gestionElegida?.agencia || ""}
                className="text-center text-gray-900 border border-gray-300 rounded-lg bg-gray-300 focus:ring-blue-500 focus:border-blue-500 "
              />
            </div>
          </div>
          <div className="flex  w-full">
            <div className="w-1/2 ">
              <label>TIP. LLAMADA :</label>
            </div>
            <div className="w-1/2 ">
              <input
                type="text"
                disabled
                value={gestionElegida?.tipoLlamada || ""}
                className="text-center text-gray-900 border border-gray-300 rounded-lg bg-gray-300 focus:ring-blue-500 focus:border-blue-500 "
              />
            </div>
          </div>
          <div className="flex  w-full">
            <div className="w-1/2 ">
              <label>TIP. INBOUND :</label>
            </div>
            <div className="w-1/2 ">
              <input
                type="text"
                disabled
                value={gestionElegida?.tipoInbound || ""}
                className="text-center text-gray-900 border border-gray-300 rounded-lg bg-gray-300 focus:ring-blue-500 focus:border-blue-500 "
              />
            </div>
          </div>
        </div>

        {/* Nuevo */}
        <div className=" w-1/2 flex flex-col items-center gap-2">
          <label className="w-full bg-green-500 text-white rounded-lg p-1 mb-0 text-center">
            {" "}
            NUEVO
          </label>
          <div className="w-1/3">
            <Checkbox
              value={flagInvalidar}
              onChange={handelChangeFlagInvalidar}
            >
              INVALIDAR
            </Checkbox>
          </div>
          {flagInvalidar ? (
            <>
              <div className="flex  w-full">
            <div className="w-1/2 ">
              <label> FECHA LLAMADA :</label>
            </div>
            <div className="w-1/2 ">
              <input
                type="text"
                value={gestionElegida?.fechaLlamada || ""}
                className=" text-center text-gray-900 border border-gray-300 rounded-lg bg-gray-300 focus:ring-blue-500 focus:border-blue-500 "
              />
            </div>
          </div>
              <div className="flex  w-full">
                <div className="w-1/2 ">
                  <label>HORA LLAMADA :</label>
                </div>
                <div className="w-1/2 ">
                  <input
                    type="text"
                    value={gestionElegida.hora}
                    disabled
                    className="text-center  text-gray-900 border border-gray-200 rounded-lg bg-gray-300 focus:ring-blue-500 focus:border-blue-500 "
                  />
                </div>
              </div>
              <div className="flex  w-full">
                <div className="w-1/2 ">
                  <label> NIVEL 1 :</label>
                </div>
                <div className="w-1/2 ">
                  <div className="w-full text-center ">
                    <label>{nivel1}</label>
                  </div>
                </div>
              </div>
              <div className="flex  w-full">
                <div className="w-1/2 ">
                  <label> NIVEL 2 :</label>
                </div>
                <div className="w-1/2 flex flex-col gap-2 justify-center">
                  <div className="w-full text-center ">
                    <label>{nivel2}</label>
                  </div>
                </div>
              </div>
               
              <div className="flex  w-full">
            <div className="w-1/2 ">
              <label>FECHA COMPROMISO :</label>
            </div>
            <div className="w-1/2 ">
              <input
                type="text"
                disabled
                value={gestionElegida?.fecCompromiso || ""}
                className=" text-center text-gray-900 border border-gray-300 rounded-lg bg-gray-300 focus:ring-blue-500 focus:border-blue-500 "
              />
            </div>
          </div> 
          <div className="flex  w-full">
            <div className="w-1/2 ">
              <label>MONTO :</label>
            </div>
            <div className="w-1/2 ">
              <input
                type="text"
                disabled
                value={gestionElegida?.monto || ""}
                className="text-center text-gray-900 border border-gray-300 rounded-lg bg-gray-300 focus:ring-blue-500 focus:border-blue-500 "
              />
            </div>
          </div>

              <div className="flex  w-full">
                <div className="w-1/2 ">
                  <label>ASESOR :</label>
                </div>
                <div className="w-1/2 ">
                  <input
                    type="text"
                    disabled
                    value={gestionElegida.asesor}
                    className="text-gray-900 border text-center  border-gray-300 rounded-lg bg-gray-300 focus:ring-blue-500 focus:border-blue-500 "
                  />
                </div>
              </div>
              <div className="flex  w-full">
                <div className="w-1/2 ">
                  <label>CANAL :</label>
                </div>
                <div className="w-1/2 ">
                  <input
                    type="text"
                    disabled
                    value={gestionElegida.agencia}
                    className="text-center text-gray-900 border border-gray-300 rounded-lg bg-gray-300 focus:ring-blue-500 focus:border-blue-500 "
                  />
                </div>
              </div>
              <div className="flex  w-full">
            <div className="w-1/2 ">
              <label>TIP. LLAMADA :</label>
            </div>
            <div className="w-1/2 ">
              <input
                type="text"
                disabled
                value={gestionElegida?.tipoLlamada || ""}
                className="text-center text-gray-900 border border-gray-300 rounded-lg bg-gray-300 focus:ring-blue-500 focus:border-blue-500 "
              />
            </div>
          </div>
          <div className="flex  w-full">
            <div className="w-1/2 ">
              <label>TIP. INBOUND :</label>
            </div>
            <div className="w-1/2 ">
              <input
                type="text"
                disabled
                value={gestionElegida?.tipoInbound || ""}
                className="text-center text-gray-900 border border-gray-300 rounded-lg bg-gray-300 focus:ring-blue-500 focus:border-blue-500 "
              />
            </div>
          </div>
            </>
          ) : (
            <>
              <div className="flex  w-full">
                <div className="w-1/2 ">
                  <label> FECHA LLAMADA :</label>
                </div>
                <div className="w-1/2 ">
                  <input
                    type="date"
                    value={fechaLlamada}
                    onChange={handelChangeFechaLlamada}
                    className=" text-center text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 "
                  />
                </div>
              </div>
              <div className="flex  w-full">
                <div className="w-1/2 ">
                  <label>HORA LLAMADA :</label>
                </div>
                <div className="w-1/2 ">
                  <input
                    type="text"
                    value={gestionElegida.hora}
                    disabled
                    className="text-center  text-gray-900 border border-gray-200 rounded-lg bg-gray-300 focus:ring-blue-500 focus:border-blue-500 "
                  />
                </div>
              </div>
              <div className="flex  w-full">
                <div className="w-1/2 ">
                  <label> NIVEL 1 :</label>
                </div>
                <div className="w-1/2 ">
                  <select
                    value={nivel1}
                    onChange={handleNivel1Change}
                    className="p-1 text-xs text-center text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccione Nivel 1</option>
                    <option value="CONTACTO_EFECTIVO">CONTACTO EFECTIVO</option>
                    <option value="CONTACTO_NO_EFECTIVO">
                      CONTACTO NO EFECTIVO
                    </option>
                    <option value="NO_CONTACTO">NO CONTACTO</option>
                  </select>
                </div>
              </div>
              <div className="flex  w-full">
                <div className="w-1/2 ">
                  <label> NIVEL 2 :</label>
                </div>
                <div className="w-1/2 flex flex-col gap-2 justify-center">
                  <div className="w-1/3 ">
                    <select
                      value={nivel2}
                      onChange={handleNivel2Change}
                      className="text-center text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                      disabled={!nivel2Options.length} // Deshabilita si no hay opciones
                    >
                      <option value="">Seleccione Nivel 2</option>
                      {nivel2Options.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex  w-full">
                <div className="w-1/2 ">
                  <label>FECHA COMPROMISO :</label>
                </div>
                <div className="w-1/2 ">
                  <input
                    type="date"
                    value={fecCompromiso}
                    disabled={!(nivel2==="PPC"||nivel2==="PAR"||nivel2==="PPM" )}
                    onChange={handelChangeFechaCompromiso}
                    className={`text-center text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.fecCompromiso
                        ? "border-red-500"
                        : "border-gray-300"
                    } `}
                  />
                </div>
              </div>
              <div className="flex  w-full">
                <div className="w-1/2 ">
                  <label>MONTO :</label>
                </div>
                <div className="w-1/2 ">
                  <input
                    type="text"
                    value={monto}
                    disabled={
                      nivel2 !== "PAR" && nivel2 !== "PPM" && nivel2 !== "PPC"
                    }
                    onChange={handelChangeMonto}
                    className={`text-center text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.monto ? "border-red-500" : "border-gray-300"
                    } `}
                  />
                </div>
              </div>
              <div className="flex  w-full">
                <div className="w-1/2 ">
                  <label>ASESOR :</label>
                </div>
                <div className="w-1/2 ">
                  <input
                    type="text"
                    disabled
                    value={gestionElegida.asesor}
                    className="text-gray-900 border text-center  border-gray-300 rounded-lg bg-gray-300 focus:ring-blue-500 focus:border-blue-500 "
                  />
                </div>
              </div>
              <div className="flex  w-full">
                <div className="w-1/2 ">
                  <label>CANAL :</label>
                </div>
                <div className="w-1/2 ">
                  <input
                    type="text"
                    disabled
                    value={gestionElegida.agencia}
                    className="text-center text-gray-900 border border-gray-300 rounded-lg bg-gray-300 focus:ring-blue-500 focus:border-blue-500 "
                  />
                </div>
              </div>
              <div className="flex  w-full">
                <div className="w-1/2 ">
                  <label>TIP. LLAMADA :</label>
                </div>
                <div className="w-1/2 ">
                  <select
                    type="text"
                    value={tipoLlamada}
                    onChange={handleTipoLlamadaChange}
                    className=" text-center text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 "
                  >
                    <option value="INBOUND">INBOUND</option>
                    <option value="OUTBOUND">OUTBOUND</option>
                  </select>
                </div>
              </div>
              {tipoLlamada === "INBOUND" && (
                <div className="flex  w-full">
                  <div className="w-1/2 ">
                    <label>TIP. INBOUND :</label>
                  </div>
                  <div className="w-1/2 ">
                    <select
                      type="text"
                      value={tipoInbound}
                      onChange={handelChangeTipoInbound}
                      className={`text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.tipoInbound
                        ? "border-red-500"
                        : "border-gray-300"
                    } `}
                    >
                      <option value="">Seleccionar </option>
                      {opcionesTipoInbound.INBOUND.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <div className="w-full flex justify-center mt-5 items-center gap-10">
        <button
          onClick={handleClick} // Asigna la función al evento onClick
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
        >
          Modificar
        </button>
        <button
          onClick={handleClickRefrescar} // Asigna la función al evento onClick
          className="px-4 py-2 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
        >
          Restaurar
        </button>
      </div>
      <Modal
        title="Escriba el motivo por favor:"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Enviar"
        okButtonProps={{ disabled: !motivo.trim() }}
        cancelText="Cancelar"
      >        
        <Input.TextArea
          rows={4}
          placeholder="Escribe tu mensaje aquí..."
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default ModificarGestion;
