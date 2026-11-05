import { motion } from 'framer-motion'
import './About.css'


export default function About() {

  const stats = [
    ['4.9/5', 'Note moyenne voyageurs'],
    ['24/7', 'Assistance dédiée'],
    ['3', 'Quartiers privilégiés'],
  ]
  return (

    <section id="a-propos" className="about-section">


      <div className="about-container">




        <motion.div

          initial={{opacity:0,x:-30}}

          whileInView={{opacity:1,x:0}}

          viewport={{
            once:true,
            amount:.3
          }}

          transition={{
            duration:.7
          }}

          className="about-image-block"

        >


          <div className="about-image-wrapper">

            <img

              src={`${import.meta.env.BASE_URL}images/hero2.png`}

              alt="Intérieur Stay Living Luxe"

              className="about-image"

            />

          </div>



          <motion.div

            initial={{opacity:0,y:20}}

            whileInView={{opacity:1,y:0}}

            viewport={{once:true}}

            transition={{
              duration:.6,
              delay:.3
            }}

            className="experience-box"

          >

            <div className="experience-number">
              +8
            </div>

            <div className="experience-text">
              ANS D'EXPÉRIENCE
            </div>

          </motion.div>


        </motion.div>






        <motion.div

          initial={{opacity:0,x:30}}

          whileInView={{opacity:1,x:0}}

          viewport={{
            once:true,
            amount:.3
          }}

          transition={{
            duration:.7
          }}

        >


          <p className="about-eyebrow">
            À propos de nous
          </p>


          <h2 className="about-title">
            Une hospitalité pensée dans les moindres détails
          </h2>



          <p className="about-text">

             Spécialisés dans la gestion locative
             et la conciergerie immobilière à Agadir, nous accompagnons
              les propriétaires et les voyageurs avec un service sur mesure, 
              fondé sur l’excellence, la disponibilité et l’attention portée aux détails.

          </p>



          <p className="about-text">

            De l'arrivée à votre départ, notre équipe locale vous accompagne
            pour un séjour fluide, élégant et sans imprévu, quelle que soit
            la durée de votre visite.

          </p>




          <div className="about-stats">

            {stats.map(([num,label]) => (

              <div
                key={label}
                className="stat-item"
              >

                <div className="stat-number">
                  {num}
                </div>

                <div className="stat-label">
                  {label}
                </div>

              </div>

            ))}


          </div>


        </motion.div>
      </div>
    </section>

  )

}