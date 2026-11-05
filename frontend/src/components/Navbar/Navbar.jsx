import { useState } from 'react';
import { Link as LinkScroll } from 'react-scroll';
import { Link as LinkRouter, useLocation, useNavigate } from 'react-router-dom';
import LanguageSelector from "./LanguageSelector";
import Button from '../Button/Button';
import ThemeToggle from './ThemeToggle';
import { CircleUser } from 'lucide-react';
import { getHomePathForUser } from '../../utils/roles';

import './Navbar.css';

const Navbar = ({ user = null, onOpenAuth }) => {
  const [activeLink, setActiveLink] = useState('accueil');
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { label: 'ACCUEIL', to: 'accueil' },
    { label: 'À PROPOS', to: 'a-propos' },
    { label: 'NOS LOGEMENTS', to: 'nos-logements' },
    { label: 'NOS SERVICES', to: 'nos-services' },
    { label: 'GALERIE', to: 'galerie' },
    { label: 'AVIS', to: 'avis' },
    { label: 'CONTACT', to: 'contact' },
  ];

  const isHomePage = location.pathname === '/';

  const getUserDisplayName = () => {
    if (!user) return 'CONNECTEZ-VOUS';
    if (user.prenom || user.nom) {
      return `${user.prenom || ''} ${user.nom || ''}`.trim().toUpperCase();
    }
    return (user.username || user.email || 'MON COMPTE').toUpperCase();
  };

  const checkIsAdmin = () => {
    if (!user) return false;
    const directRole = String(user.role || '').toUpperCase();
    if (directRole === 'ADMIN' || directRole === 'ROLE_ADMIN') return true;

    if (Array.isArray(user.authorities)) {
      return user.authorities.some(auth => {
        const roleStr = String(auth?.authority || auth || '').toUpperCase();
        return roleStr === 'ADMIN' || roleStr === 'ROLE_ADMIN';
      });
    }
    return false;
  };

  const handleAuthButtonClick = () => {
  if (!user) {
    if (onOpenAuth) onOpenAuth();
  } else {
    navigate(getHomePathForUser(user));
  }
};

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <LinkRouter to="/">
          <img 
            src={`${import.meta.env.BASE_URL}images/logo-removebg-preview.png`}
            alt="Stay Living Luxe"
            className="logo-img"
          />
        </LinkRouter>
      </div>

      <button className="burger" onClick={() => setOpen(!open)}>
        <span></span>
        <span></span>
        <span></span>
      </button>

      <ul className={`navbar-menu ${open ? "open" : ""}`}>
        {menuItems.map((item) => (
          <li key={item.to} className={`menu-item ${activeLink === item.to ? 'active' : ''}`}>
            {isHomePage ? (
              <LinkScroll
                to={item.to}
                smooth={true}
                duration={800}
                offset={-115}
                spy={true}
                onSetActive={() => setActiveLink(item.to)}
                onClick={() => {
                  setActiveLink(item.to);
                  setOpen(false);
                }}
                className="menu-link"
              >
                {item.label}
              </LinkScroll>
            ) : (
              <LinkRouter
                to={`/#${item.to}`}
                onClick={() => setOpen(false)}
                className="menu-link"
              >
                {item.label}
              </LinkRouter>
            )}
          </li>
        ))}
      </ul>

      <div className="navbar-actions">
  <LanguageSelector />
  <ThemeToggle />

  {user ? (
    <button
      type="button"
      className="navbar-user-btn"
      onClick={handleAuthButtonClick}
      title={getUserDisplayName()}
      aria-label="Mon compte"
    >
      <CircleUser size={36} strokeWidth={1.5} />
    </button>
  ) : (
    <Button
      variant="primary"
      className="btn-reserve"
      onClick={handleAuthButtonClick}
    >
      CONNECTEZ-VOUS
    </Button>
  )}
</div>
    </nav>
  );
};

export default Navbar;