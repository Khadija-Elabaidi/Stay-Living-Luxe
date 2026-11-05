import { motion } from 'framer-motion'
import {
  ShieldCheck,
  Wifi,
  Sparkles,
  Headset,
  CalendarClock,
  UserCheck
} from 'lucide-react'
import { services } from '../data/content'
import './Services.css'

const icons = {
  'shield-check': ShieldCheck,
  wifi: Wifi,
  sparkles: Sparkles,
  headset: Headset,
  'calendar-clock': CalendarClock,
  'user-check': UserCheck,
}

export default function Services() {
  return (
    <section id="nos-services" className="services-section">

      <div className="services-pattern" />

      <div className="services-container">

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="services-eyebrow"
        >
          À votre service
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="services-title"
        >
          Nos services
        </motion.h2>


        <div className="services-grid">

          {services.map((s, i) => {

            const Icon = icons[s.icon]

            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.08
                }}
                whileHover={{ y: -6 }}
                className="service-item"
                
              >

                <div className="service-icon-container">
                  <Icon
                    size={24}
                    strokeWidth={1.3}
                    className="service-icon"
                  />
                </div>

                <div>
                  <div className="service-title">
                    {s.title}
                  </div>

                  <div className="service-subtitle">
                    {s.subtitle}
                  </div>
                </div>

              </motion.div>
            )

          })}

        </div>

      </div>

    </section>
  )
}