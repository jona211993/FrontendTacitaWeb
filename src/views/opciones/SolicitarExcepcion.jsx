/* eslint-disable react-hooks/exhaustive-deps */
import { DatePicker, InputNumber, Button, message, Descriptions } from "antd";
import { useEffect, useState } from "react";
import { Select, Input } from "antd";
import dayjs from "dayjs";
import { useData } from "../../context/DataContext.jsx";
import "../../styles/estlosAntDesginn.css";
import { useNavigate } from "react-router-dom";
import 'animate.css';

const { TextArea } = Input;

const SolicitarExcepcion = () => {
  const [fecha_pago, setFechaPago] = useState(dayjs());
  const [opciones, setOpciones] = useState([]);
  const [DatosProductos, setDatosProductos] = useState([]);
  const { productoscliente, cliente, user } = useData();
  const navigate = useNavigate();

  const todasLasOpciones = [
    "Dinero en mano",
    "Venta de vehículo",
    "Cosecha",
    "Recibirá junta",
    "Préstamo familiar",
    "Otros",
  ];
  const [tipificacion, setTipificacion] = useState("");
  const [cuota, setCuota] = useState(null);
  const [monto_pago, setMontoPago] = useState(null);
  const [monto_total, setMontoTotal] = useState("");
  const [monto_planilla, setMontoPlanilla] = useState("");
  const [opcionPlanilla, setOpcionPlanilla] = useState("NO");
  const [valorNumDeudas, setValorNumDeudas] = useState(0);
  const [sustentoFondos, setSustentoFondos] = useState(todasLasOpciones[0]);
  const [sustentoOtros, setSustentoOtros] = useState("");
  const [situacionActual, setSituacionActual] = useState("");
  const [observacion, setObservacion] = useState("");
  const [errors, setErrors] = useState({});

  // Función que verifica si la fecha seleccionada es el último día del mes
  const esUltimoDiaDelMes = (fecha) => {
    if (!fecha) return false;
    const ultimoDia = dayjs(fecha).endOf("month").date();
    return dayjs(fecha).date() === ultimoDia;
  };

  const itemsMinimos = [
    {
      key: "1",
      label: "MIN 1",
      children: DatosProductos.C1
        ? parseFloat(DatosProductos.C1)
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, "$&,")
        : "",
    },
    {
      key: "2",
      label: "MIN 2",
      children: DatosProductos.MIN2
        ? parseFloat(DatosProductos.MIN2)
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, "$&,")
        : "",
    },
    {
      key: "3",
      label: "C3",
      children: DatosProductos.C3
        ? parseFloat(DatosProductos.C3)
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, "$&,")
        : "",
    },
    {
      key: "4",
      label: "C6",
      children: DatosProductos.C6
        ? parseFloat(DatosProductos.C6)
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, "$&,")
        : "",
    },
    {
      key: "5",
      label: "C12",
      span: 2,
      children: DatosProductos.C12
        ? parseFloat(DatosProductos.C12)
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, "$&,")
        : "",
    },
  ];
  useEffect(() => {
    if (fecha_pago && esUltimoDiaDelMes(fecha_pago)) {
      setOpciones(todasLasOpciones.slice(1));
    } else {
      setOpciones(todasLasOpciones);
    }
  }, []);

  useEffect(() => {
    
    console.log("El valor actualizado de sustentoFondos es: ", sustentoFondos);
    console.log(
      "El valor actualizado de fecha pago: ",
      fecha_pago.format("YYYY-MM-DD")
    );
    console.log("El valor actualizado de tipificacion es: ", tipificacion);
    console.log("El valor actualizado de monto planilla es: ", monto_planilla);
    console.log("El valor actualizado de opcion planilla es: ", opcionPlanilla);
    console.log("El valor actualizado de sustento Otros es: ", sustentoOtros);
    console.log(
      "El valor actualizado de situación actual es: ",
      situacionActual
    );
    console.log("El valor actualizado de observación es: ", observacion);
    console.log("El valor actualizado de  num deudas  es: ", valorNumDeudas);
    console.log("El valor actualizado de monto total es: ", monto_total);
    setDatosProductos(productoscliente);
  }, [
    sustentoFondos,
    fecha_pago,
    tipificacion,
    monto_planilla,
    monto_pago,
    opcionPlanilla,
    sustentoFondos,
    sustentoOtros,
    situacionActual,
    monto_total,
    valorNumDeudas,
    observacion,
  ]);

  const handleChange = (value) => {
    setOpcionPlanilla(value);
    setMontoPlanilla("");
  };

  // Lógica condicional para el valor de cuota
  let inputProps = {
    value: cuota,
    onChange: setCuota,
    className: "w-25",
  };

  if (tipificacion === "PPC") {
    // Valor fijo y deshabilitado
    inputProps = {
      ...inputProps,
      value: 1,
      disabled: true,
    };
  } else if (tipificacion === "PPM") {
    // Establecer un valor mínimo de 2
    inputProps = {
      ...inputProps,
      min: 2,
    };
  }

  // PARA RESTRINGIR las fechas >= hoy y dentro del mes
  const disabledDate = (current) => {
    // Permitir solo fechas dentro del mes actual y mayores o iguales al día de hoy
    return (
      current.month() !== dayjs().month() || // No es el mes actual
      current.isBefore(dayjs().startOf("day")) // Es una fecha anterior a hoy
    );
  };

  // Para el numero de deudas:

  const handleChangeNumDeudas = (value) => {
    setValorNumDeudas(value);
  };

  const handleMontoPago = (value) => {
    console.log(value);
    setMontoPago(value);
    console.log(monto_pago);
  };

  const handleMontoTotal = (value) => {
    setMontoTotal(value);
  };

  const handleChangeSustentoFondos = (value) => {
    setSustentoFondos(value); // Actualiza el estado con la opción seleccionada
  };

  const handleChangeSustentoOtros = (value) => {
    // console.log("Tengooo en otro sustento: ", sustentoOtros);
    setSustentoOtros(value); // Actualiza el estado con la opción seleccionada
  };

  const handleTextAreaChange = (e) => {
    setSituacionActual(e.target.value); // Actualizamos el estado con el valor ingresado en el TextArea
  };

  const enviarSolicitud = async (
    idDeudor,
    idEntidadBancaria,
    idGestor,
    montoPago,
    Cuota,
    fechaPago,
    observacion,
    gestor
  ) => {
    // Crear el cuerpo de la solicitud
    const data = {
      idDeudor: idDeudor,
      idEntidadBancaria: idEntidadBancaria,
      idgestor: idGestor,
      monto_pago: montoPago,
      cuota: Cuota,
      fecha_pago: fechaPago.format("YYYY-MM-DD"), // Formateamos la fecha a "YYYY-MM-DD"
      observacion: observacion,
      gestor: gestor,
    };

    try {
      // Realizamos la solicitud con fetch
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/insertarExcepcion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // Convertimos el objeto 'data' a una cadena JSON
      });

      // Verificamos si la respuesta es exitosa
      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }

      // Parseamos la respuesta a JSON
      const result = await response.json();
      console.log("Respuesta de la API:", result);
    } catch (error) {
      // Manejo de errores
      console.error("Error:", error);
    }
  };

  const handelSolicitar = () => {
    if (validateFields()) {
      const montoPlanilla =
        monto_planilla !== undefined &&
        monto_planilla !== "" &&
        monto_planilla !== "NO"
          ? monto_planilla
          : "NO";

      // const fechaFormateada = dayjs(fecha_pago).format("YYYY-MM-DD");

      // let concatenado = `PLANILLA S/. ${montoPlanilla}¦ CANTIDAD DEUDAS: ${valorNumDeudas}¦ MONTO TOTAL DEUDAS: ${monto_total}¦SUSTENTO DE FONDOS: ${sustentoFondos}¦ SITUACION ACTUAL: ${situacionActual}`;
      // let concatenado2 = `PLANILLA: ${montoPlanilla}¦ CANTIDAD DEUDAS: ${valorNumDeudas}¦ MONTO TOTAL DEUDAS: ${monto_total}¦SUSTENTO DE FONDOS: ${sustentoFondos}¦ SITUACION ACTUAL: ${situacionActual}`;

      let concatenado = "";
      if (montoPlanilla === "NO") {
        concatenado =
          sustentoFondos === "Otros"
            ? `PLANILLA: ${montoPlanilla}¦ CANTIDAD DEUDAS: ${valorNumDeudas}¦ MONTO TOTAL DEUDAS: ${monto_total}¦SUSTENTO DE FONDOS: ${sustentoOtros}¦ SITUACION ACTUAL: ${situacionActual}`
            : `PLANILLA: ${montoPlanilla}¦ CANTIDAD DEUDAS: ${valorNumDeudas}¦ MONTO TOTAL DEUDAS: ${monto_total}¦SUSTENTO DE FONDOS: ${sustentoFondos}¦ SITUACION ACTUAL: ${situacionActual}`;
      } else {
        concatenado =
          sustentoFondos === "Otros"
            ? `PLANILLA S/. ${montoPlanilla}¦ CANTIDAD DEUDAS: ${valorNumDeudas}¦ MONTO TOTAL DEUDAS: ${monto_total}¦SUSTENTO DE FONDOS: ${sustentoOtros}¦ SITUACION ACTUAL: ${situacionActual}`
            : `PLANILLA S/. ${montoPlanilla}¦ CANTIDAD DEUDAS: ${valorNumDeudas}¦ MONTO TOTAL DEUDAS: ${monto_total}¦SUSTENTO DE FONDOS: ${sustentoFondos}¦ SITUACION ACTUAL: ${situacionActual}`;
      }

      console.log("Concatenado para observacion: ", concatenado);
      setObservacion(concatenado);
      // Para enviar el formulario
      // Validar El monto solictado / cuotas < MIN1 ... sino cumple lanzar alerta no es
      // una excepcion y no permitir registrar

      if (cuota === 1) {
        console.log("Estoy dentro del caso = cuota 1");
        const resultante1 = monto_pago / cuota;
        if (resultante1 < productoscliente.C1) {
          console.log("Registrar");
          console.log("SI ES UNA expcion");
          console.log("la observacion enviada es: ", observacion);
          console.log(monto_pago, cuota, fecha_pago.format("YYYY-MM-DD"));
          enviarSolicitud(
            cliente.ID_DEUDOR,
            cliente.ID_ENTIDAD,
            user.idMovEmpleado,
            monto_pago,
            cuota,
            fecha_pago,
            concatenado,
            user.alias
          );
          message.success("Registro exitoso!");
          // Retrasa la redirección por 2 segundos
          setTimeout(() => {
            navigate("/expertisERP/detalleCliente");
          }, 1500);
        } else {
          alert("NO ES UNA EXEPCION");
        }
      } else if (cuota === 3) {
        console.log("Estoy dentro del caso = cuota 3");
        const resultante3 = monto_pago / cuota;
        if (resultante3 < productoscliente.C3) {
          console.log("Registrar");
          console.log("SI ES UNA expcion");
          console.log("la observacion enviada es: ", observacion);
          console.log(monto_pago, cuota, fecha_pago.format("YYYY-MM-DD"));
          enviarSolicitud(
            cliente.ID_DEUDOR,
            cliente.ID_ENTIDAD,
            user.idMovEmpleado,
            monto_pago,
            cuota,
            fecha_pago,
            concatenado,
            user.alias
          );
          message.success("Registro exitoso!");
          // Retrasa la redirección por 2 segundos
          setTimeout(() => {
            navigate("/expertisERP/detalleCliente");
          }, 1500);
        } else {
          alert("NO ES UNA EXEPCION");
        }
      } else if (cuota === 6) {
        console.log("Estoy dentro del caso = cuota 6");
        const resultante6 = monto_pago / cuota;
        if (resultante6 < productoscliente.C6) {
          console.log("Registrar");
          console.log("Registrar");
          console.log("SI ES UNA expcion");
          console.log("la observacion enviada es: ", observacion);
          console.log(monto_pago, cuota, fecha_pago.format("YYYY-MM-DD"));
          enviarSolicitud(
            cliente.ID_DEUDOR,
            cliente.ID_ENTIDAD,
            user.idMovEmpleado,
            monto_pago,
            cuota,
            fecha_pago,
            concatenado,
            user.alias
          );
          message.success("Registro exitoso!");
          // Retrasa la redirección por 2 segundos
          setTimeout(() => {
            navigate("/expertisERP/detalleCliente");
          }, 1500);
        } else {
          alert("NO ES UNA EXEPCION");
        }
      } else if (cuota === 12) {
        console.log("Estoy dentro del caso = cuota 12");
        const resultante12 = monto_pago / cuota;
        console.log(monto_pago, cuota, resultante12, productoscliente.C12);
        if (resultante12 < productoscliente.C12) {
          console.log("Registrar");
          console.log("Registrar");
          console.log("SI ES UNA expcion");
          console.log("la observacion enviada es: ", observacion);
          console.log(monto_pago, cuota, fecha_pago.format("YYYY-MM-DD"));
          enviarSolicitud(
            cliente.ID_DEUDOR,
            cliente.ID_ENTIDAD,
            user.idMovEmpleado,
            monto_pago,
            cuota,
            fecha_pago,
            concatenado,
            user.alias
          );
          message.success("Registro exitoso!");
          // Retrasa la redirección por 2 segundos
          setTimeout(() => {
            navigate("/expertisERP/detalleCliente");
          }, 1500);
        } else {
          alert("NO ES UNA EXEPCION");
        }
      } else {
        console.log("Si es una excepcion");
        enviarSolicitud(
          cliente.ID_DEUDOR,
          cliente.ID_ENTIDAD,
          user.idMovEmpleado,
          monto_pago,
          cuota,
          fecha_pago,
          concatenado,
          user.alias
        );
        message.success("Registro exitoso!");
        // Retrasa la redirección por 2 segundos
        setTimeout(() => {
          navigate("/expertisERP/detalleCliente");
        }, 1500);
      }
    } else {
      message.error(
        "Por favor, complete todos los campos requeridos, no paso validacion de campos."
      );
    }
  };

  const handleMontoPlanilla = (value) => {
    setMontoPlanilla(value);
  };

  // Para validar Errorres:
  const validateFields = () => {
    const newErrors = {};

    // Validación de campos requeridos
    if (!tipificacion) newErrors.tipificacion = "Tipo es requerido.";
    if (!monto_pago) newErrors.monto_pago = "Campo requerido";

    if (tipificacion === "PPM" && !cuota)
      newErrors.cuota = "Campo requerido es una PPM";

    if (!fecha_pago) newErrors.fechaPago = "Debe elegir una fecha";

    if (opcionPlanilla === "SI" && !monto_planilla) {
      newErrors.montoPlanilla = "Debe introducir valor";
    }

    if (
      situacionActual.trim() === "" ||
      !/[a-zA-Z]/.test(situacionActual) ||
      situacionActual.replace(/[.\s]/g, "").length < 5
    ) {
      newErrors.situacionActual =
        "Debe completar este campo con al menos una palabra y una longitud mínima de 10 caracteres.";
    }

    if (sustentoFondos === "Otros" && sustentoOtros === "") {
      newErrors.sustentosOtros = "complete este campo por favor";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="bg-white flex flex-col items-center h-full animate__animated animate__fadeIn animate__faster ">
      <div>
        <h1 className="p-4  text-xl font-semibold font-roboto">
          SOLICITAR EXCEPCIÓN
        </h1>
      </div>

      <div className="w-full flex p-10 pt-0 gap-6 ">
        <div className="bg-gray-800 w-4/6 h-full rounded-3xl p-4">
          <div className="flex flex-col items-center gap-0">
            {errors.tipificacion && (
              <div className="m-0 text-red-400">{errors.tipificacion}</div>
            )}
            <div className=" flex w-full gap-5 p-5 justify-center ">
              <label className="text-white">TIPIFICACIÓN</label>
              <select
                value={tipificacion}
                onChange={(e) => {
                  setTipificacion(e.target.value);
                  if (e.target.value === "PPC") {
                    setCuota(1);
                  } else setCuota(2);
                }}
                className="mb-4 rounded-lg"
              >
                <option value="">Selecciona una opción</option>
                <option value="PPC">PPC</option>
                <option value="PPM">PPM</option>
              </select>
            </div>
          </div>

          <div className=" ">
            <div className="flex items-center  mb-4 w-full gap-3">
              <div className="flex flex-col items-center justify-center w-3/4">
                {errors.monto_pago && (
                  <div className="m-0 text-red-400">{errors.monto_pago}</div>
                )}
                <div className=" flex w-full gap-5 pl-4 items-center ">
                  <label className="text-white">
                    MONTO SOLICITADO (Total) :
                  </label>
                  <Input
                    className="w-52"
                    placeholder=""
                    type="text"
                    value={monto_pago}
                    onKeyDown={(e) => {
                      const char = e.key;
                      const value = e.target.value;

                      // Permitir números, un solo punto decimal, y las teclas de navegación/borrado
                      if (
                        !/^\d$/.test(char) && // No es un número
                        char !== "." && // No es un punto decimal
                        char !== "Backspace" && // Permitir borrar
                        char !== "Delete" && // Permitir borrar
                        char !== "ArrowLeft" && // Permitir mover el cursor a la izquierda
                        char !== "ArrowRight" && // Permitir mover el cursor a la derecha
                        char !== "Tab" // Permitir tabulador
                      ) {
                        e.preventDefault();
                      }

                      // Evitar más de un punto decimal
                      if (char === "." && value.includes(".")) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e) => {
                      // Obtener el texto del portapapeles
                      const pastedText = e.clipboardData.getData("Text");

                      // Validar si el texto pegado coincide con el formato numérico
                      if (!/^\d*\.?\d*$/.test(pastedText)) {
                        e.preventDefault(); // Evitar pegar si no coincide con el formato
                      }
                    }}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Validar el valor: vacío, número entero o decimal con un solo punto
                      if (value === "" || /^\d*\.?\d*$/.test(value)) {
                        handleMontoPago(value);
                      }
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col items-center justify-center w-1/4 ">
                {errors.cuota && (
                  <div className="m-0 text-red-400">{errors.cuota}</div>
                )}
                <div className=" flex w-full  pl-4  items-center">
                  <label className="text-white" >
                    NUM. CUOTAS :
                  </label>

                  {/* Input con lógica condicional */}
                  <InputNumber className="text-white" {...inputProps} />
                </div>
              </div>
            </div>


            <div className="flex w-full gap-11">
              <div className="w-3/4 flex flex-col items-center">
                {errors.fechaPago && (
                  <div className="m-0 text-red-400">{errors.fechaPago}</div>
                )}
                <div className=" flex w-full gap-24 pl-4 mb-4 items-center">
                  <label className="text-white ">FECHA DE PAGO:</label>
                  <DatePicker
                    disabledDate={disabledDate}
                    inputReadOnly={true}
                    defaultValue={fecha_pago} // Convierte la fecha en formato 'YYYY-MM-DD' a un objeto Day.js para el DatePicker
                    onChange={(value) => setFechaPago(value)} // Almacena la fecha seleccionada en formato 'YYYY-MM-DD'
                  />
                </div>
              </div>
              <div className=" flex flex-col  items-end">
                {errors.montoPlanilla && (
                  <div className="m-0 text-red-400">{errors.montoPlanilla}</div>
                )}
                <div className=" flex w-full gap-14 pl-4  mb-4  justify-start items-center">
                  <label className="text-white">PLANILLA:</label>
                  <Select
                    className="w-20"
                    options={[
                      {
                        value: "SI",
                        label: "SI",
                      },
                      {
                        value: "NO",
                        label: "NO",
                      },
                    ]}
                    defaultValue={"NO"}
                    onChange={handleChange} // Asignamos la función que actualiza el estado
                  ></Select>
                  {opcionPlanilla === "SI" && (
                    <Input
                      placeholder=""
                      type="text"
                      onKeyDown={(e) => {
                        const char = e.key;
                        const value = e.target.value;

                        // Permitir números, un solo punto decimal, y las teclas de navegación/borrado
                        if (
                          !/^\d$/.test(char) && // No es un número
                          char !== "." && // No es un punto decimal
                          char !== "Backspace" && // Permitir borrar
                          char !== "Delete" && // Permitir borrar
                          char !== "ArrowLeft" && // Permitir mover el cursor a la izquierda
                          char !== "ArrowRight" && // Permitir mover el cursor a la derecha
                          char !== "Tab" // Permitir tabulador
                        ) {
                          e.preventDefault();
                        }

                        // Evitar más de un punto decimal
                        if (char === "." && value.includes(".")) {
                          e.preventDefault();
                        }
                      }}
                      onPaste={(e) => {
                        // Obtener el texto del portapapeles
                        const pastedText = e.clipboardData.getData("Text");

                        // Validar si el texto pegado coincide con el formato numérico
                        if (!/^\d*\.?\d*$/.test(pastedText)) {
                          e.preventDefault(); // Evitar pegar si no coincide con el formato
                        }
                      }}
                      onChange={(e) => {
                        const value = e.target.value;

                        // Validar el valor: vacío, número entero o decimal con un solo punto
                        if (value === "" || /^\d*\.?\d*$/.test(value)) {
                          handleMontoPlanilla(value);
                        }
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-cyan-400 text-lg ml-5">Deudas </h2>
            <div className="flex pl-4 mt-5 gap-8 w-full  ">
              <div className=" flex items-center gap-32">
                <label className="text-white" htmlFor="">
                  Cantidad:
                </label>
                <InputNumber
                  min={0} // Valor mínimo permitido
                  value={valorNumDeudas}
                  onChange={handleChangeNumDeudas} // Función para manejar el cambio de valor
                  placeholder="Ingresa un número"
                  style={{ width:150 }} // Estilo opcional para el tamaño
                />
              </div>
              <div className="flex items-center gap-5 ">
                <label className="text-white  items-center" htmlFor="">
                  Monto Total:
                </label>
                <Input
                  placeholder=""
                  type="text"
                  onKeyDown={(e) => {
                    const char = e.key;
                    const value = e.target.value;

                    // Permitir números, un solo punto decimal, y las teclas de navegación/borrado
                    if (
                      !/^\d$/.test(char) && // No es un número
                      char !== "." && // No es un punto decimal
                      char !== "Backspace" && // Permitir borrar
                      char !== "Delete" && // Permitir borrar
                      char !== "ArrowLeft" && // Permitir mover el cursor a la izquierda
                      char !== "ArrowRight" && // Permitir mover el cursor a la derecha
                      char !== "Tab" // Permitir tabulador
                    ) {
                      e.preventDefault();
                    }

                    // Evitar más de un punto decimal
                    if (char === "." && value.includes(".")) {
                      e.preventDefault();
                    }
                  }}
                  onPaste={(e) => {
                    // Obtener el texto del portapapeles
                    const pastedText = e.clipboardData.getData("Text");

                    // Validar si el texto pegado coincide con el formato numérico
                    if (!/^\d*\.?\d*$/.test(pastedText)) {
                      e.preventDefault(); // Evitar pegar si no coincide con el formato
                    }
                  }}
                  onChange={(e) => {
                    const value = e.target.value;

                    // Validar el valor: vacío, número entero o decimal con un solo punto
                    if (value === "" || /^\d*\.?\d*$/.test(value)) {
                      handleMontoTotal(value);
                    }
                  }}
                  style={{ width:150 }} // Estilo opcional para el tamaño
                />
              </div>
            </div>
          </div>
          <div>

            <div className="flex  flex-col ml-5 mt-5 gap-8">
              <div className=" flex gap-7">
                <label className="text-white" htmlFor="">
                  SUSTENTO DE FONDOS :
                </label>
                <Select
                  className="w-44 "                 
                  onChange={(value) => {
                    handleChangeSustentoFondos(value);
                  }}
                  placeholder="Selecciona una opción"
                  value={sustentoFondos} // Asignamos el valor del estado al Select
                >
                  {opciones.map((opcion, index) => (
                    <Select.Option key={index} value={opcion}>
                      {opcion}
                    </Select.Option>
                  ))}
                </Select>
              </div>
              {sustentoFondos === "Otros" && (
                <div className="flex flex-col gap-3">
                  <label className="text-white">Otro sustento:</label>
                  <Input
                    className="w-3/4"
                    
                    onChange={(event) => {
                      // Obtén el valor del input desde event.target.value
                      const value = event.target.value;
                      // Validar el valor: vacío, número entero o decimal con un solo punto
                      handleChangeSustentoOtros(value);
                    }}
                  />
                  {errors.sustentosOtros && (
                    <div className="m-0 text-red-400">
                      {errors.sustentosOtros}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex  flex-col ml-5 mt-5 gap-4">
            <label className="text-white" htmlFor="">
              SITUACIÓN ACTUAL
            </label>
            <TextArea
              rows={4}
              value={situacionActual} // Muestra el valor del estado en el TextArea
              onChange={handleTextAreaChange} // Actualiza el estado cuando cambias el contenido del TextArea
              placeholder="Escribe aquí la situación actual"
            />
            {errors.situacionActual && (
              <div className="m-0 text-red-400">{errors.situacionActual}</div>
            )}
          </div>
          <div className=" flex items-center justify-center mt-5">
            <Button type="primary" onClick={handelSolicitar}>
              SOLICITAR
            </Button>
          </div>
        </div>
        {/* COlumna 2 */}
        <div className="w-2/6 flex  flex-col items-center justify-center b ">

          <div className="w-2/3  ">
            <h1 className="m-1 mb-3 font-bold text-lg">Datos de los Productos</h1>
            <Descriptions
              layout="vertical"
              bordered
              items={itemsMinimos}
              column={2}
              className="custom-descriptions" // Aplica clase personalizada
            />
          </div>

          <div className="w-2/3 h-1/2 flex items-center  justify-center ">
            <img src="/../src/images/Robot3D.gif" alt="logo" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolicitarExcepcion;
