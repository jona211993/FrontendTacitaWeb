/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useData } from "../../../context/DataContext.jsx";
import { message, Modal } from "antd";
import { useNavigate } from "react-router-dom";

const CartaCronogrmaPagos = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    reset,
  } = useForm({ mode: "all" });

  const navigate = useNavigate();

  const [fechaActual, setFechaActual] = useState("");

  useEffect(() => {
    const hoy = new Date().toISOString().split("T")[0];
    setFechaActual(hoy);
  }, []);

  const tipoEnvio = watch("tipoEnvio");
  const descripcion = watch("descripcion");
  const numTelefono = watch("numTelefono");
  const correoElectronico = watch("correoElectronico");
  const montoCuota = watch("montoCuota");
  const montoCuotaInicial = watch("montoCuotaInicial");
  const numCuotas = watch("numCuotas");
  const montoTotal = watch("montoTotal");
  const fechaInicio = watch("fechaInicio");

  const direccion = watch("direccion");
  const distrito = watch("distrito");
  const provincia = watch("provincia");
  const departamento = watch("departamento");

  const [valorNumSolicitudesTotales, setNumSolicitudesTotales] = useState(-100);
  const [datosDireccion, setDatosDireccion] = useState([]);
  const { cliente, user } = useData();
  const [valorMinimo3, setValorMinimo3] = useState(null);
  const [valorMinimo6, setValorMinimo6] = useState(null);
  const [valorMinimo12, setValorMinim12] = useState(null);
  const [valoMontoAprobado, setValorMontoAprobado] = useState(null);

  //Estado para habilitar el boton  de Enviar luego de validar
  const [estaValidado, setEstaValidado] = useState(false);
  // Checbox de CUOTA INICIAL MENOR O MAYOR
  const [habilitadoCheckbox, setHabilitadoCheckbox] = useState(false);

  // Para Modal de Validacion exitosa
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const onSubmit = async (data) => {
    if (tipoEnvio === "Correo Electronico") {
      await onSubmitCorreo();
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
        `${import.meta.env.VITE_BACKEND_URL}/registrarCronogramaTipoCorreo`,
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
            observacion: descripcion,
            gestor: user.alias,
            fecCompromiso: fechaInicio,
            monto: montoCuota,
            cuota: numCuotas,
            cuota_diferente: habilitadoCheckbox ? "SI" : "NO",
            montoCuotaInicial: montoCuotaInicial,
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
  };

  const onSubmitOficina = async () => {
    console.log("Enviara por tipo Oficina: ", descripcion);
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
  };

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
              tipo: "CRONOGRAMA",
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
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    // Llama a la función fetchData
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // [] asegura que el efecto solo se ejecute una vez al montar el componente

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // [] asegura que el efecto solo se ejecute una vez al montar el componente
  // useeffect parValidacion
  useEffect(() => {
    // Función para obtener los datos de la API
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/obtenerDatosByValidacionCronograma`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              idDeudor: cliente.ID_DEUDOR, // Reemplaza con el valor real
              idEntidad: cliente.ID_ENTIDAD, // Reemplaza con el valor real
              cuota: numCuotas,
            }),
          }
        );

        const data = await response.json();

        // Guardamos los valores de los campos en los estados
        console.log(
          "Se obtuvo del api rest para validar los valores de :",
          data.data[0]
        );
        // setValorMin1(data.campo1);
        setValorMinimo3(data.data[0].MIN3);
        setValorMinimo6(data.data[0].MIN6);
        setValorMinim12(data.data[0].MIN12);
        setValorMontoAprobado(data.data[0].MONTO_EXCEP);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, [numCuotas, montoCuota]);

  const Validacion = () => {
    console.log("Realizando validacion");
    console.log("numCuotas: ", numCuotas);
    console.log("montoAprobado: ", valoMontoAprobado);
    console.log("min3: ", valorMinimo3);
    console.log("min6: ", valorMinimo6);
    console.log("miun12: ", valorMinimo12);
    console.log("montoCuota: ", montoCuota);

    if (numCuotas == 3 || numCuotas == 6 || numCuotas == 12) {
      if (numCuotas == 3) {
        //EXCEPCION
        if (
          montoCuota >= valoMontoAprobado / numCuotas &&
          valoMontoAprobado > 0
        ) {
          setModalMessage("MONTO VÁLIDO");
          setIsModalVisible(true);
          setEstaValidado(true);
          //MIN 3
        } else if (montoCuota >= valorMinimo3 && valorMinimo3 > 0) {
          setModalMessage("MONTO VÁLIDO");
          setIsModalVisible(true);
          setEstaValidado(true);
        } else {
          setModalMessage(
            "NO CUMPLE CON ALGUNA CONDICIÓN DE EXCEPCION O MONTO MÍNIMO"
          );
          setIsModalVisible(true);
          setEstaValidado(false);
        }
      } else if (numCuotas == 6) {
        if (
          montoCuota >= valoMontoAprobado / numCuotas &&
          valoMontoAprobado > 0
        ) {
          setModalMessage("MONTO VÁLIDO");
          setIsModalVisible(true);
          setEstaValidado(true);
        } else if (montoCuota >= valorMinimo6 && valorMinimo6 > 0) {
          setModalMessage("MONTO VÁLIDO");
          setIsModalVisible(true);
          setEstaValidado(true);
        } else {
          setModalMessage(
            "NO CUMPLE CON ALGUNA CONDICIÓN DE EXCEPCION O MONTO MÍNIMO"
          );
          setIsModalVisible(true);
          setEstaValidado(false);
        }
      } else if (numCuotas == 12) {
        if (
          montoCuota >= valoMontoAprobado / numCuotas &&
          valoMontoAprobado > 0
        ) {
          setModalMessage("MONTO VÁLIDO");
          setIsModalVisible(true);
          setEstaValidado(true);
        } else if (montoCuota >= valorMinimo12 && valorMinimo12 > 0) {
          setModalMessage("MONTO VÁLIDO");
          setIsModalVisible(true);
          setEstaValidado(true);
        } else {
          setModalMessage(
            "NO CUMPLE CON ALGUNA CONDICIÓN DE EXCEPCION O MONTO MÍNIMO"
          );
          setIsModalVisible(true);
          setEstaValidado(false);
        }
      }
    } else {
      if (
        valoMontoAprobado > 0 &&
        montoCuota >= valoMontoAprobado / numCuotas
      ) {
        setModalMessage("MONTO VÁLIDO");
        setIsModalVisible(true);
        setEstaValidado(true);
      } else {
        setModalMessage(
          "NO CUMPLE CON ALGUNA CONDICIÓN DE EXCEPCION O MONTO MÍNIMO"
        );
        setIsModalVisible(true);
        setEstaValidado(false);
      }
    }
  };

  useEffect(() => {
    console.log("El nuevo valor del checkbox es:", habilitadoCheckbox);
  }, [habilitadoCheckbox]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    // Aquí puedes manejar el envío del formulario o cualquier acción
    setIsModalVisible(false); // Cierra el modal
  };

  return (
    <div className="bg-cyan-900 w-3/4 rounded-xl p-3 flex flex-wrap gap-5 text-white animate__animated animate__fadeInDown animate__faster">
      <div className="flex justify-between w-full items-center ">
        <h1 className="text-xl pl-3 font-semibold">CRONOGRAMA DE PAGO</h1>
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
            <option value="Correo Electronico">Correo Electronico</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Courier">Courier</option>
            <option value="Oficina">Oficina</option>
          </select>
        </div>
        {tipoEnvio === "Correo Electronico" && (
          <div className="flex flex-col w-full m-3">
            <label>CORREO ELECTRÓNICO :</label>
            <input
              className="w-3/4 m-2 rounded-md text-black"
              type="text"
              // defaultValue={correoElectronico}
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
            <label className="flex gap-2">
              <input
                type="checkbox"
                value={habilitadoCheckbox}
                onChange={() => setHabilitadoCheckbox(!habilitadoCheckbox)}
              />
              CUOTA INICIAL MENOR O MAYOR
            </label>

            <div className="flex items-center gap-16">
              <label>FEC. INICIO :</label>
              <input
                className="w-2/5 m-2 rounded-md text-black"
                type="date"
                defaultValue={fechaActual}
                {...register("fechaInicio", { required: "Elegir una fecha" })}
              />
              {errors.fechaInicio && (
                <span className="text-red-500">
                  {errors.fechaInicio.message}
                </span>
              )}
            </div>
            <div className="flex flex-col justify-center  gap-6 mb-2  ">
              {habilitadoCheckbox === true && (
                <div className="flex items-center gap-2 mt-2">
                  <label className="flex items-center">
                    MONTO CUOTA INICIAL :
                  </label>
                  <input
                    className="w-2/5 pl-2 rounded-md text-black"
                    type="text"
                    defaultValue={montoCuotaInicial}
                    {...register("montoCuotaInicial", {
                      required: "Este campo no puede estar vacío",
                      pattern: {
                        value: /^(\d+(\.\d*)?)?$/,
                        message: "Solo se permiten números o decimales",
                      },
                    })}
                  />
                  {errors.montoCuotaInicial && (
                    <span className="text-red-500">
                      {errors.montoCuotaInicial.message}
                    </span>
                  )}
                </div>
              )}
              <div className="flex gap-10 mt-2">
                <label>MONTO CUOTA :</label>
                <input
                  className="w-2/5  rounded-md text-black"
                  type="text"
                  defaultValue={montoCuota}
                  {...register("montoCuota", {
                    required: "Este campo no puede estar vacío",
                    pattern: {
                      value: /^(\d+(\.\d*)?)?$/,
                      message: "Solo se permiten números o decimales",
                    },
                  })}
                />
                {errors.montoCuota && (
                  <span className="text-red-500">
                    {errors.montoCuota.message}
                  </span>
                )}
              </div>
              <div className="flex gap-11">
                <label>NUM. CUOTAS :</label>
                <input
                  className="w-2/5  rounded-md text-black"
                  type="text"
                  defaultValue={numCuotas}
                  {...register("numCuotas", {
                    required: "Este campo no puede estar vacío", // Validación requerida
                    pattern: {
                      value: /^\d+$/, // Solo permite números enteros
                      message: "Solo se permiten números enteros",
                    },
                  })}
                />
                {errors.numCuotas && (
                  <span className="text-red-500">
                    {errors.numCuotas.message}
                  </span>
                )}
              </div>
              <div className="flex  gap-10">
                <label>MONTO TOTAL :</label>
                <input
                  className="w-2/5  rounded-md text-black"
                  disabled
                  value={(montoCuota * numCuotas).toFixed(2)}
                  {...register("montoTotal")}
                />
                {errors.montoTotal && (
                  <span className="text-red-500">
                    {errors.montoTotal.message}
                  </span>
                )}
                <button
                  className="bg-blue-500 rounded-lg w-20 m-2"
                  type="button"
                  onClick={Validacion}
                >
                  VALIDAR
                </button>
                <Modal
                  title="Resultado de la Validación"
                  visible={isModalVisible}
                  onOk={handleOk}
                  okText="Aceptar"
                >
                  <p>{modalMessage}</p>
                </Modal>
              </div>
            </div>

            <label>DESCRIPCIÓN :</label>
            <textarea
              className="w-11/12 rounded-md mt-3 text-black"
              {...register("descripcion", {
                required: "Este campo es obligatorio",
                minLength: {
                  value: 1,
                  message: "El campo descripcon no puede ir vacio",
                },
              })}
            />

            {errors.descripcion && (
              <span className="text-red-500">{errors.descripcion.message}</span>
            )}

            <div className="flex mt-4 w-full justify-center">
              <button
                className={`rounded-lg w-24 p-2 ${
                  isValid && estaValidado
                    ? "bg-green-500 text-white"
                    : "bg-gray-400 text-gray-800"
                }`}
                type="submit"
                disabled={!(isValid && estaValidado)}
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
              className="w-3/4 m-2 rounded-md text-black"
              type="text"
              defaultValue={numTelefono}
              {...register("numTelefono", {
                required: "Ingresar un número válido",
                pattern: {
                  value: /^9\d{8}$/,
                  message: "El formato del número no es válido",
                },
              })}
            />
            {errors.numTelefono && (
              <p className="text-red-500 text-sm">
                {errors.numTelefono.message}
              </p>
            )}
            <label className="flex gap-2">
              <input
                type="checkbox"
                value={habilitadoCheckbox}
                onChange={() => setHabilitadoCheckbox(!habilitadoCheckbox)}
              />
              CUOTA INICIAL MENOR O MAYOR
            </label>

            <div className="flex items-center gap-16">
              <label>FEC. INICIO :</label>
              <input
                className="w-2/5 m-2 rounded-md text-black"
                type="date"
                // defaultValue={fechaInicio}
                {...register("fechaInicio", { required: "Elegir una fecha" })}
              />
              {errors.fechaInicio && (
                <span className="text-red-500">
                  {errors.fechaInicio.message}
                </span>
              )}
            </div>
            <div className="flex flex-col justify-center  gap-6 mb-2  ">
              {habilitadoCheckbox === true && (
                <div className="flex items-center gap-2 mt-2">
                  <label className="flex items-center">
                    MONTO CUOTA INICIAL :
                  </label>
                  <input
                    className="w-2/5 pl-2 rounded-md text-black"
                    type="text"
                    defaultValue={montoCuotaInicial}
                    {...register("montoCuotaInicial", {
                      required: "Este campo no puede estar vacío",
                      pattern: {
                        value: /^(\d+(\.\d*)?)?$/,
                        message: "Solo se permiten números o decimales",
                      },
                    })}
                  />
                  {errors.montoCuotaInicial && (
                    <span className="text-red-500">
                      {errors.montoCuotaInicial.message}
                    </span>
                  )}
                </div>
              )}
              <div className="flex gap-10 mt-2">
                <label>MONTO CUOTA :</label>
                <input
                  className="w-2/5  rounded-md text-black"
                  type="text"
                  defaultValue={montoCuota}
                  {...register("montoCuota", {
                    required: "Este campo no puede estar vacío",
                    pattern: {
                      value: /^(\d+(\.\d*)?)?$/,
                      message: "Solo se permiten números o decimales",
                    },
                  })}
                />
                {errors.montoCuota && (
                  <span className="text-red-500">
                    {errors.montoCuota.message}
                  </span>
                )}
              </div>
              <div className="flex gap-11">
                <label>NUM. CUOTAS :</label>
                <input
                  className="w-2/5  rounded-md text-black"
                  type="text"
                  defaultValue={numCuotas}
                  {...register("numCuotas", {
                    required: "Este campo no puede estar vacío", // Validación requerida
                    pattern: {
                      value: /^\d+$/, // Solo permite números enteros
                      message: "Solo se permiten números enteros",
                    },
                  })}
                />
                {errors.numCuotas && (
                  <span className="text-red-500">
                    {errors.numCuotas.message}
                  </span>
                )}
              </div>
              <div className="flex  gap-10">
                <label>MONTO TOTAL :</label>
                <input
                  className="w-2/5  rounded-md text-black"
                  disabled
                  value={(montoCuota * numCuotas).toFixed(2)}
                  {...register("montoTotal")}
                />
                {errors.montoTotal && (
                  <span className="text-red-500">
                    {errors.montoTotal.message}
                  </span>
                )}
                <button
                  className="bg-blue-500 rounded-lg w-20 m-2"
                  type="button"
                  onClick={Validacion}
                >
                  VALIDAR
                </button>
                <Modal
                  title="Resultado de la Validación"
                  visible={isModalVisible}
                  onOk={handleOk}
                  okText="Aceptar"
                >
                  <p>{modalMessage}</p>
                </Modal>
              </div>
            </div>

            <label>DESCRIPCIÓN :</label>
            <textarea
              className="w-11/12 rounded-md mt-3 text-black"
              {...register("descripcion", {
                required: "Este campo es obligatorio",
                minLength: {
                  value: 1,
                  message: "El campo descripcon no puede ir vacio",
                },
              })}
            />

            {errors.descripcion && (
              <span className="text-red-500">{errors.descripcion.message}</span>
            )}

            <div className="flex mt-4 w-full justify-center">
              <button
                className={`rounded-lg w-24 p-2 ${
                  isValid && estaValidado
                    ? "bg-green-500 text-white"
                    : "bg-gray-400 text-gray-800"
                }`}
                type="submit"
                disabled={!(isValid && estaValidado)}
              >
                Enviar
              </button>
            </div>
          </div>
        )}
        {tipoEnvio === "Oficina" && (
          <div className="flex flex-col w-full m-3">
            <label className="flex gap-2">
              <input
                type="checkbox"
                value={habilitadoCheckbox}
                onChange={() => setHabilitadoCheckbox(!habilitadoCheckbox)}
              />
              CUOTA INICIAL MENOR O MAYOR
            </label>

            <div className="flex items-center gap-16">
              <label>FEC. INICIO :</label>
              <input
                className="w-2/5 m-2 rounded-md text-black"
                type="date"
                // defaultValue={fechaInicio}
                {...register("fechaInicio", { required: "Elegir una fecha" })}
              />
              {errors.fechaInicio && (
                <span className="text-red-500">
                  {errors.fechaInicio.message}
                </span>
              )}
            </div>
            <div className="flex flex-col justify-center  gap-6 mb-2  ">
              {habilitadoCheckbox === true && (
                <div className="flex items-center gap-2 mt-2">
                  <label className="flex items-center">
                    MONTO CUOTA INICIAL :
                  </label>
                  <input
                    className="w-2/5 pl-2 rounded-md text-black"
                    type="text"
                    defaultValue={montoCuotaInicial}
                    {...register("montoCuotaInicial", {
                      required: "Este campo no puede estar vacío",
                      pattern: {
                        value: /^(\d+(\.\d*)?)?$/,
                        message: "Solo se permiten números o decimales",
                      },
                    })}
                  />
                  {errors.montoCuotaInicial && (
                    <span className="text-red-500">
                      {errors.montoCuotaInicial.message}
                    </span>
                  )}
                </div>
              )}
              <div className="flex gap-10 mt-2">
                <label>MONTO CUOTA :</label>
                <input
                  className="w-2/5  rounded-md text-black"
                  type="text"
                  defaultValue={montoCuota}
                  {...register("montoCuota", {
                    required: "Este campo no puede estar vacío",
                    pattern: {
                      value: /^(\d+(\.\d*)?)?$/,
                      message: "Solo se permiten números o decimales",
                    },
                  })}
                />
                {errors.montoCuota && (
                  <span className="text-red-500">
                    {errors.montoCuota.message}
                  </span>
                )}
              </div>
              <div className="flex gap-11">
                <label>NUM. CUOTAS :</label>
                <input
                  className="w-2/5  rounded-md text-black"
                  type="text"
                  defaultValue={numCuotas}
                  {...register("numCuotas", {
                    required: "Este campo no puede estar vacío", // Validación requerida
                    pattern: {
                      value: /^\d+$/, // Solo permite números enteros
                      message: "Solo se permiten números enteros",
                    },
                  })}
                />
                {errors.numCuotas && (
                  <span className="text-red-500">
                    {errors.numCuotas.message}
                  </span>
                )}
              </div>
              <div className="flex  gap-10">
                <label>MONTO TOTAL :</label>
                <input
                  className="w-2/5  rounded-md text-black"
                  disabled
                  value={(montoCuota * numCuotas).toFixed(2)}
                  {...register("montoTotal")}
                />
                {errors.montoTotal && (
                  <span className="text-red-500">
                    {errors.montoTotal.message}
                  </span>
                )}
                <button
                  className="bg-blue-500 rounded-lg w-20 m-2"
                  type="button"
                  onClick={Validacion}
                >
                  VALIDAR
                </button>
                <Modal
                  title="Resultado de la Validación"
                  visible={isModalVisible}
                  onOk={handleOk}
                  okText="Aceptar"
                >
                  <p>{modalMessage}</p>
                </Modal>
              </div>
            </div>

            <label>DESCRIPCIÓN :</label>
            <textarea
              className="w-11/12 rounded-md mt-3 text-black"
              {...register("descripcion", {
                required: "Este campo es obligatorio",
                minLength: {
                  value: 1,
                  message: "El campo descripcon no puede ir vacio",
                },
              })}
            />

            {errors.descripcion && (
              <span className="text-red-500">{errors.descripcion.message}</span>
            )}

           
              <div className="flex mt-4 w-full justify-center">
              <button
                className={`rounded-lg w-24 p-2 ${
                  isValid && estaValidado
                    ? "bg-green-500 text-white"
                    : "bg-gray-400 text-gray-800"
                }`}
                type="submit"
                disabled={!(isValid && estaValidado)}
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
                },
              })}
            />
            {errors.direccion && (
              <span className="text-red-500">{errors.direccion.message}</span>
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
                  },
                })}
              />
              {errors.distrito && (
                <span className="text-red-500 ">{errors.distrito.message}</span>
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
                  },
                })}
              />
              {errors.provincia && (
                <span className="text-red-500">{errors.provincia.message}</span>
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
                  },
                })}
              />
              {errors.departamento && (
                <span className="text-red-500">
                  {errors.departamento.message}
                </span>
              )}
            </div>
            <br />
            <label className="flex gap-2">
              <input
                type="checkbox"
                value={habilitadoCheckbox}
                onChange={() => setHabilitadoCheckbox(!habilitadoCheckbox)}
              />
              CUOTA INICIAL MENOR O MAYOR
            </label>

            <div className="flex items-center gap-16">
              <label className="pl-3">FEC. INICIO :</label>
              <input
                className="w-2/5 m-2 rounded-md text-black"
                type="date"
                // defaultValue={fechaInicio}
                {...register("fechaInicio", { required: "Elegir una fecha" })}
              />
              {errors.fechaInicio && (
                <span className="text-red-500">
                  {errors.fechaInicio.message}
                </span>
              )}
            </div>
            <div className="flex flex-col justify-center  gap-6 mb-2  ">
              {habilitadoCheckbox === true && (
                <div className="flex items-center gap-2 mt-2">
                  <label className="flex items-center ">
                    MONTO CUOTA INICIAL :
                  </label>
                  <input
                    className="w-2/5 pl-3 rounded-md text-black"
                    type="text"
                    defaultValue={montoCuotaInicial}
                    {...register("montoCuotaInicial", {
                      required: "Este campo no puede estar vacío",
                      pattern: {
                        value: /^(\d+(\.\d*)?)?$/,
                        message: "Solo se permiten números o decimales",
                      },
                    })}
                  />
                  {errors.montoCuotaInicial && (
                    <span className="text-red-500">
                      {errors.montoCuotaInicial.message}
                    </span>
                  )}
                </div>
              )}
              <div className="flex gap-10 mt-2">
                <label>MONTO CUOTA :</label>
                <input
                  className="w-2/5 pl-3  rounded-md text-black"
                  type="text"
                  defaultValue={montoCuota}
                  {...register("montoCuota", {
                    required: "Este campo no puede estar vacío",
                    pattern: {
                      value: /^(\d+(\.\d*)?)?$/,
                      message: "Solo se permiten números o decimales",
                    },
                  })}
                />
                {errors.montoCuota && (
                  <span className="text-red-500">
                    {errors.montoCuota.message}
                  </span>
                )}
              </div>
              <div className="flex gap-11">
                <label>NUM. CUOTAS :</label>
                <input
                  className="w-2/5 pl-3  rounded-md text-black"
                  type="text"
                  defaultValue={numCuotas}
                  {...register("numCuotas", {
                    required: "Este campo no puede estar vacío", // Validación requerida
                    pattern: {
                      value: /^\d+$/, // Solo permite números enteros
                      message: "Solo se permiten números enteros",
                    },
                  })}
                />
                {errors.numCuotas && (
                  <span className="text-red-500">
                    {errors.numCuotas.message}
                  </span>
                )}
              </div>
              <div className="flex  gap-10">
                <label>MONTO TOTAL :</label>
                <input
                  className="w-2/5 pl-3 rounded-md text-black"
                  disabled
                  value={(montoCuota * numCuotas).toFixed(2)}
                  {...register("montoTotal")}
                />
                {errors.montoTotal && (
                  <span className="text-red-500">
                    {errors.montoTotal.message}
                  </span>
                )}
                <button
                  className="bg-blue-500 rounded-lg w-20 m-2"
                  type="button"
                  onClick={Validacion}
                >
                  VALIDAR
                </button>
                <Modal
                  title="Resultado de la Validación"
                  visible={isModalVisible}
                  onOk={handleOk}
                  okText="Aceptar"
                >
                  <p>{modalMessage}</p>
                </Modal>
              </div>
            </div>

            <label>DESCRIPCIÓN :</label>
            <textarea
              className="w-11/12 rounded-md mt-3 pl-3 text-black"
              {...register("descripcion", {
                required: "Este campo es obligatorio",
                minLength: {
                  value: 1,
                  message: "El campo descripcon no puede ir vacio",
                },
              })}
            />

            {errors.descripcion && (
              <span className="text-red-500">{errors.descripcion.message}</span>
            )}

            
              <div className="flex mt-4 w-full justify-center">
              <button
                className={`rounded-lg w-24 p-2 ${
                  isValid && estaValidado
                    ? "bg-green-500 text-white"
                    : "bg-gray-400 text-gray-800"
                }`}
                type="submit"
                disabled={!(isValid && estaValidado)}
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
  );
};

export default CartaCronogrmaPagos;
