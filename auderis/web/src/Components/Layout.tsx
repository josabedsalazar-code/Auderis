import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearToken } from "../api/client";

const Layout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearToken();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h2>AUDERIS</h2>
        <nav>
          <NavLink to="/clients">Clientes</NavLink>
          <NavLink to="/audits">Auditorías</NavLink>
        </nav>
        <button type="button" className="secondary" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;