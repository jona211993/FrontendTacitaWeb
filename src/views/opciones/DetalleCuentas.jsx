import { useEffect, useState } from "react";
import { useData } from "../../context/DataContext.jsx";
import { Table } from "antd";
import { Descriptions } from "antd";
import 'animate.css';
const DetalleCuentas = () => {
  const { cliente } = useData();
  const [cuentas, setCuentas] = useState([]); // Estado para las cuentas
  const [loading, setLoading] = useState(false); // Estado para el loading
  const [error, setError] = useState(null); // Estado para el manejo de errores
  const [selectedCuenta, setSelectedCuenta] = useState(null); // Estado para la cuenta seleccionada

  useEffect(() => {
    if (cliente && cliente.DOCUMENTO) {
      const fetchCuentas = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/obtenerDetalleCuentas`,
            {
              method: "POST", // Método POST
              headers: {
                "Content-Type": "application/json", // Especificamos que el contenido es JSON
              },
              body: JSON.stringify({
                documento: cliente.DOCUMENTO, // Primer campo enviado
                cartera: cliente.CARTERA, // Segundo campo enviado
              }),
            }
          );

          if (!response.ok) {
            throw new Error("Error en la respuesta de la API");
          }

          const data = await response.json();
          console.log(data.data)
          setCuentas(data.data); // Guardar las cuentas en el estado
        } catch (err) {
          setError("Error al cargar las cuentas");
          console.log(err);
        } finally {
          setLoading(false); // Desactivar el estado de carga
        }
      };

      fetchCuentas();
    }
  }, [cliente]);

  // Nuevo useEffect para seleccionar la primera cuenta
  useEffect(() => {
    if (cuentas.length > 0) {
      console.log(cuentas)
      setSelectedCuenta(cuentas[0]); // Seleccionar la primera cuenta
    }
  }, [cuentas]);

  // Definir las columnas de la tabla (ajústalas según los datos que tengas)
  const columns = [
    {
      title: "Número Cuenta",
      dataIndex: "codCuenta",
      key: "numeroCuenta",
    },
    {
      title: "Saldo Capital (S/.)",
      dataIndex: "saldCapSol",
      key: "saldoCapSol",
      render: (value) => 
        value 
          ? Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
          : "No disponible",
    },
    {
      title: "Fecha Desembolso",
      dataIndex: "fecDesemb",
      key: "fecDesemb",
    },
    {
      title: "Moneda",
      dataIndex: "moneda",
      key: "moneda",
      render: (text) => {
        return text === "S" ? "SOLES" : text === "D" ? "DÓLARES" : text;
      },
    },
    {
      title: "Cartera",
      dataIndex: "CARTERA",
      key: "cartera",
    },
    {
      title: "COD CENTRAL",
      dataIndex: "codCental",
      key: "codCentral",
    },
    // Agrega más columnas según los datos que recibas de la API
  ];

  const items = [
    {
      label: "NÚMERO DE CUENTA",
      children: selectedCuenta? selectedCuenta.codCuenta : "",
    },
    {
      label: "MONEDA",
      span: 1,
      children: selectedCuenta?
      ( selectedCuenta.moneda === "S"
        ? "SOLES"
        : selectedCuenta.moneda === "D"
        ? "DÓLARES"
        : selectedCuenta.moneda)
        :""
,
    },
    {
      label: "PRODUCTO",
      span: 1,
      children: selectedCuenta? selectedCuenta.PRODUCTO || "": ""
    },
    {
      label: "CUOTAS",
      span: 1,
      children:
      selectedCuenta?
      selectedCuenta.numCuota || ""
      :"",
    },
    
    {
      label: "SUBPRODUCTO",
      span: 1,
      children: 
      selectedCuenta?
      selectedCuenta.SUBPRODUCTO || ""
      :"",
    },
    {
      label: "VALOR CUOTAS",
      span: 1,
      children:
      selectedCuenta?
      selectedCuenta.valCuota 
      ? Number(selectedCuenta.valCuota).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) 
      : ""
      :"",
    },
    
    {
      label: "FECHA DESEMBOLSO",
      span: 1,
      children: 
      selectedCuenta?
      selectedCuenta.fecDesemb || ""
      :"",
    },
    {
      label: "DK",
      span: 1,
      children:
      selectedCuenta?
      selectedCuenta.saldCapSol 
      ? Number(selectedCuenta.saldCapSol).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) 
      : ""
      :"",
    },

    {
      label: "MONTO DESEMBOLSADO",
      span: 1,
      children:
      selectedCuenta?
      (selectedCuenta.mtoDesembOrigen 
      ? Number(selectedCuenta.mtoDesembOrigen).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 }): "")
      : ""
    },
    {
      label: "DT",
      span: 1,
      children:
      selectedCuenta?
      selectedCuenta.saldTotSol 
      ? Number(selectedCuenta.saldTotSol).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) 
      : ""
      :""
    },
    {
      label: "FECHA CASTIGO",
      span: 1,
      children: 
      selectedCuenta?
      selectedCuenta.fecCastigo || ""
      :"",
    },
    // Condicional para mostrar solo si la moneda es "D"
    ...(selectedCuenta?
       selectedCuenta.moneda === "D"
      ? [
        {
          label: "DK (Dólares Orig)",
          span: 1,
          children:
          selectedCuenta.saldCapOrig || "0.0",
        },
        ]
      : []
    :""),
   
    {
      label: "COSECHA",
      span: 1,
      children: 
      selectedCuenta?
      selectedCuenta.cosecha || ""
      :"",
    },
     // Condicional para mostrar solo si la moneda es "D"
     ...(
      selectedCuenta?
      selectedCuenta.moneda === "D"
      ? [
        {
          label: "DT (Dólares Orig)",
          span: 1,
          children:
          selectedCuenta.saldTotOrig || "0.0",
        },
        ]
      : []
      :""),
   
  ];
  return (
    
    <div className=" pl-4 h-full flex items-center flex-col animate__animated animate__fadeIn animate__faster ">
      <div className="flex justify-center items-center">
        <h1 className=" mt-2 text-2xl">Detalle Cuentas</h1>
      </div>

      {/* Mostrar un mensaje si está cargando o hay un error */}
      {loading && <p>Cargando cuentas...</p>}
      {error && <p>{error}</p>}

      {/* Tabla de cuentas */}
      {cuentas.length > 0 ? (
        <>
          <div className="w-3/4 mt-4">
            <Table
              className="custom-table-DetalleCuentas"
              dataSource={cuentas}
              columns={columns}
              rowKey="numeroCuenta"
              pagination={false}
              onRow={(record) => {
                return {
                  onClick: () => {
                    setSelectedCuenta(record); // Guardar la cuenta seleccionada
                  },
                };
              }}
            />
          </div>
          {/* Mostrar detalles de la cuenta seleccionada */}
          {selectedCuenta && (
            <Descriptions            
            bordered
            title="Información de la cuenta: "
            className="custom-descriptionsdetalle mt-5"
            column={2}
            items={items}
          />
          )}
        </>
      ) : (
        <p>No hay cuentas disponibles</p>
      )}
    </div>
  );
};

export default DetalleCuentas;
