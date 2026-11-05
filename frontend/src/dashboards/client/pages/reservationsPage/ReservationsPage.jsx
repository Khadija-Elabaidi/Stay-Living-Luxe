import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays, MapPin, Search, Moon, Hash, Wallet,
  Clock, CheckCircle2, XCircle, AlertCircle, PlayCircle,
} from "lucide-react";
import {
  getMesReservations,
  annulerReservation,
  modifierDatesReservation,
} from "../../../../services/reservationService/ReservationService";
import "./ReservationsPage.css";

const parseDate = (s) => new Date(`${s}T00:00:00`);
const fmt = (s) =>
  parseDate(s).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
const nights = (r) => Math.round((parseDate(r.dateFin) - parseDate(r.dateDebut)) / 86400000);
const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
const todayISO = () => new Date().toISOString().slice(0, 10);

const STATUS = {
  EN_ATTENTE: { label: "En attente", cls: "warn", Icon: Clock },
  CONFIRMEE: { label: "Confirmée", cls: "ok", Icon: CheckCircle2 },
  EN_COURS: { label: "En cours", cls: "info", Icon: PlayCircle },
  REFUSEE: { label: "Refusée", cls: "ko", Icon: XCircle },
  ANNULEE: { label: "Annulée", cls: "ko", Icon: XCircle },
};
const statusOf = (r) =>
  STATUS[r.statut] || { label: r.statut, cls: "info", Icon: AlertCircle };

const isActive = (r) => ["EN_ATTENTE", "CONFIRMEE", "EN_COURS"].includes(r.statut) &&
  parseDate(r.dateFin) >= today();
const isModifiable = (r) =>
  ["EN_ATTENTE", "CONFIRMEE"].includes(r.statut) &&
  r.statutPaiement !== "PAYE" &&
  parseDate(r.dateDebut) > today();
const isCancellable = (r) =>
  ["EN_ATTENTE", "CONFIRMEE"].includes(r.statut) && parseDate(r.dateDebut) > today();

const getMessage = (e, fallback) => {
  const d = e.response?.data;
  return (typeof d === "string" ? d : d?.message || d?.error) || fallback;
};

