import { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import {
  CalendarOutlined ,
  FileOutlined,  
  TeamOutlined, 
  FlagOutlined ,
  BookOutlined ,
  FolderOpenOutlined ,
  DollarOutlined ,
  WarningOutlined ,
  
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

  useEffect(() => {
    // Actualiza selectedKeys con la ruta actual
    setSelectedKeys([location.pathname.replace("/", "")]);
  }, [location.pathname]);

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
    getItem("Lista Excepciones", "exepciones", <FlagOutlined />),
    getItem("Reclamos", "expertisERP/reclamos", <BookOutlined />, [
      getItem("Historial",   "expertisERP/reclamosHistorial"),
      getItem("Registro","expertisERP/reclamosRegistro"), 
    
    ]),
    getItem("Base Documentos", "5", <FolderOpenOutlined />),
    getItem("Pagos", "sub2", <DollarOutlined />, [
      getItem("No Reconocidos",   "expertisERP/pagosNOR"),
      getItem("Reconocidos","expertisERP/pagosReconocidos"), 
    ]),
    getItem("Bases", "sub3", <TeamOutlined />, [
      getItem("Base Manual", "8"),
      getItem("Seguimiento PDP", "9"),
      getItem("Seguimiento VLL", "10"),
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
  ];

  return (
    <Layout style={{ minHeight: "100vh"}}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} width={250}>
        <div className="demo-logo-vertical" />
        <Logo />
        {!collapsed && (
          <div className="bg-red flex items-center justify-center mb-3 text-white font-bold">
            <h1>{user.alias}</h1>
          </div>
        )}
        <Menu theme="dark" mode="inline" selectedKeys={selectedKeys} >
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
              <Route path="/clientes" element={<MenuClientes />} />
              <Route path="/detalleCliente" element={<DetalleCliente />} />
              <Route path="/pagosReconocidos" element={<ModuloPagosReconocidos/>} />
              <Route path="/pagosNOR" element={<ModuloPagosNOR/>} />
              <Route path="/exepciones" element={<ListaExcepciones />} />
              <Route
                path="/cliente/ingresarGestion"
                element={<IngresarGestion />}
              />
              <Route
                path="/cliente/detalleCuentas"
                element={<DetalleCuentas></DetalleCuentas>}
              />
              <Route path="/cliente/mensaje" element={<Mensaje />} />
              <Route
                path="/cliente/solExcepcion"
                element={<SolicitarExcepcion />}
              />
              <Route
                path="/cliente/solDocumento"
                element={<SolicitudDocumento></SolicitudDocumento>}
              />
              <Route
                path="/cliente/ingresarGestion"
                element={<IngresarGestion />}
              />
              <Route path="/pagos" element={<Pagos />} />
              <Route path="/reclamosHistorial" element={<Reclamos></Reclamos>} />
              <Route path="/reclamosRegistro" element={<ReclamosRegistro></ReclamosRegistro>} />
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
