import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Send, Check } from 'lucide-react'
import './Contact.css'

export default function Contact() {

  const [sent, setSent] = useState(false)

  const [form, setForm] = useState({
    name: '',
    email: '',
    message: ''
  })


  const handleSubmit = (e) => {

    e.preventDefault()

    setSent(true)

    setTimeout(() => setSent(false), 4000)

    setForm({
      name:'',
      email:'',
      message:''
    })

  }


  const infos = [
    [Phone, ' +212 7 02 67 26 51'],
    [Mail, ' satay.living.lux@gmail.com'],
    [MapPin, 'Lot 247, Haut Founty, Agadir, Maroc']
  ]


  return (

    <section id="contact" className="contact-section">


      <div className="contact-pattern" />


      <div className="contact-container">



        <motion.div
          initial={{opacity:0,y:24}}
          whileInView={{opacity:1,y:0}}
          viewport={{once:true,amount:0.3}}
          transition={{duration:0.7}}
          className="contact-info"
        >

          <p className="contact-eyebrow">
            Nous contacter
          </p>


          <h2 className="contact-title">
            Réservez votre séjour
          </h2>


          <p className="contact-description">
            Une question, un projet de séjour ou un bien à nous confier ?
            Notre équipe vous répond sous 24h.
          </p>



          <div className="contact-details">

            {infos.map(([Icon,text]) => (

              <div className="contact-item" key={text}>

                <div className="contact-icon">
                  <Icon size={16}/>
                </div>

                <span>
                  {text}
                </span>

              </div>

            ))}

          </div>


        </motion.div>





        <motion.form

          onSubmit={handleSubmit}

          initial={{opacity:0,y:24}}
          whileInView={{opacity:1,y:0}}
          viewport={{once:true,amount:0.3}}
          transition={{
            duration:0.7,
            delay:0.15
          }}

          className="contact-form"

        >


          <div className="form-grid">


            <div className="form-group">

              <label>
                Nom complet
              </label>

              <input

                required

                value={form.name}

                onChange={(e)=>
                  setForm({
                    ...form,
                    name:e.target.value
                  })
                }

                placeholder="Votre nom"

              />

            </div>



            <div className="form-group">

              <label>
                Email
              </label>

              <input

                required

                type="email"

                value={form.email}

                onChange={(e)=>
                  setForm({
                    ...form,
                    email:e.target.value
                  })
                }

                placeholder="vous@email.com"

              />

            </div>


          </div>




          <div className="form-group message-group">

            <label>
              Message
            </label>


            <textarea

              required

              rows="4"

              value={form.message}

              onChange={(e)=>
                setForm({
                  ...form,
                  message:e.target.value
                })
              }

              placeholder="Parlez-nous de votre séjour idéal..."

            />


          </div>




          <motion.button

            whileHover={{y:-2}}

            whileTap={{scale:0.97}}

            type="submit"

            className="contact-button"

          >

            {sent ? (

              <>
                <Check size={16}/>
                Message envoyé
              </>

            ) : (

              <>
                <Send size={16}/>
                Envoyer la demande
              </>

            )}

          </motion.button>


        </motion.form>



      </div>


    </section>

  )
}