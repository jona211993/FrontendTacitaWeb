import { createContext, useContext, useState, useEffect } from "react";

export const DataContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData debe ser usado con un DataProvider");
  }
  return context;
};

// eslint-disable-next-line react/prop-types
export const DataProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [cliente, setCliente] = useState(() => {
    const savedCliente = localStorage.getItem("cliente");
    return savedCliente ? JSON.parse(savedCliente) : null;
  });

  const [autenticado, setAutenticado] = useState(() => {
    const savedAutenticado = localStorage.getItem("autenticado");
    return savedAutenticado === "true"; // "true" como string convertido a booleano
  });

  const [clientesBusqueda, setClientesBusqueda] = useState(() => {
    const savedClientesBusqueda = localStorage.getItem("clientesBusqueda");
    return savedClientesBusqueda ? JSON.parse(savedClientesBusqueda) : [];
  });

  const [productoscliente, setProductosClienteBusqueda] = useState(() => {
    const savedProductosCliente = localStorage.getItem("productoscliente");
    return savedProductosCliente ? JSON.parse(savedProductosCliente) : [];
  });

  const [gestionesCliente, setGestionesCliente] = useState(() => {
    const savedGestionesCliente = localStorage.getItem("gestionesCliente");
    return savedGestionesCliente ? JSON.parse(savedGestionesCliente) : [];
  });

  const [cancelado, setCancelado] = useState(() => {
    const savedCancelado = localStorage.getItem("cancelado");
    return savedCancelado === "true"; // "true" como string convertido a booleano
  });

  const [gestionElegida, setGestionElegida] = useState(() => {
    const savedGestionElegida = localStorage.getItem("gestionElegida");
    return savedGestionElegida ? JSON.parse(savedGestionElegida) : null;
  });

  // Guarda los estados en localStorage cuando cambian
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
    localStorage.setItem("autenticado", autenticado.toString()); // Guarda 'true' o 'false' como string
    localStorage.setItem("cliente", JSON.stringify(cliente));
    localStorage.setItem("clientesBusqueda", JSON.stringify(clientesBusqueda));
    localStorage.setItem("productoscliente", JSON.stringify(productoscliente));
    localStorage.setItem("gestionesCliente", JSON.stringify(gestionesCliente));
    localStorage.setItem("cancelado", cancelado.toString());
    localStorage.setItem("gestionElegida", JSON.stringify(gestionElegida));
  }, [
    user,
    autenticado,
    cliente,
    clientesBusqueda,
    productoscliente,
    gestionesCliente,
    cancelado,
    gestionElegida
  ]);

  return (
    <DataContext.Provider
      value={{
        user,
        cliente,
        autenticado,
        gestionesCliente,
        clientesBusqueda,
        productoscliente,
        cancelado,
        gestionElegida,
        setGestionElegida,
        setProductosClienteBusqueda,
        setClientesBusqueda,
        setGestionesCliente,
        setUser,
        setCliente,
        setAutenticado,
        setCancelado
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
