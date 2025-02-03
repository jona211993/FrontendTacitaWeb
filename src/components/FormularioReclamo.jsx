import { Select } from "antd";
import { Checkbox } from "antd";
import { Button, Modal, Result } from "antd";
import axios from "axios";
const { Option } = Select;
import {
  SearchOutlined,
  ScanOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useData } from "../context/DataContext.jsx";
import { useNavigate } from "react-router-dom";

const FormularioReclamo = () => {
  const { user } = useData();
  const navigate = useNavigate();
  const [viaReclamo, setViaReclamo] = useState("Ministerio público");
  const [motivo, setMotivo] = useState("Actualización en la central de riesgo");
  const [esCliente, setEsCliente] = useState("No");
  const [seResolvio, setSeResolvio] = useState("No resuelto");
  const [canal, setCanal] = useState("Interno");
  const [listaVia, setListaVia] = useState([]);
  const [listaMotivos, setListaMotivos] = useState([]);
  const [checkDniReclamo, setCheckDniReclamo] = useState(true);
  const [checkDniDeudor, setCheckDniDeudor] = useState(true);
  const [dniReclamo, setDniReclamo] = useState("");
  const [dniDeudor, setDniDeudor] = useState("");
  const [observacion, setObservacion] = useState("");
  const [nombre, setNombre] = useState("");
  // Obtiene la fecha de hoy en formato 'YYYY-MM-DD'
  const today = new Date().toISOString().split("T")[0];
  const [fechaReclamo, setFechaReclamo] = useState(today);
  const [fechaSuceso, setFechaSuceso] = useState(today);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [mensaje2, setMensaje2] = useState("");
  //Estados para habilitacion de botones:
  const [habilitarBtnValidar, setHabilitarBtnValidar] = useState(true);
  const [habilitarCheckDniDeudor, setHabilitarCheckDniDeudor] = useState(true);
  const [habilitarInputDniDeudor, setHabilitarInputDniDeudor] = useState(true);
  const [habilitarSelectCliente, setHabilitarSelectCliente] = useState(true);
  //Estados de Validacion
  const [validar1, setValidar1] = useState(false);
  const [validar2, setValidar2] = useState(false);
  // Para Errore:
  const [errors, setErrors] = useState({}); // Estado para errores
  // Para el modal de registro exitoso
  const [mostrarModalExitoso, setMostrarModalExitoso] = useState(false);

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const validateFields = () => {
    const newErrors = {};

    if (!dniReclamo  && checkDniReclamo === true) {
      newErrors.dniReclamo = "El DNI del reclamo es obligatorio.";
    }
    if (!dniDeudor && checkDniDeudor === true) {
      console.log(dniDeudor);
      newErrors.dniDeudor = "El DNI del deudor es obligatorio.";
    }
    if (!observacion.trim()) {
      newErrors.observacion = "La observación es obligatoria.";
    }

    setErrors(newErrors); // Actualiza los errores
    return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
  };
 // Para el modal de exito
 const showModalExito = () => {
  setMostrarModalExitoso(true);

  // Cierra el modal después de 3 segundos
  setTimeout(() => {
    setMostrarModalExitoso(false);
  }, 2000);
};



  ///
  const showModal = () => {
    setIsModalVisible(true);

    // Cierra el modal después de 3 segundos
    setTimeout(() => {
      setIsModalVisible(false);
    }, 2000);
  };

  // Para el modal de deudor

  const showModal2 = () => {
    setIsModalVisible2(true);

    // Cierra el modal después de 3 segundos
    setTimeout(() => {
      setIsModalVisible2(false);
    }, 2000);
  };

  const handleChangeCheckDniReclamo = (e) => {
    setCheckDniReclamo(e.target.checked);
    if (e.target.checked===false) {
      setDniReclamo("SIN DNI");
    } else {
      setDniReclamo("");
    }

    setNombre("");
    setHabilitarCheckDniDeudor(true);
    setHabilitarInputDniDeudor(true);
    setHabilitarBtnValidar(true);
    setHabilitarSelectCliente(true);
    setValidar1(false);
  };

  const handleChangeCheckDniDeudor = (e) => {
    setCheckDniDeudor(e.target.checked);
    if (!checkDniDeudor) {
      setDniDeudor("SIN DNI");
    } else {
      setDniDeudor("");
    }
    setNombre("");
    setHabilitarCheckDniDeudor(true);
    setHabilitarInputDniDeudor(true);
    setHabilitarBtnValidar(true);
    setHabilitarSelectCliente(true);
    setValidar2(false);
  };
  useEffect(() => {
    const obtenerViasReclamo = async () => {
      setListaVia([
        "Ministerio público",
        "Indecopi",
        "Carta notarial",
        "Web Expertis",
        "Telefónico",
      ]);
    };

    obtenerViasReclamo();
  }, []);

  useEffect(() => {
    const obtenerMotivos = async () => {
      setListaMotivos([
        "Actualización en la central de riesgo",
        "Teléfono no pertenece",
        "Métodos abusivos de cobranza",
        "No reconoce la transferencia",
        "No reconoce deuda con la entidad primigenia",
        "Actualización de saldo en la S.B.S",
        "Conciliación",
        "Estafa",
        "Conclusión del proceso",
        "Titular Fenecido",
        "Devolución de alicuota",
        "Correo no pertenece",
        "Carta notarial",
        "Dirección errónea",
        "Extorsión",
        "Otros",
      ]);
    };

    obtenerMotivos();
  }, []);

  const handleChangeViaReclamo = (value) => {
    setViaReclamo(value);
  };

  const handleChangeMotivo = (value) => {
    setMotivo(value);
  };

  const handleChangeEscliente = (value) => {
    setEsCliente(value);
  };

  const handleChangeSeResolvio = (value) => {
    setSeResolvio(value);
  };
  const handleChangeCanal = (value) => {
    setCanal(value);
  };

  const handleInputChangeDniReclamo = (e) => {
    setDniReclamo(e.target.value); // Actualiza el estado con el valor del input
    setNombre("");
    setValidar1(false);
  };

  const handleInputChangeDniDeudor = (e) => {
    setDniDeudor(e.target.value); // Actualiza el estado con el valor del input
    setValidar2(false);
  };

  const handleInputChangeObservacion = (e) => {
    setObservacion(e.target.value); // Actualiza el estado con el valor del input
  };
  const handleInputChangeNombre = (e) => {
    setNombre(e.target.value); // Actualiza el estado con el valor del input
  };

  const handleDateFechaReclamo = (e) => {
    setFechaReclamo(e.target.value); // Guarda el valor del input en el estado
  };
  const handleDateFechaSuceso = (e) => {
    setFechaSuceso(e.target.value); // Guarda el valor del input en el estado
  };

  // Para validacion de document
  const handelValidarDocumento = async () => {
    const url = `${API_URL}/validarDocumento`; // Reemplaza con tu URL

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ documento: dniReclamo }),
      });

      if (!response.ok) {
        throw new Error("Error al validar el documento");
      }

      const data = await response.json();
      console.log("Respuesta del servidor:", data);
      setNombre(data.data.alias);
      //obtiendo el Mensaje a mostrar::::

      if (data.data.idPersona != null && data.data.alias == null && data.data.idDeudor !== null) {
        setMensaje("Se encuentra en la base de deudores");
        setEsCliente("Si");
        setNombre(data.data.nomCompleto);
        setCheckDniDeudor(false);
        setHabilitarCheckDniDeudor(false);
        setHabilitarSelectCliente(false);
        setHabilitarInputDniDeudor(false);
        setHabilitarBtnValidar(false);
        setDniDeudor(dniReclamo);
        setValidar1(true);
        setValidar2(true);
        showModal();
      } else if (data.data.idPersona != null && data.data.alias != null && data.data.idDeudor === null) {
        setMensaje("Registrado como empleado");
        setNombre(data.data.nomCompleto);
        setEsCliente("No");
        setHabilitarSelectCliente(false);
        setHabilitarCheckDniDeudor(true);
        setHabilitarInputDniDeudor(true);
        setHabilitarBtnValidar(true);
        showModal();
      } else {
         if(data.data.idPersona != null){
          setMensaje("YA SE REGISTRÓ");
          setEsCliente("No");
          setHabilitarSelectCliente(false);
          showModal();
         }else{
          setMensaje("PERSONA NUEVA");
          setEsCliente("No");
          setHabilitarSelectCliente(false);
          showModal();
         }

       
      }
    } catch (error) {
      console.error("Hubo un error:", error.message);
    }
  };

  // Para validacion de deudor
  const handelValidarDocumentoDeudor = async () => {
    const url = `${API_URL}/validarDocumento`; // Reemplaza con tu URL
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ documento: dniDeudor }),
      });

      if (!response.ok) {
        throw new Error("Error al validar el documento");
      }

      const data = await response.json();
      console.log("Respuesta del servidor:", data.data);

      //obtiendo el Mensaje a mostrar::::
      if (data.data.idPersona != null && data.data.alias === null) {
        setMensaje2("Deudor encontrado");
        setHabilitarSelectCliente(false);
        showModal2();
        setValidar1(true);
        setValidar2(true);
      } else if (data.data.idPersona != null && data.data.alias != null) {
        setMensaje2("El documento no es un deudor");
        showModal2();
        setValidar2(false);
      } else {
        setMensaje2("El documento no es un deudor");
        showModal2();
        setValidar2(false);
      }
    } catch (error) {
      console.error("Hubo un error:", error.message);
    }
  };
  const showModalError = (message) => {
    Modal.error({
      title: "Error",
      content: message,
    });
  };

  const handleRegistrar = async () => {
    if (validateFields()) {
      const dataToSend = {
        accion: "REGISTRAR",
        idReclamo: 0,
        fecReclamo: fechaReclamo,
        viaReclamo: viaReclamo,
        escliente: esCliente,
        DNI_reclamo: dniReclamo,
        nombreReferencial: nombre,
        estadoReclamo: "No Resuelto",
        canal: canal,
        motivo:motivo,
        usuario: user.alias,
        DNI_deudor: dniDeudor,
        fecSuceso: fechaSuceso,
        observacion: observacion,
      };
  
      console.log("Datos a enviar en el cuerpo del post reclamo:", dataToSend);
  
      try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/crearReclamo`, dataToSend);
         console.log(response)
        if (response.data.status === 200) {
          console.log("Reclamo registrado con éxito:", response.data);
  
          // Mostrar modal de éxito
          showModalExito();
  
          // Redirigir después de 2 segundos
          setTimeout(() => {
            navigate("/expertisERP/reclamosHistorial");
          }, 2000);
        } else {
          console.error("Error al registrar reclamo:", response.data);
          // Puedes mostrar un mensaje de error al usuario si lo necesitas
          showModalError("Hubo un problema al registrar el reclamo. Intenta nuevamente.");
        }
      } catch (error) {
        console.error("Error en la solicitud al servidor:", error);
        // Mostrar mensaje de error si la solicitud falla
        showModalError("Error en el servidor. Intenta nuevamente más tarde.");
      }
    } else {
      console.log("Formulario inválido. Corrige los errores.");
    }
  };
  // useEffect(() => {
  //   if (validar1 && validar2) {
  //     setHabilitarBtnValidarFinal(true); // Habilita el botón de validación si ambos son válidos
  //   } else {
  //     setHabilitarBtnValidarFinal(false); // Caso contrario, lo deshabilita
  //   }
  // }, [validar1, validar2]);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("Errores detectados en el formulario:", errors);
    }
  }, [errors]);

  return (
    <div className="flex flex-col gap-5 mt-5 pl-5 pr-5 font-semibold">
      <div className=" flex gap-5">
        <div className=" w-1/2 flex gap-12 items-center">
          <label> Fecha Reclamo : </label>
          <input
            className="border-2 rounded-md p-1"
            type="date"
            value={fechaReclamo}
            onChange={handleDateFechaReclamo}
          />
        </div>
        <div className="w-1/2 pl-24 flex gap-4 items-center">
          <label> Fecha Suceso : </label>
          <input
            className="border-2 rounded-md p-1"
            type="date"
            value={fechaSuceso}
            onChange={handleDateFechaSuceso}
          />
        </div>
      </div>
      <div className="w-1/2  flex gap-16">
        <label> Vía reclamo : </label>
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
      </div>
      <div className="flex gap-12 items-center">
        <div className="flex gap-2 items-center ">
          <label>DNI reclamo </label>
          <Checkbox
            checked={checkDniReclamo}
            onChange={handleChangeCheckDniReclamo}
          ></Checkbox>
        </div>
        {checkDniReclamo ? (
          <div className="flex items-center gap-2">
            <input
              className="border-2 rounded-md "
              type="text"
              value={dniReclamo}
              onChange={(e) => {
                const inputValue = e.target.value;
                // Permitir solo números y limitar a 8 caracteres
                if (/^\d*$/.test(inputValue) && inputValue.length <= 8) {
                  handleInputChangeDniReclamo(e);
                }
              }}
              maxLength={8} // Evitar que se escriban más de 8 caracteres
            />
            {errors.dniReclamo && (
              <span className="text-red-500 text-sm">{errors.dniReclamo}</span>
            )}
            <Button
              className="bg-cyan-500 text-white border-cyan-500 hover:bg-cyan-600 hover:border-cyan-600 focus:bg-cyan-700 focus:border-cyan-700"
              onClick={handelValidarDocumento}
            >
              <SearchOutlined />
            </Button>
            <Modal
              title={
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <InfoCircleOutlined
                    style={{ color: "#1890ff", fontSize: "20px" }}
                  />
                  <span>Mensaje</span>
                </div>
              }
              open={isModalVisible}
              footer={null}
            >
              <p className="font-semibold b text-center text-blue-900">
                {mensaje}
              </p>
            </Modal>
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="flex gap-5 ">
        <div className="flex  w-2/3 items-center gap-7">
          <label> Nombre completo :</label>
          <input
            className="w-3/4 border-2 rounded-md "
            type="text"
            value={nombre}
            onChange={handleInputChangeNombre}
          />
        </div>
        <div className="w-1/2 flex items-center  gap-14">
          <label className="pl-5">Cliente: </label>
          <Select
            value={esCliente} // Valor por defecto basado en el primer elemento del array
            style={{ width: 200 }} // Ancho del selector
            onChange={handleChangeEscliente} // Manejo del cambio
            disabled={!habilitarSelectCliente}
          >
            <Option key={"si"} value={"Si"}>
              Si
            </Option>
            <Option key={"no"} value={"No"}>
              No
            </Option>
          </Select>
        </div>
      </div>
      <div className="flex gap-5 items-center">
        <div className="flex gap-2 items-center">
          <label>DNI/RUC deudor </label>
          <Checkbox
            checked={checkDniDeudor}
            onChange={handleChangeCheckDniDeudor}
            disabled={!habilitarCheckDniDeudor}
          ></Checkbox>
        </div>
        {checkDniDeudor ? (
          <div className=" flex items-center gap-2">
            <input
              className="border-2 rounded-md "
              type="text"
              value={dniDeudor}
              onChange={(e) => {
                const inputValue = e.target.value;
                // Permitir solo números y limitar a 8 caracteres
                if (/^\d*$/.test(inputValue) && inputValue.length <= 11) {
                  handleInputChangeDniDeudor(e);
                }
              }}
              disabled={!habilitarInputDniDeudor}
            />
            {errors.dniDeudor && (
              <span className="text-red-500 text-sm">{errors.dniDeudor}</span>
            )}
            <Button
              className="bg-green-500 text-white border-green-500 hover:bg-green-600 hover:border-green-600 focus:bg-green-700 focus:border-green-700"
              disabled={!habilitarBtnValidar}
              onClick={handelValidarDocumentoDeudor}
            >
              <ScanOutlined />
              Validar
            </Button>
            <Modal
              title={
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <InfoCircleOutlined
                    style={{ color: "#1890ff", fontSize: "20px" }}
                  />
                  <span>Mensaje</span>
                </div>
              }
              open={isModalVisible2}
              footer={null}
            >
              <p className="font-semibold b text-center text-blue-900">
                {mensaje2}
              </p>
            </Modal>
          </div>
        ) : (
          <></>
        )}
      </div>

      <div className="flex gap-5">
        <div className=" w-1/2 flex items-center gap-16">
          <label>¿Se resolvió?</label>
          <Select
            value={seResolvio} // Valor por defecto basado en el primer elemento del array
            style={{ width: 200 }} // Ancho del selector
            onChange={handleChangeSeResolvio} // Manejo del cambio
          >
            <Option key={1} value={"Resuelto"}>
              Si
            </Option>
            <Option key={2} value={"No resuelto"}>
              No
            </Option>
          </Select>
        </div>
        <div className=" w-1/2 flex  items-center gap-12">
          <label className="pl-28">Canal : </label>
          <Select
            value={canal} // Valor por defecto basado en el primer elemento del array
            style={{ width: 200 }} // Ancho del selector
            onChange={handleChangeCanal} // Manejo del cambio
          >
            <Option key={1} value={"Interno"}>
              Interno
            </Option>
            <Option key={2} value={"Externo"}>
              Externo
            </Option>
          </Select>
        </div>
      </div>

      <div className=" w-3/4 flex flex-col gap-5 ">
        <div className="flex gap-16 items-center">
          <label className="pl-6"> Motivo :</label>
          <Select
            value={motivo} // Valor por defecto basado en el primer elemento del array
            style={{ width: 400 }} // Ancho del selector
            onChange={handleChangeMotivo} // Manejo del cambio
          >
            {listaMotivos.map((canal, index) => (
              <Option key={index} value={canal}>
                {canal}
              </Option>
            ))}
          </Select>
        </div>

        <div className="  w-3/4 pl-4">
          {motivo === "Otros" ? (
            <input
              className="w-full border-2 p-1 rounded-md pl-4 "
              type="text"
              placeholder="Ingrese su motivo:"
            />
          ) : null}
        </div>
      </div>

      <div className="flex items-center pl-4 w-full gap-5">
        <label> Observación : </label>
        <textarea
          className="w-3/4 ml-6 pl-2  border-2  border-blue-950 rounded-md"
          onChange={handleInputChangeObservacion}
          value={observacion}
        ></textarea>
        {errors.observacion && (
          <span className="text-red-500 text-sm">{errors.observacion}</span>
        )}
      </div>

      <div className="flex w-full items-center justify-center mt-5">
        <Button
          type="primary"
          onClick={handleRegistrar}
          disabled={observacion === "" || !validar1 || !validar2 ? true : false}
        >
          Registrar
        </Button>
        <Modal
        title="Mensaje de confirmación"
        open={mostrarModalExitoso}        
        footer={null} // Para evitar los botones por defecto del modal
      >
        <Result
          status="success"
          title="Registro exitoso!"
          subTitle="El reclamo ya se encuentra registrado en la base de datos"          
        />
      </Modal>
      </div>
    </div>
  );
};

export default FormularioReclamo;
