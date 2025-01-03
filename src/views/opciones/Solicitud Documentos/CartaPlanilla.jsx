import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useData } from "../../../context/DataContext.jsx";
import 'animate.css';

const CartaPlanilla = () => {
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
  const { cliente, user, productoscliente } = useData();
  const [ valor2, setValor2] = useState("");
  

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
        `${import.meta.env.VITE_BACKEND_URL}/registrarCPlanillaTipoCorreo`,
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
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }

      const data = await response.json();

      console.log("Respuesta del servidor:", data);
      alert("Envio Exitoso!");
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
        `${import.meta.env.VITE_BACKEND_URL}/registrarCPlanillaTipoWsp`,
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
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }

      const data = await response.json();

      console.log("Respuesta del servidor:", data);
      alert("Envio Exitoso!");
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
        `${import.meta.env.VITE_BACKEND_URL}/registrarCPlanillaTipoOficina`,
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
      alert("Envio Exitoso!");
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
        `${import.meta.env.VITE_BACKEND_URL}/registrarCPlanillaTipoCourier`,
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
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }

      const data = await response.json();

      console.log("Respuesta del servidor:", data);
      alert("Envio Exitoso!");
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
              tipo: "PLANILLA",
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
 
  // VALIDACION DE LA HABILITACION DEL FORMULARIO
  useEffect(() => {
    const obtenerValor2 = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/validacionCartaPlanilla`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idDeudor: cliente.ID_DEUDOR, idEntidadBancaria: cliente.ID_ENTIDAD, tipo: "PLANILLA"  }),
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();     
        setValor2(data.data[0].VALOR); // Suponiendo que `valor2` viene en la respuesta
      } catch (error) {
        console.error("Error al obtener valor2:", error);
      }
    };

      obtenerValor2();
    
  }, []); 

  return (
    <div>    
    {productoscliente.situacion === null ? (
      <div className=" bg-red-500 p-5 rounded-lg text-white font-semibold mt-5 animate__animated animate__tada animate__faster">Cliente no clasificado en planilla.</div>
    ) : productoscliente.situacion === "PLANILLA" ? (
      valor2 === "NO GENERAR" ? (
        <div className=" bg-green-600 p-5 rounded-lg text-white font-semibold mt-5 animate__animated animate__tada">El cliente ya tiene una carta vigente.</div>
      ) : valor2 === "GENERAR CARTA" ? (
         
   <div className="flex gap-10 justify-center animate__animated animate__fadeInDown animate__faster">
   <div className="bg-cyan-900 w-3/6 rounded-xl p-3 flex flex-wrap gap-5 text-white">
   <div className="flex justify-between w-full items-center ">
     <h1 className="text-xl pl-3 font-semibold">CARTA PLANILLA</h1>
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
           <span className="text-red-500">{errors.descripcion.message}</span>
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
           <span className="text-red-500">{errors.descripcion.message}</span>
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
           <span className="text-red-500">{errors.descripcion.message}</span>
         )}
         
           <div className="flex mt-4 w-full justify-center">
             <button className={`rounded-lg w-24 p-2 ${
               isValid
                 ? "bg-green-500 text-white"
                 : "bg-gray-400 text-gray-800"
             }`}
             type="submit"
             disabled={!isValid}>
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
                 message: "El campo distrito no puede ir vacio",
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
                 message: "El campo no puede ir vacio",
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
           <span className="text-red-500">{errors.descripcion.message}</span>
         )}
        
           <div className="flex mt-4 w-full justify-center">
             <button className={`rounded-lg w-24 p-2 ${
               isValid
                 ? "bg-green-500 text-white"
                 : "bg-gray-400 text-gray-800"
             }`}
             type="submit"
             disabled={!isValid}>
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
     <img  src="../../src/images/Robot3D.gif" alt="" />
     </div>
      
   </div>
 </div>
      ) : (
        <div className=" bg-orange-400 p-5 rounded-lg text-white font-semibold mt-5 animate__animated animate__tada">No se cumple ninguna condición válida para el cliente.</div>
      )
    ) : (
      <div className=" bg-purple-600 p-5 rounded-lg text-white font-semibold mt-5 animate__animated animate__tada">No se cumplen las condiciones para mostrar algo.</div>
    )}
  </div>





  );
}

export default CartaPlanilla