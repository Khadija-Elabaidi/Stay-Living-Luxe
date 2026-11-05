import {
  Home,
  Building2,
  CalendarDays,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { authService } from "../../../../services/authService/AuthService"; 
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();

    navigate("/", { replace: true });
  };

  return (
    <nav className="sidebar-container">
      <div className="sidebar-header">
        <h1 className="sidebar-title">Stay Living Luxe</h1>
      </div>

      <ul className="sidebar-nav-list">
        <li>
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              isActive ? "sidebar-nav-item active" : "sidebar-nav-item"
            }
          >
            <div className="sidebar-icon-wrapper">
              <Home size={20} />
            </div>
            <div className="sidebar-label-wrapper">
              <span className="sidebar-label">Tableau de bord</span>
            </div>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/admin/appartements"
            className={({ isActive }) =>
              isActive ? "sidebar-nav-item active" : "sidebar-nav-item"
            }
          >
            <div className="sidebar-icon-wrapper">
              <Building2 size={20} />
            </div>
            <div className="sidebar-label-wrapper">
              <span className="sidebar-label">Appartements</span>
            </div>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/admin/reservations"
            className={({ isActive }) =>
              isActive ? "sidebar-nav-item active" : "sidebar-nav-item"
            }
          >
            <div className="sidebar-icon-wrapper">
              <CalendarDays size={20} />
            </div>
            <div className="sidebar-label-wrapper">
              <span className="sidebar-label">Réservations</span>
            </div>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/admin/clients"
            className={({ isActive }) =>
              isActive ? "sidebar-nav-item active" : "sidebar-nav-item"
            }
          >
            <div className="sidebar-icon-wrapper">
              <Users size={20} />
            </div>
            <div className="sidebar-label-wrapper">
              <span className="sidebar-label">Clients</span>
            </div>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/admin/parametres"
            className={({ isActive }) =>
              isActive ? "sidebar-nav-item active" : "sidebar-nav-item"
            }
          >
            <div className="sidebar-icon-wrapper">
              <Settings size={20} />
            </div>
            <div className="sidebar-label-wrapper">
              <span className="sidebar-label">Paramètres</span>
            </div>
          </NavLink>
        </li>
      </ul>
      <button className="sidebar-logout-button" onClick={handleLogout}>
        <div className="sidebar-icon-wrapper">
          <LogOut size={20} />
        </div>
        <span className="sidebar-logout-label">
          Déconnexion
        </span>
      </button>
    </nav>
  );
};

export default Sidebar;