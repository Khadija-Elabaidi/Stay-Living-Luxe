import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { heroSlides } from '../data/content'
import './Hero.css'

export default function Hero() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % heroSlides.length), 6000)
    return () => clearInterval(t)
  }, [])

  const slide = heroSlides[index]

  return (
    <section id="accueil" className="hero-section">
      <AnimatePresence mode="sync">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.12 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="hero-slide-wrapper"
        >
          <img
            src={slide.img}
            alt=""
            className="hero-bg-image"
          />
        </motion.div>
      </AnimatePresence>

      <div className="hero-gradient-right" />
      <div className="hero-gradient-top" />

      <div className="hero-content-container">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="hero-text-block"
          >
            <p className="eyebrow text-gold-light mb-5">{slide.eyebrow}</p>
            <h1 className="hero-title">
              <span className="hero-title-main">{slide.title}</span>
              <span className="hero-title-accent">
                {slide.titleAccent}
              </span>
            </h1>
            <p className="hero-subtitle">{slide.subtitle}</p>

            <motion.a
              href="#contact"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="hero-cta-button"
            >
              Réserver votre séjour
            </motion.a>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="hero-pagination">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Slide ${i + 1}`}
            className={`hero-dot ${i === index ? 'active' : ''}`}
          >
            {i === index && (
              <motion.span
                layoutId="hero-dot"
                className="hero-dot-active-indicator"
              />
            )}
          </button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="hero-scroll-indicator"
      >
        <span className="hero-scroll-text">SCROLL</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="hero-scroll-line"
        />
      </motion.div>
    </section>
  )
}