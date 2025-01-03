/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Button, Checkbox, Select, Spin, Modal, Result } from "antd";
import { useEffect, useState } from "react";
import { useData } from "../context/DataContext.jsx";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const ModalReconocimiento = ({ elejida, cerrarModal }) => {

  const { user } = useData();
  const navigate = useNavigate();

  const [opcion1, setOpcion1] = useState(true);
  const [opcion2, setOpcion2] = useState(false);
  const [opcion3, setOpcion3] = useState(false);
  const [opcion4, setOpcion4] = useState(false);
  const [opcion5, setOpcion5] = useState(false);
  const [opcion6, setOpcion6] = useState(false);
  const [opcion7, setOpcion7] = useState(false);

  const [sumaTotal, setSumaTotal] = useState(0);
  // Estado para hacer aparecer los campos de cartera y num op
  const [validacion, setValidacion] = useState(false);
  //Para las opciones de cartera:
  const [opccionesCarteras, setOpcionesCarteras] = useState([]);
  //Para el icono de carga de información
  const [loading, setLoading] = useState(false);
  const [documento, setDocumento] = useState("");
  const [cartera, setCartera] = useState("");
  const [numOper, setNumOper] = useState("");
  const [idDeuda, setIdDeuda] = useState(null); // Para almacenar el IDDEUDA
  // Estados para el modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState(""); // 'success' o 'error'
  // VALIDACION DEL MONTO
  const [validacionMonto, setValidacionMonto] = useState(false);
  const [valorConclusion, setValorConclusion] = useState(0);

  const [errors, setErrors] = useState({});

  // Estado para el modal de satifaccion
  const [verModalRespuestaOK, setVerModalRespuestaOK] = useState(false);

  // Función para mostrar y ocultar el modal automáticamente
  const showModal = (message, type) => {
    setModalMessage(message);
    setModalType(type);
    setIsModalVisible(true);

    setTimeout(() => {
      setIsModalVisible(false);
    }, 1200); // El modal desaparecerá después de 1 segundo
  };

  useEffect(() => {
    resetCheckboxes();
    setOpcion1(true);
    setSumaTotal(elejida.MONTO_PAGO);
  }, []);

  useEffect(() => {
    if (opcion7 === true) {
      setValorConclusion(elejida.MONTO_PAGO - sumaTotal);
    } else {
      setValorConclusion(0);
    }
  }, [opcion7, opcion6, opcion5, opcion4, opcion3, opcion2]);

  useEffect(() => {
    if (sumaTotal === elejida.MONTO_PAGO) {
      setValidacionMonto(true);
    } else {
      if (opcion7 === true) {
        if (valorConclusion > 0) setValidacionMonto(true);
        else setValidacionMonto(false);
      } else {
        setValidacionMonto(false);
      }
    }
  }, [sumaTotal, valorConclusion]);

  const resetCheckboxes = () => {
    setOpcion1(false);
    setOpcion2(false);
    setOpcion3(false);
    setOpcion4(false);
    setOpcion5(false);
    setOpcion6(false);
    setOpcion7(false);
    setSumaTotal(0);
  };

  //Funcion para obtener las carteras enviando el documento:
  const fetchOptions = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3005/listarCarteras", {
        method: "POST", // Cambia el método a POST
        headers: {
          "Content-Type": "application/json", // Especifica el tipo de contenido
        },
        body: JSON.stringify({ documento }), // Convierte el cuerpo a JSON
      });
      console.log(response);
      if (response.status === 404) {
        setValidacion(false);
        showModal("Documento no válido", "error");
        throw new Error("Error al obtener las opciones");
      }

      setValidacion(true);
      showModal("Documento válido", "success");

      const data = await response.json();
      console.log("Se obtuvo del backend: ", data.data);
      const formattedData = data.data.map((cartera) => ({
        CARTERA: cartera.CARTERA,
        DOCUMENTO: cartera.DOCUMENTO,
        IDDEUDA: cartera.IDDEUDA,
      }));

      console.log("Formateado OPCIONES CARTERA: ", formattedData);

      setOpcionesCarteras(formattedData); // Actualizar las opciones
    } catch (error) {
      console.error("Error al obtener las opciones:", error);
    } finally {
      setLoading(false); // Ocultar el spinner
    }
  };

  const onChange1 = (e) => {
    console.log(`checked = ${e.target.checked}`);
    if (!opcion1) {
      resetCheckboxes(); // Reinicia los demás checkboxes
      setSumaTotal(elejida.MONTO_PAGO); // Asigna el monto de `elejida` si `opcion1` se activa
    } else {
      setSumaTotal(0); // Reinicia la suma si `opcion1` se desactiva
    }
    setOpcion1(!opcion1); // Alterna el estado de `opcion1`
  };

  const onChange2 = (e) => {
    const isChecked = e.target.checked;
    setSumaTotal((prev) => prev + (isChecked ? 45 : -45));
    setOpcion2(isChecked);
  };

  const onChange3 = (e) => {
    console.log(`checked = ${e.target.checked}`);
    if (opcion3 === true) setSumaTotal(sumaTotal - 60);
    else setSumaTotal(sumaTotal + 60);
    setOpcion3(!opcion3);
  };
  const onChange4 = (e) => {
    console.log(`checked = ${e.target.checked}`);
    if (opcion4 === true) setSumaTotal(sumaTotal - 70);
    else setSumaTotal(sumaTotal + 70);

    setOpcion4(!opcion4);
  };
  const onChange5 = (e) => {
    console.log(`checked = ${e.target.checked}`);
    if (opcion5 === true) setSumaTotal(sumaTotal - 65);
    else setSumaTotal(sumaTotal + 65);
    setOpcion5(!opcion5);
  };
  const onChange6 = (e) => {
    console.log(`checked = ${e.target.checked}`);
    if (opcion6 === true) setSumaTotal(sumaTotal - 65);
    else setSumaTotal(sumaTotal + 65);
    setOpcion6(!opcion6);
  };

  const onChange7 = (e) => {
    console.log(`checked = ${e.target.checked}`);
    setOpcion7(!opcion7);
  };

  const handleChangeCartera = (value) => {
    console.log("Valor seleccionado:", value);
    setCartera(value);
    const selectedOption = opccionesCarteras.find(
      (option) => option.CARTERA === value
    );
    if (selectedOption) {
      setIdDeuda(selectedOption.IDDEUDA); // Actualiza el estado de IDDEUDA
    }
  };

  const handleDocumento = (e) => {
    const docu = e.target.value;
    // Validar si solo contiene números y tiene un máximo de 10 caracteres
    if (/^\d{0,10}$/.test(docu)) {
      setDocumento(docu);
      console.log("Se envió como el documento: ", docu);
    }
  };

  const handleNumOper = (e) => {
    const no = e.target.value;
    if (/^\d{0,15}$/.test(no)) {
      setNumOper(no);
    }
  };
  

  //FUNCION PARA EL eNVO DEDATOS:
  const enviarDatos = async (url, body) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (response.status === 200) {
            const data = await response.json();
            return {
                success: true,
                message: 'Operación exitosa',
                data,
            };
        } else {
            const error = await response.json();
            return {
                success: false,
                message: error.message || 'Error al realizar la operación',
            };
        }
    } catch (error) {
        return {
            success: false,
            message: error.message || 'Error inesperado en la solicitud',
        };
    }
};


 // Funcion para Reconocer RELACION CONCEPTO:
 const registrarRelacionConcepto = async (idConcepto) => {
  const url = 'http://localhost:3005/reconocerConceptoPago';
  const body = {
    idPago: elejida.idPago,
    idConceptoPago: idConcepto,
    monto: elejida.MONTO_PAGO,
    usuario: user.alias,
  };
  try {
    const resultado = await enviarDatos(url, body);

    if (resultado.success) {
      console.log('Respuesta exitosa:', resultado.data);
    } else {
      console.error('Error en la respuesta:', resultado.message);
    }
  } catch (error) {
    console.error('Error al enviar datos:', error);
  }

};

  // Funcion para Reconocer PAGO:
  const reconocerPago = async () => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/reconocerPago`;
    const body = {
        idPago: elejida.idPago,
        idDeuda: idDeuda,       
        usuario: user.alias,
        numop: numOper,
       
    };

    const resultado = await enviarDatos(url, body);

    if (resultado.success) {
        console.log('Respuesta exitosa:', resultado.data);
    } else {
        console.error('Error:', resultado.message);
    }
  };




  const handelReconocer = () => {
    if (opcion1 === true) {
      console.log("Se enviara solo: ");
      console.log("Para Reconocer Relacion concepto: ",elejida.idPago,1,elejida.MONTO_PAGO, user.alias );
      console.log(  "Para Reconocer Pago: ", elejida.idPago, idDeuda, user.alias, numOper);
     try {
      reconocerPago();
      registrarRelacionConcepto(1); 

      setVerModalRespuestaOK(true);
      cerrarModal();
      setTimeout(() => {
        navigate("/expertisERP/pagosReconocidos");
      }, 2000);
     } catch (error) {
       console.log(error)
     }
    } 
     else{
      if (opcion2 === true) {
        console.log("Se enviara por opcion 2 Para Reconocer Relacion concepto: ");
        console.log(elejida.idPago, 2, 45, user.alias   );
      }

      if (opcion3 === true) {
        console.log("Se enviara por opcon 3 ");
        console.log(
          "Para Reconocer Relacion concepto: ",
          elejida.idPago,
          3,
          60,
          user.alias
        );
      }
      if (opcion4 === true) {
        console.log("Se enviara solo: ");
        console.log(
          "Para Reconocer Relacion concepto: ",
          elejida.idPago,
          4,
          70,
          user.alias
        );
      }
      if (opcion5 === true) {
        console.log("Se enviara solo: ");
        console.log(
          "Para Reconocer Relacion concepto: ",
          elejida.idPago,
          5,
          65,
          user.alias
        );
      }
      if (opcion6 === true) {
        console.log("Se enviara solo: ");
        console.log(
          "Para Reconocer Relacion concepto: ",
          elejida.idPago,
          7,
          65,
          user.alias
        );
      }
      // PARA CONCLUSION O DESESTIMIENTO
      if (opcion7 === true) {
        console.log("Se enviara solo: ");
        console.log(
          "Para Reconocer Relacion concepto: ",
          elejida.idPago,
          6,
          valorConclusion,
          user.alias
        );
       
      }
 

      // SE RECONOCE EL PAGO 1 SOLA VEZ
      console.log(
        "Para Reconocer Pago: ",
        elejida.idPago,
        idDeuda,
        user.alias,
        numOper
      );

      setVerModalRespuestaOK(true);
      cerrarModal();

     }

    
  };

  // Para validar Errorres:
  const validateFields = () => {
    const newErrors = {};

    // Validación de campos requeridos
    if (!documento || documento === "")
      newErrors.documento = "El documento es requerido.";

    if (!cartera || cartera === "") newErrors.cartera = "Elija una cartera";
    if (!numOper || numOper === "") newErrors.numOper = "Campo requerido";

    if (numOper != "" && (numOper.length < 4 || numOper.length > 15))
      newErrors.numOper = "Tamaño no valido";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    validateFields();
  }, [documento, cartera, numOper /* otros estados relevantes aquí */]);

  return (
    <div>
      <div className="flex gap-10  items-center">
        <div className="w-1/2 flex gap-10">
          <div>
            <label htmlFor="">ID PAGO: </label>
            <label>{elejida.idPago}</label>
          </div>
          <div>
            <label>Monto Seleccionado: </label>
            <label className=" bg-cyan-900 text-white rounded-lg pl-4 pr-4 pt-1 pb-1">
              {sumaTotal}
            </label>
          </div>
          {opcion7 ? (
            <div>
              <label>CONCLUSION: </label>
              <label className=" bg-cyan-900 text-white rounded-lg pl-4 pr-4 pt-1 pb-1">
                {valorConclusion}
              </label>
            </div>
          ) : (
            <></>
          )}
        </div>
        {validacionMonto ? (
          <></>
        ) : (
          <div className="flex  items-center justify-center  w-1/2">
            <label className="bg-red-500 p-2 rounded-lg text-white font-semibold">
              {" "}
              VERIFICA EL MONTO !
            </label>
          </div>
        )}
      </div>
      <div className="flex w-full">
        <div className="w-2/5 mt-5 ">
          <label className="font-bold">Concepto</label>
          <div className="flex flex-col gap-2 mt-2">
            <Checkbox onChange={onChange1} checked={opcion1}>
              RECAUDO EXPERTIS
            </Checkbox>

            <Checkbox
              onChange={onChange2}
              checked={opcion2}
              disabled={opcion1 ? true : false}
            >
              2da a + CDNA presencial, correo o WhatsApp (S/45.00)
            </Checkbox>
            <Checkbox
              onChange={onChange3}
              checked={opcion3}
              disabled={opcion4 || opcion1 ? true : false}
            >
              Servicio de Courier CDNA u otros documentos (S/60.00)
            </Checkbox>

            <Checkbox
              onChange={onChange4}
              checked={opcion4}
              disabled={opcion3 || opcion1 ? true : false}
            >
              Servicio de Courier file por envío de file (S/70.00)
            </Checkbox>

            <Checkbox
              onChange={onChange5}
              checked={opcion5}
              disabled={opcion1 ? true : false}
            >
              Servicio de legalización de CDNA u otros documentos (S/65.00)
            </Checkbox>
            <Checkbox
              onChange={onChange6}
              checked={opcion6}
              disabled={opcion1 ? true : false}
            >
              Servicio de legalización de transacción extrajudicial (S/65.00)
            </Checkbox>
            <Checkbox
              onChange={onChange7}
              checked={opcion7}
              disabled={opcion1 ? true : false}
            >
              Conclusión o desestimiento de proceso
            </Checkbox>
          </div>
        </div>

        <div className=" w-3/5 flex flex-col gap-5 mt-5">
          <div className="flex w-full ">
            <div className=" flex w-1/2 ">
              <label className="w-1/2 rounded-lg bg-blue-950 text-white flex justify-center">
                {" "}
                FEC. PAGO:
              </label>
              <label className="w-1/2 flex justify-center">
                {elejida.FEC_PAGO}
              </label>
            </div>
            <div className="w-1/2 flex ">
              <label className="w-1/2 rounded-lg bg-blue-950 text-white flex justify-center">
                {" "}
                HORA PAGO:{" "}
              </label>
              <label className="w-1/2 flex justify-center">
                {elejida.HORA_PAGO}
              </label>
            </div>
          </div>
          <div className="flex w-full">
            <div className=" flex w-1/2">
              <label className="w-1/2 rounded-lg bg-blue-950 text-white flex justify-center">
                {" "}
                MONTO
              </label>
              <label className="w-1/2 flex justify-center">
                {elejida.MONTO_PAGO}
              </label>
            </div>
            <div className="w-1/2 flex ">
              <label className="w-1/2 rounded-lg bg-blue-950 text-white flex justify-center">
                {" "}
                CANAL
              </label>
              <label className="w-1/2 flex justify-center">
                {elejida.MODALIDAD}
              </label>
            </div>
          </div>
          <div className="flex w-full items-center gap-4 ">
            <div className=" flex w-4/5 gap-5 ">
              <label className="w-1/3 rounded-lg bg-blue-950 text-white flex justify-center">
                DOCUMENTO:{" "}
              </label>
              <input
                className="w-2/3 rounded-lg border-solid border-2 border-indigo-600 "
                placeholder="Ingrese el IDC"
                onChange={handleDocumento}
                value={documento}
                style={{ textAlign: "center" }}
              ></input>
            </div>
            {errors.documento && (
              <div className="m-0 text-red-400">{errors.documento}</div>
            )}
            <div className="w-1/5 flex justify-center  ">
              <Button
                className="bg-green-600 text-white "
                onClick={fetchOptions}
              >
                VALIDAR
              </Button>
            </div>
          </div>
          {validacion ? (
            <>
              <div className="flex w-full gap-10 ">
                <div className=" flex w-2/5 items-center gap-1 ">
                  <label className="w-2/5 p-1 rounded-lg bg-blue-950 text-white flex justify-center items-center">
                    CARTERA
                  </label>
                  <Select
                    className="flex items-center justify-center"
                    placeholder="Selecciona una opción"
                    style={{ width: 250 }}
                    value={cartera}
                    onChange={handleChangeCartera}
                    loading={loading} // Spinner dentro del select mientras carga
                    notFoundContent={
                      loading ? <Spin size="small" /> : "Sin opciones"
                    }
                  >
                    {opccionesCarteras.map((option) => (
                      <Option key={option.CARTERA} value={option.CARTERA}>
                        {option.CARTERA}
                      </Option>
                    ))}
                  </Select>
                </div>
                {errors.cartera && (
                  <div className="m-0 text-red-400">{errors.cartera}</div>
                )}
                <div className="w-3/5 flex gap-2 items-center">
                  <label className="w-1/4 rounded-lg p-1 bg-blue-950 text-white flex justify-center items-center text-center ">
                    NUM. OP.
                  </label>
                  <input
                    placeholder="Ingrese el num oper"
                    className="w-3/4 rounded-lg  border-solid border-2 border-indigo-600 pl-2 "
                    onChange={handleNumOper}
                    value={numOper}
                  ></input>
                </div>
                {errors.numOper && (
                  <div className="m-0 text-red-400">{errors.numOper}</div>
                )}
              </div>
              {validacionMonto ? (
                <div className="w-full flex justify-center mt-5">
                  <Button
                    type="primary"
                    disabled={Object.keys(errors).length > 0}
                    onClick={handelReconocer}
                  >
                    Reconocer
                  </Button>
                </div>
              ) : (
                <></>
              )}
              <Modal
                visible={isModalVisible}
                footer={null}
                closable={false}
                centered
                onCancel={() => setIsModalVisible(false)}
              >
                <div
                  style={{
                    textAlign: "center",
                    color: modalType === "success" ? "green" : "red",
                  }}
                >
                  {modalMessage}
                </div>
              </Modal>
            </>
          ) : (
            <>
              {" "}
              <Modal
                visible={isModalVisible}
                footer={null}
                closable={false}
                centered
                onCancel={() => setIsModalVisible(false)}
              >
                <div
                  style={{
                    textAlign: "center",
                    color: modalType === "success" ? "green" : "red",
                  }}
                >
                  {modalMessage}
                </div>
              </Modal>{" "}
            </>
          )}
        </div>
        <Modal
          visible={verModalRespuestaOK}
          footer={null}
          closable={false}
          centered
          onCancel={() => setVerModalRespuestaOK(false)}
        >
          <Result
            status="success"
            title="Reconocimiento Exitoso"
            extra={[
              <Button
                type="primary"
                key="console"
                onClick={() => {
                  setVerModalRespuestaOK(false);
                }}
              >
                Aceptar
              </Button>,
            ]}
          />
        </Modal>
      </div>
    </div>
  );
};

export default ModalReconocimiento;
