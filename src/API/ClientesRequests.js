import axios from "./axios.js";

export const datosTitularIdDeudor = async (idDeudor) => {     
    // Realiza la petición POST con Axios
    try {
        const response = await axios.get(`/obtenerDatosTitular/${idDeudor}`, { withCredentials: true });
        // Maneja la respuesta aquí
        // console.log("Respuesta del endpoint ", response.data.data);
        return response.data.data;
    } catch (error) {
        // Maneja los errores aquí
        console.error('Hubo un error:', error);
        throw error; // Si necesitas propagar el error
    }
  };

  export const datosProductosClienteByIdDeudorAndEntidad = async (idDeudor, idEntidad) => {
    try {
        console.log("LLEga al request del frontend: ", idDeudor, idEntidad);
        const response = await axios.post(`/obtenerDatosProductos`, { idDeudor, idEntidad }, { withCredentials: true });
        console.log("Respuesta del endpoint de productos ", response.data.data);
        return response.data.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.warn('No se encontraron datos.');
            return null; // O devuelve un valor específico para indicar sin datos
        }
        console.error('Hubo un error:', error);
        throw error; // Propaga el error para otros casos
    }
};

  export const datosPagosClienteByIdDeudorAndEntidad = async (idDeudor,idEntidad) => {     
    try {
        const response = await axios.post(`/obtenerDatosPagosCliente`,{idDeudor,idEntidad}, { withCredentials: true });
        // Maneja la respuesta aquí
        console.log("Respuesta del endpoint de pagos ", response.data.data);
        return response.data.data;
    } catch (error) {
        // Maneja los errores aquí
        console.error('Hubo un error:', error);
        throw error; // Si necesitas propagar el error
    }
  };

  export const datosGestionesClienteByDocumentoAndCartera = async (documento , cartera) => {     
    try {
        const response = await axios.post(`/obtenerDatosGestionesCliente`,{documento,cartera}, { withCredentials: true });
        // Maneja la respuesta aquí
        console.log("Respuesta del endpoint de Gestiones", response.data.data);
        return response.data.data;
    } catch (error) {
        // Maneja los errores aquí
        console.error('Hubo un error:', error);
        throw error; // Si necesitas propagar el error
    }
  };

  export const datosExcepcionesClienteByIdDeudorAndEntidad = async (idDeudor,idEntidad) => {     
    try {
        const response = await axios.post(`/obtenerDatosExcepcionesCliente`,{idDeudor,idEntidad}, { withCredentials: true });
        // Maneja la respuesta aquí
        console.log("Respuesta del endpoint de excepciones ", response.data.data);
        return response.data.data;
    } catch (error) {
        // Maneja los errores aquí
        console.error('Hubo un error:', error);
        throw error; // Si necesitas propagar el error
    }
  };