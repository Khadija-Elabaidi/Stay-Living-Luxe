import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa";
import { Phone, Mail, MapPin } from "lucide-react";
import { SiAirbnb, SiBookingdotcom } from "react-icons/si";
import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        
        <div className="footer-column brand-col">
          <div className="footer-logo-wrapper">
            <h2 className="footer-brand-title">STAY LIVING</h2>
            <p className="footer-brand-subtitle">LUXE</p>
          </div>
          <p className="footer-tagline">Locations de prestige à Agadir</p>
         <div className="footer-social-icons">
            <a href="#instagram" aria-label="Instagram" className="social-icon">
            <FaInstagram size={18} strokeWidth={1.8} />
            </a>

            <a href="#facebook" aria-label="Facebook" className="social-icon">
              <FaFacebookF size={18} strokeWidth={1.8} />
            </a>

            
            <a
              href="https://wa.me/212702672651"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="social-icon"
             >
              <FaWhatsapp size={18} />
            </a>
          </div>
        </div>

        <div className="footer-column">
          <h3 className="footer-col-title">LIENS RAPIDES</h3>
          <ul className="footer-links-list">
            <li><a href="#accueil">Accueil</a></li>
            <li><a href="#a-propos">À propos</a></li>
            <li><a href="#nos-logements">Nos logements</a></li>
            <li><a href="#nos-services">Nos services</a></li>
            <li><a href="#galerie">Galerie</a></li>
            <li><a href="#avis">Avis</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3 className="footer-col-title">CONTACT</h3>
          <ul className="footer-contact-list">
  <li>
    <div className="contact-icon">
      <Phone size={18} strokeWidth={1.8} />
    </div>
    <a href="tel:+212702672651"> +212 7 02 67 26 51</a>
  </li>

  <li>
    <div className="contact-icon">
      <Mail size={18} strokeWidth={1.8} />
    </div>
    <a
  href="https://mail.google.com/mail/?view=cm&fs=1&to=satay.living.lux@gmail.com&su=Demande%20d'information%20Stay%20Living%20Luxe"
  target="_blank"
  rel="noopener noreferrer"
>
  satay.living.lux@gmail.com
</a>
  </li>

  <li>
    <div className="contact-icon">
      <MapPin size={18} strokeWidth={1.8} />
    </div>
    <span>Lot 247, Haut Founty, Agadir, Maroc</span>
  </li>
</ul>
        </div>

        <div className="footer-column cta-col">
          <h3 className="footer-col-title">SUIVEZ-NOUS</h3>
          <ul className="footer-links-list partners-list">
  <li>
    <a 
      href="https://www.airbnb.com" 
      target="_blank" 
      rel="noopener noreferrer"
    >
      <SiAirbnb size={22} />
      Airbnb
    </a>
  </li>

  <li>
    <a 
      href="https://www.booking.com" 
      target="_blank" 
      rel="noopener noreferrer"
    >
      <SiBookingdotcom size={22} />
      Booking.com
    </a>
  </li>
</ul>
          
          <a href="#owner-space" className="footer-cta-button">
            <span className="cta-main">PROPRIÉTAIRE ? <br></br> CONFIEZ-NOUS VOTRE BIEN</span>
          </a>
        </div>

      </div>

      <div className="footer-bottom-bar">
        <hr  className="footer-line"></hr>
        <div className="footer-bottom-container">
          <p className="copyright-text">© 2026 Stay Living Luxe - Tous droits réservés</p>
          <div className="legal-links">
            <a href="#mentions-legales">Mentions légales</a>
            <a href="#politique-confidentialite">Politique de confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;