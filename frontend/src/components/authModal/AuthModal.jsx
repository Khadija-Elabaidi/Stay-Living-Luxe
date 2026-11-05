import { useState } from 'react';
import { X, Mail, Lock, User, Phone } from 'lucide-react';
import { authService } from '../../../src/services/authService/AuthService'; 
import { useNavigate } from 'react-router-dom';
import { getHomePathForUser } from '../../utils/roles';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          setErrorMessage('Les mots de passe ne correspondent pas.');
          setLoading(false);
          return;
        }

        await authService.register(formData);
      }

      const loggedUser = await authService.login({
        email: formData.email,
        password: formData.password
      });

      if (onLoginSuccess) {
        onLoginSuccess(loggedUser);
      }
      onClose();

      navigate(getHomePathForUser(loggedUser), { replace: true });
      onClose();
    } catch (error) {
      setErrorMessage(error.message || (isSignUp ? "Erreur lors de l'inscription." : "Identifiants incorrects."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close-btn" onClick={onClose} type="button">
          <X size={20} />
        </button>

        <div className="auth-header">
          <span className="auth-subtitle">STAY LIVING LUXE</span>
          <h2>{isSignUp ? 'Créer un compte' : 'Espace Membre'}</h2>
          <p>
            {isSignUp
              ? "Inscrivez-vous pour bénéficier d'offres exclusives et gérer vos séjours."
              : "Connectez-vous pour accéder à vos réservations d'exception."}
          </p>
        </div>

        {errorMessage && (
          <div className="auth-error-message" style={{ color: '#e53e3e', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'center' }}>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {isSignUp && (
            <div className="input-group">
              <User className="input-icon" size={18} />
              <input
                type="text"
                name="fullName"
                placeholder="Nom complet (ex: Amine Elabaidi)"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="input-group">
            <Mail className="input-icon" size={18} />
            <input
              type="email"
              name="email"
              placeholder="Adresse e-mail"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {isSignUp && (
            <div className="input-group">
              <Phone className="input-icon" size={18} />
              <input
                type="tel"
                name="phone"
                placeholder="Téléphone (ex: 0644774878)"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="input-group">
            <Lock className="input-icon" size={18} />
            <input
              type="password"
              name="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {isSignUp && (
            <div className="input-group">
              <Lock className="input-icon" size={18} />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirmer le mot de passe"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'TRAITEMENT EN COURS...' : (isSignUp ? "S'INSCRIRE" : 'SE CONNECTER')}
          </button>
        </form>

        <div className="auth-footer">
          {isSignUp ? (
            <p>
              Vous avez déjà un compte ?{' '}
              <button type="button" onClick={() => { setIsSignUp(false); setErrorMessage(''); }}>
                Se connecter
              </button>
            </p>
          ) : (
            <p>
              Vous n'avez pas de compte ?{' '}
              <button type="button" onClick={() => { setIsSignUp(true); setErrorMessage(''); }}>
                Créer un compte
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;