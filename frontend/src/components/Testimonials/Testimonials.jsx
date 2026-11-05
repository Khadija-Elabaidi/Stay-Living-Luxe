import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { testimonials } from '../data/content'
import './Testimonials.css'


export default function Testimonials() {

  return (

    <section id="avis" className="testimonials-section">


      <div className="testimonials-container">


        <div className="testimonials-header">


          <motion.p
            initial={{opacity:0}}
            whileInView={{opacity:1}}
            viewport={{once:true}}
            className="testimonials-eyebrow"
          >
            Ils nous font confiance
          </motion.p>



          <motion.h2

            initial={{opacity:0,y:20}}

            whileInView={{opacity:1,y:0}}

            viewport={{once:true}}

            transition={{duration:.6}}

            className="testimonials-title"

          >
            Avis voyageurs
          </motion.h2>


        </div>





        <div className="testimonials-grid">


          {testimonials.map((t,i)=>(


            <motion.div

              key={t.author}

              initial={{opacity:0,y:30}}

              whileInView={{opacity:1,y:0}}

              viewport={{
                once:true,
                amount:.3
              }}

              transition={{
                duration:.6,
                delay:i*.1
              }}

              whileHover={{
                y:-6
              }}

              className="testimonial-card"

            >


              <Quote className="testimonial-quote" size={26}/>



              <p className="testimonial-text">

                {t.text}

              </p>




              <div className="testimonial-stars">

                {Array.from({
                  length:t.rating
                }).map((_,s)=>(

                  <Star

                    key={s}

                    size={14}

                    className="star"

                  />

                ))}

              </div>




              <div className="testimonial-author">

                {t.author}

              </div>



            </motion.div>


          ))}


        </div>


      </div>


    </section>

  )

}