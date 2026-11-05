import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BedDouble, Bath, Users, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
// import { listings } from '../data/content'
import { getAllAppartements } from "../../services/AppartementService/AppartementService";
import './Apartment.css'
import { Link } from "react-router-dom"

export default function Apartment() {
  const trackRef = useRef(null)
  const [activeDot, setActiveDot] = useState(0);
  const [listings, setListings] = useState([]);


  const scrollByCard = (dir) => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector('[data-card]')
    const width = card ? card.offsetWidth + 24 : 320
    el.scrollBy({ left: dir * width, behavior: 'smooth' })
  }

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const onScroll = () => {
      const card = el.querySelector('[data-card]')
      const width = card ? card.offsetWidth + 24 : 320
      setActiveDot(Math.round(el.scrollLeft / width))
    }
    el.addEventListener('scroll', onScroll)
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {

    const loadAppartements = async () => {

        try {
            const data = await getAllAppartements();
            console.log(data);
            setListings(data);
        } catch (error) {
            console.error("Erreur :", error);
        }

    };

    loadAppartements();

}, []);

  return (
    <>
      <section id="nos-logements" className="listings-section">
        <div className="listing-container">
          <div className="listings-header">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="listings-title">
                Nos logements
                <span className="listings-title-line" />
              </h2>
            </motion.div>

            <div className="listings-view-all">
              <Link to="/logements" className="listings-link">
                VOIR TOUS LES LOGEMENTS <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="listings-track-wrapper">
            <div
              ref={trackRef}
              className="listings-track [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: 'none' }}
            >
              {listings.map((l, i) => (
                <motion.article
                  data-card
                  key={l.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
                  className="listing-card"
                >
                  <div className="card-image-wrapper">
                    <img
                      src={`http://localhost:8085/uploads/${l.imgPrincipalUrl}`}
                      alt={l.titre}
                      className="card-image"
                      style={{ filter: 'sepia(0.12) saturate(1.1) contrast(1.03)' }}
                    />
                    <div className="card-image-overlay" />
                    <div className="card-badge">
                      {l.statut}
                    </div>
                  </div>

                  <div className="card-content">
                    <h3 className="card-title">{l.titre}</h3>

                    <div className="card-features">
                      <span className="feature-item">
                        <BedDouble className="feature-icon" size={16} strokeWidth={1.5} />
                        {l.nbreDeLit}
                      </span>

                      <span className="feature-item">
                        <Bath className="feature-icon" size={16} strokeWidth={1.5} />
                        {l.nbreSalleDeBain}
                      </span>

                      <span className="feature-item">
                        <Users className="feature-icon" size={16} strokeWidth={1.5} />
                        {l.capacite} pers.
                      </span>
                    </div>
                    <div className="card-footer">
  <div className="card-price">
    <span className="card-price-amount">
      {Number(l.prixParNuit).toLocaleString('fr-FR')} MAD
    </span>
    <span className="card-price-unit">/ nuit</span>
  </div>

  <Link to={`/appartement/${l.id}`} className="card-details-btn">
    Plus de détails
    <ArrowRight size={18} />
  </Link>
</div>

                    
                  </div>
                </motion.article>
              ))}
            </div>

            <button
              onClick={() => scrollByCard(-1)}
              className="slider-arrow-btn slider-arrow-prev"
              aria-label="Précédent"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={() => scrollByCard(1)}
              className="slider-arrow-btn slider-arrow-next"
              aria-label="Suivant"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="slider-dots">
            {listings.map((_, i) => (
              <span
                key={i}
                className="slider-dot-item"
                style={{
                  width: i === activeDot ? 24 : 8,
                  backgroundColor: i === activeDot ? '#C9A15F' : '#E4DCCB',
                }}
              />
            ))}
          </div>

        </div>
      </section>
    </>
  )
}