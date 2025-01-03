import { Descriptions, Table, Modal, Tag, Input, Button  } from "antd";
import {MessageOutlined, CalendarOutlined,EditOutlined  } from "@ant-design/icons";
const { TextArea } = Input;
import {
  datosGestionesClienteByDocumentoAndCartera,
  datosPagosClienteByIdDeudorAndEntidad,
  datosProductosClienteByIdDeudorAndEntidad,
  datosTitularIdDeudor,
  datosExcepcionesClienteByIdDeudorAndEntidad,
} from "../API/ClientesRequests.js";
import { useData } from "../context/DataContext.jsx";
import { useEffect, useState } from "react";
import "../styles/estlosAntDesginn.css";
import Mensaje from "../views/opciones/Mensaje.jsx";
import 'animate.css';
import Agendar from "../components/Agendar.jsx";
import ModificarGestion from "./opciones/ModificarGestion.jsx";

const DetalleCliente = () => {
  const [DatosTitular, setDatosTitular] = useState(null);
  const { cliente, setProductosClienteBusqueda, setCancelado,setGestionElegida } = useData();
  const [DatosProductos, setDatosProductos] = useState([]);
  const [DatosPagos, setDatosPagos] = useState([]);
  const [DatosExcepciones, setDatosExcepciones] = useState([]);
  const [DatosGestiones, setDatosGestiones] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleEstadoCliente, setIsModalVisibleEstadoCliente] =
    useState(false);
  const [isModalVisibleEstadoCancelado, setIsModalVisibleEstadoCancelado] =
    useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRowGestion, setSelectedRowGestion] = useState(null);

  const [isModalMensajeVisible, setIsModalMensajeVisible] = useState(false);
  const [isModalAgendarVisible, setIsModalAgendarVisible] = useState(false);
  const [isModalModificarVisible, setIsModalModificarVisible] = useState(false);
  // {console.log(isModalMensajeVisible)}
  /*===================Para Campo Observacion al darle click====================================*/
  const onRowClick = (record) => {
    setSelectedRowGestion(record);
    setGestionElegida(record);
  };

  // const rowGestionSelection = {
  //   onChange: (selectedRowKeys, selectedRows) => {
  //     // Aquí puedes manejar la selección de filas si lo deseas
  //   },
  //   onSelect: (record) => {
  //     onRowClick(record);
  //   },
  // };
  /*======================================================*/

  useEffect(() => {
    const LosDatosTitular = async () => {
      try {
        console.log(cliente.ID_DEUDOR);
        const response = await datosTitularIdDeudor(cliente.ID_DEUDOR);
        console.log(response[0]); // Almacena los datos en el estado
        setDatosTitular(response[0]);
      } catch (error) {
        console.error(
          "Hubo un error al obtener los datos del cliente en mencion:",
          error
        );
      }
    };
    LosDatosTitular();
  }, [cliente]);

  const itemsDatosTitular = DatosTitular
    ? [
        {
          key: "1",
          label: "Documento",
          children: DatosTitular.DOCUMENTO,
        },
        {
          key: "2",
          label: "Nombre Titular",
          children: DatosTitular.NOMBRE_COMPLETO,
        },
        {
          key: "3",
          label: "Departamento",
          children: DatosTitular.DEPARTAMENTO,
        },
        {
          key: "4",
          label: "Distrito",
          children: DatosTitular.DISTRITO,
        },
        {
          key: "5",
          label: "Dirección",
          children: DatosTitular.direccion,
        },
      ]
    : [];

  // Para los Productos

  useEffect(() => {
    const LosDatosProductos = async () => {
      try {
        console.log("Estoy en Productos", cliente.ID_DEUDOR);
        console.log(cliente.ID_ENTIDAD);
        const response = await datosProductosClienteByIdDeudorAndEntidad(
          cliente.ID_DEUDOR,
          cliente.ID_ENTIDAD
        );
        console.log("Apunto de mostrar lo del response de productos:"); // Almacena los datos en el estado
        if (response) {
          if (response.length > 0) {
            console.log("este es el response de productos: ", response[0]); // Almacena los datos en el estado
            console.log("sacando la agencia: ", response[0].AGENCIA); // Almacena los datos en el estado
            setProductosClienteBusqueda(response[0]);
            setDatosProductos(response[0]);
          } else {
            if (cliente.ESTADO_CLIENTE == null) {
              setIsModalVisibleEstadoCancelado(true);
              setCancelado(true)
            }
            console.warn(
              "No se encontraron datos de los Productos, cliente cancelado."
            );
            setDatosProductos([]); // O establece un estado que indique que no hay datos
          }
        } else {
          // Manejar el caso donde no hay datos debido a un 404
          console.warn("No se encontraron datos de los Productos.");

          if (cliente.ESTADO_CLIENTE == null) {
            setIsModalVisibleEstadoCancelado(true);
            setCancelado(true)
          }
          setDatosProductos([]);
          setProductosClienteBusqueda([])
        }
      } catch (error) {
        console.error(
          "Hubo un error al obtener los datos de los productos del cliente en mencion:",
          error
        );
      }
    };
    LosDatosProductos();
  }, [cliente,DatosPagos]);

  const itemsDatosProductos = [
    {
      key: "1",
      label: "CARTERA",
      children: DatosProductos.CARTERA ?? "",
    },
    {
      key: "2",
      label: "CANAL",
      children: DatosProductos.AGENCIA,
    },
    {
      key: "3",
      label: "ANTIGUEDAD",
      children: DatosProductos.ANTIGUEDAD,
    },
    {
      key: "4",
      label: "JUDICIAL",
      children: DatosProductos.JUDICIAL,
    },
    {
      key: "5",
      label: "DK ACTUAL",
      children: DatosProductos.DK
        ? parseFloat(DatosProductos.DK)
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, "$&,")
        : "",
    },
    {
      key: "6",
      label: "DT ACTUAL",
      children: DatosProductos.DT
      ? parseFloat(DatosProductos.DT)
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, "$&,")
        : "",
    },
  ];

  const itemsMinimos = [
    {
      key: "1",
      label: "MIN 1",
      children: DatosProductos.C1 ?
      parseFloat(DatosProductos.C1)
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, "$&,")
        : "",
    },
    {
      key: "2",
      label: "MIN 2",
      children: DatosProductos.MIN2?
      parseFloat(DatosProductos.MIN2)
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, "$&,")
        :"",
    },
    {
      key: "3",
      label: "C3",
      children:  DatosProductos.C3?
      parseFloat(DatosProductos.C3)
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, "$&,")
        :"",
    },
    {
      key: "4",
      label: "C6",
      children: DatosProductos.C6?
       parseFloat(DatosProductos.C6)
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, "$&,")
        :"",
    },
    {
      key: "5",
      label: "C12",
      span: 2,
      children:  DatosProductos.C12?
      parseFloat(DatosProductos.C12)
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, "$&,")
        : "" ,
    },
  ];
  // Para los Pagos

  useEffect(() => {
    const LosDatosPagos = async () => {
      try {
        console.log(cliente.ID_DEUDOR);
        console.log(cliente.ID_ENTIDAD);
        const response = await datosPagosClienteByIdDeudorAndEntidad(
          cliente.ID_DEUDOR,
          cliente.ID_ENTIDAD
        );

        // Verificar si la respuesta contiene datos
        if (response && response.length > 0) {
          console.log("monstrando")
          console.log(response[0]); // Almacena los datos en el estado
          setDatosPagos(response);
        } else {
          // Manejar el caso donde no hay datos
          console.warn("No se encontraron datos de pagos.");
          setDatosPagos([]); // O establece un estado que indique que no hay datos
        }
      } catch (error) {
        console.error(
          "Hubo un error al obtener los datos de los pagos del cliente en mención:",
          error
        );
        setDatosPagos([]); // También puedes establecer un estado vacío aquí si hay un error
      }
    };
    LosDatosPagos();
    setCancelado(false)
  }, [cliente]);
  const columnasPagos = [
    {
      title: "Fecha",
      dataIndex: "fecPago",
      key: "fecPago",
      render: (text) => text[0], // Mostrar el primer elemento del arreglo
    },
    {
      title: "Monto",
      dataIndex: "mtoPago",
      key: "mtoPago",
    },
    {
      title: "Fecha Reconoc",
      dataIndex: "fecReconocimiento",
      key: "fecReconocimiento",
    },
  ];
  // =================  TAbla de PAgos  =====================//

  const columnasExcepciones = [
    {
      title: "Fecha Exc.",
      dataIndex: "FEC_EXCEPCION",
      key: "FEC_EXCEPCION",
    },
    {
      title: "Monto Apr.",
      dataIndex: "MONTO_APROBADO",
      key: "MONTO_APROBADO",
    },
    {
      title: "Fecha Pago",
      dataIndex: "FEC_POSIBLEPAGO",
      key: "FEC_POSIBLEPAGO",
    },
    {
      title: "Asesor",
      dataIndex: "SOLICITANTE",
      key: "SOLICITANTE",
    },
    {
      title: "Estado",
      dataIndex: "APROBADO",
      key: "APROBADO",
    },
  ];
  // Para las Excxepciones

  useEffect(() => {
    const LosDatosExcepciones = async () => {
      try {
        console.log(cliente.ID_DEUDOR);
        console.log(cliente.ID_ENTIDAD);
        const response = await datosExcepcionesClienteByIdDeudorAndEntidad(
          cliente.ID_DEUDOR,
          cliente.ID_ENTIDAD
        );

        if (response) {
          if (response.length > 0) {
            console.log(response[0]); // Almacena los datos en el estado
            setDatosExcepciones(response);
          } else {
            console.warn("No se encontraron datos de las excepciones.");
            setDatosExcepciones([]); // O establece un estado que indique que no hay datos
          }
        } else {
          // Manejar el caso donde no hay datos debido a un 404
          console.warn("No se encontraron datos de las excepciones.");
          setDatosExcepciones([]);
        }
      } catch (error) {
        console.error(
          "Hubo un error al obtener los datos de las excepciones del cliente en mención:",
          error
        );
        setDatosExcepciones([]); // También puedes establecer un estado vacío aquí si hay un error
      }
    };
    LosDatosExcepciones();
  }, [cliente]);
  // =================  TAbla de PAgos  =====================//

  //Para las Gestiones:

  useEffect(() => {
    const LosDatosGestiones = async () => {
      try {
        console.log(cliente.DOCUMENTO);
        console.log(cliente.CARTERA);
        const response = await datosGestionesClienteByDocumentoAndCartera(
          cliente.DOCUMENTO,
          cliente.CARTERA
        );

        // Verificar si la respuesta contiene datos
        if (response && response.length > 0) {
          console.log(response); // Almacena los datos en el estado
          setDatosGestiones(response);
        } else {
          // Manejar el caso donde no hay datos
          console.warn("No se encontraron datos de las gestiones.");
          setDatosPagos([]); // O establece un estado que indique que no hay datos
        }
      } catch (error) {
        console.error(
          "Hubo un error al obtener los datos de las gestiones del cliente en mención:",
          error
        );
        setDatosPagos([]); // También puedes establecer un estado vacío aquí si hay un error
      }
    };
    LosDatosGestiones();
  }, [cliente]);

  // =================  TAbla de Gestiones  =====================//
  const columnasGestiones = [
    {
      title: "ID GESTION",
      dataIndex: "idGestion",
      key: "idGestion",
      width: 90,
      align: "center",
    },
    {
      title: "F.LLAMADA",
      dataIndex: "fechaLlamada",
      key: "fechaLlamada",
      width: 80,
      align: "center",
    },
    {
      title: "HORA",
      dataIndex: "hora",
      key: "hora",
      width: 80,
      align: "center",
    },
    {
      title: "NIVEL2",
      dataIndex: "nvl2",
      key: "nvl2",
      width: 50,
      align: "center",
    },
    {
      title: "F.COMPROMISO",
      dataIndex: "fecCompromiso",
      key: "fecCompromiso",
      width: 100,
      default: "",
      align: "center",
    },
    {
      title: "MONTO",
      dataIndex: "monto",
      key: "monto",
      width: 80,
      align: "center",
    },
    {
      title: "ASESOR",
      dataIndex: "asesor",
      key: "asesor",
      width: 120,
      align: "center",
    },
    {
      title: "CANAL GESTION",
      dataIndex: "agencia",
      key: "agencia",
      width: 100,
      align: "center",
    },
  ];

  // =================  TAbla de Telefonos  =====================//
  const columnasTelefonos = [
    {
      title: "Teléfono",
      dataIndex: "telefono",
      key: "telefono",
      width: 90,
      align: "center",
    },
    {
      title: "Fecha",
      dataIndex: "fechaLlamada",
      key: "fechaLlamada",
      width: 80,
      align: "center",
    },
  ];

  // funcion que de DatosGestiones traiga  aquellos 2 ultimoms telfonos cef

  const obtenerTelefonos = (datos) => {
    // Filtrar los elementos que cumplen con la condición
    const contactosEfectivos = datos.filter(
      (item) =>
        item.nvl1 === "CONTACTO EFECTIVO" &&
        item.telefono &&
        item.telefono.length === 9
    );
    // console.log(contactosEfectivos);

    // Mapear para obtener solo los campos deseados
    const resultadosFiltrados = contactosEfectivos.map(
      ({ fechaLlamada, telefono, hora }) => ({
        fechaLlamada,
        telefono,
        hora,
      })
    );

    // console.log(resultadosFiltrados);

    // Crear un objeto para almacenar el teléfono y la fecha más reciente
    const telefonosUnicos = {};

    // Recorrer los resultados filtrados
    resultadosFiltrados.forEach(({ telefono, fechaLlamada, hora }) => {
      const fechaActual = new Date(`${fechaLlamada} ${hora}`);

      // Si el teléfono no está en el objeto, agregarlo

      if (!telefonosUnicos[telefono]) {
        telefonosUnicos[telefono] = { fechaLlamada, hora };
      } else {
        // Comparar fechas para conservar el más reciente
        const fechaGuardada = new Date(
          `${telefonosUnicos[telefono].fechaLlamada} ${telefonosUnicos[telefono].hora}`
        );

        if (fechaActual > fechaGuardada) {
          telefonosUnicos[telefono] = { fechaLlamada, hora };
        }
      }
    });

    // Convertir el objeto a un arreglo
    const resultadoFinal = Object.entries(telefonosUnicos).map(
      ([telefono, { fechaLlamada, hora }]) => ({
        telefono,
        fechaLlamada,
        hora,
      })
    );

    // console.log("lo final : ", resultadoFinal);

    return resultadoFinal;
  };

  // Suponiendo que DatosGestionesCliente.data contiene tu arreglo
  const telefonosObtenidos = obtenerTelefonos(DatosGestiones);
  // Ordenar por fecha
  const telefonosOrdenados = telefonosObtenidos.sort((a, b) => {
    // Convertir las fechas a objetos Date para compararlas
    const fechaA = new Date(a.fechaLlamada.split("-").reverse().join("-")); // Cambiar a formato YYYY-MM-DD
    const fechaB = new Date(b.fechaLlamada.split("-").reverse().join("-"));

    return fechaB - fechaA; // Orden ascendente
  });

  // Si necesitas orden descendente, cambia el retorno a: return fechaB - fechaA;

  // console.log(telefonosOrdenados);

  const handleRowClick = (record) => {
    setSelectedRow(record);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  // Para el modal de inicio
  useEffect(() => {
    if (cliente.ESTADO_CLIENTE !== null) {
      setIsModalVisibleEstadoCliente(true);
    }
  }, [cliente]);
  const handleOkEstadoCliente = () => {
    setIsModalVisibleEstadoCliente(false);
  };

  // Para el modal de Cancelado
  const handleOkEstadoClienteCancelado = () => {
    setIsModalVisibleEstadoCancelado(false);
  };


  // Para el modal del mensaje: 
  const showModal = () => {
    setIsModalMensajeVisible(true);
  };

  const handleModalOk = () => {
    setIsModalMensajeVisible(false);
  };

  const handleCancel = () => {
    setIsModalMensajeVisible(false);
  };

  // Para el modal del Agendar: 
  const showModalAgendar = () => {
    setIsModalAgendarVisible(true);
  };

  const handleModalAgendarOk = () => {
    setIsModalAgendarVisible(false);
  };

  const handleCancelAgendar = () => {
    setIsModalAgendarVisible(false);
  };

   // Para el modal del mensaje: 
   const showModalModificar = () => {
    selectedRowGestion?(
    setIsModalModificarVisible(true)): alert("Elija primero una gestión");
  };

  const closeModalModificar = () => setIsModalModificarVisible(false);
  // const handleModalOkModificar = () => {
  //   setIsModalModificarVisible(false);
  // };

  const handleCancelModificar = () => {
    setIsModalModificarVisible(false);
  };

  return (
    <>
      {cliente ? (
        <div className="animate__animated animate__fadeInDown animate__faster">
          <div className="flex flex-row gap-2 ">
            <div className="w-2/4">
              <Descriptions
                title="Datos Titular"
                items={itemsDatosTitular}
                layout="vertical"
                className="custom-descriptions " // Aplica clase personalizada
              />
            </div>

            <div className="w-2/4 flex flex-col gap-5 ">
              <div>
                <Descriptions
                  title="Productos"
                  items={itemsDatosProductos}
                  className="custom-descriptions" // Aplica clase personalizada
                />
              </div>

              <div>
                <Descriptions
                  layout="vertical"
                  bordered
                  items={itemsMinimos}
                  column={6}
                  className="custom-descriptions" // Aplica clase personalizada
                />
              </div>
            </div>
          </div>

          <div>
          <div>
      {/* Botón para abrir el modal */}
      <Button className="mt-5 bg-yellow-400" type="primary" onClick={showModal} icon={<MessageOutlined />}>
        Abrir Mensaje
      </Button>

      {/* Modal que contiene el componente Mensaje */}
      <Modal
        title="Mensaje"
        visible={isModalMensajeVisible}
        onOk={handleModalOk}
        onCancel={handleCancel}
        footer={null} // Ocultamos los botones por defecto del modal
      >
        <Mensaje /> {/* Aquí renderizamos el componente Mensaje dentro del modal */}
      </Modal>
      <Button className=" ml-3 mt-5 bg-cyan-700" type="primary" onClick={showModalAgendar} icon={<CalendarOutlined />} >
        AGENDAR 
      </Button>
      <Modal
        
        title="AGENDAMIENTO"
        visible={isModalAgendarVisible}
        onOk={handleModalAgendarOk}
        onCancel={handleCancelAgendar}
        footer={null} // Ocultamos los botones por defecto del modal
      >
        <Agendar></Agendar>
      </Modal>

       {/* Botón para mODIFICAR*/}
       <Button className="mt-5 ml-3 bg-green-700" type="primary" onClick={showModalModificar} icon={<EditOutlined />}>
        MODIFICAR
      </Button>
      <Modal
        
        title="MODIFICANDO GESTION"
        visible={isModalModificarVisible}      
        onCancel={handleCancelModificar}
        footer={null} // Elimina todos los botones del footer
        width={800}         
      >
        {isModalModificarVisible && <ModificarGestion cerrarModal={closeModalModificar}/>}
      </Modal>

    </div>
          </div>
          <div className="flex flex-row gap-5  ">
            <div className="w-2/5">
              <h1 className="text-base font-semibold p-2 mt-2">Pagos</h1>
              <Table
                dataSource={DatosPagos}
                columns={columnasPagos}
                pagination={false}
                className="custom-table-pagos"
                scroll={{ y: 100 }}
              />
            </div>
            <div className="w-3/5">
              <h1 className="text-base font-semibold p-2 mt-2">Excepciones</h1>
              <Table
                dataSource={DatosExcepciones}
                columns={columnasExcepciones}
                pagination={false}
                className="custom-table-excepciones"
                scroll={{ y: 100 }}
                onRow={(record) => ({
                  onClick: () => handleRowClick(record), // Maneja el clic en la fila
                })}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && selectedRow) {
                    handleRowClick(selectedRow); // Maneja la pulsación de Enter
                  }
                }}
              />
            </div>
          </div>

          <div className="flex flex-row">
            <div className="w-4/6">
              <h1 className="text-lg font-semibold mt-5 ">Gestiones</h1>
              <Table
                dataSource={DatosGestiones}
                columns={columnasGestiones}
                pagination={false}
                className="custom-table"
                scroll={{ y: 120 }}
                // rowSelection={rowGestionSelection}
                onRow={(record) => ({
                  onClick: () => {
                    onRowClick(record);
                    setSelectedRowGestion(record);
                    setGestionElegida(record)

                  },
                  className: selectedRowGestion ? "selected-row" : "",
                })}
              />
            </div>
            <div className="w-2/6">
              <h1 className="text-lg font-semibold mt-5 ">Teléfonos</h1>
              <div className="m-4">
                <Table
                  dataSource={telefonosOrdenados}
                  columns={columnasTelefonos}
                  pagination={false}
                  className="custom-table-telefonos"
                  scroll={{ y: 120 }}
                />
              </div>
            </div>
          </div>
          <div>
            {selectedRowGestion && (
              <div className="flex flex-col">
                <h2 className="text-base font-semibold">
                  Detalles de la fila seleccionada:
                </h2>
                <div className="flex gap-4 mt-1">
                  <h3>Teléfono: </h3>
                  <Tag color="green" className="w-24 align-text-top ">
                    {selectedRowGestion.telefono || "No disponible"}
                  </Tag>{" "}
                </div>
                <div className="flex gap-4 mt-1">
                  <h3>Observación: </h3>
                  <TextArea
                    rows={4}
                    value={selectedRowGestion.observacion || ""}
                    readOnly
                    style={{ borderColor: "#d9d9d9", borderRadius: 4 }}
                  />
                </div>
                {/* Añade más campos según sea necesario */}
              </div>
            )}
          </div>
          <Modal
            title="ESTADO CLIENTE"
            visible={isModalVisibleEstadoCancelado}
            onOk={handleOkEstadoClienteCancelado}
            onCancel={handleOkEstadoClienteCancelado}
          >
            <p>CLIENTE CANCELADO</p>
          </Modal>
          <Modal
            title="Estado del Cliente"
            visible={isModalVisibleEstadoCliente}
            onOk={handleOkEstadoCliente}
            onCancel={handleOkEstadoCliente}
          >
            <p>{cliente.ESTADO_CLIENTE}</p>
          </Modal>
          <Modal
            title="Detalle Excepción"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={() => setIsModalVisible(false)} // Maneja el cierre del modal
            footer={[
              <Button key="ok" type="primary" onClick={handleOk}>
                Aceptar
              </Button>,
            ]}
          >
            {selectedRow && (
              <div className=" flex flex-col gap-3">
                <div className="flex flex-row gap-16">
                  <p>
                    <strong>Fec Excepción:</strong> {selectedRow.FEC_EXCEPCION}
                  </p>
                  <p>
                    <strong>Estado:</strong> {selectedRow.APROBADO}
                  </p>
                </div>
                <div className="flex flex-row gap-24">
                  <p>
                    <strong>Monto Solicitado:</strong>{" "}
                    {selectedRow.MONTO_SOLICITADO}
                  </p>
                  <p>
                    <strong>Monto Aprobado:</strong>{" "}
                    {selectedRow.MONTO_APROBADO}
                  </p>
                </div>
                <div className="flex flex-row gap-28">
                  <p>
                    <strong>Cuota Solicitada:</strong>{" "}
                    {selectedRow.CUOTA_SOLICITADO}
                  </p>
                  <p>
                    <strong>Cuota Aprobada:</strong>{" "}
                    {selectedRow.CUOTA_APROBADO}
                  </p>
                </div>

                <div className="flex flex-row gap-5">
                  <p>
                    <strong>Solicitado por: </strong> {selectedRow.SOLICITANTE}
                  </p>
                  <p>
                    <strong>Aprobado por: </strong> {selectedRow.RESPONSABLE}
                  </p>
                </div>

                <div className="flex flex-row gap-10">
                  <p>
                    <strong>Fec. Posible Pago:</strong>{" "}
                    {selectedRow.FEC_POSIBLEPAGO}
                  </p>
                  <p>
                    <strong>Fec Aprobada:</strong> {selectedRow.FEC_APROBACION}
                  </p>
                </div>

                <p>
                  <strong>Observación Gestor:</strong> {selectedRow.OBSERVACION}
                </p>
                <p>
                  <strong>Observación Aprobador:</strong>{" "}
                  {selectedRow.OBSERVACION2}
                </p>
              </div>
            )}
          </Modal>
        </div>
      ) : (
        <h1>no eligio ningun cliente</h1>
      )}
    </>
  );
};

export default DetalleCliente;