export default function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const [fStatut, setFStatut] = useState("ALL");
  const [fProp, setFProp] = useState("ALL");
  const [fFrom, setFFrom] = useState("");
  const [fTo, setFTo] = useState("");
  const [search, setSearch] = useState("");

  const [toCancel, setToCancel] = useState(null);
  const [toEdit, setToEdit] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getMesReservations();
      setReservations(
        [...data].sort((a, b) => parseDate(b.dateDebut) - parseDate(a.dateDebut))
      );
      setError("");
    } catch {
      setError("Impossible de charger vos réservations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const properties = useMemo(
    () => [...new Set(reservations.map((r) => r.appartement?.titre).filter(Boolean))],
    [reservations]
  );

  const filtered = reservations.filter((r) => {
    if (fStatut !== "ALL" && r.statut !== fStatut) return false;
    if (fProp !== "ALL" && r.appartement?.titre !== fProp) return false;
    if (fFrom && r.dateFin < fFrom) return false;
    if (fTo && r.dateDebut > fTo) return false;
    const q = search.trim().toLowerCase();
    if (q && !`${r.numeroReservation} ${r.appartement?.titre} ${r.appartement?.adresse}`
      .toLowerCase().includes(q)) return false;
    return true;
  });

  const active = filtered.filter(isActive);
  const history = filtered.filter((r) => !isActive(r));

  const resetFilters = () => {
    setFStatut("ALL"); setFProp("ALL"); setFFrom(""); setFTo(""); setSearch("");
  };

  return (
    <div className="rp-page">
      <div className="rp-head">
        <h1>Mes Réservations</h1>
        <p>Historique complet et gestion de vos séjours</p>
      </div>

      {toast && <div className="rp-toast">{toast}</div>}

      <div className="rp-filters">
        <div className="rp-f">
          <label>Statut</label>
          <select value={fStatut} onChange={(e) => setFStatut(e.target.value)}>
            <option value="ALL">Tous les statuts</option>
            <option value="EN_ATTENTE">En attente</option>
            <option value="CONFIRMEE">Confirmée</option>
            <option value="EN_COURS">En cours</option>
            <option value="REFUSEE">Refusée</option>
            <option value="ANNULEE">Annulée</option>
          </select>
        </div>
        <div className="rp-f">
          <label>Période</label>
          <div className="rp-dates">
            <input type="date" value={fFrom} onChange={(e) => setFFrom(e.target.value)} />
            <span>→</span>
            <input type="date" value={fTo} min={fFrom} onChange={(e) => setFTo(e.target.value)} />
          </div>
        </div>
        <div className="rp-f">
          <label>Propriété</label>
          <select value={fProp} onChange={(e) => setFProp(e.target.value)}>
            <option value="ALL">Toutes les propriétés</option>
            {properties.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="rp-f rp-search">
          <label>&nbsp;</label>
          <div className="rp-search-box">
            <Search size={16} />
            <input
              placeholder="N° de réservation, logement..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <button className="rp-reset" onClick={resetFilters}>Réinitialiser</button>
      </div>

      {loading && <p className="rp-info">Chargement...</p>}
      {error && <p className="rp-alert rp-alert-error">{error}</p>}

      {!loading && !error && (
        <>
          <h2 className="rp-section">Séjours en cours et à venir</h2>
          {active.length === 0 ? (
            <p className="rp-info">Aucune réservation en cours.</p>
          ) : (
            <div className="rp-grid">
              {active.map((r) => (
                <ReservationCard
                  key={r.id}
                  r={r}
                  onEdit={() => setToEdit(r)}
                  onCancel={() => setToCancel(r)}
                />
              ))}
            </div>
          )}

          <h2 className="rp-section">Historique complet</h2>
          <div className="rp-table-wrap">
            <table className="rp-table">
              <thead>
                <tr>
                  <th>Statut</th><th>N°</th><th>Logement</th>
                  <th>Arrivée</th><th>Départ</th><th>Séjour</th><th>Total</th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr><td colSpan="7" className="rp-empty">Aucun séjour dans l'historique</td></tr>
                ) : history.map((r) => {
                  const s = statusOf(r);
                  return (
                    <tr key={r.id}>
                      <td><span className={`rp-badge ${s.cls}`}>{s.label}</span></td>
                      <td>{r.numeroReservation}</td>
                      <td>{r.appartement?.titre}</td>
                      <td>{fmt(r.dateDebut)}</td>
                      <td>{fmt(r.dateFin)}</td>
                      <td>{nights(r)} nuit(s)</td>
                      <td>{r.prixTotal} MAD</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {toCancel && (
        <CancelModal
          r={toCancel}
          onClose={() => setToCancel(null)}
          onDone={(msg) => { setToCancel(null); setToast(msg); load(); }}
        />
      )}
      {toEdit && (
        <EditDatesModal
          r={toEdit}
          onClose={() => setToEdit(null)}
          onDone={(msg) => { setToEdit(null); setToast(msg); load(); }}
        />
      )}
    </div>
  );
}

function ReservationCard({ r, onEdit, onCancel }) {
  const s = statusOf(r);
  const Icon = s.Icon;
  const a = r.appartement || {};
  return (
    <div className="rp-card">
      <div className="rp-card-top">
        <div>
          <h3>{a.titre}</h3>
          <span className="rp-loc"><MapPin size={14} /> {a.adresse}</span>
        </div>
        <span className={`rp-badge ${s.cls}`}><Icon size={14} /> {s.label}</span>
      </div>

      <div className="rp-card-body">
        <ul>
          <li><CalendarDays size={16} /> {fmt(r.dateDebut)} → {fmt(r.dateFin)}</li>
          <li><Moon size={16} /> {nights(r)} nuit(s)</li>
          <li><Hash size={16} /> {r.numeroReservation}</li>
          <li>
            <Wallet size={16} /> {r.prixTotal} MAD
            {r.statutPaiement === "PAYE"
              ? <em className="rp-paid">Payé</em>
              : <em className="rp-unpaid">Paiement en attente</em>}
          </li>
        </ul>
        {a.imgPrincipalUrl && <img src={a.imgPrincipalUrl} alt={a.titre} />}
      </div>

      {r.statut === "CONFIRMEE" && r.statutPaiement !== "PAYE" && (
        <p className="rp-hint">Réservation confirmée : veuillez procéder au paiement.</p>
      )}

      <div className="rp-card-actions">
        {isModifiable(r) && (
          <button className="rp-btn rp-btn-blue" onClick={onEdit}>Modifier les dates</button>
        )}
        {isCancellable(r) && (
          <button className="rp-btn rp-btn-red" onClick={onCancel}>Annuler la réservation</button>
        )}
      </div>
    </div>
  );
}

function CancelModal({ r, onClose, onDone }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const confirm = async () => {
    try {
      setBusy(true);
      await annulerReservation(r.id);
      onDone(`La réservation ${r.numeroReservation} a été annulée.`);
    } catch (e) {
      setErr(getMessage(e, "Annulation impossible."));
      setBusy(false);
    }
  };

  return (
    <div className="rp-overlay" onClick={() => !busy && onClose()}>
      <div className="rp-modal" onClick={(e) => e.stopPropagation()}>
        <div className="rp-modal-icon">!</div>
        <h3>Annuler cette réservation ?</h3>
        <p><strong>{r.appartement?.titre}</strong><br />
          {fmt(r.dateDebut)} → {fmt(r.dateFin)}</p>
        {r.statutPaiement === "PAYE" && (
          <p className="rp-alert rp-alert-warn">
            Cette réservation est déjà payée : le remboursement sera traité par l'administration.
          </p>
        )}
        {err && <p className="rp-alert rp-alert-error">{err}</p>}
        <div className="rp-modal-actions">
          <button className="rp-btn rp-btn-light" onClick={onClose} disabled={busy}>Retour</button>
          <button className="rp-btn rp-btn-red" onClick={confirm} disabled={busy}>
            {busy ? "Annulation..." : "Oui, annuler"}
          </button>
        </div>
      </div>
    </div>
  );
}

function EditDatesModal({ r, onClose, onDone }) {
  const [debut, setDebut] = useState(r.dateDebut);
  const [fin, setFin] = useState(r.dateFin);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const n = debut && fin ? Math.round((parseDate(fin) - parseDate(debut)) / 86400000) : 0;
  const total = n > 0 ? n * (r.appartement?.prixParNuit || 0) : 0;
  const unchanged = debut === r.dateDebut && fin === r.dateFin;

  const save = async () => {
    setErr("");
    if (n <= 0) { setErr("La date de départ doit être après la date d'arrivée."); return; }
    try {
      setBusy(true);
      await modifierDatesReservation(r.id, debut, fin);
      onDone("Dates modifiées. La demande est de nouveau en attente de validation.");
    } catch (e) {
      setErr(getMessage(e, "Modification impossible."));
      setBusy(false);
    }
  };

  return (
    <div className="rp-overlay" onClick={() => !busy && onClose()}>
      <div className="rp-modal rp-modal-left" onClick={(e) => e.stopPropagation()}>
        <h3>Modifier les dates</h3>
        <p className="rp-sub">{r.appartement?.titre}</p>

        <div className="rp-edit-grid">
          <label>Arrivée
            <input type="date" value={debut} min={todayISO()}
              onChange={(e) => setDebut(e.target.value)} />
          </label>
          <label>Départ
            <input type="date" value={fin} min={debut}
              onChange={(e) => setFin(e.target.value)} />
          </label>
        </div>

        {n > 0 && (
          <p className="rp-total">{n} nuit(s) · Nouveau total : <strong>{total} MAD</strong></p>
        )}
        <p className="rp-alert rp-alert-warn">
          Après modification, la réservation repasse « En attente » et doit être
          revalidée par l'administrateur.
        </p>
        {err && <p className="rp-alert rp-alert-error">{err}</p>}

        <div className="rp-modal-actions">
          <button className="rp-btn rp-btn-light" onClick={onClose} disabled={busy}>Fermer</button>
          <button className="rp-btn rp-btn-blue" onClick={save} disabled={busy || unchanged}>
            {busy ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}