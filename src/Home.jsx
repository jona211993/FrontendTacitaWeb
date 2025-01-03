import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MenuClientes from "./views/MenuClientes";


const Home = () => {
  const [auth, setAuth] = useState(false);
  const [name, setName] = useState("");
  const [mensaje, setMensaje] = useState("");


  axios.defaults.withCredentials= true;
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}`).then((res) => {
      if (res.status === 200) {
        setAuth(true);
        setName(res.data.name);
      } else {
        setMensaje(res.data.Message);
      }
    });
  }, []);

  const handleLogout = () =>{
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/logout`)
     .then(res => {
      if(res.data.Status === "Success"){
        console.log("se cerro sesion ")
        location.reload(true);
      } else{
         alert("error");
      }
        
     }).catch(err => console.log(err))

  }


  return (
    <div>
      {
        auth ? (
        <div>
          <h3>Tu estas auterizado {name}</h3>
          <MenuClientes></MenuClientes>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : 
      (
        <div>
          <h1>NOT FOUND</h1>
          <h3>{mensaje}</h3>
          
          <Link to="/login" >Login</Link>
        </div>
      )}
    </div>
  );
};

export default Home;
