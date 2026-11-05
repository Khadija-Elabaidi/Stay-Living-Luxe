import { useEffect, useState } from "react";
import {
  User,
  Lock,
  Mail,
  Phone,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  getProfil,
  updateProfil,
  changePassword,
} from "../../../../services/profilService/ProfilService";
import "./Parametres.css";

const getMessage = (e, fallback) => {
  const data = e.response?.data;
  return (typeof data === "string" ? data : data?.message || data?.error) || fallback;
};

export default function Parametres() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [tab, setTab] = useState("infos");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({ nom: "", prenom: "", email: "", telephone: "" });
  const [pwd, setPwd] = useState({ ancien: "", nouveau: "", confirm: "" });
  const [showPwd, setShowPwd] = useState(false);

  const fillForm = (u) =>
    setForm({
      nom: u.nom || "",
      prenom: u.prenom || "",
      email: u.email || "",
      telephone: u.telephone || "",
    });

  useEffect(() => {
    getProfil()
      .then((u) => {
        setUser(u);
        fillForm(u);
      })
      .catch(() => setLoadError("Impossible de charger le profil."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(""), 3000);
    return () => clearTimeout(t);
  }, [success]);

  const switchTab = (t) => {
    setTab(t);
    setError("");
    setSuccess("");
  };

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const handlePwdChange = (e) => setPwd((p) => ({ ...p, [e.target.name]: e.target.value }));

  const hasChanges =
    user &&
    (form.nom !== (user.nom || "") ||
      form.prenom !== (user.prenom || "") ||
      form.email !== (user.email || "") ||
      form.telephone !== (user.telephone || ""));

  const submitInfos = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.nom.trim() || !form.prenom.trim() || !form.email.trim()) {
      setError("Le nom, le prénom et l'email sont obligatoires.");
      return;
    }

    try {
      setSaving(true);
      const updated = await updateProfil(form);

      if (updated.email !== user.email) {
        alert("Votre email a changé. Veuillez vous reconnecter.");
        localStorage.removeItem("token");
        window.location.href = "/";
        return;
      }

      setUser(updated);
      fillForm(updated);
      setSuccess("Profil mis à jour avec succès.");
    } catch (err) {
      setError(getMessage(err, "Impossible de mettre à jour le profil."));
    } finally {
      setSaving(false);
    }
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (pwd.nouveau.length < 6) {
      setError("Le nouveau mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (pwd.nouveau !== pwd.confirm) {
      setError("La confirmation ne correspond pas au nouveau mot de passe.");
      return;
    }

    try {
      setSaving(true);
      await changePassword(pwd.ancien, pwd.nouveau);
      setSuccess("Mot de passe modifié avec succès.");
      setPwd({ ancien: "", nouveau: "", confirm: "" });
    } catch (err) {
      setError(getMessage(err, "Impossible de modifier le mot de passe."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="ps-page"><p>Chargement...</p></div>;
  if (loadError)
    return (
      <div className="ps-page">
        <p className="ps-alert ps-alert-error">{loadError}</p>
      </div>
    );

  const initials = `${user.prenom?.[0] ?? ""}${user.nom?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="ps-page">
      <div className="ps-title">
        <h2>Paramètres</h2>
        <p>Gérez vos informations personnelles et la sécurité de votre compte.</p>
      </div>

      <div className="ps-layout">
        <aside className="ps-side">
          <div className="ps-profile">
            <div className="ps-avatar">{initials}</div>
            <h3>{user.prenom} {user.nom}</h3>
            <span className="ps-email">{user.email}</span>
            {user.role && <span className="ps-role">{user.role}</span>}
          </div>

          <nav className="ps-menu">
            <button
              className={tab === "infos" ? "ps-menu-item active" : "ps-menu-item"}
              onClick={() => switchTab("infos")}
            >
              <User size={18} /> Mon compte
            </button>
            <button
              className={tab === "password" ? "ps-menu-item active" : "ps-menu-item"}
              onClick={() => switchTab("password")}
            >
              <Lock size={18} /> Mot de passe
            </button>
          </nav>
        </aside>

        <section className="ps-card">
          <div className="ps-card-head">
            <h3>{tab === "infos" ? "Informations personnelles" : "Changer le mot de passe"}</h3>
            <p>
              {tab === "infos"
                ? "Ces informations sont utilisées pour votre connexion et vos notifications."
                : "Choisissez un mot de passe d'au moins 6 caractères."}
            </p>
          </div>

          {error && (
            <div className="ps-alert ps-alert-error">
              <AlertCircle size={18} /> {error}
            </div>
          )}
          {success && (
            <div className="ps-alert ps-alert-success">
              <CheckCircle2 size={18} /> {success}
            </div>
          )}

          {tab === "infos" ? (
            <form onSubmit={submitInfos}>
              <div className="ps-grid">
                <div className="ps-field">
                  <label htmlFor="prenom">Prénom</label>
                  <div className="ps-input">
                    <User size={16} />
                    <input id="prenom" name="prenom" value={form.prenom} onChange={handleChange} />
                  </div>
                </div>

                <div className="ps-field">
                  <label htmlFor="nom">Nom</label>
                  <div className="ps-input">
                    <User size={16} />
                    <input id="nom" name="nom" value={form.nom} onChange={handleChange} />
                  </div>
                </div>

                <div className="ps-field ps-full">
                  <label htmlFor="email">Adresse email</label>
                  <div className="ps-input">
                    <Mail size={16} />
                    <input id="email" type="email" name="email" value={form.email} onChange={handleChange} />
                  </div>
                </div>

                <div className="ps-field ps-full">
                  <label htmlFor="telephone">Téléphone</label>
                  <div className="ps-input">
                    <Phone size={16} />
                    <input id="telephone" name="telephone" value={form.telephone} onChange={handleChange} />
                  </div>
                </div>
              </div>

              <div className="ps-footer">
                <button
                  type="button"
                  className="ps-btn ps-btn-light"
                  onClick={() => fillForm(user)}
                  disabled={!hasChanges || saving}
                >
                  Annuler
                </button>
                <button type="submit" className="ps-btn ps-btn-primary" disabled={!hasChanges || saving}>
                  {saving ? "Enregistrement..." : "Enregistrer les modifications"}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={submitPassword}>
              <div className="ps-grid">
                <div className="ps-field ps-full">
                  <label htmlFor="ancien">Ancien mot de passe</label>
                  <div className="ps-input">
                    <Lock size={16} />
                    <input
                      id="ancien"
                      type={showPwd ? "text" : "password"}
                      name="ancien"
                      value={pwd.ancien}
                      onChange={handlePwdChange}
                    />
                    <button type="button" className="ps-eye" onClick={() => setShowPwd((s) => !s)}>
                      {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="ps-field">
                  <label htmlFor="nouveau">Nouveau mot de passe</label>
                  <div className="ps-input">
                    <Lock size={16} />
                    <input
                      id="nouveau"
                      type={showPwd ? "text" : "password"}
                      name="nouveau"
                      value={pwd.nouveau}
                      onChange={handlePwdChange}
                    />
                  </div>
                </div>

                <div className="ps-field">
                  <label htmlFor="confirm">Confirmation</label>
                  <div className="ps-input">
                    <Lock size={16} />
                    <input
                      id="confirm"
                      type={showPwd ? "text" : "password"}
                      name="confirm"
                      value={pwd.confirm}
                      onChange={handlePwdChange}
                    />
                  </div>
                </div>
              </div>

              <div className="ps-footer">
                <button
                  type="submit"
                  className="ps-btn ps-btn-primary"
                  disabled={saving || !pwd.ancien || !pwd.nouveau || !pwd.confirm}
                >
                  {saving ? "Modification..." : "Modifier le mot de passe"}
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}