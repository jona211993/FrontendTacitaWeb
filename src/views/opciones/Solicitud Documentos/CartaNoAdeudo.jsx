/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useData } from "../../../context/DataContext.jsx";
import { Modal , message} from 'antd';
import 'animate.css';

const CartaNoAdeudo = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleJefes, setIsModalVisibleJefes] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    reset,
  } = useForm({ mode: "all" });

  const tipoEnvio = watch("tipoEnvio");
  const descripcion = watch("descripcion");
  const numTelefono = watch("numTelefono");
  const correoElectronico = watch("correoElectronico");

  const direccion = watch("direccion");
  const distrito = watch("distrito");
  const provincia = watch("provincia");
  const departamento = watch("departamento");

  const [valorNumSolicitudesTotales, setNumSolicitudesTotales] = useState(-100);
  const [datosDireccion, setDatosDireccion] = useState([]);
  const { cliente, user, cancelado } = useData();

  // Para CDNA
  const [habilitarFormularioCDNA, setHabilitarCDNA] = useState(false);
  const [mensajeCDNA, setMensajeCDNA] = useState("");
  const [mensajeCDNAjefes, setMensajeCDNAjefes] = useState("");
  const [pagoPorEmisionCarta, setPagoEmisionCarta] = useState(false);

  const onSubmit = async (data) => {
    if (tipoEnvio === "Correo Electronico") {
      await onSubmitCorreo();
      navigate("/expertisERP/detalleCliente");
    } else if (tipoEnvio === "WhatsApp") {
      onSubmitWhatsApp(data);
    } else if (tipoEnvio === "Oficina") {
      onSubmitOficina(data);
    } else if (tipoEnvio === "Courier") {
      onSubmitCurier(data);
    } else {
      console.warn("Tipo de envío no seleccionado o no válido");
    }
  };

  const onSubmitCorreo = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/registrarCDNATipoCorreo`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idDeudor: cliente.ID_DEUDOR,
            idEntidad: cliente.ID_ENTIDAD,
            idGestor: user.idMovEmpleado,
            texto: correoElectronico,
            descripcion: descripcion,
            gestor: user.alias,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }

      const data = await response.json();

      console.log("Respuesta del servidor:", data);
      message.success('Envio Exitoso!',1);
      setTimeout(() => {
        navigate("/expertisERP/detalleCliente"); // Navegar después de 1 segundo
      }, 1000)
      // Si el envío es exitoso, restablece el formulario
      reset();
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
    }
  };

  const onSubmitWhatsApp = async () => {
    console.log("Enviara por tipo whatsapp: ", numTelefono, descripcion);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/registrarCDNATipoWsp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idDeudor: cliente.ID_DEUDOR,
            idEntidad: cliente.ID_ENTIDAD,
            idGestor: user.idMovEmpleado,
            texto: numTelefono,
            descripcion: descripcion,
            gestor: user.alias,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }

      const data = await response.json();

      console.log("Respuesta del servidor:", data);
      message.success('Envio Exitoso!',1);
      setTimeout(() => {
        navigate("/expertisERP/detalleCliente"); // Navegar después de 1 segundo
      }, 1000)
      // Si el envío es exitoso, restablece el formulario
      reset();
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
    }
  };

  const onSubmitOficina = async () => {
    console.log("Enviara por tipo Oficina: ", descripcion);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/registrarCDNATipoOficina`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idDeudor: cliente.ID_DEUDOR,
            idEntidad: cliente.ID_ENTIDAD,
            idGestor: user.idMovEmpleado,
            descripcion: descripcion,
            gestor: user.alias,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }

      const data = await response.json();

      console.log("Respuesta del servidor:", data);
      message.success('Envio Exitoso!',1);
      setTimeout(() => {
        navigate("/expertisERP/detalleCliente"); // Navegar después de 1 segundo
      }, 1000)
      // Si el envío es exitoso, restablece el formulario
      reset();
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
    }
  };

  const onSubmitCurier = async () => {
    console.log(
      "Enviara por tipo Curier: ",
      direccion,
      distrito,
      provincia,
      departamento,
      descripcion
    );

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/registrarCDNATipoCourier`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idDeudor: cliente.ID_DEUDOR,
            idEntidad: cliente.ID_ENTIDAD,
            idGestor: user.idMovEmpleado,
            texto: direccion,
            descripcion: descripcion,
            gestor: user.alias,
            distrito: distrito,
            provincia: provincia,
            departamento: departamento,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }

      const data = await response.json();

      console.log("Respuesta del servidor:", data);
      message.success('Envio Exitoso!',1);
      setTimeout(() => {
        navigate("/expertisERP/detalleCliente"); // Navegar después de 1 segundo
      }, 1000)
      // Si el envío es exitoso, restablece el formulario
      reset();
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
    }
  };

  // PARA NUM SOLCITUDES
  useEffect(() => {
    // Define la función asincrónica para obtener el valor de la API
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/obtenerNumSolicitudesTotales`,
          {
            method: "POST", // Usa POST o PUT según el caso
            headers: {
              "Content-Type": "application/json", // Especifica el tipo de contenido
            },
            body: JSON.stringify({
              // Aquí defines los campos que necesitas enviar en el body
              idDeudor: cliente.ID_DEUDOR,
              idEntidad: cliente.ID_ENTIDAD,
              tipo: "CARTA",
              // Agrega más campos según sea necesario
            }),
          }
        );
        if (!response.ok) {
          throw new Error("Error en la respuesta de la API");
        }
        const data = await response.json();

        // Supongamos que el valor que necesitas está en data.totalSolicitudes
        console.log("Tengo del api: ", data.data[0][""]);
        setNumSolicitudesTotales(data.data[0][""]);
        if (data.data[0][""] === 0) {
          setPagoEmisionCarta(true);
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    // Llama a la función fetchData
    fetchData();
     
  }, []); // [] asegura que el efecto solo se ejecute una vez al montar el componente

  // PARA DIRECCION
  useEffect(() => {
    // Define la función asincrónica para obtener el valor de la API
    const fetchDataDireccion = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/obtenerDireccionCarta`,
          {
            method: "POST", // Usa POST o PUT según el caso
            headers: {
              "Content-Type": "application/json", // Especifica el tipo de contenido
            },
            body: JSON.stringify({
              // Aquí defines los campos que necesitas enviar en el body
              idDeudor: cliente.ID_DEUDOR,
              idEntidad: cliente.ID_ENTIDAD,
              // Agrega más campos según sea necesario
            }),
          }
        );
        if (!response.ok) {
          throw new Error("Error en la respuesta de la API");
        }
        const data = await response.json();

        // Supongamos que el valor que necesitas está en data.totalSolicitudes
        console.log("Tengo del api para direccion : ", data.data);
        setDatosDireccion(data.data);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    // Llama a la función fetchData
    fetchDataDireccion();
     
  }, []); // [] asegura que el efecto solo se ejecute una vez al montar el componente

  // PARA VERIFICAR HABILITACION DE FORM DE CARTA DE NO ADEUDO

  useEffect(() => {
    // Define la función asincrónica para obtener el valor de la API
    const habilitandoFormularioCDNA = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/validarCartaDeNoAdeudo`,
          {
            method: "POST", // Usa POST o PUT según el caso
            headers: {
              "Content-Type": "application/json", // Especifica el tipo de contenido
            },
            body: JSON.stringify({
              // Aquí defines los campos que necesitas enviar en el body
              idDeudor: cliente.ID_DEUDOR,
              idEntidad: cliente.ID_ENTIDAD,
              // Agrega más campos según sea necesario
            }),
          }
        );
        if (!response.ok) {
          throw new Error("Error en la respuesta de la API");
        }
        const data = await response.json();

        // Supongamos que el valor que necesitas está en data.totalSolicitudes
        console.log("Tengo del api para validar CDNA : ", data.data);

        if (cancelado === true ) {
          setHabilitarCDNA(true);
        } else {
          if (data.data.MONTO_PAGO != null) {
            if (
              data.data.MONTO_APROBADO > 0 &&
              data.data.MONTO_PAGO >= data.data.MONTO_APROBADO
            ) {
              setHabilitarCDNA(true);
            } else {
              if (
                data.data.MINIMO1 >= 0 &&
                data.data.MONTO_PAGO >= data.data.MINIMO1
              ) {
                setHabilitarCDNA(true);
              } else {
                setMensajeCDNA(
                  "NO CUMPLE CON ALGUNA CONDICIÓN DE EXCEPCION O MONTO MÍNIMO"
                );
              }
            }
          } else {
            setMensajeCDNA("NO TIENE PAGO");
          }
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    // Llama a la función fetchData
    habilitandoFormularioCDNA();
  }, []); // [] asegura que el efecto solo se ejecute una vez al montar el componente

  const handleBotonPago2CDNA = async () => {
    try {
        // Realizar la consulta al endpoint
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/validarSegundaCDNA`,
          {
            method: "POST", // Usa POST o PUT según el caso
            headers: {
              "Content-Type": "application/json", // Especifica el tipo de contenido
            },
            body: JSON.stringify({
              // Aquí defines los campos que necesitas enviar en el body
              idDeudor: cliente.ID_DEUDOR,
              idEntidad: cliente.ID_ENTIDAD,
              // Agrega más campos según sea necesario
            }),
          }
        );

        console.log("Mostranto datataaa: ",response.data)
        const data = await response.json();
        console.log("Mostranto datataaa: ",data.status)
        if (data.status===200) {
           setPagoEmisionCarta(true)
        }else{
          if(user.alias==="MAYRA LLIMPE"){
            setPagoEmisionCarta(true)
            setMensajeCDNAjefes("CDNA PREFERENCIAL , CLIENTE NO TIENE PAGO DE CARTA")
            setIsModalVisibleJefes(true)
            console.log("CDNA PREFERENCIAL , CLIENTE NO TIENE PAGO DE CARTA")
          }else{
            setPagoEmisionCarta(false)
            console.log("No se encontró Pago")
            setIsModalVisible(true)
          }
          
  
        }
        // // Comprobar si el valor devuelto cumple con la condición
        // if (data.valor === 'algunValorEsperado') {
        //     setValorRespuesta(true); // Establecer el estado en true si la condición se cumple
        // } else {
        //     setValorRespuesta(false); // Opcionalmente, puedes ponerlo en false si la condición no se cumple
        // }
    } catch (error) {
        console.error('Error en la consulta al endpoint:', error);
    }
};

// Efecto para cerrar el modal después de 2 segundos
useEffect(() => {
  if (isModalVisible) {
      const timer = setTimeout(() => {
          setIsModalVisible(false);
      }, 2000);

      return () => clearTimeout(timer); // Limpia el temporizador si el componente se desmonta
  }
}, [isModalVisible]);







  return (
    <>
      {habilitarFormularioCDNA ? (
        <div className="bg-cyan-900 w-3/4 rounded-xl p-3 flex flex-wrap gap-5 text-white animate__animated animate__fadeInDown ">
          <div className="flex justify-between w-full items-center ">
            <h1 className="text-xl pl-3 font-semibold">CARTA DE NO ADEUDO</h1>
            <div className="flex flex-col gap-2 items-center">
              <label> NUM. SOLICITUDES TOTALES</label>
              <div className="w-20 bg-cyan-200 rounded-md flex items-center justify-center">
                <label className="text-black font-semibold">
                  {valorNumSolicitudesTotales}
                </label>
              </div>
            </div>
          </div>

          <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex justify-between w-full items-center ">
              <label>TIPO ENVÍO :</label>
              <select
                className="text-black rounded-md p-1"
                {...register("tipoEnvio")}
              >
                <option value="seleccion una opcion">Seleccione uno </option>
                <option value="Correo Electronico">Correo Electronico</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Courier">Courier</option>
                <option value="Oficina">Oficina</option>
              </select>
            </div>
            {valorNumSolicitudesTotales > 0 && (
              <div className="flex items-center justify-center">
                <button
                  type="button"
                  className=" bg-blue-950 border-cyan-100 rounded-lg pl-3 pr-3 mt-5 "
                  onClick={handleBotonPago2CDNA}
                >
                  Pago por emsión de carta
                </button>
                
                <Modal
                visible={isModalVisible}
                footer={null} // Sin botones en el modal
                closable={false} // Sin botón de cierre
                onCancel={() => setIsModalVisible(false)} // Opción para cerrar manualmente si lo deseas
            >
                <p className="text-center text-xl font-semibold">No se encontró Pago</p>
            </Modal>
            <Modal
                visible={isModalVisibleJefes}
                footer={null} // Sin botones en el modal
                closable={false} // Sin botón de cierre
                onCancel={() => setIsModalVisibleJefes(false)} // Opción para cerrar manualmente si lo deseas
            >
                <p className="text-center text-xl font-semibold">{mensajeCDNAjefes}</p>
            </Modal>
              </div>
            )}
            {tipoEnvio === "Correo Electronico" && (
              <div className="flex flex-col w-full m-3">
                <label>CORREO ELECTRÓNICO :</label>
                <input
                  className="w-3/4 m-2 p-1 rounded-md text-black"
                  type="text"
                  defaultValue={correoElectronico}
                  {...register("correoElectronico", {
                    required: "El correo es obligatorio",
                    pattern: {
                      value: /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/,
                      message: "El formato del correo no es válido",
                    },
                  })}
                />
                {errors.correoElectronico && (
                  <p className="text-red-500 text-sm">
                    {errors.correoElectronico.message}
                  </p>
                )}
                <label>DESCRIPCIÓN :</label>
                <textarea
                  className="w-11/12 rounded-md p-1 mt-2 text-black"
                  {...register("descripcion", {
                    required: "Este campo es obligatorio",
                    minLength: {
                      value: 1,
                      message: "La descripción no puede estar vacía",
                    },
                  })}
                />
                {errors.descripcion && (
                  <span className="text-red-500">
                    {errors.descripcion.message}
                  </span>
                )}
               
                  <div className="flex mt-4 w-full justify-center">
                    <button
                       className={`rounded-lg w-24 p-2 ${
                        isValid && pagoPorEmisionCarta
                          ? "bg-green-500 text-white"
                          : "bg-gray-400 text-gray-800"
                      }`}
                      type="submit"
                      disabled={!(isValid && pagoPorEmisionCarta)}
                    >
                      Enviar
                    </button>
                  </div>
                
              </div>
            )}
            {tipoEnvio === "WhatsApp" && (
              <div className="flex flex-col w-full m-3">
                <label>NÚMERO DE TELÉFONO :</label>
                <input
                  className="w-3/4 rounded-md m-2 p-1 text-black"
                  {...register("numTelefono", {
                    required: "Escriba un numero valido",
                    pattern: {
                      value: /^9\d{8}$/,
                      message: "El formato del número no es válido",
                    },
                  })}
                  defaultValue={numTelefono}
                />
                {errors.numTelefono && (
                  <p className="text-red-500 text-sm">
                    {errors.numTelefono.message}
                  </p>
                )}
                <label>DESCRIPCIÓN :</label>
                <textarea
                  className="w-11/12 rounded-md p-1 mt-2 text-black"
                  {...register("descripcion", {
                    required: "Este campo es obligatorio",
                    minLength: {
                      value: 1,
                      message: "La descripción no puede estar vacía",
                    },
                  })}
                />
                {errors.descripcion && (
                  <span className="text-red-500">
                    {errors.descripcion.message}
                  </span>
                )}
                
                  <div className="flex mt-4 w-full justify-center">
                  <button
                       className={`rounded-lg w-24 p-2 ${
                        isValid && pagoPorEmisionCarta
                          ? "bg-green-500 text-white"
                          : "bg-gray-400 text-gray-800"
                      }`}
                      type="submit"
                      disabled={!(isValid && pagoPorEmisionCarta)}
                    >
                      Enviar
                    </button>
                  </div>
                
              </div>
            )}
            {tipoEnvio === "Oficina" && (
              <div className="flex flex-col w-full m-3">
                <label>DESCRIPCIÓN :</label>
                <textarea
                  className="w-11/12 rounded-md p-1 mt-2 text-black"
                  {...register("descripcion", {
                    required: "Este campo es obligatorio",
                    minLength: {
                      value: 1,
                      message: "La descripción no puede estar vacía",
                    },
                  })}
                />
                {errors.descripcion && (
                  <span className="text-red-500">
                    {errors.descripcion.message}
                  </span>
                )}
              
                  <div className="flex mt-4 w-full justify-center">
                  <button
                       className={`rounded-lg w-24 p-2 ${
                        isValid && pagoPorEmisionCarta
                          ? "bg-green-500 text-white"
                          : "bg-gray-400 text-gray-800"
                      }`}
                      type="submit"
                      disabled={!(isValid && pagoPorEmisionCarta)}
                    >
                      Enviar
                    </button>
                  </div>
                
              </div>
            )}
            {tipoEnvio === "Courier" && (
              <div className="flex flex-col w-full m-3">
                <label>DIRECCIÓN :</label>
                <input
                  className=" pl-3 mt-2 w-11/12 rounded-md text-black"
                  type="text"
                  defaultValue={datosDireccion[0]?.DIRECCION || ""}
                  {...register("direccion", {
                    required: "Este campo es obligatorio",
                    minLength: {
                      value: 1,
                      message: "El campo direccion no puede ir vacio",
                    },
                  })}
                />
                {errors.direccion && (
                  <span className="text-red-500">
                    {errors.direccion.message}
                  </span>
                )}

                <div className="flex items-center mt-2 gap-16 w-full">
                  <label>DISTRITO :</label>
                  <input
                    className="pl-3 w-3/4 rounded-md mt-2 text-black"
                    type="text"
                    defaultValue={datosDireccion[0]?.DISTRITO || ""}
                    {...register("distrito", {
                      required: "Este campo es obligatorio",
                      minLength: {
                        value: 1,
                        message: "El campo distrito no puede ir vacio",
                      },
                    })}
                  />
                  {errors.distrito && (
                    <span className="text-red-500 ">
                      {errors.distrito.message}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-12 mt-2 w-full">
                  <label>PROVINCIA :</label>
                  <input
                    className="pl-3 w-3/4 rounded-md text-black"
                    type="text"
                    defaultValue={datosDireccion[0]?.PROVINCIA || ""}
                    {...register("provincia", {
                      required: "Este campo es obligatorio",
                      minLength: {
                        value: 1,
                        message: "El campo no puede ir vacio",
                      },
                    })}
                  />
                  {errors.provincia && (
                    <span className="text-red-500">
                      {errors.provincia.message}
                    </span>
                  )}
                </div>
                <div className="flex items-center  mt-2 gap-4 w-full">
                  <label>DEPARTAMENTO :</label>
                  <input
                    className="pl-3 w-3/4 rounded-md text-black"
                    type="text"
                    defaultValue={datosDireccion[0]?.DEPARTAMENTO || ""}
                    {...register("departamento", {
                      required: "Este campo es obligatorio",
                      minLength: {
                        value: 1,
                        message: "El departamento no puede ir vacio",
                      },
                    })}
                  />
                  {errors.departamento && (
                    <span className="text-red-500">
                      {errors.departamento.message}
                    </span>
                  )}
                </div>

                <label className="mt-2">DESCRIPCIÓN :</label>
                <textarea
                  className="w-11/12 rounded-md p-1 mt-2 text-black"
                  {...register("descripcion", {
                    required: "Este campo es obligatorio",
                    minLength: {
                      value: 1,
                      message: "La descripción no puede estar vacía",
                    },
                  })}
                />
                {errors.descripcion && (
                  <span className="text-red-500">
                    {errors.descripcion.message}
                  </span>
                )}
               
                  <div className="flex mt-4 w-full justify-center">
                  <button
                       className={`rounded-lg w-24 p-2 ${
                        isValid && pagoPorEmisionCarta
                          ? "bg-green-500 text-white"
                          : "bg-gray-400 text-gray-800"
                      }`}
                      type="submit"
                      disabled={!(isValid && pagoPorEmisionCarta)}
                    >
                      Enviar
                    </button>
                  </div>
              
              </div>
            )}

            {/* errors will return when field validation fails  */}
            {errors.exampleRequired && <span>This field is required</span>}
          </form>
        </div>
      ) : (
        <div className=" bg-red-500 p-5 rounded-lg text-white font-semibold mt-5 animate__animated animate__tada">
          {mensajeCDNA}
        </div>
      )}
    </>
  );
};

export default CartaNoAdeudo;
