import { DatePicker, Slider, Input, Button } from "antd";
import { useState } from "react";
import dayjs from "dayjs";
import { useData } from "../context/DataContext.jsx";
import { useNavigate } from "react-router-dom";
import "../styles/estlosAntDesginn.css";

const { TextArea } = Input;

const marks = {
  6: "6",
  7: "7 ",
  8: "8",
  9: "9",
  10: "10",
  11: "11",
  12: "12",
  13: "13",
  14: "14",
  15: "15",
  16: "16",
  17: "17",
  18: "18",
  19: {
    style: {
      color: "#f50",
    },
    label: <strong>19</strong>,
  },
};

const horasMap = {
  6: "6 AM",
  7: "7 AM",
  8: "8 AM",
  9: "9 AM",
  10: "10 AM",
  11: "11 AM",
  12: "12 PM",
  13: "1 PM",
  14: "2 PM",
  15: "3 PM",
  16: "4 PM",
  17: "5 PM",
  18: "6 PM",
  19: "7 PM",
};

const Agendar = () => {
  const navigate = useNavigate();
  const [fecha_pago, setFechaPago] = useState(dayjs());
  const [observacion, setObservacion] = useState("");
  const [hora, setHora] = useState("");
  const [etiqueta, setEtiqueta] = useState("-");
  const [errors, setErrors] = useState({}); // Estado para manejar errores
  const { cliente, user } = useData();

  const handleChange = (value) => {
    console.log(`Hora seleccionada: ${value}`);
    setHora(value);
    setEtiqueta(horasMap[value] || `${value} Hrs`); // Manejo de valores no mapeados
  };

  // PARA RESTRINGIR las fechas >= hoy y dentro del mes
  const disabledDate = (current) => {
    // Permitir solo fechas dentro del mes actual y mayores o iguales al día de hoy
    return (
      current.month() !== dayjs().month() || // No es el mes actual
      current.isBefore(dayjs().startOf("day")) // Es una fecha anterior a hoy
    );
  };

  const handleTextAreaChange = (e) => {
    setObservacion(e.target.value); // Actualizamos el estado con el valor ingresado en el TextArea
  };

  const validateForm = () => {
    const newErrors = {};
    if (!fecha_pago) newErrors.fecha_pago = "Por favor selecciona una fecha.";
    if (!hora) newErrors.hora = "Por favor selecciona una hora.";
    if (!observacion.trim()) newErrors.observacion = "La observación es obligatoria.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Validar si no hay errores
  };
  const handelSolicitar = async () => {
    if (validateForm()) {
      console.log("Se enviará esto:", observacion, fecha_pago.format("YYYY-MM-DD"), hora);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/registrarAgendamiento`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              idDeudor: cliente.ID_DEUDOR,
              idEntidad: cliente.ID_ENTIDAD,
              idGestor: user.idMovEmpleado,
              fecAgenda: fecha_pago,
              horaAgenda: hora,
              texto: observacion,       
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
        // Retrasa la redirección por 2 segundos
        setTimeout(() => {
          navigate("/expertisERP/clientes");
        }, 100);
     
       
      } catch (error) {
        console.error("Error al enviar la solicitud:", error);
      }
    }
    
  };

  const isButtonDisabled = !fecha_pago || !hora || !observacion.trim(); 

  return (
    <div className="p-5 bg-blue-50 rounded-md">
      <div className="flex justify-between">
        <label> Fecha: </label>
        <DatePicker
          disabledDate={disabledDate}
          inputReadOnly={true}
          defaultValue={fecha_pago} // Convierte la fecha en formato 'YYYY-MM-DD' a un objeto Day.js para el DatePicker
          onChange={(value) => {
            setFechaPago(value);
            setErrors((prev) => ({ ...prev, fecha_pago: "" })); // Limpiar error si se selecciona fecha
          }}
        />
        {errors.fecha_pago && <span className="text-red-500 text-sm">{errors.fecha_pago}</span>}
      </div>
      <div className="flex mt-3 justify-between">
        <h4>Hora:</h4>
        <label>{etiqueta}</label>
      </div>
      <div   className="custom-slider">
      <Slider
       
       included={false}
       marks={marks} // Etiquetas para las horas
       min={6} // Hora mínima
       max={19} // Hora máxima
       step={1} // Solo valores enteros
       defaultValue={6} // Valor inicial (ejemplo: 9 AM)
       onChange={handleChange} // Maneja el cambio de valor
       
     />
      </div>
    
       {errors.hora && <span className="text-red-500 text-sm">{errors.hora}</span>}
      <div className="flex flex-col">
        <label className="mt-2 mb-2"> OBSERVACIÓN</label>

        <TextArea
          rows={3}
          value={observacion} // Muestra el valor del estado en el TextArea
          onChange={handleTextAreaChange} // Actualiza el estado cuando cambias el contenido del TextArea
          placeholder="Escribe un comentario"
        />
        {errors.observacion && <span className="text-red-500 text-sm">{errors.observacion}</span>}
        <div className=" flex items-center justify-center mt-5">
          <Button type="primary" onClick={handelSolicitar} disabled={isButtonDisabled}>
            SOLICITAR
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Agendar;
