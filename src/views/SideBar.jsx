import { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import {
  CalendarOutlined,
  FileOutlined,
  TeamOutlined,
  FlagOutlined,
  BookOutlined,
  FolderOpenOutlined,
  DollarOutlined,
  WarningOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { Logo } from "../components/Logo";
import MenuClientes from "./MenuClientes";
import ListaExcepciones from "./ListaExcepciones";
import Pagos from "./Pagos";
import DetalleCliente from "./DetalleCliente";
import IngresarGestion from "./opciones/IngresarGestion";
import DetalleCuentas from "./opciones/DetalleCuentas";
import Mensaje from "./opciones/Mensaje";
import SolicitarExcepcion from "./opciones/SolicitarExcepcion";
import { useData } from "../context/DataContext.jsx";
import SolicitudDocumento from "./opciones/Solicitud Documentos/SolicitudDocumento.jsx";
import ModuloPagosReconocidos from "./ModuloPagosReconocidos.jsx";
import ModuloPagosNOR from "./ModuloPagosNOR.jsx";
import Reclamos from "./Reclamos.jsx";
import ReclamosRegistro from "./ReclamosRegistro.jsx";
import { useNavigate } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute.jsx";
import Excepciones from "./Excepciones.jsx";
import ExcepcionesAsesor from "./ExcepcionesAsesor.jsx";
import BaseManual from "./modulo_bases/BaseManual.jsx";
import SeguimientoPDP from "./modulo_bases/SeguimientoPDP.jsx";
import SeguimientoVLL from "./modulo_bases/SeguimientoVLL.jsx";
// import Cookies from "js-cookie";

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { cliente, user } = useData();
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState([]);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3005/logout", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }

      const result = await response.json();
      console.log("Respuesta del servidor:", result);

      if (result.Status === "Success") {
        console.log(
          "La sesión se cerró correctamente y la cookie fue eliminada."
        );
        navigate("/login"); // Redirigir al login
      } else {
        console.error("Error al cerrar sesión:", result);
      }
    } catch (error) {
      console.error("Error al comunicarse con el servidor:", error);
    }
  };

  useEffect(() => {
     console.log(user.idCargo)
    if (location.pathname.includes("expertisERP/excepciones/Asesor") && user.idCargo === 1) {
      setSelectedKeys(["expertisERP/excepciones/Asesor"]);
    } else if (location.pathname.includes("expertisERP/excepciones")) {
      setSelectedKeys(["expertisERP/excepciones"]);
    } else {
      setSelectedKeys([location.pathname.replace("/", "")]);
    }
  }, [location.pathname, user.idCargo]);

  const items = [
    getItem("Consulta Cliente", "sub1", <TeamOutlined />, [
      getItem("Busqueda Cliente", "expertisERP/clientes"),
      ...(cliente
        ? [
            // Solo incluye estas opciones si cliente no está vacío
            getItem("Detalle", "expertisERP/detalleCliente"),
            getItem("Opciones", "sub-options", <TeamOutlined />, [
              getItem(
                "Ingresar Gestión",
                "expertisERP/cliente/ingresarGestion"
              ),
              getItem("Detalle Cuentas", "expertisERP/cliente/detalleCuentas"),
              getItem(
                "Solicitar Excepción",
                "expertisERP/cliente/solExcepcion"
              ),
              getItem(
                "Solicitar Documento",
                "expertisERP/cliente/solDocumento"
              ),
            ]),
          ]
        : []),
    ]),

    (user.idCargo === 1)
      ? getItem("Lista Excepciones.", "expertisERP/excepciones/Asesor", <FlagOutlined />)
      : getItem("Lista Excepciones", "expertisERP/excepciones", <FlagOutlined />)
    ,

    getItem("Reclamos", "expertisERP/reclamos", <BookOutlined />, [
      getItem("Historial", "expertisERP/reclamosHistorial"),
      getItem("Registro", "expertisERP/reclamosRegistro"),
    ]),
    getItem("Base Documentos", "5", <FolderOpenOutlined />),
    getItem("Pagos", "sub2", <DollarOutlined />, [
      getItem("No Reconocidos", "expertisERP/pagosNOR"),
      getItem("Reconocidos", "expertisERP/pagosReconocidos"),
    ]),
    getItem("Bases", "sub3", <TeamOutlined />, [
      getItem("Base Manual", "expertisERP/baseManual"),
      getItem("Seguimiento PDP", "expertisERP/seguimientoPDP"),
      getItem("Seguimiento VLL", "expertisERP/seguimientoVLL"),
    ]),
    getItem("Agendados", "11", <CalendarOutlined />),
    getItem("Incidencias", "sub4", <WarningOutlined />, [
      getItem("Lista", "12"),
      getItem("Registro", "13"),
    ]),
    getItem("Seguim. INC", "sub5", <FileOutlined />, [
      getItem("Lista", "14"),
      getItem("Registro", "15"),
    ]),
    getItem(
      "Cerrar Sesión",
      "logout", // Cambia el key si es necesario
      <LogoutOutlined />
    ),
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={250}
      >
        <div className="demo-logo-vertical" />
        <Logo />
        {!collapsed && (
          <div className="bg-red flex items-center justify-center mb-3 text-white font-bold">
            <h1>{user.alias}</h1>
          </div>
        )}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={selectedKeys}
          onClick={({ key }) => {
            if (key === "logout") {
              handleLogout(); // Ejecutar la función de logout
            } else {
              navigate(`/${key}`); // Redirigir para otros ítems
            }
          }}
        >
          {items.map((item) =>
            item.children ? (
              <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
                {item.children.map((child) =>
                  child.children ? (
                    <Menu.SubMenu key={child.key} title={child.label}>
                      {child.children.map((subChild) => (
                        <Menu.Item key={subChild.key}>
                          <Link to={`/${subChild.key}`}>{subChild.label}</Link>
                        </Menu.Item>
                      ))}
                    </Menu.SubMenu>
                  ) : (
                    <Menu.Item key={child.key}>
                      <Link to={`/${child.key}`}>{child.label}</Link>
                    </Menu.Item>
                  )
                )}
              </Menu.SubMenu>
            ) : (
              <Menu.Item key={item.key} icon={item.icon}>
                <Link to={`/${item.key}`}>{item.label}</Link>
              </Menu.Item>
            )
          )}
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ padding: 0, height: 0, background: "gray" }} />
        <Content className="m-0  bg-white">
          <div className="m-2  h-full">
            <Routes>
              <Route
                path="/clientes"
                element={<PrivateRoute element={<MenuClientes />} />}
              />
              <Route
                path="/detalleCliente"
                element={<PrivateRoute element={<DetalleCliente />} />}
              />
              <Route
                path="/pagosReconocidos"
                element={<PrivateRoute element={<ModuloPagosReconocidos />} />}
              />
              <Route
                path="/pagosNOR"
                element={<PrivateRoute element={<ModuloPagosNOR />} />}
              />
              <Route
                path="/exepciones"
                element={<PrivateRoute element={<ListaExcepciones />} />}
              />
              <Route
                path="/cliente/ingresarGestion"
                element={<PrivateRoute element={<IngresarGestion />} />}
              />
              <Route
                path="/cliente/detalleCuentas"
                element={<PrivateRoute element={<DetalleCuentas />} />}
              />
              <Route
                path="/cliente/mensaje"
                element={<PrivateRoute element={<Mensaje />} />}
              />
              <Route
                path="/cliente/solExcepcion"
                element={<PrivateRoute element={<SolicitarExcepcion />} />}
              />
              <Route
                path="/cliente/solDocumento"
                element={<PrivateRoute element={<SolicitudDocumento />} />}
              />
              <Route
                path="/cliente/ingresarGestion"
                element={<PrivateRoute element={<IngresarGestion />} />}
              />
              <Route
                path="/pagos"
                element={<PrivateRoute element={<Pagos />} />}
              />
              <Route
                path="/reclamosHistorial"
                element={<PrivateRoute element={<Reclamos />} />}
              />
              <Route
                path="/reclamosRegistro"
                element={<PrivateRoute element={<ReclamosRegistro />} />}
              />
               <Route
                path="/excepciones/Asesor"
                element={<PrivateRoute element={<ExcepcionesAsesor />} />}
              />
              <Route
                path="/excepciones"
                element={<PrivateRoute element={<Excepciones />} />}
              />
              <Route
                path="/baseManual"
                element={<PrivateRoute element={<BaseManual />} />}
              />
              <Route
                path="/seguimientoPDP"
                element={<PrivateRoute element={<SeguimientoPDP />} />}
              />
              <Route
                path="/seguimientoVLL"
                element={<PrivateRoute element={<SeguimientoVLL />} />}
              />
              
            </Routes>
          </div>
        </Content>
        <Footer className="text-center  flex h-5 text-white items-center justify-center  bg-cyan-950">
          Expertis ©{new Date().getFullYear()} Created by Jonatan Pacora
        </Footer>
      </Layout>
    </Layout>
  );
};

export default SideBar;
