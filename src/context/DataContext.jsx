import { createContext, useContext, useState } from "react";
// import { loginRequest, registerRequest } from "../API/auth.js";
// import Cookies from 'js-cookie';

export const DataContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useAuth  debe ser usado con un AuthProvider");
  }
  return context;
};
// eslint-disable-next-line react/prop-types
export const DataProvider = ({children}) => {

  const [user, setUser] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [autenticado, setAutenticado] = useState(false);
  const [clientesBusqueda, setClientesBusqueda] = useState([]);
  const [productoscliente, setProductosClienteBusqueda] = useState([]);
  const [gestionesCliente, setGestionesCliente] = useState([]);
  const [cancelado, setCancelado] = useState(false)
  const [gestionElegida, setGestionElegida] = useState(null);

//   const [idJust, setIdJust] = useState();
//   const [idSolVac, setIdSolVac] = useState();
//   const [filtrosJustificaciones, setFiltrosJustificaciones] = useState({
//     fechaInicio: null,
//     fechaFin: null,
//     asesor: '',
//     grupo: ''
//   });



//   const signup = async (user) => {
//     try {
//       const res = await registerRequest(user);
//       console.log(res.data);
//       setUser(res.data);
//       setAutenticado(true);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const signIn = async (user) => {
//     try {
//       const res = await loginRequest(user);
//       // console.log('esto esta en data');
//       // console.log(res.data.user);
//       setUser(res.data);
//       setAutenticado(true);
//     } catch (error) {
//       console.log(error.response);
//       setErrores(error.response.data);
//     }
//   };
 
//   useEffect(() => {
//      const cookies = Cookies.get()  
//      if(cookies.token){
//         // console.log(cookies.token)
//      }
    
//   }, [])
  
  return (
    <DataContext.Provider
      value={{
        // signup,
        // signIn,
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
        // errores,
        // idJust,
        // setIdJust,
        // idSolVac,
        // setIdSolVac,
        // setErrores,
        // setAutenticado,
        // filtrosJustificaciones,
        // setFiltrosJustificaciones
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
