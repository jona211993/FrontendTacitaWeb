import { Button, Form, Input } from "antd";
// import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useData } from "./context/DataContext.jsx";

const Login = () => {
  const { setUser } = useData();

  const onFinish = (values) => {
    console.log("Exitoso:", values.usuario);
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/login`, {
        usuario: values.usuario,
        contrasenia: values.contrasenia,
      })
      .then((res) => {
        if (res.status == 200) {
          setUser(res.data.user);
          navigate("/expertisERP/clientes");
        } else {
          alert("algo salio mal");
        }
      })
      .catch((err) => console.log(err));
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Fallido:", errorInfo);
    alert("No se pudo autenticar... intente denuevo");
  };

  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  return (
    <div className=" w-screen h-screen flex gap-20 items-center justify-center p-2 bg-cyan-950">
      <div className="flex flex-col gap-10 items-center w-1/3 xs:w-3/4 xs2:w-4/5 sm:w-1/2 md:w-2/5 lg:w-2/6  h-3/4 rounded-xl p-5 custom-shadow bg-white ">
        <img className="mt-2" src="src/images/icono-logo.png" alt="Logo" />
        <h1 className="text-gray-900 font-semibold font-mono text-3xl">ERP-EXPERTIS</h1>
        <Form
          className=" h-1/6 gap-7"
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Usuario"
            name="usuario"
            rules={[
              {
                required: true,
                message: "Por favor ingrese su usuario!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Contraseña"
            name="contrasenia"
            rules={[
              {
                required: true,
                message: "Por favor ingrese su clave!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Ingresar
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className=" w-1/4" >
       <img src="src/images/Robot3D.gif" alt="" />           
      </div>
    </div>
  );
};

export default Login;
