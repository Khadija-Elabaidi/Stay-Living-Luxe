import { Calendar, ChevronDown } from 'lucide-react';
import './TopbarDash.css';

const TopbarDash = () => {
  return (
    <header className="topbar-container">
      <div className="topbar-title">
        STAY LIVING LUXE - TABLEAU DE BORD
      </div>

      <div className="topbar-right-section">
        <div className="topbar-shortcut">
          <Calendar size={16} />
          <span>Tableau de Bord</span>
        </div>

        <div className="topbar-datetime">
          <span className="topbar-date">Mercredi 15 Oct 2023</span>
          <span className="topbar-time">10:45 AM</span>
        </div>

        <div className="topbar-profile">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120"
            alt="Sarah L."
            className="topbar-avatar"
          />
          <span className="topbar-user-name">Sarah L.</span>
          <ChevronDown size={14} className="topbar-chevron" />
        </div>
      </div>
    </header>
  );
};

export default TopbarDash;