import { Card, Button, Input } from "antd";
import { useEffect, useState } from "react";
import { useData } from "../../context/DataContext.jsx";
import { EditOutlined, DeleteOutlined, SaveOutlined } from "@ant-design/icons"; // Íconos de Ant Design

const Mensaje = () => {
  const [mensaje, setMensaje] = useState(""); // Estado para el mensaje
  const [loading, setLoading] = useState(false); // Estado para el loading

  const [isEditing, setIsEditing] = useState(false); // Estado para el modo de edición
  const [tempMensaje, setTempMensaje] = useState(""); // Mensaje temporal para la edición
  const { cliente, user } = useData();

  const handleEdit = () => {
    setIsEditing(true); // Activar modo de edición
    setTempMensaje(mensaje); // Establecer el mensaje actual en el estado temporal
  };

  const handleSave = async () => {
    // Datos que quieres enviar al backend
    const payload = {
      descripcion: tempMensaje,
      id_deudor: cliente.ID_DEUDOR,
      id_entidad: cliente.ID_ENTIDAD,
      alerta : "SI",
      gestor: user.alias
    };
  
    try {
      // Realizar la petición al backend
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/insertarMensaje`, {
        method: 'POST', // o 'PUT' dependiendo de tu necesidad
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload), // Convertir el objeto a JSON
      });
  
      if (response.ok) {
        // Si la respuesta es exitosa
        const result = await response.json();
        console.log('Datos guardados:', result);
  
        setMensaje(tempMensaje); // Actualizar el mensaje con el texto editado    
        setIsEditing(false); // Salir del modo de edición
      } else {
        console.error('Error al guardar los datos:', response.statusText);
      }
    } catch (error) {
      console.error('Error en la petición:', error);
    }
  };

  const handleDelete = async() => {
    setMensaje(""); // Vaciar el mensaje al eliminar
     // Datos que quieres enviar al backend
     const payload = {
      descripcion: "",
      id_deudor: cliente.ID_DEUDOR,
      id_entidad: cliente.ID_ENTIDAD,
      alerta : "NO",
      gestor: user.alias
    };
  
    try {
      // Realizar la petición al backend
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/insertarMensaje`, {
        method: 'POST', // o 'PUT' dependiendo de tu necesidad
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload), // Convertir el objeto a JSON
      });
  
      if (response.ok) {
        // Si la respuesta es exitosa
        const result = await response.json();
        console.log('Datos guardados:', result);
  
        setMensaje(""); // Actualizar el mensaje con el texto editado    
        setIsEditing(false); // Salir del modo de edición
      } else {
        console.error('Error al borrar los datos:', response.statusText);
      }
    } catch (error) {
      console.error('Error en la petición:', error);
    }
  };

  useEffect(() => {
    if (cliente && cliente.DOCUMENTO) {
      const fetchMensaje = async () => {
        setLoading(true);
        try {
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/verMensaje`, {
            method: "POST", // Método POST
            headers: {
              "Content-Type": "application/json", // Especificamos que el contenido es JSON
            },
            body: JSON.stringify({
              idDeudor: cliente.ID_DEUDOR, // Primer campo enviado
              idEntidad: cliente.ID_ENTIDAD, // Segundo campo enviado
            }),
          });

          if (!response.ok) {
            throw new Error("Error en la respuesta de la API");
          }

          const data = await response.json();

          if (data.data[0].descripcion) {
            setMensaje(data.data[0].descripcion); // Guardar la descripción en el estado
          } else {
            setMensaje(""); // Si no hay descripción, vaciar el estado
          }
        } catch (err) {
          
          console.log(err);
        } finally {
          setLoading(false); // Desactivar el estado de carga
        }
      };

      fetchMensaje();
    }
  }, [cliente]);

  return (
    <div className="flex flex-col justify-center items-center  bg-green-100 gap-5 p-5 ">
      {/* Mostrar un mensaje si está cargando o hay un error */}
      {loading && <p>Cargando mensaje...</p>}
      

      {/* Mostrar el mensaje o indicar que no hay mensaje disponible */}
      {mensaje ? (
        <Card         
          bordered={false}
          rows= {5}
          style={{
            width: 300,
          }}
         
        >
          {/* Si estamos editando, mostramos un textarea para modificar el mensaje */}
          {isEditing ? (
            <Input.TextArea
              value={tempMensaje}
              onChange={(e) => setTempMensaje(e.target.value)} // Actualizamos el mensaje temporal
              rows={4}
            />
          ) : (
            <p>{mensaje}</p> // Mostrar el mensaje actual si no estamos editando
          )}

          <div className="flex justify-between mt-4">
            {isEditing ? (
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSave}
              >
                Guardar
              </Button>
            ) : (
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={handleEdit}
              >
                Editar
              </Button>
            )}
            <Button
              type="danger"
              icon={<DeleteOutlined />}
              onClick={handleDelete}
            >
              Eliminar
            </Button>
          </div>
        </Card>
      ) : (
        <Card
          
          bordered={false}
          style={{
            width: 300,
          }}
         
        >
          <p></p> {/* Mostrar un mensaje por defecto si no hay contenido */}
        </Card>
        
      )}
    </div>
  );
};

export default Mensaje;
