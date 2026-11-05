import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { gallery } from '../data/content'
import './Gallery.css'


export default function Gallery() {

  const [openIndex, setOpenIndex] = useState(null)


  const close = () => setOpenIndex(null)


  const prev = (e) => {

    e.stopPropagation()

    setOpenIndex(
      (i) => (i - 1 + gallery.length) % gallery.length
    )

  }


  const next = (e) => {

    e.stopPropagation()

    setOpenIndex(
      (i) => (i + 1) % gallery.length
    )

  }



  return (

    <section id="galerie" className="gallery-section">


      <div className="gallery-container">


        <div className="gallery-header">


          <motion.p

            initial={{opacity:0}}

            whileInView={{opacity:1}}

            viewport={{once:true}}

            className="gallery-eyebrow"

          >
            Ambiances
          </motion.p>



          <motion.h2

            initial={{opacity:0,y:20}}

            whileInView={{opacity:1,y:0}}

            viewport={{once:true}}

            transition={{duration:.6}}

            className="gallery-title"

          >
            Galerie
          </motion.h2>


        </div>





        <div className="gallery-grid">


          {gallery.map((src,i)=>(


            <motion.button

              key={i}

              onClick={() => setOpenIndex(i)}

              initial={{
                opacity:0,
                scale:.92
              }}

              whileInView={{
                opacity:1,
                scale:1
              }}

              viewport={{
                once:true,
                amount:.3
              }}

              transition={{
                duration:.5,
                delay:(i%4)*.08
              }}

              className={`gallery-item ${
                i===0 ? 'gallery-big' : ''
              } ${
                i===5 ? 'gallery-wide' : ''
              }`}

            >


              <img

                src={src}

                alt={`Galerie ${i+1}`}

                className="gallery-image"

              />



              <div className="gallery-overlay">

                <span>
                  +
                </span>

              </div>


            </motion.button>


          ))}


        </div>


      </div>






      <AnimatePresence>


        {openIndex !== null && (


          <motion.div

            initial={{opacity:0}}

            animate={{opacity:1}}

            exit={{opacity:0}}

            onClick={close}

            className="gallery-modal"

          >



            <button
              onClick={close}
              className="gallery-close"
            >
              <X size={28}/>
            </button>




            <button

              onClick={prev}

              className="gallery-prev"

            >
              <ChevronLeft size={36}/>
            </button>





            <motion.img

              key={openIndex}

              initial={{
                opacity:0,
                scale:.95
              }}

              animate={{
                opacity:1,
                scale:1
              }}

              transition={{
                duration:.35
              }}

              src={gallery[openIndex]}

              alt=""

              onClick={(e)=>e.stopPropagation()}

              className="gallery-modal-image"

            />





            <button

              onClick={next}

              className="gallery-next"

            >
              <ChevronRight size={36}/>
            </button>



          </motion.div>


        )}


      </AnimatePresence>


    </section>

  )

}