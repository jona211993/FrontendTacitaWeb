/* eslint-disable react-hooks/exhaustive-deps */
import { Descriptions, DatePicker } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Select,
  Input,
  InputNumber,
  Checkbox,
  Radio,
  Button,
  message,
} from "antd";
import { useData } from "../../context/DataContext.jsx";
import useCurrentTime from "../../components/useCurrentTime.jsx";
import "../../styles/estlosAntDesginn.css";
import dayjs from "dayjs";
import "animate.css";

const { Option } = Select;
const { TextArea } = Input;
const IngresarGestion = () => {
  const navigate = useNavigate();

  const [selectedOption, setSelectedOption] = useState("CELULAR");
  const [fixedNumber, setFixedNumber] = useState("");
  const [cellNumber, setCellNumber] = useState("");
  // pARA LOS DE NIVEL 1 Y 2
  const [nivel1SelectValue, setNivel1SelectValue] = useState("");
  const [nivel2SelectValue, setNivel2SelectValue] = useState("");
  const [nivel3SelectValue, setNivel3SelectValue] = useState("");
  const [opcionesNivel4, setOpcionesNivel4] = useState([]);
  const [nivel4SelectValue, setNivel4SelectValue] = useState(
    opcionesNivel4.length > 0 ? opcionesNivel4[0].descripcion : null
  );

  const [cuotas, setCuotas] = useState(1);
  const [horaInicio, sethorainicio] = useState("");
  const [fecCompromiso, setFecCompromiso] = useState(
    dayjs().format("YYYY-MM-DD")
  );

  const [fechaActual, setFechaActual] = useState("");
  //dayjs().format("YYYY-MM-DD")

  // Checkbox de preguntas para observacion
  const [comunicacionConTitular, setComunicacionConTitular] = useState(null); // Estado inicial
  // Checkbox de preguntas para observacion
  const [numeroAdicional, setNumeroAdicional] = useState(null); // Estado inicial
  // Para el campo observacion
  const [observacion, setObservacion] = useState("");
  // Para el Inbound o outbound
  const [tipoInbound, setTipoInbound] = useState("");
  const [tipoBoundSelectValue, setTipoBound1SelectValue] = useState(null);
  const [opcionesInbound, setOpcionesInbound] = useState([]);
  const { cliente, user, productoscliente } = useData();
  const [loading, setLoading] = useState(true);

  // Estado parta campo de input de nombre de tercero
  const [inputValueNombreTercero, setInputValueNombreTercero] = useState("");

  // Estado parta campo de input de nombre de tercero
  const [montoTotalNegociado, setMontoTotalNegociado] = useState(0);
  const [montoMes, setMontoMes] = useState(0);
  const [horarioPago, setHorarioPago] = useState("Mañana");

  //Agregamos los campos adicionale:
  const [mto_adelanto, setMontoAdelanto] = useState(0);
  const [fec_adelanto, setFecAdelanto] = useState(null);

  //Agregamos los campos adicionales para los de RPP:
  const [confirmacionDePago, setConfirmacionDePago] = useState(0);
  const [clienteAbono, setClienteAbono] = useState(null);
  const [reprogramacionDePago, setReprogramacionDePago] = useState(null);
  const [canalEnvio, setCanalEnvio] = useState("Llamada");

  const [inputValueParentescoTercero, setInputValueParentescoTercero] =
    useState("");

  //Estado de Nota
  const [nota, setNota] = useState("");
  const [errors, setErrors] = useState({});

  //Para el checbox de Adelanto:
  const [adelantoChecked, setAdelantoChecked] = useState(false);

  useEffect(() => {
    const hoy = new Date().toISOString().split("T")[0];
    setFechaActual(hoy);
  }, []);

  const handleCheckboxChange = (e) => {
    setAdelantoChecked(e.target.checked);
    console.log(adelantoChecked);
    if (adelantoChecked === true) {
      setFecAdelanto(null);
      setMontoAdelanto(0);
    }
  };
  // Para la hora:
  const { currentTime } = useCurrentTime();
  const date = new Date(currentTime); // Convierte a objeto Date

  // Para validar Errorres:
  const validateFields = () => {
    const newErrors = {};

    // Validación de campos requeridos
    if (!nivel2SelectValue) newErrors.nivel2 = "Nivel 2 es requerido.";
    if (nivel2SelectValue === "MCT" && !nivel4SelectValue)
      newErrors.nivel4 = "Nivel 4 es requerido.";

    if (nivel2SelectValue === "PAR" && (!horarioPago || !montoTotalNegociado))
      newErrors.horarioPagoOMontoTotal = "Campo requerido.";

    if (nivel4SelectValue === "Familiar" && !inputValueNombreTercero) {
      newErrors.nombreTercero = "Nombre de tercero es requerido.";
    }
    if (nivel4SelectValue === "Familiar" && !inputValueParentescoTercero) {
      newErrors.parentescoTercero = "Parentesco de tercero es requerido.";
    }

    if (nivel2SelectValue === "MCT" && comunicacionConTitular === null)
      newErrors.comunicacion = "Este campo es requerido CT.";
    if (nivel2SelectValue === "MCT" && numeroAdicional === null)
      newErrors.numeroAdicional = "Este campo es requerido NA.";

    if (!cellNumber || cellNumber.length !== 9) {
      newErrors.cellNumber =
        "Este campo es requerido y debe tener 9 caracteres.";
    }

    if (
      (selectedOption === "NUM_FIJO" && !fixedNumber) ||
      (selectedOption === "NUM_FIJO" && fixedNumber === "")
    ) {
      newErrors.fixedNumber = "Este campo es requerido num fijo";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateFields()) {
      // Aquí puedes manejar el envío de datos
      message.success("Formulario enviado con éxito!");
      const data = {
        idDeudor: cliente.ID_DEUDOR,
        idGestor: user.idMovEmpleado,
        documento: cliente.DOCUMENTO,
        cartera: cliente.CARTERA,
        gestor: user.alias,
        numero: cellNumber,
        nvl2: nivel2SelectValue,
        fec_compromiso: fecCompromiso,
        cuotas:
          nivel2SelectValue === "PAR" ||
          nivel2SelectValue === "PPC" ||
          nivel2SelectValue === "PPM"
            ? cuotas
            : 0,
        hora_inicio: horaInicio,
        monto_mes: montoMes,
        monto_total: cuotas * montoMes,
        observacion: observacion,
        tipo_llamada:
          tipoBoundSelectValue === "INBOUND"
            ? "I"
            : tipoBoundSelectValue === "OUTBOUND"
            ? "O"
            : null,
        tipo_inbound: tipoInbound,
        nvl1: nivel1SelectValue,
        idRelacionDeudor: 0,
        fec_adelanto: fec_adelanto,
        mto_adelanto: mto_adelanto,
      };
      console.log(
        "Estos serian los elementos que estamos enviando por el formulario: \n",
        "idDeudor:",
        cliente.ID_DEUDOR,
        "\n",
        "idGestor:",
        user.idMovEmpleado,
        "\n",
        "documento:",
        cliente.DOCUMENTO,
        "\n",
        "cartera:",
        cliente.CARTERA,
        "\n",
        "gestor:",
        user.alias,
        "\n",
        "numero:",
        cellNumber,
        "\n",
        "nvl2:",
        nivel2SelectValue,
        "\n",
        "fec_compromiso:",
        fecCompromiso ? dayjs(fecCompromiso).format("YYYY-MM-DD") : null,
        "\n",
        "cuotas:",
        cuotas,
        "\n",
        "hora_inicio:",
        horaInicio,
        "\n",
        "monto_mes:",
        montoMes,
        "\n",
        "monto_total:",
        cuotas * montoMes,
        "\n",
        "observacion:",
        observacion,
        "\n",
        "tipo_llamada:",
        tipoBoundSelectValue,
        "\n",
        "tipo_inbound:",
        tipoInbound,
        "\n",
        "nvl1:",
        nivel1SelectValue,
        "\n",
        "idRelacionDeudor:",
        0,
        "\n",
        "fec_adelanto:",
        fec_adelanto ? dayjs(fec_adelanto).format("YYYY-MM-DD") : null,
        "\n",
        "mto_adelanto:",
        mto_adelanto,
        "\n"
      );
      //Para insertar segun los datos:
      switch (nivel2SelectValue) {
        case "PAR":
          try {
            // Enviar los datos a la API usando fetch
            const response = await fetch(
              `${import.meta.env.VITE_BACKEND_URL}/insertarGestionesPDP`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
              }
            );

            const result = await response.json();

            if (response.ok) {
              // Si el insert fue exitoso, muestra un mensaje o realiza alguna acción
              console.log("Insert exitoso", result);
              message.success("Registro exitoso!");
              // Retrasa la redirección por 2 segundos
              setTimeout(() => {
                navigate("/expertisERP/detalleCliente");
              }, 1500);
            } else {
              // Si hubo un error, maneja el error
              console.error("Error en el insert", result);
              alert("Hubo un error al insertar la gestión");
            }
          } catch (error) {
            console.error("Error de red o servidor:", error);
            alert("Error al conectar con la API");
          }
          break;
        case "PPC":
          try {
            // Enviar los datos a la API usando fetch
            const response = await fetch(
              `${import.meta.env.VITE_BACKEND_URL}/insertarGestionesPDP`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
              }
            );

            const result = await response.json();

            if (response.ok) {
              // Si el insert fue exitoso, muestra un mensaje o realiza alguna acción
              console.log("Insert exitoso", result);
              alert("Gestión insertada exitosamente");
            } else {
              // Si hubo un error, maneja el error
              console.error("Error en el insert", result);
              alert("Hubo un error al insertar la gestión");
            }
          } catch (error) {
            console.error("Error de red o servidor:", error);
            alert("Error al conectar con la API");
          }
          break;
        case "PPM":
          try {
            // Enviar los datos a la API usando fetch
            const response = await fetch(
              `${import.meta.env.VITE_BACKEND_URL}/insertarGestionesPDP`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
              }
            );

            const result = await response.json();

            if (response.ok) {
              // Si el insert fue exitoso, muestra un mensaje o realiza alguna acción
              console.log("Insert exitoso", result);
              alert("Gestión insertada exitosamente");
            } else {
              // Si hubo un error, maneja el error
              console.error("Error en el insert", result);
              alert("Hubo un error al insertar la gestión");
            }
          } catch (error) {
            console.error("Error de red o servidor:", error);
            alert("Error al conectar con la API");
          }
          break;
        case "VLL":
          try {
            // Enviar los datos a la API usando fetch
            const response = await fetch(
              `${import.meta.env.VITE_BACKEND_URL}/insertarGestionesPDP`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
              }
            );

            const result = await response.json();

            if (response.ok) {
              // Si el insert fue exitoso, muestra un mensaje o realiza alguna acción
              console.log("Insert exitoso", result);
              alert("Gestión insertada exitosamente");
            } else {
              // Si hubo un error, maneja el error
              console.error("Error en el insert", result);
              alert("Hubo un error al insertar la gestión");
            }
          } catch (error) {
            console.error("Error de red o servidor:", error);
            alert("Error al conectar con la API");
          }
          break;
        case "RPP":
          try {
            // Enviar los datos a la API usando fetch
            const response = await fetch(
              `${import.meta.env.VITE_BACKEND_URL}/insertarGestionesPDP`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
              }
            );

            const result = await response.json();

            if (response.ok) {
              // Si el insert fue exitoso, muestra un mensaje o realiza alguna acción
              console.log("Insert exitoso", result);
              alert("Gestión insertada exitosamente");
            } else {
              // Si hubo un error, maneja el error
              console.error("Error en el insert", result);
              alert("Hubo un error al insertar la gestión");
            }
          } catch (error) {
            console.error("Error de red o servidor:", error);
            alert("Error al conectar con la API");
          }
          break;
        default:
          try {
            // Enviar los datos a la API usando fetch
            const response = await fetch(
              `${import.meta.env.VITE_BACKEND_URL}/insertarGestionesNoPDP`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
              }
            );

            const result = await response.json();

            if (response.ok) {
              // Si el insert fue exitoso, muestra un mensaje o realiza alguna acción
              console.log("Insert exitoso", result);
              alert("Gestión NO PDP insertada exitosamente");
            } else {
              // Si hubo un error, maneja el error
              console.error("Error en el insert", result);
              alert("Hubo un error al insertar la gestión NO PDP");
            }
          } catch (error) {
            console.error("Error de red o servidor:", error);
            alert("Error al conectar con la API");
          }
          break;
      }
      // Reiniciar los campos si es necesario
    } else {
      message.error("Por favor, complete todos los campos requeridos.");
      console.log(errors);
    }
  };

  const handleTipoBoundChange = (value) => {
    setTipoBound1SelectValue(value);
    setTipoInbound("");
    setOpcionesInbound(null); // Reset the second select when the first select changes
    setObservacion("");
  };

  const getOpcionesInbound = () => {
    switch (tipoBoundSelectValue) {
      case "INBOUND":
        return [
          "CARTA",
          "AGENCIA",
          "SMS",
          "REPROGRAMACION",
          "CORREO",
          "ASIGNADO",
          "PREFIJO",
        ];

      default:
        return [];
    }
  };

  const handleFirstSelectChange = (value) => {
    console.log("Se elejio algo nuevo en nivel 1", value);
    setNivel1SelectValue(value);
    setNivel2SelectValue(null); // Reset the second select when the first select changes
    console.log("En este mosneto n2 es: ", nivel2SelectValue);
    setObservacion("");
    console.log("En este mosneto observacon es: ", observacion);
  };

  const handleHorrarioPagoSelectChange = (value) => {
    setHorarioPago(value);
  };
  const handleMontoNegociadoChange = (value) => {
    console.log(value);
    setMontoTotalNegociado(value);
  };

  const handleMontoMesChange = (value) => {
    console.log(value);
    setMontoMes(value);
  };

  const handleCanalEnvioSelectChange = (value) => {
    console.log(value);
    setCanalEnvio(value);
  };

  const getSecondSelectOptions = () => {
    switch (nivel1SelectValue) {
      case "CONTACTO EFECTIVO":
        return ["PAR", "PPC", "PPM", "REN", "RPP", "TAT", "VLL", "CAN", "REC"];
      case "CONTACTO NO EFECTIVO":
        return ["FAL", "MCT"];
      case "NO CONTACTO":
        return ["NOC", "GBR", "ILC", "DES", "NTT", "HOM"];
      default:
        return [];
    }
  };

  const getNivel4SelectOptions = () => {
    switch (nivel2SelectValue) {
      case "MCT":
        return [
          "Familiar",
          "Conocido",
          "Línea a nombre del titular según SEARCH",
        ];

      default:
        return [];
    }
  };

  const handleSelectChange = (value) => {
    setSelectedOption(value);
    // Reset the inputs when changing selection
    if (value === "NUMERO_VACIO") {
      setFixedNumber("");
      setCellNumber("");
    }
  };

  // funcion para obtener la fecha del sistema
  const getCurrentDate = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0"); // Día
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Mes (0-11)
    const year = now.getFullYear(); // Año
    return `${day}-${month}-${year}`; // Formato DD-MM-YYYY
  };

  // funcion para obtener la hora del sistema
  const getCurrentTime = () => {
    date.toLocaleString();
    // console.log(date.toLocaleString())
    return date.toLocaleString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // Para formato de 24 horas
    });
  };

  const items = [
    {
      key: "1",
      label: "Nombre Asesor",
      children: user.alias,
    },
    {
      key: "2",
      label: "Fecha Actual",
      children: getCurrentDate(),
    },
    {
      key: "3",
      label: "Hora Inicio",
      children: getCurrentTime(),
    },
    {
      key: "4",
      label: "Doc Titular",
      children: cliente.DOCUMENTO,
    },
    {
      key: "5",
      label: "Nombre TT/ Razon Social",
      children: cliente.NOMBRE_COMPLETO,
    },
    {
      key: "6",
      label: "Cartera",
      children: cliente.CARTERA,
    },
    // COlocar de los productos el canal
    {
      key: "7",
      label: "Canal",
      children: productoscliente.AGENCIA,
    },
  ];

  // DEl checBox de MCT - CONOCIDO :
  const onChangeComunicarConTitular = (e) => {
    setComunicacionConTitular(e.target.value); // Guardar la opción seleccionada
  };
  // DEl checBox de MCT - CONOCIDO :
  const onChangeNumeroAdicional = (e) => {
    setNumeroAdicional(e.target.value); // Guardar la opción seleccionada
  };

  // DEl checBox de MCT - CONOCIDO :
  const onChangeNota = (e) => {
    setNota(e.target.value); // Guardar la opción seleccionada
  };

  // DEl checBox de RPP - Clienter abono?  :
  const onChangeClienteAbono = (e) => {
    setClienteAbono(e.target.value); // Guardar la opción seleccionada
  };
  // DEl checBox de RPP - Confirmacion de pago?  :
  const onChangeConfirmacionDePago = (e) => {
    setConfirmacionDePago(e.target.value); // Guardar la opción seleccionada
    setReprogramacionDePago(null);
    setFecCompromiso(null);
  };

  // DEl checBox de RPP - Reprogramacion de Pago?  :
  const onChangeReprogramacionDePago = (e) => {
    setReprogramacionDePago(e.target.value); // Guardar la opción seleccionada
    setFecCompromiso(null);
  };

  // Para el campo nombre de tercero familiar- nom ercero
  const handleChangeNombreTercero = (event) => {
    const nuevoValor = event.target.value;
    // Actualiza el estado correspondiente (puedes ajustar esto según tu lógica)
    setInputValueNombreTercero(nuevoValor);
    setObservacion(
      `Tipo de tercero - ${nivel4SelectValue}: ${inputValueNombreTercero}__${inputValueParentescoTercero} / Se comunicará con Titular - ${comunicacionConTitular}`
    ); // Actualiza observacion concatenando estado1 y el nuevo valor
  };

  // Para el campo nombre de tercero familiar- nom ercero
  const handleChangeParentescoTercero = (event) => {
    const nuevoValor = event.target.value;
    // Actualiza el estado correspondiente (puedes ajustar esto según tu lógica)
    setInputValueParentescoTercero(nuevoValor);
    setObservacion(`Tipo de tercero - ${nivel4SelectValue}: ${inputValueNombreTercero}__${inputValueParentescoTercero}/
      Se comunicará con Titular - ${comunicacionConTitular}`); // Actualiza observacion concatenando estado1 y el nuevo valor
  };

  useEffect(() => {
    sethorainicio(getCurrentTime());
    if (
      nivel2SelectValue === "FAL" ||
      nivel2SelectValue === "CAN" ||
      nivel1SelectValue === "NO CONTACTO" ||
      nivel1SelectValue === "CONTACTO EFECTIVO"
    ) {
      console.log("blanqueamos por FAL NC CEF");

      setObservacion("");
    }
    if (!nivel1SelectValue) {
      setObservacion("");
    }

    if (nivel4SelectValue === "Familiar") {
      setObservacion(
        `Tipo de tercero - ${nivel4SelectValue}: ${inputValueNombreTercero}_${inputValueParentescoTercero} / Se comunicará con Titular - ${comunicacionConTitular} / Número adicional - ${numeroAdicional} / NOTA: ${nota}`
      );
    }
    if (nivel4SelectValue === "Conocido") {
      setObservacion(
        `Tipo de tercero - ${nivel4SelectValue} / Se comunicará con Titular - ${comunicacionConTitular} / Número adicional - ${numeroAdicional} / NOTA: ${nota}`
      );
    }

    if (!nivel2SelectValue) {
      setObservacion("");
    }

    if (nivel2SelectValue === "PAR") {
      setObservacion(
        `MONTO TOTAL NEGOCIADO: ${montoTotalNegociado} / HORARIO DE PAGO: ${horarioPago} / NOTA: ${nota}`
      );
    } else if (nivel2SelectValue === "FAL") {
      setObservacion("");
    }
    if (nivel2SelectValue === "PPC") {
      setObservacion(
        `${nivel3SelectValue} - ${nivel4SelectValue} / HORARIO DE PAGO: ${horarioPago} / NOTA: ${nota}`
      );
    }
    if (nivel2SelectValue === "PPM") {
      setNivel4SelectValue("Liquidación, AFP, ahorros");
      console.log("va a ir en ppm --- ", nivel4SelectValue);
      setObservacion(
        `${nivel3SelectValue} - ${nivel4SelectValue} / HORARIO DE PAGO: ${horarioPago} / NOTA: ${nota}`
      );

      setNivel4SelectValue(nivel4SelectValue);
    }
    if (nivel2SelectValue === "REN") {
      setObservacion(`${nivel3SelectValue} - ${nivel4SelectValue}`);
    }
    if (nivel2SelectValue === "RPP") {
      if (confirmacionDePago === "SI") {
        setObservacion(
          `Cliente abonó - ${clienteAbono} / Confirmación de pago - ${confirmacionDePago} / CANAL ENVO - ${canalEnvio} / NOTA: ${nota}`
        );
      } else {
        setObservacion(
          `Cliente abonó - ${clienteAbono} / Confirmación de pago - ${confirmacionDePago} / Reprogación de pago - ${reprogramacionDePago} / CANAL ENVO - ${canalEnvio} / NOTA: ${nota}`
        );
      }
    }
    if (nivel2SelectValue === "TAT") {
      setObservacion(
        `${nivel3SelectValue} - ${nivel4SelectValue} / NOTA: ${nota}`
      );
    }
    if (nivel2SelectValue === "VLL") {
      setObservacion(
        `${nivel3SelectValue} - ${nivel4SelectValue} /MONTO TOTAL NEGOCIADO: ${montoTotalNegociado} / NOTA: ${nota}`
      );
    }
    if (nivel2SelectValue === "REC") {
      setObservacion(`${nivel3SelectValue} - ${nivel4SelectValue}`);
    }

    const fetchNivel3 = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/obtenerListaNivel3`,
          { nivel2: nivel2SelectValue }
        );
        console.log(response.data.data[0].descripcion);
        setNivel3SelectValue(response.data.data[0].descripcion); // Asumiendo que el valor deseado está en response.data.nivel3
      } catch (error) {
        console.error("Error al obtener nivel3:", error);
      }
    };

    if (nivel2SelectValue) {
      fetchNivel3(); // Solo llamamos a la API si nivel2 tiene un valor
    }

    // Para lo de nivel 4
    const fetchOptions = async () => {
      if (nivel3SelectValue != "" && nivel3SelectValue) {
        try {
          console.log("entra como nivel 3: ", nivel3SelectValue);
          const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/obtenerListaNivel4`,
            { nivel3: nivel3SelectValue }
          ); // Cambia esto a tu URL de API
          //  console.log("aui en front n4,,, ", response.data.data)
          const fetchedOptions = response.data.data.map((item) => ({
            descripcion: item.descripcion, // Suponiendo que la API devuelve el campo 'descripcion'
          }));
          console.log("rrr- ", fetchedOptions);
          setOpcionesNivel4(fetchedOptions);
          console.log(
            "actualmente opciones de nivel 4 son:",
            opcionesNivel4[0].descripcion
          );
        } catch (error) {
          console.error("Error al obtener las opciones:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchOptions();
  }, [
    nivel1SelectValue,
    nivel2SelectValue,
    nivel3SelectValue,
    nivel4SelectValue,
    inputValueNombreTercero,
    inputValueParentescoTercero,
    comunicacionConTitular,
    numeroAdicional,
    observacion,
    nota,
    montoTotalNegociado,
    horarioPago,
    tipoBoundSelectValue,
    opcionesInbound,
    loading,
    selectedOption,
    montoMes,
    fecCompromiso,
    clienteAbono,
    confirmacionDePago,
    reprogramacionDePago,
    canalEnvio,
  ]);

  // para limiar al cambiar nivel2
  const handleNivel2SelectChange = (value) => {
    setObservacion("");
    setNivel2SelectValue(value);
    setHorarioPago("Mañana");
    setComunicacionConTitular(null); // Resetear checkbox
    setNumeroAdicional(null); // Resetear checkbox
    setNota(""); // Limpiar nota
    setNivel4SelectValue("");
    setMontoTotalNegociado("");
    setMontoMes(0);
    setCuotas(1);
    setFecCompromiso(null);
    setFecAdelanto(null);
    setMontoAdelanto(0);
    setClienteAbono(null);
    setConfirmacionDePago(null);
    setReprogramacionDePago(null);
  };

  // PARA RESTRINGIR las fechas >= hoy y dentro del mes
  const disabledDate = (current) => {
    // Permitir solo fechas dentro del mes actual y mayores o iguales al día de hoy
    return (
      current.month() !== dayjs().month() || // No es el mes actual
      current.isBefore(dayjs().startOf("day")) // Es una fecha anterior a hoy
    );
  };

  // Función para guardar en localStorage
  const guardarEnLocalStorage = () => {
    localStorage.setItem(
      "formularioData",
      JSON.stringify({
        nivel1SelectValue,
        nivel2SelectValue,
        nivel3SelectValue,
        nivel4SelectValue,
      })
    );
  };

  // Recuperar el estado desde localStorage cuando el componente se monta
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("formularioData"));
    if (savedData) {
      setNivel1SelectValue(savedData.nivel1SelectValue || "");
      setNivel2SelectValue(savedData.nivel2SelectValue || "");
      setNivel3SelectValue(savedData.nivel3SelectValue || "");
      setNivel4SelectValue(savedData.nivel4SelectValue || "");
    }
  }, []);
  // Guardar los datos en localStorage cada vez que cambie el estado de los campos
  useEffect(() => {
    guardarEnLocalStorage();
  }, [
    nivel1SelectValue,
    nivel2SelectValue,
    nivel3SelectValue,
    nivel4SelectValue,
  ]);

  return (
    <div className=" h-full flex flex-row bg-white animate__animated animate__fadeIn animate__faster">
      <div className="h-screen w-1/4 m-2 ">
        <Descriptions
          className="custom-descriptions2"
          title="Registro"
          items={items}
          layout={"vertical"}
          column={1}
          bordered={true}
        />
      </div>

      {/* Bloque del formulario */}

      <div className="max-h-full mb-2 w-3/4  bg-gray-900 opacity-95 text-cyan-50  rounded-xl p-8 ">
        <div className="m-0 flex  w-full items-center  ">
          <div className=" flex items-center w-full  gap-5">
            <h2 className="font-bold">Elija el tipo de Número :</h2>
            <Select
              onChange={handleSelectChange}
              style={{ width: 200, margin: "5px" }}
              defaultValue={"CELULAR"}
            >
              <Option value="CELULAR">N. CELULAR</Option>
              <Option value="NUMERO_VACIO">NUMERO VACIO</Option>
              <Option value="NUM_FIJO">N. Fijo</Option>
            </Select>

            {selectedOption === "CELULAR" && (
              <>
                <Input
                  className="w-1/3"
                  placeholder="Ingrese número de celular (9 dígitos)"
                  maxLength={9}
                  value={cellNumber}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Expresión regular que solo permite números
                    if (/^9\d*$/.test(value)) {
                      setCellNumber(value); // Solo actualiza si el valor es numérico
                    }
                  }}
                  required={true}
                />
                {errors.cellNumber && (
                  <div style={{ color: "red" }}>{errors.cellNumber}</div>
                )}
              </>
            )}

            {selectedOption === "NUMERO_VACIO" && (
              <Input placeholder="Número vacío" className="w-1/3" disabled />
            )}

            {selectedOption === "NUM_FIJO" && (
              <div className=" flex gap-6 items-center">
                <Select
                  placeholder="Prefijo"
                  style={{ width: 120, marginRight: 10 }}
                >
                  <Option value="1">1</Option>
                  <Option value="41">41</Option>
                  <Option value="42">42</Option>
                  <Option value="43">43</Option>
                  <Option value="44">44</Option>
                  <Option value="51">51</Option>
                  <Option value="53">53</Option>
                  <Option value="54">54</Option>
                  <Option value="56">56</Option>
                  <Option value="61">61</Option>
                  <Option value="62">62</Option>
                  <Option value="63">63</Option>
                  <Option value="64">64</Option>
                  <Option value="65">65</Option>
                  <Option value="66">66</Option>
                  <Option value="67">67</Option>
                  <Option value="72">72</Option>
                  <Option value="73">73</Option>
                  <Option value="74">74</Option>
                  <Option value="76">76</Option>
                  <Option value="82">82</Option>
                  <Option value="83">83</Option>
                  <Option value="84">84</Option>
                  {/* Añade más prefijos según sea necesario */}
                </Select>
                {errors.prefijo && (
                  <div style={{ color: "red" }}>{errors.prefijo}</div>
                )}
                <Input
                  className="w-2/3"
                  placeholder="Ingrese número fijo"
                  value={fixedNumber}
                  onChange={(e) => setFixedNumber(e.target.value)}
                />
                {errors.fixedNumber && (
                  <div style={{ color: "red" }}>{errors.fixedNumber}</div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="m-1 mt-5 flex gap-3 flex-wrap ">
          <div className="flex gap-10">
            <div className="flex items-center gap-20 ">
              <label className="font-semibold">Nivel 1: </label>
              <Select
                placeholder="Seleccione un contacto"
                onChange={handleFirstSelectChange}
                style={{ width: 210, marginBottom: 10 }}
                value={nivel1SelectValue}
              >
                <Option value="CONTACTO EFECTIVO">CONTACTO EFECTIVO</Option>
                <Option value="CONTACTO NO EFECTIVO">
                  CONTACTO NO EFECTIVO
                </Option>
                <Option value="NO CONTACTO">NO CONTACTO</Option>
              </Select>
            </div>
            <div className="flex items-center gap-12">
              <label className="font-semibold">Nivel 2: </label>
              <Select
                placeholder="Seleccione una opción"
                onChange={handleNivel2SelectChange}
                value={nivel2SelectValue}
                style={{ width: 200 }}
                disabled={!nivel1SelectValue} // Disable if no first select value is selected
              >
                {getSecondSelectOptions().map((option) => (
                  <Option key={option} value={option}>
                    {option}
                  </Option>
                ))}
              </Select>
              {errors.nivel2 && (
                <div style={{ color: "red" }}>{errors.nivel2}</div>
              )}
            </div>
          </div>
          {/* PARA EL CASO DE MCT*/}
          {nivel2SelectValue === "MCT" && (
            <>
              <div className=" flex gap-5 w-screen">
                <div className=" flex gap-2 w-1/2">
                  <label className="w-16 font-semibold">Nivel 3:</label>
                  <Input
                    className="w-32"
                    placeholder="Tipo de tercero"
                    disabled={true}
                  />
                </div>
                <div className="flex gap-2 w-1/2">
                  <label className="w-16 font-semibold">Nivel 4:</label>
                  <Select
                    placeholder="Seleccione una opción"
                    onChange={(value) => {
                      setNivel4SelectValue(value);
                      console.log("ahora nivel 4 es : ", value);
                      setObservacion(`Tipo de tercero: ${value}`);
                      setInputValueNombreTercero("");
                      setInputValueParentescoTercero("");
                      setNota("");
                      setComunicacionConTitular(null); // Resetear checkbox
                      setNumeroAdicional(null); // Resetear checkbox
                    }}
                    style={{ width: 300 }}
                    disabled={!nivel2SelectValue} // Disable if no first select value is selected
                  >
                    {getNivel4SelectOptions().map((option) => (
                      <Option key={option} value={option}>
                        {option}
                      </Option>
                    ))}
                  </Select>
                  {errors.nivel4 && (
                    <div style={{ color: "red" }}>{errors.nivel4}</div>
                  )}
                </div>
              </div>
              {nivel4SelectValue === "Familiar" && (
                <div className="flex flex-row gap-4 w-full ">
                  <div className="flex gap-2 w-1/2">
                    <label className="w-48 text-xs font-semibold">
                      NOMBRE TERCERO :{" "}
                    </label>
                    <Input
                      placeholder=""
                      onChange={handleChangeNombreTercero}
                    />
                    {errors.nombreTercero && (
                      <div style={{ color: "red" }}>{errors.nombreTercero}</div>
                    )}
                  </div>
                  <div className=" flex gap-2 w-1/2">
                    <label className="w-40 text-xs font-semibold">
                      PARENTESCO TERCERO :
                    </label>
                    <Input
                      placeholder=""
                      onChange={handleChangeParentescoTercero}
                    />
                    {errors.parentescoTercero && (
                      <div style={{ color: "red" }}>
                        {errors.parentescoTercero}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex  gap-4 w-screen">
                <div className="  w-1/2 flex flex-col">
                  <label className="font-semibold">
                    ¿Se comunicará con titular?
                  </label>
                  <div>
                    <Radio.Group
                      onChange={onChangeComunicarConTitular}
                      value={comunicacionConTitular}
                    >
                      <Radio value="SI">SI</Radio>
                      <Radio value="NO">NO</Radio>
                    </Radio.Group>
                    {errors.comunicacion && (
                      <div style={{ color: "red" }}>{errors.comunicacion}</div>
                    )}
                  </div>
                </div>
                <div className="  w-1/2">
                  <label className="font-semibold">¿Número adicional?</label>
                  <div>
                    <Radio.Group
                      onChange={onChangeNumeroAdicional}
                      value={numeroAdicional}
                    >
                      <Radio value="SI">SI</Radio>
                      <Radio value="NO">NO</Radio>
                    </Radio.Group>
                    {errors.numeroAdicional && (
                      <div style={{ color: "red" }}>
                        {errors.numeroAdicional}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className=" flex flex-row gap-8  w-screen">
                <div className="flex justify-center items-center">
                  <label className=" flex align-text-bottom font-semibold">
                    NOTA:{" "}
                  </label>
                </div>

                <TextArea
                  placeholder=""
                  rows={3}
                  maxLength={2000}
                  value={nota}
                  className="w-3/4"
                  onChange={onChangeNota}
                />
              </div>
            </>
          )}
          {/* PARA EL CASO DE PAR*/}
          {nivel2SelectValue === "PAR" && (
            <>
              <div className=" flex gap-5 w-full mb-3 ">
                <div className=" flex gap-14 w-1/2 ">
                  <label className="w-16 font-semibold text-xs">
                    HORARIO DE PAGO:
                  </label>
                  <Select
                    // defaultValue="Mañana"
                    onChange={handleHorrarioPagoSelectChange}
                    defaultValue={horarioPago}
                    style={{ width: 120 }}
                  >
                    <Option value="Mañana">Mañana</Option>
                    <Option value="Mediodía">Mediodía</Option>
                    <Option value="Tarde">Tarde</Option>
                  </Select>
                </div>
                {errors.horarioPagoOMontoTotal && (
                  <div style={{ color: "red" }}>
                    {errors.horarioPagoOMontoTotal}
                  </div>
                )}
                <div className="flex gap-2 items-center w-1/2">
                  <label className="w-32 font-semibold text-xs">
                    MONTO TOTAL NEGOCIADO:
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
                        handleMontoNegociadoChange(value);
                      }
                    }}
                  />
                </div>
              </div>

              <div className="flex  gap-4 w-full ">
                <div className="  w-1/2 flex flex-row text-xs items-center  gap-3">
                  <label className="font-semibold">FEC COMPROMISO:</label>
                  <DatePicker
                    disabledDate={disabledDate}
                    inputReadOnly={true}
                    defaultValue={dayjs(fechaActual)} // Convierte la fecha en formato 'YYYY-MM-DD' a un objeto Day.js para el DatePicker
                    onChange={(value) => setFecCompromiso(value)} // Almacena la fecha seleccionada en formato 'YYYY-MM-DD'
                  />
                </div>
                <div className="  w-1/2 flex gap-6 items-center">
                  <label className="font-semibold text-xs">MONTO MES:</label>
                  <div>
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
                          handleMontoMesChange(value);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className=" flex  w-full  ">
                <div className="flex items-center gap-9">
                  <label className="font-semibold text-xs">MONTO TOTAL:</label>
                  <div>
                    <Input
                      type="text"
                      value={cuotas * montoMes}
                      disabled={true}
                      style={{ backgroundColor: "white" }}
                      readOnly // Bloquea el input para que no sea editable
                    />
                  </div>
                </div>
              </div>
              <div className=" flex flex-row   mt-3 mb-3 w-full ">
                <div className="flex w-full gap-20 ">
                  <div className="flex  justify-center items-center ">
                    <label className=" flex align-text-bottom font-semibold text-xs">
                      NOTA:{" "}
                    </label>
                  </div>
                  <TextArea
                    placeholder=""
                    rows={4}
                    maxLength={1900}
                    value={nota}
                    onChange={onChangeNota}
                  />
                </div>
              </div>
            </>
          )}
          {/* PARA EL CASO DE PPC*/}
          {nivel2SelectValue === "PPC" && (
            <>
              <div className="flex gap-3 w-screen">
                <div className=" flex gap-11  w-1/2 items-center">
                  <label className="w-20 font-semibold">Nivel 3:</label>
                  <Input
                    className="w-48"
                    placeholder="Sustento de pago PPC"
                    disabled={true}
                    style={{ backgroundColor: "white" }}
                  />
                </div>
                {opcionesNivel4 && (
                  <div className="flex flex-row gap-4">
                    <label className="font-semibold">Nivel 4: </label>
                    <Select
                      placeholder="Seleccione una opción"
                      defaultValue={"Dinero en mano"}
                      onChange={(value) => {
                        setNivel4SelectValue(value);
                        console.log("ahora nivel 4 es : ", value);
                        setObservacion(`Tipo de tercero: ${value}`);
                        setInputValueNombreTercero("");
                        setInputValueParentescoTercero("");
                        setNota("");
                        setComunicacionConTitular(null); // Resetear checkbox
                        setNumeroAdicional(null); // Resetear checkbox
                      }}
                      style={{ width: 300 }}
                      disabled={!nivel2SelectValue} // Disable if no first select value is selected
                    >
                      {opcionesNivel4.map((option, index) => (
                        <Option key={index} value={option.descripcion}>
                          {option.descripcion}
                        </Option>
                      ))}
                    </Select>
                  </div>
                )}
              </div>
              <div className=" flex gap-5 w-screen">
                <div className=" flex gap-16 w-1/2">
                  <label className="w-16 font-semibold text-xs">
                    HORARIO DE PAGO:
                  </label>
                  <Select
                    defaultValue={horarioPago}
                    onChange={handleHorrarioPagoSelectChange}
                    style={{ width: 120 }}
                  >
                    <Option value="Mañana">Mañana</Option>
                    <Option value="Medioda">Mediodía</Option>
                    <Option value="Tarde">Tarde</Option>
                  </Select>
                </div>
                {errors.horarioPagoOMontoTotal && (
                  <div style={{ color: "red" }}>
                    {errors.horarioPagoOMontoTotal}
                  </div>
                )}
                <div className="  w-1/2 flex gap-4 items-center">
                  <label className="font-semibold text-xs">MONTO MES:</label>
                  <div>
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
                          handleMontoMesChange(value);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex  gap-4 w-screen">
                <div className="  w-1/2 flex flex-row text-xs items-center  gap-5">
                  <label className="font-semibold">FEC COMPROMISO:</label>
                  <div>
                    <DatePicker
                      disabledDate={disabledDate}
                      defaultValue={dayjs(fechaActual)}
                      inputReadOnly={true}
                      onChange={(value) => setFecCompromiso(value)}
                    />
                  </div>
                </div>
                <div className="  w-1/2 flex gap-2 items-center">
                  <label className="font-semibold text-xs">MONTO TOTAL:</label>
                  <div>
                    <Input
                      type="text"
                      value={cuotas * montoMes}
                      disabled={true}
                      style={{ backgroundColor: "white" }}
                      readOnly // Bloquea el input para que no sea editable
                    />
                  </div>
                </div>
              </div>
              <div className="w-screen flex flex-col ">
                <div>
                  <Checkbox
                    onChange={handleCheckboxChange}
                    style={{ color: "yellow" }}
                  >
                    Adelanto?
                  </Checkbox>
                </div>
              </div>
              {adelantoChecked && (
                <div className="flex w-screen ">
                  <div className="flex items-center  w-1/2 gap-5">
                    <label className="font-semibold text-xs">FEC :</label>
                    <DatePicker
                      disabledDate={disabledDate}
                      inputReadOnly={true}
                      onChange={(value) => setFecAdelanto(value)} // Almacena la fecha seleccionada en formato 'YYYY-MM-DD'
                    />
                  </div>
                  <div className="flex items-center w-1/2 gap-7">
                    <label className="font-semibold text-xs">
                      MONTO ADELANTO:
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
                        // Evitar pegar texto
                        e.preventDefault();
                      }}
                      onChange={(e) => {
                        const value = e.target.value;

                        // Validar el valor: vacío, número entero o decimal con un solo punto
                        if (value === "" || /^\d*\.?\d*$/.test(value)) {
                          setMontoAdelanto(value);
                        }
                      }}
                    />
                    {/* <InputNumber min={0} onChange={(value) => setMontoAdelanto(value)}/> */}
                  </div>
                </div>
              )}

              <div className=" flex flex-row gap-8  w-full mb-2">
                <div className="flex flex-row gap-5 w-full">
                  <div className="flex  justify-center items-center ">
                    <label className=" flex align-text-bottom font-semibold text-xs">
                      NOTA:{" "}
                    </label>
                  </div>
                  <TextArea
                    placeholder=""
                    rows={2}
                    maxLength={1900}
                    value={nota}
                    onChange={onChangeNota}
                  />
                </div>
              </div>
            </>
          )}
          {/* PARA EL CASO DE PPM*/}
          {nivel2SelectValue === "PPM" && (
            <>
              <div className="flex gap-3 w-screen">
                <div className=" flex gap-11 w-1/2 items-center">
                  <label className="w-20 font-semibold">Nivel 3:</label>
                  <Input
                    className="w-48"
                    placeholder="Sustento de pago PPM"
                    style={{ backgroundColor: "white" }}
                    disabled={true}
                  />
                </div>
                {opcionesNivel4 && (
                  <div className="flex flex-row gap-4">
                    <label className="font-semibold">Nivel 4: </label>
                    <Select
                      placeholder="Seleccione una opción"
                      value={nivel4SelectValue}
                      onChange={(value) => {
                        setNivel4SelectValue(value);
                        console.log("ahora nivel 4 es : ", value);
                        setObservacion(`Tipo de tercero: ${value}`);
                        setInputValueNombreTercero("");
                        setInputValueParentescoTercero("");
                        setNota("");
                        setComunicacionConTitular(null); // Resetear checkbox
                        setNumeroAdicional(null); // Resetear checkbox
                      }}
                      style={{ width: 300 }}
                      disabled={!nivel2SelectValue} // Disable if no first select value is selected
                    >
                      {opcionesNivel4.map((option, index) => (
                        <Option key={index} value={option.descripcion}>
                          {option.descripcion}
                        </Option>
                      ))}
                    </Select>
                  </div>
                )}
              </div>
              <div className=" flex gap-5 w-screen">
                <div className=" flex gap-16 w-1/2">
                  <label className="w-16 font-semibold text-xs">
                    HORARIO DE PAGO:
                  </label>
                  <Select
                    defaultValue={horarioPago}
                    onChange={handleHorrarioPagoSelectChange}
                    style={{ width: 120 }}
                  >
                    <Option value="Mañana">Mañana</Option>
                    <Option value="Medioda">Mediodía</Option>
                    <Option value="Tarde">Tarde</Option>
                  </Select>
                </div>
                {errors.horarioPagoOMontoTotal && (
                  <div style={{ color: "red" }}>
                    {errors.horarioPagoOMontoTotal}
                  </div>
                )}
                <div className="  w-1/2 flex gap-5 items-center">
                  <label className="font-semibold text-xs">MONTO MES:</label>
                  <div>
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
                          handleMontoMesChange(value);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex  gap-4 w-screen">
                <div className="  w-1/2 flex flex-row text-xs items-center  gap-5">
                  <label className="font-semibold">FEC COMPROMISO:</label>
                  <div>
                    <DatePicker
                      disabledDate={disabledDate}
                      defaultValue={dayjs(fechaActual)}
                      inputReadOnly={true}
                      onChange={(value) => setFecCompromiso(value)}
                    />
                  </div>
                </div>
                <div className="  w-1/2 flex gap-3 items-center">
                  <label className="font-semibold text-xs">MONTO TOTAL:</label>
                  <div>
                    <Input
                      type="text"
                      value={cuotas * montoMes}
                      disabled={true}
                      readOnly // Bloquea el input para que no sea editable
                    />
                  </div>
                </div>
              </div>

              <div className="w-screen flex items-center gap-20 ">
                <label className="font-semibold text-xs">CUOTAS:</label>
                <InputNumber
                  min={1}
                  defaultValue={1}
                  onChange={(value) => setCuotas(value)}
                  onKeyDown={(e) => {
                    const char = e.key;

                    // Permitir solo números, backspace, delete, flechas y tabulador
                    if (
                      !/^\d$/.test(char) && // No es un número
                      char !== "Backspace" &&
                      char !== "Delete" &&
                      char !== "ArrowLeft" &&
                      char !== "ArrowRight" &&
                      char !== "Tab"
                    ) {
                      e.preventDefault(); // Bloquear la entrada de letras u otros caracteres
                    }
                  }}
                />
              </div>

              <div className=" flex flex-row gap-8  w-full mb-3">
                <div className="flex flex-row gap-5 w-full">
                  <div className="flex  justify-center items-center ">
                    <label className=" flex align-text-bottom font-semibold text-xs">
                      NOTA:{" "}
                    </label>
                  </div>
                  <TextArea
                    placeholder=""
                    rows={2}
                    maxLength={2000}
                    value={nota}
                    onChange={onChangeNota}
                  />
                </div>
              </div>
            </>
          )}
          {/* PARA EL CASO DE REN*/}
          {nivel2SelectValue === "REN" && (
            <>
              <div className="flex gap-3 w-screen">
                <div className=" flex gap-11 w-1/2 items-center">
                  <label className="w-20 font-semibold">Nivel 3:</label>
                  <Input
                    className="w-48"
                    placeholder="Motivo de renuencia"
                    disabled={true}
                    style={{ backgroundColor: "white" }}
                  />
                </div>
                {opcionesNivel4 && (
                  <div className="flex flex-row gap-4">
                    <label className="font-semibold">Nivel 4: </label>
                    <Select
                      placeholder="Seleccione una opción"
                      // defaultValue={"Es titular y corta llamada (Llamada Corta)"}
                      onChange={(value) => {
                        setNivel4SelectValue(value);
                        console.log("ahora nivel 4 es : ", value);
                        setObservacion(`Tipo de tercero: ${value}`);
                        setInputValueNombreTercero("");
                        setInputValueParentescoTercero("");
                        setNota("");
                        setComunicacionConTitular(null); // Resetear checkbox
                        setNumeroAdicional(null); // Resetear checkbox
                      }}
                      style={{ width: 300 }}
                      disabled={!nivel2SelectValue} // Disable if no first select value is selected
                    >
                      {opcionesNivel4.map((option, index) => (
                        <Option key={index} value={option.descripcion}>
                          {option.descripcion}
                        </Option>
                      ))}
                    </Select>
                  </div>
                )}
              </div>
            </>
          )}
          {/* PARA EL CASO DE MCT*/}
          {nivel2SelectValue === "RPP" && (
            <>
              <div className=" flex gap-5 w-screen"></div>
              <div className="flex  gap-4 w-screen">
                <div className="  w-1/2 flex flex-col">
                  <label className="font-semibold">¿Cliente abonó?</label>
                  <div>
                    <Radio.Group
                      onChange={onChangeClienteAbono}
                      value={clienteAbono}
                    >
                      <Radio value="SI">SI</Radio>
                      <Radio value="NO">NO</Radio>
                    </Radio.Group>
                    {errors.clienteAbono && (
                      <div style={{ color: "red" }}>{errors.clienteAbono}</div>
                    )}
                  </div>
                </div>
                <div className="  w-1/2">
                  <label className="font-semibold">
                    ¿Confirmación de pago?
                  </label>
                  <div>
                    <Radio.Group
                      onChange={onChangeConfirmacionDePago}
                      value={confirmacionDePago}
                    >
                      <Radio value="SI">SI</Radio>
                      <Radio value="NO">NO</Radio>
                    </Radio.Group>
                    {errors.confirmacionPago && (
                      <div style={{ color: "red" }}>
                        {errors.confirmacionPago}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {confirmacionDePago === "NO" && (
                <div className="flex flex-row gap-4 w-full ">
                  <div className="  w-1/2">
                    <label className="font-semibold">
                      ¿Reprogramación de pago?
                    </label>
                    <div>
                      <Radio.Group
                        onChange={onChangeReprogramacionDePago}
                        value={reprogramacionDePago}
                      >
                        <Radio value="SI">SI</Radio>
                        <Radio value="NO">NO</Radio>
                      </Radio.Group>
                      {errors.reprogramacionDePago && (
                        <div style={{ color: "red" }}>
                          {errors.reprogramacionDePago}
                        </div>
                      )}
                    </div>
                  </div>
                  {reprogramacionDePago === "SI" && (
                    <div className="flex flex-row gap-4 w-full ">
                      <div className="  w-1/2">
                        <label className="font-semibold">
                          ¿Fecha compromiso?
                        </label>
                        <div>
                          <DatePicker
                            disabledDate={disabledDate}
                            inputReadOnly={true}
                            defaultValue={fecCompromiso} // Convierte la fecha en formato 'YYYY-MM-DD' a un objeto Day.js para el DatePicker
                            onChange={(value) => setFecCompromiso(value)} // Almacena la fecha seleccionada en formato 'YYYY-MM-DD'
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-5 items-center">
                <label className="font-semibold">C. ENVIO: </label>
                <Select
                  onChange={handleCanalEnvioSelectChange}
                  defaultValue={canalEnvio}
                  style={{ width: 120 }}
                >
                  <Option value="LLAMADA">LLAMADA</Option>
                  <Option value="SMS">SMS</Option>
                  <Option value="WHATSAPP">WHATSAPP</Option>
                  <Option value="CORREO">CORREO</Option>
                </Select>
              </div>

              <div className=" flex flex-row gap-8  w-screen">
                <div className="flex justify-center items-center">
                  <label className=" flex align-text-bottom font-semibold">
                    NOTA:{" "}
                  </label>
                </div>

                <TextArea
                  placeholder=""
                  rows={3}
                  maxLength={2000}
                  value={nota}
                  className="w-3/4"
                  onChange={onChangeNota}
                />
              </div>
            </>
          )}
          {/* PARA EL CASO DE TAT*/}
          {nivel2SelectValue === "TAT" && (
            <>
              <div className="flex gap-3 w-screen">
                <div className=" flex gap-11 w-1/2 items-center">
                  <label className="w-20 font-semibold">Nivel 3:</label>
                  <Input
                    className="w-48"
                    placeholder="Motivo de no cierre"
                    disabled={true}
                    style={{ backgroundColor: "white" }}
                  />
                </div>
                <div className="flex flex-row gap-4">
                  <label className="font-semibold">Nivel 4: </label>
                  <Select
                    placeholder="Seleccione una opción"
                    onChange={(value) => {
                      setNivel4SelectValue(value);
                      console.log("ahora nivel 4 es : ", value);
                      setObservacion(`Tipo de tercero: ${value}`);
                      setInputValueNombreTercero("");
                      setInputValueParentescoTercero("");
                      setNota("");
                      setComunicacionConTitular(null); // Resetear checkbox
                      setNumeroAdicional(null); // Resetear checkbox
                    }}
                    style={{ width: 300 }}
                    disabled={!nivel2SelectValue} // Disable if no first select value is selected
                  >
                    {opcionesNivel4.map((option, index) => (
                      <Option key={index} value={option.descripcion}>
                        {option.descripcion}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>
              <div className=" flex flex-row gap-8  w-full">
                <div className="flex flex-row gap-5 w-full">
                  <div className="flex  justify-center items-center ">
                    <label className=" flex align-text-bottom font-semibold text-xs">
                      NOTA:{" "}
                    </label>
                  </div>
                  <TextArea
                    placeholder=""
                    rows={2}
                    maxLength={2000}
                    value={nota}
                    onChange={onChangeNota}
                  />
                </div>
              </div>
            </>
          )}
          {/* PARA EL CASO DE VLL*/}
          {nivel2SelectValue === "VLL" && (
            <>
              <div className="flex gap-3 w-screen">
                <div className=" flex gap-11 w-1/2 items-center">
                  <label className="w-20 font-semibold">Nivel 3:</label>
                  <Input
                    className="w-48"
                    placeholder="Motivo de VLL"
                    disabled={true}
                    style={{ backgroundColor: "white" }}
                  />
                </div>
                <div className="flex flex-row gap-4">
                  <label className="font-semibold">Nivel 4: </label>
                  <Select
                    placeholder="Seleccione una opción"
                    onChange={(value) => {
                      setNivel4SelectValue(value);
                      console.log("ahora nivel 4 es : ", value);
                      setObservacion(`Tipo de tercero: ${value}`);
                      setInputValueNombreTercero("");
                      setInputValueParentescoTercero("");
                      setNota("");
                      setComunicacionConTitular(null); // Resetear checkbox
                      setNumeroAdicional(null); // Resetear checkbox
                    }}
                    style={{ width: 300 }}
                    disabled={!nivel2SelectValue} // Disable if no first select value is selected
                  >
                    {opcionesNivel4.map((option, index) => (
                      <Option key={index} value={option.descripcion}>
                        {option.descripcion}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="flex gap-5 w-screen">
                <div className="  w-1/2 flex flex-row text-xs items-center  gap-5">
                  <label className="font-semibold">FEC COMPROMISO:</label>
                  <div>
                    <DatePicker
                      disabledDate={disabledDate}
                      inputReadOnly={true}
                      value={fecCompromiso} // Convierte la fecha en formato 'YYYY-MM-DD' a un objeto Day.js para el DatePicker
                      onChange={(value) => setFecCompromiso(value)} // Almacena la fecha seleccionada en formato 'YYYY-MM-DD'
                    />
                  </div>
                </div>

                <div className="flex gap-2 items-center w-1/2">
                  <label className="w-32 font-semibold text-xs">
                    MONTO TOTAL NEGOCIADO:
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
                        handleMontoNegociadoChange(value);
                      }
                    }}
                  />
                </div>
              </div>

              <div className=" flex flex-row gap-8  w-full mt-3">
                <div className="flex flex-row gap-5 w-full">
                  <div className="flex  justify-center items-center ">
                    <label className=" flex align-text-bottom font-semibold text-xs">
                      NOTA:{" "}
                    </label>
                  </div>
                  <TextArea
                    placeholder=""
                    rows={2}
                    maxLength={1900}
                    value={nota}
                    onChange={onChangeNota}
                  />
                </div>
              </div>
            </>
          )}
          {/* PARA EL CASO DE CAN*/}
          {nivel2SelectValue === "CAN" && <></>}
          {/* PARA EL CASO DE REC*/}
          {nivel2SelectValue === "REC" && (
            <>
              <div className="flex gap-3 w-screen">
                <div className=" flex gap-2 w-1/2 items-center">
                  <label className="w-20 font-semibold">Nivel 3:</label>
                  <Input
                    className="w-48"
                    placeholder="Motivo de reclamo"
                    disabled={true}
                  />
                </div>
                <div className="flex flex-row gap-4">
                  <label className="font-semibold">Nivel 4: </label>
                  <Select
                    placeholder="Seleccione una opción"
                    onChange={(value) => {
                      setNivel4SelectValue(value);
                      console.log("ahora nivel 4 es : ", value);
                      setObservacion(`Tipo de tercero: ${value}`);
                      setInputValueNombreTercero("");
                      setInputValueParentescoTercero("");
                      setNota("");
                      setComunicacionConTitular(null); // Resetear checkbox
                      setNumeroAdicional(null); // Resetear checkbox
                    }}
                    style={{ width: 300 }}
                    disabled={!nivel2SelectValue} // Disable if no first select value is selected
                  >
                    {opcionesNivel4.map((option, index) => (
                      <Option key={index} value={option.descripcion}>
                        {option.descripcion}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>
            </>
          )}
        </div>

        <div className=" mt-3  ">
          <div className=" flex flex-row gap-8">
            <div className="flex justify-center items-center">
              <label className=" flex align-text-bottom font-semibold text-xs">
                OBSERVACIÓN:
              </label>
            </div>
            <TextArea
              placeholder=""
              rows={4}
              maxLength={2000}
              readOnly
              className="w-3/4"
              value={observacion}
            />
          </div>
        </div>
        <div className="mt-4 flex gap-3 ">
          <label className="font-semibold text-xs">Tipo de Llamada : </label>
          <Select
            placeholder="Seleccione Tipo de llamada"
            onChange={handleTipoBoundChange}
            style={{ width: 200, marginBottom: 10 }}
          >
            <Option value="INBOUND">INBOUND</Option>
            <Option value="OUTBOUND">OUTBOUND</Option>
          </Select>

          <label className="font-semibold text-xs">Tipo de INBOUND : </label>
          <Select
            placeholder="Seleccione una opción"
            value={opcionesInbound}
            onChange={(value) => {
              setOpcionesInbound(value), setTipoInbound(value);
            }}
            style={{ width: 200 }}
            disabled={tipoBoundSelectValue === "OUTBOUND"} // Disable if no first select value is selected
          >
            {getOpcionesInbound().map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </div>
        <div className="w-full  flex justify-center mt-8">
          <Button type="primary" onClick={handleSubmit}>
            Enviar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IngresarGestion;
