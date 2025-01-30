/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal, message } from "antd";
import { useData } from "../../context/DataContext.jsx";
import {
  CheckCircleOutlined,
  FormOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const FormExcepcion = ({ selectedRow, closeModalVer, recargarPagina }) => {
  const [datosProductos, setDatosProductos] = useState([]);
  const [verModalConfirmacionAprobar, setVerModalConfirmacionAprobar] =
    useState(false);
  const [fechaActual] = useState(dayjs().format("YYYY-MM-DD"));
  const [verModalNegacionAprobar, setVerModalNegacionAprobar] = useState(false);
  const [observacion2, setObservacion2] = useState("");
  const { user, setCliente } = useData();
  const [messageApi] = message.useMessage();
  const [fechaAprobada, setFechaAprobada] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [montoAprobado, setMontoAprobado] = useState(null);
  const [cuotaAprobada, setCuotaAprobada] = useState(null);
  //Para el MOdificar:
  const [verModalConfirmacionModificar, setVerModalConfirmacionModificar] =
    useState(false);

  // Creare este estado para controlar la visualizacion de los campos a llenar cuando sea una MODIFICACION
  const [banderaModificar, setBanderaModificar] = useState(false);

  useEffect(() => {
    if (selectedRow?.idDeudor && selectedRow?.idEntidadBancaria) {
      // Define los datos que se enviarán en el body
      const body = {
        idDeudor: selectedRow.idDeudor,
        idEntidad: selectedRow.idEntidadBancaria,
      };

      // Llama al endpoint con Axios
      const obtenerProductos = async () => {
        try {
          const response = await axios.post(
            "http://localhost:3005/obtenerDatosProductos",
            body
          );

          // Verifica si hay datos en la respuesta
          if (response.data && response.data.data) {
            console.log(response.data.data[0]);
            setDatosProductos(response.data.data); // Almacena los datos en el estado
          } else {
            console.warn("No se encontraron datos en la respuesta.");
          }
        } catch (error) {
          console.error("Error al obtener datos del endpoint:", error.message);
        }
      };

      // Llamar a la función
      obtenerProductos();
    } else {
      console.warn("Los datos de selectedRow no están completos.");
    }
  }, [selectedRow]); // El efecto se ejecuta cuando selectedRow cambia

  // Función para manejar el cambio de valor en el textarea2
  const handleObservacionChange = (event) => {
    setObservacion2(event.target.value); // Actualiza el estado con el nuevo valor
  };
  const handleAprobar = () => {
    console.log(user.alias);
    console.log(selectedRow.EXCEPCION_R2);
    if (selectedRow.MONTO_SOLICITADO < selectedRow.EXCEPCION_R2) {
      if (
        user.alias === "JULIO HIGA" ||
        user.alias === "ANGEL MARTINEZ" ||
        user.alias === "CESAR MENACHO" ||
        user.alias === "ALESSANDRA ORUNA" ||
        user.alias === "NATHALY JIMENEZ" ||
        user.alias === "MAYRA LLIMPE"
      )
        showModalAprobar();
      else {
        showModalNegacionAprobar();
      }
    } else {
      alert("NORMAL");
      // aquidebo aprobar con el endpoint y cerrar modales
    }
  };
  // Función para mostrar el modal
  const showModalAprobar = () => {
    setVerModalConfirmacionAprobar(true);
  };

  // Función para cerrar el modal
  const handleCancelAprobar = () => {
    setVerModalConfirmacionAprobar(false);
  };

  // Función para mostrar el modal
  const showModalNegacionAprobar = () => {
    setVerModalNegacionAprobar(true);
  };

  // Función para cerrar el modal
  const handleCancelNegacionAprobar = () => {
    setVerModalNegacionAprobar(false);
  };

  // Función para cerrar el modal de modificar
  const handleCancelModificar = () => {
    setVerModalConfirmacionModificar(false);
  };

  // Función para CONFIRMAR APROBACION del modal
  const handleConfirmarAprobacion = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3005/excepciones/evaluarExcepcion",
        {
          idExcepcion: selectedRow.idExcepcion,
          idDeudor: selectedRow.idDeudor,
          idEntidad: selectedRow.idEntidadBancaria,
          idGestor: user.idMovEmpleado,
          fecha_aprobacion: fechaActual,
          monto_aprobacion: selectedRow.MONTO_SOLICITADO,
          cuota_aprobacion: selectedRow.CUOTA_SOLICITADO,
          gestor: user.alias,
          detalle: "APROBADO",
          observacion_ap: observacion2,
        }
      );
      console.log("Respuesta del servidor:", response.status);

      if (response.status === 200) {
        // Muestra el mensaje de éxito
        message.success("Registro exitoso!");

        // Espera 2 segundos para que el mensaje sea visible
        setTimeout(() => {
          // Cierra el modal de confirmación
          setVerModalConfirmacionAprobar(false);

          // Llama a la función que cierra el otro modal
          closeModalVer();

          // Recarga la página después de cerrar los modales
          setTimeout(() => {
            recargarPagina();
          }, 500); // Puedes ajustar el tiempo si es necesario
        }, 2000); // 2 segundos para que se observe el mensaje
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      messageApi.open({
        type: "error",
        content: "Algo salió mal",
      });
      // Si hay un error en la solicitud, puedes manejarlo aquí
    }
  };

  // Función para RECHAZAR
  const handleRechazar = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3005/excepciones/evaluarExcepcion",
        {
          idExcepcion: selectedRow.idExcepcion,
          idDeudor: selectedRow.idDeudor,
          idEntidad: selectedRow.idEntidadBancaria,
          idGestor: user.idMovEmpleado,
          fecha_aprobacion: fechaActual,
          monto_aprobacion: selectedRow.MONTO_SOLICITADO,
          cuota_aprobacion: selectedRow.CUOTA_SOLICITADO,
          gestor: user.alias,
          detalle: "RECHAZADO",
          observacion_ap: observacion2,
        }
      );
      console.log("Respuesta del servidor:", response.status);

      if (response.status === 200) {
        // Muestra el mensaje de éxito
        message.success("Se rechazó la excepcción");

        // Espera 2 segundos para que el mensaje sea visible
        setTimeout(() => {
          // Llama a la función que cierra el otro modal
          closeModalVer();

          // Recarga la página después de cerrar los modales
          setTimeout(() => {
            recargarPagina();
          }, 500); // Puedes ajustar el tiempo si es necesario
        }, 2000); // 2 segundos para que se observe el mensaje
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      // Si hay un error en la solicitud, puedes manejarlo aquí
    }
  };

  const handleModificar = () => {
    setBanderaModificar(true);
  };

  const EjecutarEnpointModificar = async () => {
    try {
      console.log("Se enviará la solicitud a la API con los siguientes datos:");

      const requestBody = {
        idExcepcion: selectedRow.idExcepcion,
        idDeudor: selectedRow.idDeudor,
        idEntidad: selectedRow.idEntidadBancaria,
        idGestor: user.idMovEmpleado,
        fecha_aprobacion: fechaAprobada,
        monto_aprobacion: montoAprobado,
        cuota_aprobacion: cuotaAprobada,
        gestor: user.alias,
        detalle: "MODIFICADO",
        observacion_ap: observacion2,
      };

      console.log(requestBody);

      const response = await axios.post(
        "http://localhost:3005/excepciones/evaluarExcepcion",
        requestBody
      );

      if (response.status === 200) {
        message.success("Modificación enviada correctamente");
        console.log("Respuesta del backend:", response.data);
      } else {
        message.error("Error en la modificación");
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      message.error("Hubo un problema al comunicarse con el servidor");
    }
  };

  const handleAceptar = () => {
    if (montoAprobado < selectedRow.EXCEPCION_R2) {
      if (
        user.alias === "GINA GEORFFINO" ||
        user.alias === "JULIO HIGA" ||
        user.alias === "ANGEL MARTINEZ" ||
        user.alias === "CESAR MENACHO" ||
        user.alias === "ALESSANDRA ORUNA" ||
        user.alias === "NATHALY JIMENEZ" ||
        user.alias === "MAYRA LLIMPE"
      ) {
        setVerModalConfirmacionModificar(true);
      } else {
        message.success(
          "El monto esta fuera del rango de autonomía. (Consultar con Cesar)"
        );
      }
    } else {
      message.success("NORMAl");
      //Segundo switch
      console.log(cuotaAprobada);
      switch (cuotaAprobada) {
        case "1":
          console.log("estoy en 1");
          console.log(
            "recibo monto aprobado",
            montoAprobado,
            datosProductos[0].C1
          );
          if (
            montoAprobado >= datosProductos[0].C1 &&
            datosProductos[0].C1 != 0
          ) {
            message.success("ESTA NO ES UNA EXCEPCIÓN c1");
            console.log("ESTA NO ES UNA EXCEPCIÓN c1");
            handleCancelModificar();
          } else {
            // Enviar el enpoint de Modificar
            EjecutarEnpointModificar();
            handleCancelModificar();
            closeModalVer();
            // Esperar 2 segundos antes de recargar la página
            setTimeout(() => {
              recargarPagina();
            }, 2000); // Puedes ajustar el tiempo en milisegundos
          }

          break;
        case "3":
          if (
            montoAprobado / 3 >= datosProductos[0].C3 &&
            datosProductos[0].C3 != 0
          ) {
            message.success("ESTA NO ES UNA EXCEPCIÓN c3");
            handleCancelModificar();
          } else {
            // Enviar el enpoint de Modificar
            // console.log("Se enviara: ");
            // console.log("idExcepcion: ", selectedRow.idExcepcion);
            // console.log("idDeudor: ", selectedRow.idDeudor);
            // console.log("idEntidad: ", selectedRow.idEntidadBancaria);
            // console.log("idGestor: ", user.idMovEmpleado);
            // console.log("fecha_aprobacion: ", fechaAprobada);
            // console.log("monto_aprobacion: ", montoAprobado);
            // console.log("cuota_aprobacion: ", cuotaAprobada);
            // console.log("gestor: ", user.alias);
            // console.log("detalle: ", "MODIFICADO");
            // console.log("observacion_ap", observacion2);
            EjecutarEnpointModificar();
            handleCancelModificar();
            closeModalVer();
            // Esperar 2 segundos antes de recargar la página
            setTimeout(() => {
              recargarPagina();
            }, 2000); // Puedes ajustar el tiempo en milisegundos
          }

          break;
        case "6":
          if (
            montoAprobado / 6 >= datosProductos[0].C6 &&
            datosProductos[0].C6 != 0
          ) {
            message.success("ESTA NO ES UNA EXCEPCIÓN c6");
            handleCancelModificar();
          } else {
            // Enviar el enpoint de Modificar
            // console.log("Se enviara: ");
            // console.log("idExcepcion: ", selectedRow.idExcepcion);
            // console.log("idDeudor: ", selectedRow.idDeudor);
            // console.log("idEntidad: ", selectedRow.idEntidadBancaria);
            // console.log("idGestor: ", user.idMovEmpleado);
            // console.log("fecha_aprobacion: ", fechaAprobada);
            // console.log("monto_aprobacion: ", montoAprobado);
            // console.log("cuota_aprobacion: ", cuotaAprobada);
            // console.log("gestor: ", user.alias);
            // console.log("detalle: ", "MODIFICADO");
            // console.log("observacion_ap", observacion2);
            EjecutarEnpointModificar();
            handleCancelModificar();
            closeModalVer();
            // Esperar 2 segundos antes de recargar la página
            setTimeout(() => {
              recargarPagina();
            }, 2000); // Puedes ajustar el tiempo en milisegundos
          }
          break;
        case "12":
          if (
            montoAprobado / 12 >= datosProductos[0].C12 &&
            datosProductos[0].C12 != 0
          ) {
            message.success("ESTA NO ES UNA EXCEPCIÓN c12");
            handleCancelModificar();
          } else {
            // Enviar el enpoint de Modificar
            // console.log("Se enviara: ");
            // console.log("idExcepcion: ", selectedRow.idExcepcion);
            // console.log("idDeudor: ", selectedRow.idDeudor);
            // console.log("idEntidad: ", selectedRow.idEntidadBancaria);
            // console.log("idGestor: ", user.idMovEmpleado);
            // console.log("fecha_aprobacion: ", fechaAprobada);
            // console.log("monto_aprobacion: ", montoAprobado);
            // console.log("cuota_aprobacion: ", cuotaAprobada);
            // console.log("gestor: ", user.alias);
            // console.log("detalle: ", "MODIFICADO");
            // console.log("observacion_ap", observacion2);
            EjecutarEnpointModificar();
            handleCancelModificar();
            closeModalVer();
            // Esperar 2 segundos antes de recargar la página
            setTimeout(() => {
              recargarPagina();
            }, 2000); // Puedes ajustar el tiempo en milisegundos
          }
          break;

        default:
          // Llama al enpoint de la api para hacer la modificacion
          // console.log("Se enviara: ");
          // console.log("idExcepcion: ", selectedRow.idExcepcion);
          // console.log("idDeudor: ", selectedRow.idDeudor);
          // console.log("idEntidad: ", selectedRow.idEntidadBancaria);
          // console.log("idGestor: ", user.idMovEmpleado);
          // console.log("fecha_aprobacion: ", fechaAprobada);
          // console.log("monto_aprobacion: ", montoAprobado);
          // console.log("cuota_aprobacion: ", cuotaAprobada);
          // console.log("gestor: ", user.alias);
          // console.log("detalle: ", "MODIFICADO");
          // console.log("observacion_ap", observacion2);
          EjecutarEnpointModificar();
          handleCancelModificar();
          closeModalVer();
          // Esperar 2 segundos antes de recargar la página
          setTimeout(() => {
            recargarPagina();
          }, 2000); // Puedes ajustar el tiempo en milisegundos

          break;
      }
    }
  };

  const handelConfirmacionModificar = () => {
    switch (cuotaAprobada) {
      case 1:
        if (
          montoAprobado >= datosProductos[0].C1 &&
          datosProductos[0].C1 != 0
        ) {
          message.success("ESTA NO ES UNA EXCEPCIÓN c1");
        } else {
          // Enviar el enpoint de Modificar
          // console.log("Se enviara: ");
          // console.log("idExcepcion: ", selectedRow.idExcepcion);
          // console.log("idDeudor: ", selectedRow.idDeudor);
          // console.log("idEntidad: ", selectedRow.idEntidadBancaria);
          // console.log("idGestor: ", user.idMovEmpleado);
          // console.log("fecha_aprobacion: ", fechaAprobada);
          // console.log("monto_aprobacion: ", montoAprobado);
          // console.log("cuota_aprobacion: ", cuotaAprobada);
          // console.log("gestor: ", user.alias);
          // console.log("detalle: ", "MODIFICADO");
          // console.log("observacion_ap", observacion2);
          EjecutarEnpointModificar();
          // Esperar 2 segundos antes de recargar la página
          setTimeout(() => {
            recargarPagina();
          }, 2000); // Puedes ajustar el tiempo en milisegundos
        }
        // CErrar modal de Confirmacion Modificar
        handleCancelModificar();
        break;
      case 3:
        if (
          montoAprobado / 3 >= datosProductos[0].C3 &&
          datosProductos[0].C3 != 0
        ) {
          message.success("ESTA NO ES UNA EXCEPCIÓN c3");
        } else {
          // Enviar el enpoint de Modificar
          // console.log("Se enviara: ");
          // console.log("idExcepcion: ", selectedRow.idExcepcion);
          // console.log("idDeudor: ", selectedRow.idDeudor);
          // console.log("idEntidad: ", selectedRow.idEntidadBancaria);
          // console.log("idGestor: ", user.idMovEmpleadoç);
          // console.log("fecha_aprobacion: ", fechaAprobada);
          // console.log("monto_aprobacion: ", montoAprobado);
          // console.log("cuota_aprobacion: ", cuotaAprobada);
          // console.log("gestor: ", user.alias);
          // console.log("detalle: ", "MODIFICADO");
          // console.log("observacion_ap", observacion2);
          EjecutarEnpointModificar();
          closeModalVer();
          // Esperar 2 segundos antes de recargar la página
          setTimeout(() => {
            recargarPagina();
          }, 2000); // Puedes ajustar el tiempo en milisegundos
        }

        break;
      case 6:
        if (
          montoAprobado / 6 >= datosProductos[0].C6 &&
          datosProductos[0].C6 != 0
        ) {
          message.success("ESTA NO ES UNA EXCEPCIÓN c6");
        } else {
          // Enviar el enpoint de Modificar
          // console.log("Se enviara: ");
          // console.log("idExcepcion: ", selectedRow.idExcepcion);
          // console.log("idDeudor: ", selectedRow.idDeudor);
          // console.log("idEntidad: ", selectedRow.idEntidadBancaria);
          // console.log("idGestor: ", user.idMovEmpleado);
          // console.log("fecha_aprobacion: ", fechaAprobada);
          // console.log("monto_aprobacion: ", montoAprobado);
          // console.log("cuota_aprobacion: ", cuotaAprobada);
          // console.log("gestor: ", user.alias);
          // console.log("detalle: ", "MODIFICADO");
          // console.log("observacion_ap", observacion2);
          EjecutarEnpointModificar();
          closeModalVer();
          // Esperar 2 segundos antes de recargar la página
          setTimeout(() => {
            recargarPagina();
          }, 2000); // Puedes ajustar el tiempo en milisegundos
        }
        break;
      case 12:
        if (
          montoAprobado / 12 >= datosProductos[0].C12 &&
          datosProductos[0].C12 != 0
        ) {
          message.success("ESTA NO ES UNA EXCEPCIÓN c12");
        } else {
          // Enviar el enpoint de Modificar
          // console.log("Se enviara: ");
          // console.log("idExcepcion: ", selectedRow.idExcepcion);
          // console.log("idDeudor: ", selectedRow.idDeudor);
          // console.log("idEntidad: ", selectedRow.idEntidadBancaria);
          // console.log("idGestor: ", user.idMovEmpleado);
          // console.log("fecha_aprobacion: ", fechaAprobada);
          // console.log("monto_aprobacion: ", montoAprobado);
          // console.log("cuota_aprobacion: ", cuotaAprobada);
          // console.log("gestor: ", user.alias);
          // console.log("detalle: ", "MODIFICADO");
          // console.log("observacion_ap", observacion2);
          EjecutarEnpointModificar();
          closeModalVer();
          // Esperar 2 segundos antes de recargar la página
          setTimeout(() => {
            recargarPagina();
          }, 2000); // Puedes ajustar el tiempo en milisegundos
        }
        break;

      default:
        // Llama al enpoint de la api para hacer la modificacion
        // console.log("Se enviara: ");
        // console.log("idExcepcion: ", selectedRow.idExcepcion);
        // console.log("idDeudor: ", selectedRow.idDeudor);
        // console.log("idEntidad: ", selectedRow.idEntidadBancaria);
        // console.log("idGestor: ", user.idMovEmpleado);
        // console.log("fecha_aprobacion: ", fechaAprobada);
        // console.log("monto_aprobacion: ", montoAprobado);
        // console.log("cuota_aprobacion: ", cuotaAprobada);
        // console.log("gestor: ", user.alias);
        // console.log("detalle: ", "MODIFICADO");
        // console.log("observacion_ap", observacion2);
        EjecutarEnpointModificar();
        handleCancelModificar();
        closeModalVer();
        // Esperar 2 segundos antes de recargar la página
        setTimeout(() => {
          recargarPagina();
        }, 2000); // Puedes ajustar el tiempo en milisegundos

        break;
    }
  };

  // Paa el cambio en el input de fecha aprobada:
  const onchangeFechaAprobada = (event) => {
    const nuevaFecha = event.target.value; // Captura el valor seleccionado
    setFechaAprobada(nuevaFecha); // Actualiza el estado
    console.log("Fecha seleccionada:", nuevaFecha); // Opcional: Para verificar
  };

  // Paa el cambio en el input monto aprobada:
  const onchangeMontoAprobado = (event) => {
    const valor = event.target.value;

    // Permitir números decimales válidos o vacío
    if (/^\d*\.?\d*$/.test(valor)) {
      setMontoAprobado(valor); // Actualiza el estado si el valor es válido
    }
  };

  // Paa el cambio en el input monto aprobada:
  const onchangeCuotaAprobada = (event) => {
    const valor = event.target.value;

    // Permitir solo números enteros positivos y no comenzar con 0
    if (/^[1-9]\d*$/.test(valor) || valor === "") {
      setCuotaAprobada(valor); // Actualiza el estado si es válido
    }
  };

  const validarTecla = (event) => {
    const teclasPermitidas = [
      "Backspace",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      ".",
    ];
    const esNumero = /^[0-9]$/;

    // Bloquear si no es número, punto, o tecla de control
    if (!teclasPermitidas.includes(event.key) && !esNumero.test(event.key)) {
      event.preventDefault();
    }

    // Bloquear más de un punto
    if (event.key === "." && montoAprobado.includes(".")) {
      event.preventDefault();
    }
  };

  //PAra la nueva cuota
  const bloquearTeclas = (event) => {
    const teclasPermitidas = ["Backspace", "Tab", "ArrowLeft", "ArrowRight"];
    const esNumeroValido = /^[1-9]$/.test(event.key);

    if (!teclasPermitidas.includes(event.key) && !esNumeroValido) {
      event.preventDefault();
    }
  };

  // Para abrir la pestaña nueva para el boton detalle
  const handelBotonDetalle = async () => {
    //Actualizar el cliente que estas elijiendo en el context
    // ENPOINT DONDE MANDO EL DOCUMENTO DEL CLIENTE Y USO UN GET CON LOS DATOS DEL CLIENTE
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/obtenerCliente/${
          selectedRow.DOCUMENTO
        }`
      );
      console.log("Datos obtenidos:", response.data.data[0]);
      setCliente(response.data.data[0]);
      message.success("Datos obtenidos correctamente");
      window.open("/expertisERP/detalleCliente", "_blank");
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      message.error("Error al obtener los datos");
    }
  };

  return (
    <div className=" flex flex-col gap-2">
      {/* Datos de los Productos */}
      <div className=" border-2 border-blue-950 rounded-lg p-2 text-xs">
        <h1 className="font-semibold">Productos</h1>
        {datosProductos.length > 0 ? (
          <div className="flex gap-5 p-2 mt-1">
            <div className="flex flex-col text-center bg-  w-1/3">
              <div className="flex gap-5">
                <label className="w-1/3"> CARTERA : </label>
                <label className="w-2/3 border-2 pl-5 text-center bg-green-100">
                  {" "}
                  {datosProductos[0].CARTERA}
                </label>
              </div>
              <div className="flex gap-5 ">
                <label className="w-1/3 text-center">CANAL : </label>
                <label className="w-2/3 border-2 text-center pl-5 bg-green-100">
                  {" "}
                  {datosProductos[0].AGENCIA}
                </label>
              </div>
            </div>
            <div className="flex flex-col bg-  w-1/3">
              <div className="flex gap-5">
                <label className="w-1/3 text-center"> ANTIGUEDAD : </label>
                <label className="w-2/3 border-2 pl-5 text-center bg-green-100">
                  {" "}
                  {datosProductos[0].ANTIGUEDAD}
                </label>
              </div>
              <div className="flex gap-5 ">
                <label className="w-1/3 text-center">JUDICIAL : </label>
                <label className="w-2/3 border-2 text-center pl-5 bg-green-100">
                  {" "}
                  {datosProductos[0].JUDICIAL}
                </label>
              </div>
            </div>
            <div className="flex flex-col bg-  w-1/3">
              <div className="flex gap-5">
                <label className="w-1/3 text-center"> DK ACTUAL : </label>
                <label className="w-2/3 border-2 pl-5 text-center bg-green-100">
                  {" "}
                  {datosProductos[0].DK}
                </label>
              </div>
              <div className="flex gap-5 ">
                <label className="w-1/3 text-center">DK TOTAL : </label>
                <label className="w-2/3 border-2 text-center pl-5 bg-green-100">
                  {" "}
                  {datosProductos[0].DT}
                </label>
              </div>
            </div>
          </div>
        ) : (
          <p>No hay productos para mostrar.</p>
        )}
        <h1 className="font-semibold mt-2 pl-10">Mínimo</h1>
        {datosProductos.length > 0 ? (
          <div className=" ">
            <div className="flex items-center gap-5 justify-end">
              <div className="flex  justify-center gap-5   p-2 mt-1 w-5/6">
                <div className="flex flex-col text-center   w-1/5">
                  <div className="flex gap-5 BG ">
                    <label className=" w-full border-2 pl-5 text-center bg-blue-950 text-white font-semibold">
                      MIN1
                    </label>
                  </div>
                  <div className="flex gap-5 ">
                    <label className="w-full border-2 text-center pl-5 ">
                      {typeof datosProductos[0].C1 === "number"
                        ? datosProductos[0].C1.toFixed(2)
                        : datosProductos[0].C1}
                    </label>
                  </div>
                </div>
                <div className="flex flex-col bg-  w-1/5">
                  <div className="flex gap-5">
                    <label className=" w-full border-2 pl-5 text-center bg-blue-950 text-white  font-semibold">
                      MIN2
                    </label>
                  </div>
                  <div className="flex gap-5 ">
                    <label className=" w-full border-2 text-center pl-5 ">
                      {typeof datosProductos[0].C1 === "number"
                        ? datosProductos[0].MIN2.toFixed(2)
                        : datosProductos[0].MIN2}
                    </label>
                  </div>
                </div>
                <div className="flex flex-col bg-  w-1/5">
                  <div className="flex gap-5">
                    <label className="w-full border-2 pl-5 text-center bg-blue-950 text-white font-semibold">
                      C3
                    </label>
                  </div>
                  <div className="flex gap-5 ">
                    <label className="w-full border-2 text-center pl-5 ">
                      {" "}
                      {typeof datosProductos[0].C1 === "number"
                        ? datosProductos[0].C3.toFixed(2)
                        : datosProductos[0].C3}
                    </label>
                  </div>
                </div>
                <div className="flex flex-col bg-  w-1/5">
                  <div className="flex gap-5">
                    <label className="w-full border-2 pl-5 text-center bg-blue-950 text-white font-semibold">
                      C6
                    </label>
                  </div>
                  <div className="flex gap-5 ">
                    <label className="w-full border-2 text-center pl-5 ">
                      {datosProductos[0].C6
                        ? typeof datosProductos[0].C6 === "number"
                          ? datosProductos[0].C6.toFixed(2)
                          : datosProductos[0].C6
                        : "-"}
                    </label>
                  </div>
                </div>
                <div className="flex flex-col bg-  w-1/5">
                  <div className="flex gap-5">
                    <label className="w-full border-2 pl-5 text-center bg-blue-950 text-white font-semibold">
                      C12
                    </label>
                  </div>
                  <div className="flex gap-5 ">
                    <label className="w-full border-2 text-center pl-5 ">
                    {datosProductos[0].C12
                        ? typeof datosProductos[0].C12 === "number"
                          ? datosProductos[0].C12.toFixed(2)
                          : datosProductos[0].C12
                        : "-"}
                    </label>
                  </div>
                </div>
              </div>
              <div>
                <Button onClick={handelBotonDetalle}>Detalle</Button>
              </div>
            </div>
          </div>
        ) : (
          <p>No hay productos para mostrar.</p>
        )}
      </div>

      {/* DAtos de la Excepcion */}
      <div className=" border-2 border-blue-950 rounded-lg p-2 text-xs">
        <h1 className="font-semibold">Datos</h1>

        {datosProductos.length > 0 ? (
          <>
            <div className="flex gap-5 p-2 mt-1">
              <div className="flex flex-col text-center bg-  w-1/2">
                <div className="flex gap-5">
                  <label className="w-1/3"> CODIGO IDC : </label>
                  <label className="w-2/3 border-2 pl-5 text-center bg-green-100">
                    {selectedRow.DOCUMENTO}
                  </label>
                </div>
                <div className="flex gap-5 ">
                  <label className="w-1/3 text-center">
                    FECHA POSIBLE PAGO: :{" "}
                  </label>
                  <label className="w-2/3 border-2 text-center pl-5 bg-green-100">
                    {selectedRow.FEC_EXCEPCION}
                  </label>
                </div>
                <div className="flex gap-5 items-center ">
                  <label className="w-1/3 text-center">
                    MONTO SOLICITADO (Total) :{" "}
                  </label>
                  <label className="w-2/3 border-2 text-center pl-5 bg-green-100">
                    {selectedRow.MONTO_SOLICITADO}
                  </label>
                </div>
              </div>
              <div className="flex flex-col bg-  w-1/2">
                <div className="flex gap-5">
                  <label className="w-1/3 text-center">
                    {" "}
                    FECHA EXCEPCIÓN :{" "}
                  </label>
                  <label className="w-2/3 border-2 pl-5 text-center bg-green-100">
                    {" "}
                    {selectedRow.FEC_EXCEPCION}
                  </label>
                </div>
                <div className="flex gap-5 ">
                  <label className="w-1/3 text-center">HORA EXCEPCIÓN : </label>
                  <label className="w-2/3 border-2 text-center pl-5 bg-green-100">
                    {" "}
                    {selectedRow.HORA_EXCEPCION}
                  </label>
                </div>
                <div className="flex gap-5 ">
                  <label className="w-1/3 text-center">
                    CUOTA SOLICITADA :{" "}
                  </label>
                  <label className="w-2/3 border-2 text-center pl-5 bg-green-100">
                    {" "}
                    {selectedRow.CUOTA_SOLICITADO}
                  </label>
                </div>
              </div>
            </div>
            {/* Para la opcion mofificar */}
            {banderaModificar ? (
              <div className=" flex  items-center justify-center pl-5 pr-5 mb-5 mt-4">
                <div className=" flex items-center gap-5 w-1/3">
                  <label className="font-semibold"> FECHA APROBADA</label>
                  <input
                    className="border-2 border-blue-900 rounded-md text-center"
                    type="date"
                    value={fechaAprobada}
                    onChange={onchangeFechaAprobada}
                    min={dayjs().format("YYYY-MM-DD")}
                    max={dayjs().endOf("month").format("YYYY-MM-DD")}
                  />
                </div>
                <div className=" flex items-center gap-5 w-1/3">
                  <label className="font-semibold"> MONTO APROBADO</label>
                  <input
                    className="border-2  border-blue-900 rounded-md text-center"
                    type="text"
                    value={montoAprobado}
                    onChange={onchangeMontoAprobado}
                    onKeyDown={validarTecla}
                  />
                </div>
                <div className="flex items-center gap-5 w-1/3">
                  <label className="font-semibold"> CUOTA APROBADA </label>
                  <input
                    className="border-2  border-blue-900 rounded-md text-center"
                    type="text"
                    value={cuotaAprobada}
                    onChange={onchangeCuotaAprobada}
                    onKeyDown={bloquearTeclas}
                  />
                </div>
              </div>
            ) : (
              <></>
            )}
          </>
        ) : (
          <p>No hay productos para mostrar.</p>
        )}
        <div>
          <div className="w-full flex gap-5  mb-5">
            <label className="w-2/12 flex  justify-center  items-center font-semibold">
              OBSERVACIÓN
            </label>
            <textarea
              className="w-10/12 p-2 pl-5  rounded-lg border-2"
              rows={6}
              onScroll={true}
              type="text"
              value={selectedRow.OBSERVACION.replaceAll("¦", "\n")}
            />
          </div>
        </div>
        <div>
          <div className="w-full flex gap-5  mb-5">
            <label className="w-2/12 flex  justify-center  items-center font-semibold">
              OBSERVACIÓN 2
            </label>
            <textarea
              className="w-10/12 p-2 pl-5  rounded-lg border-2"
              rows={3}
              type="text"
              value={observacion2}
              onChange={handleObservacionChange} // Actualiza el estado cuando el usuario escribe
            />
          </div>
        </div>
      </div>

      {/* Para los botones del formulario*/}
      <div className="flex justify-center  w-full">
        <div className="flex justify-between w-3/4 ">
          {banderaModificar ? (
            <></>
          ) : (
            <Button
              className="bg-blue-600 text-white"
              icon={<CheckCircleOutlined />}
              onClick={handleAprobar}
              disabled={banderaModificar ? true : false}
            >
              APROBAR
            </Button>
          )}
          {banderaModificar ? (
            <Button
              className="bg-green-600 text-white"
              icon={<FormOutlined />}
              onClick={handleAceptar}
              disabled={
                !fechaAprobada || !montoAprobado || !cuotaAprobada
                  ? true
                  : false
              }
            >
              ACEPTAR
            </Button>
          ) : (
            <Button
              className="bg-green-600 text-white"
              icon={<FormOutlined />}
              onClick={handleModificar}
            >
              MODIFICAR
            </Button>
          )}

          <Button
            className="bg-red-600 text-white"
            icon={<CloseCircleOutlined />}
            onClick={handleRechazar}
          >
            RECHAZAR
          </Button>
          <Button className="bg-gray-600 text-white" onClick={closeModalVer}>
            CERRAR
          </Button>
        </div>
      </div>
      <Modal
        title="Mensaje de confirmación"
        open={verModalConfirmacionAprobar}
        onCancel={handleCancelAprobar}
        footer={[
          <Button key="back" onClick={handleConfirmarAprobacion}>
            Confirmar
          </Button>,
          <Button key="back" onClick={handleCancelAprobar}>
            Cerrar
          </Button>,
        ]}
      >
        <p> El monto esta fuera del rango de autonomía ¿Deseas continuar?</p>
      </Modal>
      <Modal
        title="Mensaje de confirmación"
        open={verModalNegacionAprobar}
        onCancel={handleCancelNegacionAprobar}
        footer={[
          <Button key="back" onClick={handleCancelNegacionAprobar}>
            Aceptar
          </Button>,
        ]}
      >
        <p>
          {" "}
          El monto esta fuera del rango de autonomía. (Consultar con Cesar)
        </p>
      </Modal>
      {/*Modal para el mensaje de confirmacion en MODIFICAR*/}
      <Modal
        title="Mensaje de confirmación para modificar"
        open={verModalConfirmacionModificar}
        onCancel={handleCancelModificar}
        footer={[
          <Button
            className="bg-blue-500 text-white"
            key="back"
            onClick={handelConfirmacionModificar}
          >
            Sí
          </Button>,
          <Button key="back" onClick={handleCancelModificar}>
            No
          </Button>,
        ]}
      >
        <p> El monto esta fuera del rango de autonomía ¿Deseas continuar?</p>
      </Modal>
    </div>
  );
};

export default FormExcepcion;
