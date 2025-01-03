import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useData } from "../../../context/DataContext.jsx";
import "animate.css";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

const CartaAgresiva = () => {
  let contenido;
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    reset,
  } = useForm({ mode: "all" });


  const navigate = useNavigate();

  const tipoEnvio = watch("tipoEnvio");
  const descripcion = watch("descripcion");
  const numTelefono = watch("numTelefono");
  const correoElectronico = watch("correoElectronico");

  const direccion = watch("direccion");
  const distrito = watch("distrito");
  const provincia = watch("provincia");
  const departamento = watch("departamento");

  const [valorNumSolicitudesTotales, setNumSolicitudesTotales] = useState(-100);
  const [valorNumSolicitudesTotales2, setNumSolicitudesTotales2] =
    useState(-100);
  const [datosDireccion, setDatosDireccion] = useState([]);
  const { cliente, user } = useData();
  const [valor, setValor] = useState("");
  const [numCarta, setNumCarta] = useState(0);

  // VALIDACION DE LA HABILITACION DEL FORMULARIO
  useEffect(() => {
    const obtenerValor = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/validacionCartaAgresiva`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              idDeudor: cliente.ID_DEUDOR,
              idEntidadBancaria: cliente.ID_ENTIDAD,
              tipo: "AGRESIVA",
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data.data[0].VALOR);
        console.log(data.data)
        setValor(data.data[0].VALOR); // Suponiendo que `valor2` viene en la respuesta
      } catch (error) {
        console.error("Error al obtener valor:", error);
      }
    };

    obtenerValor();
  }, []);

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
        `${import.meta.env.VITE_BACKEND_URL}/registrarCAgresivaTipoCorreo`,
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
            numCarta: numCarta,
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
        `${import.meta.env.VITE_BACKEND_URL}/registrarCAgresivaTipoWsp`,
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
            observacion: descripcion,
            gestor: user.alias,
            numCarta: numCarta,
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
        `${import.meta.env.VITE_BACKEND_URL}/registrarCAgresivaTipoOficina`,
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
            numCarta: numCarta,
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
      descripcion,
      numCarta
    );

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/registrarCAgresivaTipoCourier`,
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
            observacion: descripcion,
            gestor: user.alias,
            distrito: distrito,
            provincia: provincia,
            departamento: departamento,
            numCarta: numCarta,
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
              tipo: "AGRESIVA-CARTA1",
              // Agrega más campos según sea necesario
            }),
          }
        );
        if (!response.ok) {
          throw new Error("Error en la respuesta de la API");
        }
        const data = await response.json();

        // Supongamos que el valor que necesitas está en data.totalSolicitudes
        // console.log("Tengo del api: ", data.data[0][""]);
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
              tipo: "AGRESIVA-CARTA2",
              // Agrega más campos según sea necesario
            }),
          }
        );
        if (!response.ok) {
          throw new Error("Error en la respuesta de la API");
        }
        const data = await response.json();

        // Supongamos que el valor que necesitas está en data.totalSolicitudes
        // console.log("Tengo del api: ", data.data[0][""]);
        setNumSolicitudesTotales2(data.data[0][""]);
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
        // console.log("Tengo del api para direccion : ", data.data);
        setDatosDireccion(data.data);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    // Llama a la función fetchData
    fetchDataDireccion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // [] asegura que el efecto solo se ejecute una vez al montar el componente

  useEffect(() => {
    // console.log("El valor es:", valor);
  }, [valor]);

  useEffect(() => {
    if(valor){
    if (valor === "GENERAR CARTA1") {
      setNumCarta(1);
      console.log(numCarta)
    } else if (valor === "GENERAR CARTA2") {
      setNumCarta(2);
    }
    else if (valor === "GENERAR CARTA3") {
      setNumCarta(3);
    }
    else if (valor === "GENERAR CARTA4") {
      setNumCarta(4);
    }
    
  }
    // Puedes manejar otros valores aquí si es necesario
  }, [valor, numCarta]); // Solo se ejecuta cuando 'valor' cambia


  switch (valor) {
    case "NO GENERAR1":
      contenido = (
        <div>El cliente ya tiene una carta de AVISO DE PRE-EMBARGO</div>
      );
      break;
    case "NO GENERAR2":
      contenido = (
        <div>El cliente tiene una carta vigente de REQUERIMIENTO JUDICIAL</div>
      );
      break;
    case "NO GENERAR":
      contenido = <div>No se puede solicitar esta carta</div>;
      break;
    case "GENERAR CARTA1":
      {
      contenido = (
        <div className="flex gap-10 justify-center animate__animated animate__fadeInUp animate__faster ">
          <div className="bg-cyan-900 w-3/6 rounded-xl p-3 flex flex-wrap gap-5 text-white">
            <div className="flex justify-between w-full items-center ">
              <h1 className="text-xl pl-3 font-semibold">CARTA AGRESIVA</h1>
              <div className="flex flex-col gap-2">
                <div className="flex  gap-4 items-center">
                  <label className=" text-sm">REQUERIMIENTO JUDICIAL</label>
                  <div className="w-20 bg-cyan-200 rounded-md flex items-center justify-center">
                    <label className="text-black font-semibold">
                      {valorNumSolicitudesTotales}
                    </label>
                  </div>
                </div>
                <div className="flex  gap-6 items-center">
                  <label className="text-sm"> AVISO DE PRE-EMBARGO</label>
                  <div className="w-20 bg-cyan-200 rounded-md flex items-center justify-center">
                    <label className="text-black font-semibold">
                      {valorNumSolicitudesTotales2}
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center w-full m-2">
              <button className="bg-cyan-600 hover:bg-cyan-950 text-white font-bold py-2 px-4 rounded-lg animate-blink pointer-events-none cursor-default">
                GENERAR CARTA REQUERIMIENTO JUDICIAL
              </button>
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
              {tipoEnvio === "Correo Electronico" && (
                <div className="flex flex-col w-full m-3 animate__animated animate__flipInX">
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
                        isValid
                          ? "bg-green-500 text-white"
                          : "bg-gray-400 text-gray-800"
                      }`}
                      type="submit"
                      disabled={!isValid}
                    >
                      Enviar
                    </button>
                  </div>
                </div>
              )}

              {tipoEnvio === "WhatsApp" && (
                <div className="flex flex-col w-full m-3 animate__animated animate__flipInX">
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
                        isValid
                          ? "bg-green-500 text-white"
                          : "bg-gray-400 text-gray-800"
                      }`}
                      type="submit"
                      disabled={!isValid}
                    >
                      Enviar
                    </button>
                  </div>
                </div>
              )}
              {tipoEnvio === "Oficina" && (
                <div className="flex flex-col w-full m-3 animate__animated animate__flipInX">
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
                        isValid
                          ? "bg-green-500 text-white"
                          : "bg-gray-400 text-gray-800"
                      }`}
                      type="submit"
                      disabled={!isValid}
                    >
                      Enviar
                    </button>
                  </div>
                </div>
              )}
              {tipoEnvio === "Courier" && (
                <div className="flex flex-col w-full m-3 animate__animated animate__flipInX">
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
                        isValid
                          ? "bg-green-500 text-white"
                          : "bg-gray-400 text-gray-800"
                      }`}
                      type="submit"
                      disabled={!isValid}
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
          <div className="flex  items-center w-1/6 ">
            <div className="h-3/6">
              <img src="../../src/images/Robot3D.gif" alt="" />
            </div>
          </div>
        </div>
      );
      break;}
    case "GENERAR CARTA2":
       {
      contenido = (
        <div className="flex gap-10 justify-center animate__animated animate__fadeInUp animate__faster ">
          <div className="bg-cyan-900 w-3/6 rounded-xl p-3 flex flex-wrap gap-5 text-white">
            <div className="flex justify-between w-full items-center ">
              <h1 className="text-xl pl-3 font-semibold">CARTA AGRESIVA</h1>
              <div className="flex flex-col gap-2">
                <div className="flex  gap-4 items-center">
                  <label className=" text-sm">REQUERIMIENTO JUDICIAL</label>
                  <div className="w-20 bg-cyan-200 rounded-md flex items-center justify-center">
                    <label className="text-black font-semibold">
                      {valorNumSolicitudesTotales}
                    </label>
                  </div>
                </div>
                <div className="flex  gap-6 items-center">
                  <label className="text-sm"> AVISO DE PRE-EMBARGO</label>
                  <div className="w-20 bg-cyan-200 rounded-md flex items-center justify-center">
                    <label className="text-black font-semibold">
                      {valorNumSolicitudesTotales}
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center w-full m-2">
              <button className="bg-cyan-600 hover:bg-cyan-950 text-white font-bold py-2 px-4 rounded-lg animate-blink pointer-events-none cursor-default">
              GENERAR CARTA AVISO DE PRE-EMBARGO
              </button>
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
              {tipoEnvio === "Correo Electronico" && (
                <div className="flex flex-col w-full m-3 animate__animated animate__flipInX">
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
                        isValid
                          ? "bg-green-500 text-white"
                          : "bg-gray-400 text-gray-800"
                      }`}
                      type="submit"
                      disabled={!isValid}
                    >
                      Enviar
                    </button>
                  </div>
                </div>
              )}

              {tipoEnvio === "WhatsApp" && (
                <div className="flex flex-col w-full m-3 animate__animated animate__flipInX">
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
                        isValid
                          ? "bg-green-500 text-white"
                          : "bg-gray-400 text-gray-800"
                      }`}
                      type="submit"
                      disabled={!isValid}
                    >
                      Enviar
                    </button>
                  </div>
                </div>
              )}
              {tipoEnvio === "Oficina" && (
                <div className="flex flex-col w-full m-3 animate__animated animate__flipInX">
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
                        isValid
                          ? "bg-green-500 text-white"
                          : "bg-gray-400 text-gray-800"
                      }`}
                      type="submit"
                      disabled={!isValid}
                    >
                      Enviar
                    </button>
                  </div>
                </div>
              )}
              {tipoEnvio === "Courier" && (
                <div className="flex flex-col w-full m-3 animate__animated animate__flipInX">
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
                        isValid
                          ? "bg-green-500 text-white"
                          : "bg-gray-400 text-gray-800"
                      }`}
                      type="submit"
                      disabled={!isValid}
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
          <div className="flex  items-center w-1/6 ">
            <div className="h-3/6">
              <img src="../../src/images/Robot3D.gif" alt="" />
            </div>
          </div>
        </div>
      );
      break;}
    

    default:
      contenido = <div>No se cumplen las condiciones para mostrar algo.</div>;
  }

  return <div>{contenido}</div>;
};

export default CartaAgresiva;
