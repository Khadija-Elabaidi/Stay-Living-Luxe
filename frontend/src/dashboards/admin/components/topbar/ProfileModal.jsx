import { useState } from "react";
import { updateProfil, changePassword } from "../../../../services/profilService/ProfilService";

const getMessage = (e, fallback) => {
  const data = e.response?.data;
  return (typeof data === "string" ? data : data?.message || data?.error) || fallback;
};

export default function ProfileModal({ user, onClose, onUpdated }) {
  const [tab, setTab] = useState("infos");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    nom: user.nom || "",
    prenom: user.prenom || "",
    email: user.email || "",
    telephone: user.telephone || "",
  });

  const [pwd, setPwd] = useState({ ancien: "", nouveau: "", confirm: "" });

  const switchTab = (t) => {
    setTab(t);
    setError("");
    setSuccess("");
  };

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handlePwdChange = (e) =>
    setPwd((p) => ({ ...p, [e.target.name]: e.target.value }));

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
      const emailChanged = updated.email !== user.email;
      onUpdated(updated, emailChanged);
      if (!emailChanged) setSuccess("Profil mis à jour avec succès.");
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

  return (
    <div className="pm-overlay" onClick={() => !saving && onClose()}>
      <div
        className="pm-box"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pm-header">
          <h3>Mon profil</h3>
          <button className="pm-close" onClick={onClose} disabled={saving}>
            ×
          </button>
        </div>

        <div className="pm-tabs">
          <button
            className={tab === "infos" ? "pm-tab active" : "pm-tab"}
            onClick={() => switchTab("infos")}
          >
            Informations
          </button>
          <button
            className={tab === "password" ? "pm-tab active" : "pm-tab"}
            onClick={() => switchTab("password")}
          >
            Mot de passe
          </button>
        </div>

        {error && <p className="pm-error">{error}</p>}
        {success && <p className="pm-success">{success}</p>}

        {tab === "infos" ? (
          <form onSubmit={submitInfos} className="pm-form">
            <div className="pm-row">
              <label>
                Nom
                <input name="nom" value={form.nom} onChange={handleChange} />
              </label>
              <label>
                Prénom
                <input name="prenom" value={form.prenom} onChange={handleChange} />
              </label>
            </div>
            <label>
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </label>
            <label>
              Téléphone
              <input
                name="telephone"
                value={form.telephone}
                onChange={handleChange}
              />
            </label>

            <div className="pm-actions">
              <button type="button" className="pm-btn-cancel" onClick={onClose} disabled={saving}>
                Fermer
              </button>
              <button type="submit" className="pm-btn-save" disabled={saving}>
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={submitPassword} className="pm-form">
            <label>
              Ancien mot de passe
              <input
                type="password"
                name="ancien"
                value={pwd.ancien}
                onChange={handlePwdChange}
              />
            </label>
            <label>
              Nouveau mot de passe
              <input
                type="password"
                name="nouveau"
                value={pwd.nouveau}
                onChange={handlePwdChange}
              />
            </label>
            <label>
              Confirmer le nouveau mot de passe
              <input
                type="password"
                name="confirm"
                value={pwd.confirm}
                onChange={handlePwdChange}
              />
            </label>

            <div className="pm-actions">
              <button type="button" className="pm-btn-cancel" onClick={onClose} disabled={saving}>
                Fermer
              </button>
              <button type="submit" className="pm-btn-save" disabled={saving}>
                {saving ? "Modification..." : "Modifier"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}