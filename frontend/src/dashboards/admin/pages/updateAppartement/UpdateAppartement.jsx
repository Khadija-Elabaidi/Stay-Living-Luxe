import { useState, useEffect } from 'react';
import { 
  X, Save, Building, DollarSign, MapPin, AlignLeft, 
  Upload, Image as ImageIcon, Users, Bed, Bath, Trash2, RefreshCw 
} from 'lucide-react';
import { updateAppartement, deleteImageAppartement } from '../../../../services/appartementService/AppartementService';
import './UpdateAppartement.css';

export default function UpdateAppartement({ isOpen, onClose, appartement, onAppartementUpdated }) {
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    adresse: '',
    prixParNuit: 0,
    statut: 'DISPONIBLE',
    capacite: 1,
    nbreDeLit: 1,
    nbreSalleDeBain: 1
  });

  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState('');

  const [galleryItems, setGalleryItems] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (appartement) {
      setFormData({
        titre: appartement.titre || '',
        description: appartement.description || '',
        adresse: appartement.adresse || '',
        prixParNuit: appartement.prixParNuit || 0,
        statut: appartement.statut || 'DISPONIBLE',
        capacite: appartement.capacite || 1,
        nbreDeLit: appartement.nbreDeLit || 1,
        nbreSalleDeBain: appartement.nbreSalleDeBain || 1
      });

      setMainImagePreview(
        appartement.imgPrincipalUrl
          ? `http://localhost:8085/uploads/${appartement.imgPrincipalUrl}`
          : ''
      );

      if (appartement.images && Array.isArray(appartement.images)) {
        const initialItems = appartement.images.map((img, idx) => {
          const fileName = typeof img === 'string' ? img : (img.imgUrl || img.imageUrl || img.url);
          return {
            id: img.id || `exist-${idx}`,
            url: fileName ? `http://localhost:8085/uploads/${fileName}` : '',
            file: null,
            isNew: false
          };
        }).filter(item => item.url !== '');

        setGalleryItems(initialItems);
      } else {
        setGalleryItems([]);
      }

      setMainImageFile(null);
    }
  }, [appartement]);

  if (!isOpen || !appartement) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImageFile(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const handleReplaceGalleryImage = (index, event) => {
    const file = event.target.files[0];
    if (!file) return;

    setGalleryItems((prev) => {
      const updated = [...prev];
      updated[index] = {
        id: updated[index].id,
        url: URL.createObjectURL(file),
        file: file,
        isNew: true
      };
      return updated;
    });
  };

  const handleAddGalleryImages = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newItems = files.map((file) => ({
      id: `new-${Date.now()}-${Math.random()}`,
      url: URL.createObjectURL(file),
      file: file,
      isNew: true
    }));

    setGalleryItems((prev) => [...prev, ...newItems]);
  };

  const handleRemoveGalleryImage = async (index) => {
    const itemToRemove = galleryItems[index];

    if (!window.confirm("Voulez-vous vraiment supprimer définitivement cette image ?")) {
      return;
    }

    try {
      if (!itemToRemove.isNew && itemToRemove.id) {
        await deleteImageAppartement(itemToRemove.id);
      }

      setGalleryItems((prev) => prev.filter((_, i) => i !== index));

      if (onAppartementUpdated) {
        onAppartementUpdated();
      }
    } catch (err) {
      console.error("Erreur lors de la suppression de l'image:", err);
      setError("Impossible de supprimer l'image du serveur.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const uploadData = new FormData();

      const dtoData = {
        ...formData,
        prixParNuit: parseInt(formData.prixParNuit, 10),
        capacite: parseInt(formData.capacite, 10),
        nbreDeLit: parseInt(formData.nbreDeLit, 10),
        nbreSalleDeBain: parseInt(formData.nbreSalleDeBain, 10)
      };

      uploadData.append('appartement', new Blob([JSON.stringify(dtoData)], { type: 'application/json' }));

      if (mainImageFile) {
        uploadData.append('imgPrincipalUrl', mainImageFile);
      }

      const filesToSend = galleryItems.filter((item) => item.isNew && item.file).map((item) => item.file);
      filesToSend.forEach((file) => {
        uploadData.append('images', file);
      });

      await updateAppartement(appartement.id, uploadData);
      onAppartementUpdated();
      onClose();
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      setError('Impossible de mettre à jour le logement. Vérifiez vos données.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container modal-large">
        <div className="modal-header">
          <h2>Modifier l'Appartement</h2>
          <button type="button" className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && <div className="error-badge">{error}</div>}

        <form onSubmit={handleSubmit} className="update-form">
          <div className="form-section">
            <h3>Informations Générales</h3>
            <div className="form-group">
              <label>Titre de l'appartement</label>
              <div className="input-with-icon">
                <Building size={18} />
                <input type="text" name="titre" value={formData.titre} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label>Adresse</label>
              <div className="input-with-icon">
                <MapPin size={18} />
                <input type="text" name="adresse" value={formData.adresse} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Prix par nuit (DH)</label>
                <div className="input-with-icon">
                  <DollarSign size={18} />
                  <input type="number" name="prixParNuit" value={formData.prixParNuit} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-group">
                <label>Statut</label>
                <select name="statut" value={formData.statut} onChange={handleChange} className="select-input">
                  <option value="DISPONIBLE">DISPONIBLE</option>
                  <option value="RESERVE">RESERVE</option>
                  <option value="INDISPONIBLE">INDISPONIBLE</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Capacité & Agencement</h3>
            <div className="form-row-three">
              <div className="form-group">
                <label>Capacité</label>
                <div className="input-with-icon">
                  <Users size={18} />
                  <input type="number" min="1" name="capacite" value={formData.capacite} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-group">
                <label>Lits</label>
                <div className="input-with-icon">
                  <Bed size={18} />
                  <input type="number" min="1" name="nbreDeLit" value={formData.nbreDeLit} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-group">
                <label>Salles de bain</label>
                <div className="input-with-icon">
                  <Bath size={18} />
                  <input type="number" min="1" name="nbreSalleDeBain" value={formData.nbreSalleDeBain} onChange={handleChange} required />
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
                  accept="image/*"
                  id="mainImage"
                  onChange={handleMainImageChange}
                  className="file-input-hidden"
                />
                <label htmlFor="mainImage" className="file-upload-btn">
                  <Upload size={16} /> Changer l'image principale
                </label>
                {mainImagePreview && (
                  <div className="image-preview-single">
                    <img src={mainImagePreview} alt="Principale" />
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Galerie d'Images Secondaires</label>
              <div className="image-upload-wrapper">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  id="galleryImages"
                  onChange={handleAddGalleryImages}
                  className="file-input-hidden"
                />
                <label htmlFor="galleryImages" className="file-upload-btn">
                  <ImageIcon size={16} /> Ajouter des images à la galerie
                </label>
              </div>

              {galleryItems.length > 0 && (
                <div className="image-preview-grid">
                  {galleryItems.map((item, index) => (
                    <div key={item.id} className="gallery-preview-item">
                      <img src={item.url} alt={`Galerie ${index + 1}`} />

                      <div className="gallery-item-actions">
                        <label htmlFor={`replace-img-${index}`} className="action-btn replace-btn" title="Remplacer cette image">
                          <RefreshCw size={14} />
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          id={`replace-img-${index}`}
                          style={{ display: 'none' }}
                          onChange={(e) => handleReplaceGalleryImage(index, e)}
                        />

                        <button
                          type="button"
                          className="action-btn remove-btn"
                          onClick={() => handleRemoveGalleryImage(index)}
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
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              <Save size={16} />
              {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}