import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import CartaNotificacion from "./CartaNotificacion";
import CartaCompromisoPago from "./CartaCompromisoPago";
import CartaCronogrmaPagos from "./CartaCronogrmaPagos";
import EstadoDeCuenta from "./EstadoDeCuenta";
import CartaNoAdeudo from "./CartaNoAdeudo";
import CartaCampana from "./CartaCampana";
import CartaPlanilla from "./CartaPlanilla";
import CartaAgresiva from "./CartaAgresiva";
import CartaEjecucionGarantia from "./CartaEjecucionGarantia";
import 'animate.css';


const SolicitudDocumento = () => {
  const [mostrarImagen, setMostrarImagen] = useState(true);
  const [componenteSeleccionado, setComponenteSeleccionado] = useState(null);

  const { register, handleSubmit, watch } = useForm();
  const documentoElegido = watch("documentoElegido");

  const onSubmit = (data) => console.log(data);

  // Controlar el estado basado en documentoElegido
  useEffect(() => {
    if (!documentoElegido || documentoElegido === "Seleccionar") {
      setMostrarImagen(true);
      setComponenteSeleccionado(null);
      return;
    }

    setMostrarImagen(false);

    switch (documentoElegido) {
      case "Carta de No Adeudo":
        setComponenteSeleccionado(<CartaNoAdeudo />);
        break;
      case "Carta de Notificación":
        setComponenteSeleccionado(<CartaNotificacion />);
        break;
      case "Compromiso de pago":
        setComponenteSeleccionado(<CartaCompromisoPago />);
        break;
      case "Cronograma de pago":
        setComponenteSeleccionado(<CartaCronogrmaPagos />);
        break;
      case "Estado de Cuenta":
        setComponenteSeleccionado(<EstadoDeCuenta />);
        break;
      case "Carta de Campana":
        setComponenteSeleccionado(<CartaCampana />);
        break;
      case "Carta Planilla":
        setComponenteSeleccionado(<CartaPlanilla />);
        break;
      case "Carta Agresiva":
        setComponenteSeleccionado(<CartaAgresiva />);
        break;
      case "Carta ejecucion garantia":
        setComponenteSeleccionado(<CartaEjecucionGarantia />);
        break;
      default:
        setComponenteSeleccionado(null);
    }
  }, [documentoElegido]);

  return (
    <div className="h-full w-full flex flex-col items-center animate__animated animate__fadeIn animate__faster">
      <div className="mt-5 mb-5">
        <h1 className="text-xl font-semibold">Solicitud Documento</h1>
      </div>
      <form className="flex gap-5" onSubmit={handleSubmit(onSubmit)}>
        <label>Elija un tipo de documento:</label>
        <select
          className="flex justify-center bg-cyan-950 text-white items-center rounded-lg p-2"
          {...register("documentoElegido")}
        >
          <option value="Seleccionar">Seleccione una opción</option>
          <option value="Carta de No Adeudo">Carta de No Adeudo</option>
          <option value="Carta de Notificación">Carta de Notificación</option>
          <option value="Compromiso de pago">Compromiso de pago</option>
          <option value="Cronograma de pago">Cronograma de pago</option>
          <option value="Estado de Cuenta">Estado de Cuenta</option>
          <option value="Carta de Campana">Carta de Campana</option>
          <option value="Carta Planilla">Carta Planilla</option>
          <option value="Carta Agresiva">Carta Agresiva</option>
          <option value="Carta ejecucion garantia">
            Carta ejecución garantía
          </option>
        </select>
      </form>

      {mostrarImagen && (
        <div className="animate-float w-24 mt-5 ml-56">
          <img src="../../src/images/flecha.png" alt="flecha" />
        </div>
      )}

      {/* Renderiza el componente seleccionado */}
      <div className="mt-5 flex items-center justify-center">
        {componenteSeleccionado}
      </div>
    </div>
  );
};

export default SolicitudDocumento;
