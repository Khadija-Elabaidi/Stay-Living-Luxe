import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getAllAppartements } from "../../services/AppartementService/AppartementService";
import { BedDouble, Bath, Users, Search, RotateCcw } from "lucide-react";
import "./AllAppartements.css";

const normalize = (str) =>
  (str ?? "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const BEDS_OPTIONS = [
  { value: "ALL", label: "Tous" },
  { value: "1", label: "1 Ch." },
  { value: "2", label: "2 Ch." },
  { value: "4", label: "4+ Ch." },
];

const SORT_OPTIONS = [
  { value: "", label: "Par défaut" },
  { value: "prix_asc", label: "Prix croissant" },
  { value: "prix_desc", label: "Prix décroissant" },
  { value: "capacite_desc", label: "Capacité (max)" },
  { value: "titre_asc", label: "Titre (A-Z)" },
];

const AllAppartements = () => {
  const navigate = useNavigate();

  const [appartements, setAppartements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBeds, setSelectedBeds] = useState("ALL");
  const [prixMax, setPrixMax] = useState("");
  const [capacite, setCapacite] = useState("");
  const [seulementDispo, setSeulementDispo] = useState(false);
  const [tri, setTri] = useState("");

  
  useEffect(() => {
    const fetchAppartements = async () => {
      try {
        const data = await getAllAppartements();
        setAppartements(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement :", err);
        setError("Impossible de charger les logements. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppartements();
  }, []);

  
  const filteredAppartements = useMemo(() => {
    const term = normalize(searchTerm);
    const prixLimite = prixMax !== "" ? Number(prixMax) : null;
    const capaciteMin = capacite !== "" ? Number(capacite) : null;

    const result = appartements.filter((item) => {
      
      const matchesSearch =
        term === "" ||
        normalize(item.titre).includes(term) ||
        normalize(item.adresse).includes(term) ||
        normalize(item.description).includes(term);

      
      const lits = Number(item.nbreDeLit) || 0;
      let matchesBeds = true;
      if (selectedBeds === "1") matchesBeds = lits === 1;
      else if (selectedBeds === "2") matchesBeds = lits === 2;
      else if (selectedBeds === "4") matchesBeds = lits >= 4;

      
      const matchesPrix =
        prixLimite === null || (Number(item.prixParNuit) || 0) <= prixLimite;

      
      const matchesCapacite =
        capaciteMin === null || (Number(item.capacite) || 0) >= capaciteMin;

      
      const matchesStatut = !seulementDispo || item.statut === "DISPONIBLE";

      return (
        matchesSearch &&
        matchesBeds &&
        matchesPrix &&
        matchesCapacite &&
        matchesStatut
      );
    });

    
    const sorted = [...result];
    switch (tri) {
      case "prix_asc":
        sorted.sort((a, b) => a.prixParNuit - b.prixParNuit);
        break;
      case "prix_desc":
        sorted.sort((a, b) => b.prixParNuit - a.prixParNuit);
        break;
      case "capacite_desc":
        sorted.sort((a, b) => b.capacite - a.capacite);
        break;
      case "titre_asc":
        sorted.sort((a, b) =>
          (a.titre || "").localeCompare(b.titre || "", "fr")
        );
        break;
      default:
        break;
    }
    return sorted;
  }, [appartements, searchTerm, selectedBeds, prixMax, capacite, seulementDispo, tri]);

  const filtresActifs =
    searchTerm !== "" ||
    selectedBeds !== "ALL" ||
    prixMax !== "" ||
    capacite !== "" ||
    seulementDispo ||
    tri !== "";

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedBeds("ALL");
    setPrixMax("");
    setCapacite("");
    setSeulementDispo(false);
    setTri("");
  };

  
  const renderResults = () => {
    if (loading) {
      return (
        <div className="no-results">
          <p>Chargement des logements...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="no-results">
          <p>{error}</p>
        </div>
      );
    }

    if (filteredAppartements.length === 0) {
      return (
        <div className="no-results">
          <p>Aucun logement ne correspond à votre recherche.</p>
          {filtresActifs && (
            <button className="btn-reset" onClick={resetFilters}>
              Réinitialiser les filtres
            </button>
          )}
        </div>
      );
    }

    return filteredAppartements.map((item) => (
      <div key={item.id} className="appartement-card">
        <div className="card-image-wrapper">
          <span className="badge-status">{item.statut}</span>
          <img
            src={`http://localhost:8085/uploads/${item.imgPrincipalUrl}`}
            alt={item.titre}
          />
        </div>

        <div className="card-content">
          <div className="card-header-info">
            <h3>{item.titre}</h3>
          </div>

          <p className="card-location">{item.adresse}</p>

          <div className="card-specs">
            <span>
              <BedDouble className="feature-icon" size={16} strokeWidth={1.5} />{" "}
              {item.nbreDeLit}
            </span>
            <span>
              <Bath className="feature-icon" size={16} strokeWidth={1.5} />{" "}
              {item.nbreSalleDeBain}
            </span>
            <span>
              <Users className="feature-icon" size={16} strokeWidth={1.5} />{" "}
              {item.capacite} pers.
            </span>
            <span className="card-price">
  {Number(item.prixParNuit).toLocaleString('fr-FR')} MAD/nuit
</span>
          </div>

          <button
            className="btn-details"
            onClick={() => navigate(`/appartement/${item.id}`)}
          >
            PLUS DE DÉTAILS →
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="all-appartements-container">
      <header className="page-header">
        <h1>Tous Nos Logements</h1>
        <p>
          Découvrez l'ensemble de nos appartements d'exception disponibles à la
          location.
        </p>
      </header>

      <div className="filter-bar">
        <div className="filter-row">
          <div className="search-box">
            <Search size={18} strokeWidth={1.5} className="search-icon" />
            <input
              type="text"
              placeholder="Titre, ville, description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="beds-filter">
            <label>Chambres :</label>
            {BEDS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={selectedBeds === opt.value ? "active" : ""}
                onClick={() => setSelectedBeds(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-row">
          <div className="filter-field">
            <label htmlFor="prixMax">Prix max / nuit</label>
            <input
              id="prixMax"
              type="number"
              min="0"
              placeholder="MAD"
              value={prixMax}
              onChange={(e) => setPrixMax(e.target.value)}
            />
          </div>

          <div className="filter-field">
            <label htmlFor="capacite">Voyageurs (min)</label>
            <input
              id="capacite"
              type="number"
              min="1"
              placeholder="Ex : 2"
              value={capacite}
              onChange={(e) => setCapacite(e.target.value)}
            />
          </div>

          <div className="filter-field">
            <label htmlFor="tri">Trier par</label>
            <select id="tri" value={tri} onChange={(e) => setTri(e.target.value)}>
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <label className="filter-checkbox">
            <input
              type="checkbox"
              checked={seulementDispo}
              onChange={(e) => setSeulementDispo(e.target.checked)}
            />
            Disponibles uniquement
          </label>

          {filtresActifs && (
            <button className="btn-reset" onClick={resetFilters}>
              <RotateCcw size={14} strokeWidth={1.5} /> Réinitialiser
            </button>
          )}
        </div>
      </div>

      {!loading && !error && (
        <p className="results-count">
          {filteredAppartements.length} logement
          {filteredAppartements.length > 1 ? "s" : ""} trouvé
          {filteredAppartements.length > 1 ? "s" : ""}
        </p>
      )}

      <div className="appartements-grid">{renderResults()}</div>
    </div>
  );
};

export default AllAppartements;
