import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  X, Save, Building, DollarSign, MapPin, AlignLeft, 
  Upload, Image as ImageIcon, Users, Bed, Bath, Trash2, AlertCircle 
} from 'lucide-react';
import { addAppartement } from '../../../../services/appartementService/AppartementService';
import './AddAppartement.css';

const INITIAL_FORM_STATE = {
  titre: '',
  description: '',
  adresse: '',
  prixParNuit: '',
  statut: 'DISPONIBLE',
  capacite: '',
  nbreDeLit: '',
  nbreSalleDeBain: '',
};

export default function AddAppartement({ isOpen, onClose, onAppartementAdded }) {
  const [appartement, setAppartement] = useState(INITIAL_FORM_STATE);
  const [imgPrincipal, setImgPrincipal] = useState(null);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [imgPrincipalPreview, setImgPrincipalPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
      if (imgPrincipalPreview) URL.revokeObjectURL(imgPrincipalPreview);
    };
  }, [previews, imgPrincipalPreview]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppartement((prev) => ({ ...prev, [name]: value }));
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (imgPrincipalPreview) URL.revokeObjectURL(imgPrincipalPreview);
      setImgPrincipal(file);
      setImgPrincipalPreview(URL.createObjectURL(file));
    }
  };

  const handleImagesChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (!selectedFiles.length) return;

    setImages((prev) => [...prev, ...selectedFiles]);
    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
    e.target.value = '';
  };

  const handleRemoveImage = (index) => {
    URL.revokeObjectURL(previews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setAppartement(INITIAL_FORM_STATE);
    setImgPrincipal(null);
    setImgPrincipalPreview(null);
    setImages([]);
    setPreviews([]);
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('imgPrincipalUrl', imgPrincipal);

      images.forEach((image) => {
        formData.append('images', image);
      });

      Object.entries(appartement).forEach(([key, value]) => {
        formData.append(key, value);
      });

      await addAppartement(formData);

      resetForm();
      if (onAppartementAdded) onAppartementAdded();
      onClose();
    } catch (err) {
      console.error('Erreur lors de l\'ajout :', err);
      setError('Une erreur est survenue lors de la création du logement.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Ajouter un appartement</h2>
          <button type="button" className="close-btn" onClick={handleClose} aria-label="Fermer">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="error-badge">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="update-form">
          <div className="form-section">
            <h3>Informations Générales</h3>
            <div className="form-group">
              <label>Titre de l'appartement</label>
              <div className="input-with-icon">
                <Building size={18} />
                <input
                  type="text"
                  name="titre"
                  placeholder="Ex: Appartement vue sur mer"
                  value={appartement.titre}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Adresse complète</label>
              <div className="input-with-icon">
                <MapPin size={18} />
                <input
                  type="text"
                  name="adresse"
                  placeholder="Ex: 12 Rue des Fleurs, Agadir"
                  value={appartement.adresse}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Prix par nuit (DH)</label>
                <div className="input-with-icon">
                  <DollarSign size={18} />
                  <input
                    type="number"
                    min="0"
                    name="prixParNuit"
                    placeholder="450"
                    value={appartement.prixParNuit}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Statut initial</label>
                <select name="statut" value={appartement.statut} onChange={handleChange} className="select-input">
                  <option value="DISPONIBLE">DISPONIBLE</option>
                  <option value="INDISPONIBLE">INDISPONIBLE</option>
                  <option value="RESERVE">RESERVE</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Capacité & Agencement</h3>
            <div className="form-row-three">
              <div className="form-group">
                <label>Capacité (Pers.)</label>
                <div className="input-with-icon">
                  <Users size={18} />
                  <input
                    type="number"
                    min="1"
                    name="capacite"
                    placeholder="4"
                    value={appartement.capacite}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Lits</label>
                <div className="input-with-icon">
                  <Bed size={18} />
                  <input
                    type="number"
                    min="1"
                    name="nbreDeLit"
                    placeholder="2"
                    value={appartement.nbreDeLit}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Salles de bain</label>
                <div className="input-with-icon">
                  <Bath size={18} />
                  <input
                    type="number"
                    min="1"
                    name="nbreSalleDeBain"
                    placeholder="1"
                    value={appartement.nbreSalleDeBain}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Images de l'Appartement</h3>

            <div className="form-group">
              <label>Image Principale</label>
              <div className="image-upload-wrapper">
                <input
                  type="file"
                  id="imgPrincipal"
                  accept="image/*"
                  onChange={handleMainImageChange}
                  required={!imgPrincipalPreview}
                  className="file-input-hidden"
                />
                <label htmlFor="imgPrincipal" className="file-upload-btn">
                  <Upload size={16} /> Sélectionner une image
                </label>
                {imgPrincipalPreview && (
                  <div className="image-preview-single">
                    <img src={imgPrincipalPreview} alt="Principale" />
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Galerie d'Images Secondaires</label>
              <div className="image-upload-wrapper">
                <input
                  type="file"
                  id="imagesGallerie"
                  accept="image/*"
                  multiple
                  onChange={handleImagesChange}
                  className="file-input-hidden"
                />
                <label htmlFor="imagesGallerie" className="file-upload-btn">
                  <ImageIcon size={16} /> Ajouter des images à la galerie
                </label>
              </div>

              {previews.length > 0 && (
                <div className="image-preview-grid">
                  {previews.map((previewUrl, index) => (
                    <div className="gallery-preview-item" key={index}>
                      <img src={previewUrl} alt={`Aperçu ${index + 1}`} />
                      <div className="gallery-item-actions">
                        <button
                          type="button"
                          className="action-btn remove-btn"
                          onClick={() => handleRemoveImage(index)}
                          title="Supprimer cette image"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <div className="input-with-icon textarea-wrapper">
              <AlignLeft size={18} className="textarea-icon" />
              <textarea
                name="description"
                rows="3"
                placeholder="Description détaillée du bien..."
                value={appartement.description}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button type="submit" className="btn-submit" disabled={isSubmitting}>
              <Save size={16} />
              {isSubmitting ? 'Enregistrement...' : 'Ajouter le logement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

AddAppartement.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAppartementAdded: PropTypes.func,
};