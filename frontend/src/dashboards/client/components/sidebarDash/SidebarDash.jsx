import { authService } from "../../../../services/authService/AuthService";

import {
  Home,
  CalendarDays,
  Settings,
  LogOut,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import "./SidebarDash.css";

const SidebarDash = () => {
  const navigate = useNavigate();


  const handleLogout = () => {
    authService.logout();

    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="sidebar-container">
      <div className="sidebar-header">
        <h1 className="sidebar-title">Stay Living Luxe</h1>
      </div>

      <ul className="sidebar-nav-list">
        <li>
          <NavLink
            to="/client/reservations"
            className={({ isActive }) =>
              isActive ? "sidebar-nav-item active" : "sidebar-nav-item"
            }
          >
            <div className="sidebar-icon-wrapper">
              <CalendarDays size={20} />
            </div>

            <div className="sidebar-label-wrapper">
              <span className="sidebar-label">Mes Réservations</span>
            </div>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/client/explorer"
            className={({ isActive }) =>
              isActive ? "sidebar-nav-item active" : "sidebar-nav-item"
            }
          >
            <div className="sidebar-icon-wrapper">
              <Home size={20} />
            </div>

            <div className="sidebar-label-wrapper">
              <span className="sidebar-label">Explorer Logements</span>
            </div>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/client/parametres"
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

export default SidebarDash;