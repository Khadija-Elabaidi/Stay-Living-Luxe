import { useEffect, useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import { getProfil } from "../../../../services/profilService/ProfilService";
import ProfileModal from "./ProfileModal";
import "./Topbar.css";

const Topbar = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    getProfil()
      .then(setUser)
      .catch((e) => console.error("Profil:", e.response?.status));
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const handleUpdated = (updated, emailChanged) => {
    setUser(updated);
    if (emailChanged) {
      alert("Votre email a changé. Veuillez vous reconnecter.");
      localStorage.removeItem("token");
      window.location.href = "/login"; }
  };

  const initials = user
    ? `${user.prenom?.[0] ?? ""}${user.nom?.[0] ?? ""}`.toUpperCase()
    : "";

  const displayName = user ? `${user.prenom} ${user.nom}` : "...";

  const dateStr = now.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const timeStr = now.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <header className="topbar-container">
      <div className="topbar-title">STAY LIVING LUXE - TABLEAU DE BORD</div>

      <div className="topbar-right-section">
        <div className="topbar-shortcut">
          <Calendar size={16} />
          <span>Tableau de Bord</span>
        </div>

        <div className="topbar-datetime">
          <span className="topbar-date">{dateStr}</span>
          <span className="topbar-time">{timeStr}</span>
        </div>

        <div className="topbar-profile-wrapper">
          <div
            className="topbar-profile"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <div className="topbar-initials">{initials}</div>
            <span className="topbar-user-name">{displayName}</span>
            <ChevronDown size={14} className="topbar-chevron" />
          </div>

          {menuOpen && (
            <>
              <div
                className="topbar-menu-backdrop"
                onClick={() => setMenuOpen(false)}
              />
              <div className="topbar-menu">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setShowModal(true);
                  }}
                  disabled={!user}
                >
                  Mon profil
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {showModal && user && (
        <ProfileModal
          user={user}
          onClose={() => setShowModal(false)}
          onUpdated={handleUpdated}
        />
      )}
    </header>
  );
};

export default Topbar;