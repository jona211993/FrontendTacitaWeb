import { useState, useEffect } from "react";
import { Select, Input, Button, Table } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { EyeOutlined } from "@ant-design/icons";
import axios from "axios";
import { Link } from "react-router-dom";
import { useData } from "../context/DataContext.jsx";
import 'animate.css';

const MenuClientes = () => {
  const [selectedOption, setSelectedOption] = useState("1");
  const [inputValues, setInputValues] = useState({
    codigoIdc: "",
    telefono: "",
    nombres: "",
    apellidos: "",
  });

  const [data, setData] = useState([]);
  const { setCliente, clientesBusqueda, setClientesBusqueda } = useData();

  const handleVer = (cliente) => {
    console.log("Nos dirigimos a la nueva vista:   ");
    setCliente(cliente);
  };

  const columns = [
    {
      title: "DOC TITULAR",
      width: 5,
      dataIndex: "DOCUMENTO",
    },
    {
      title: "NOMBRE DEL TITULAR",
      width: 10,
      dataIndex: "NOMBRE_COMPLETO",
    },
    {
      title: "CARTERA",
      dataIndex: "CARTERA",
      width: 8,
    },
    {
      title: "Ver",
      width: 3,
      render: (record) => (
        <Link to="/expertisERP/detalleCliente">
          <Button
            className="acciones-button"
            icon={<EyeOutlined style={{ color: "blue" }} />}
            onClick={() => handleVer(record)}
          />
        </Link>
      ),
    },
  ];
  const handleSelectChange = (value) => {
    setSelectedOption(value);
    setInputValues({ codigoIdc: "", telefono: "", nombres: "", apellidos: "" }); // Limpiar inputs
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputTelefonoChange = (e) => {
    const { name, value } = e.target;    
   // Permitir solo números y con un máximo de 9 cifras, incluyendo la posibilidad de que el campo esté vacío
   if (/^\d{0,9}$/.test(value)) {
    setInputValues((prev) => ({ ...prev, [name]: value }));
  }
  };

  const handleSearch = () => {
    // Aquí iría la lógica para realizar la consulta a la API
    console.log("Buscar con:", inputValues);
    switch (selectedOption) {
      case "1":
        axios
          .get(`${import.meta.env.VITE_BACKEND_URL}/obtenerCliente/${inputValues.codigoIdc}`)
          .then((res) => {
            if (res.status == 200) {
              console.log("se OBTUVO LOS CLIENTES QUE COINCIDEN", res.data);
              setData(res.data);
              setClientesBusqueda(res.data);
            } else {
              alert("error");
              console.log("estas en un error");
            }
          })
          .catch((err) => console.log(err));
        break;

      case "2":
        axios
          .get(`${import.meta.env.VITE_BACKEND_URL}/obtenerClientePorNombreApellido`, {
            params: {
              nombres: inputValues.nombres,
              apellidos: inputValues.apellidos,
            },
          })
          .then((res) => {
            if (res.status == 200) {
              console.log("se OBTUVO LOS CLIENTES QUE COINCIDEN", res.data);
              setData(res.data);
              setClientesBusqueda(res.data);
            } else {
              alert("error");
              console.log("estas en un error");
            }
          })
          .catch((err) => console.log(err));
        break;
      case "3":
        axios
          .get(
            `${import.meta.env.VITE_BACKEND_URL}/obtenerClientePorTelefono/${inputValues.telefono}`
          )
          .then((res) => {
            if (res.status == 200) {
              console.log("se OBTUVO LOS CLIENTES QUE COINCIDEN", res.data);
              setData(res.data);
              setClientesBusqueda(res.data);
            } else {
              alert("error");
              console.log("estas en un error");
            }
          })
          .catch((err) => console.log(err));
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    // Actualiza el estado de data cuando cambian los clientesBuscados
    if (clientesBusqueda) {
      setData(clientesBusqueda);
    }
  }, [clientesBusqueda]);

  const handleKeyPress = (e) => {
    // Permitir solo números
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handlePaste = (e) => {
    const pastedData = e.clipboardData.getData("text");
    // Bloquear pegado si no son solo números o si exceden 9 caracteres
    if (!/^\d{1,9}$/.test(pastedData)) {
      e.preventDefault();
    }
  };

  return (
    <div className="animate__animated animate__fadeIn animate__faster">
      <div className="font-bold text-xl">CLIENTE</div>
      <div className="flex w-full gap-12 mb-6 mt-6">
        <div className="flex flex-col w-1/2 gap-5 p-5 ">
          <div className="flex  gap-4">
            <label style={{ marginBottom: 5, display: "block" }}>
              Busqueda por:
            </label>
            <Select
              className="w-52"
              showSearch={false}
              placeholder="Búsqueda por: "
              onChange={handleSelectChange}
              defaultValue={'CODGO IDC'}
              options={[
                { value: "1", label: "CODIGO IDC" },
                { value: "2", label: "NOMBRE" },
                { value: "3", label: "TELEFONO" },
              ]}
            />
          </div>
          <div className="flex gap-5">
            <label
              style={{ marginBottom: 5, display: "block", width: "100px" }}
            >
              CÓDIGO IDC:
            </label>
            <Input
              name="codigoIdc"
              placeholder="CODIGO IDC"
              value={inputValues.codigoIdc}
              onChange={handleInputChange}
              disabled={selectedOption !== "1"}
            />
          </div>
          <div className="flex gap-8">
            <label style={{ marginBottom: 5, display: "block" }}>
              TELÉFONO:
            </label>
            <Input
              name="telefono"
              placeholder="TELEFONO"
              value={inputValues.telefono}
              onChange={handleInputTelefonoChange}
              onKeyUp={handleKeyPress}
               onPaste={handlePaste}
              disabled={selectedOption !== "3"}
            />
          </div>
        </div>

        <div className=" flex flex-col w-1/2 gap-5 p-8">
          <div className="flex gap-4">
            <label style={{ marginBottom: 5, display: "block" }}>
              NOMBRES:
            </label>
            <Input
              name="nombres"
              placeholder="NOMBRES"
              value={inputValues.nombres}
              onChange={handleInputChange}
              disabled={selectedOption !== "2"}
            />
          </div>
          <div className="flex gap-4">
            <label style={{ marginBottom: 5, display: "block" }}>
              APELLIDOS: 
            </label>
            <Input
              name="apellidos"
              placeholder="APELLIDOS"
              value={inputValues.apellidos}
              onChange={handleInputChange}
              disabled={selectedOption !== "2"}
            />
          </div>
        </div>
      </div>

      <div className=" flex justify-center">
        <Button onClick={handleSearch} icon={<SearchOutlined />} type="primary">
          Buscar
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data.data}
        className="custom-table-busqClientes mt-5 ml-5 mr-5"
        scroll={{
          x: 1000,
          y: 400,
        }}
      />
    </div>
  );
};

export default MenuClientes;
