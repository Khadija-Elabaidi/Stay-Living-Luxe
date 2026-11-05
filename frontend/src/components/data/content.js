const base = import.meta.env.BASE_URL

export const heroSlides = [
  {
    img: `${base}images/hero2.png`,
    eyebrow: "L'art de séjourner avec élégance",
    title: "STAY LIVING",
    titleAccent: "LUXE",
    subtitle: "à Agadir",
  },
  {
    img: `${base}images/hero1.jpg`,
    eyebrow: "Séjours de prestige",
    title: "DES ADRESSES",
    titleAccent: "D'EXCEPTION",
    subtitle: "au cœur de la ville",
  },
  {
    img: `${base}images/hero3.jpg`,
    eyebrow: "Un accueil sur mesure",
    title: "VIVEZ",
    titleAccent: "Agadir",
    subtitle: "comme chez vous, en mieux",
  },
]

export const trustBadges = [
  {
    icon: "calendar",
    title: "Séjours",
    subtitle: "Courte et moyenne durée",
  },
  {
    icon: "gem",
    title: "Appartements",
    subtitle: "Haut de gamme",
  },
  {
    icon: "pin",
    title: "Emplacements",
    subtitle: "Privilégiés",
  },
  {
    icon: "headset",
    title: "Assistance",
    subtitle: "Voyageurs 7j/7",
  },
]

export const listings = [
  {
    id: 1,
    name: "Appartement chic haut founty ",
    beds:4,
    baths: 2,
    guests: 7,
    price: 120,
    images: [
      `${base}images/apartements/aprtmnt1/Chambre1.jpg`,
      `${base}images/apartements/aprtmnt1/Chambre2.jpg`,
      `${base}images/apartements/aprtmnt1/Chambre3.jpg`,
      `${base}images/apartements/aprtmnt1/Cuisine.jpg`,
      `${base}images/apartements/aprtmnt1/exterieur.jpg`,
      `${base}images/apartements/aprtmnt1/photoSupp.jpg`,
      `${base}images/apartements/aprtmnt1/SalleAmanger1.jpg`,
      `${base}images/apartements/aprtmnt1/SalleAmanger2.jpg`,
      `${base}images/apartements/aprtmnt1/salleDebain.jpg`,
      `${base}images/apartements/aprtmnt1/salleDebain2.jpg`,
      `${base}images/apartements/aprtmnt1/salon1.jpg`,
      `${base}images/apartements/aprtmnt1/Salon2.jpg`
    ],
    img: `${base}images/apartements/aprtmnt1/salon1.jpg`,
  },
  {
    id: 2,
    name: "Casa azul Stay Studio Haut Founty",
    beds: 1,
    baths: 1,
    guests: 3,
    price: 150,
    img: `${base}images/apartements/aprtmnt2/chambre.jpg`,
    images : [
      `${base}images/apartements/aprtmnt2/chambre.jpg`,
      `${base}images/apartements/aprtmnt2/cuisine.jpg`,
      `${base}images/apartements/aprtmnt2/espaceRepas.jpg`,
      `${base}images/apartements/aprtmnt2/exterieur.jpg`,
      `${base}images/apartements/aprtmnt2/photoSupp.jpg`,
      `${base}images/apartements/aprtmnt2/salleDebain.jpg`,
      `${base}images/apartements/aprtmnt2/salon1.jpg`,
      `${base}images/apartements/aprtmnt2/salon2.jpg`
    ],
  },
  {
    id: 3,
    name: "Chic Haven Haut Founty",
    beds: 2,
    baths: 1,
    guests: 5,
    price: 180,
    img: `${base}images/apartements/aprtmnt3/chambre2.jpg`,
    images : [
      `${base}images/apartements/aprtmnt3/chambre1.jpg`,
      `${base}images/apartements/aprtmnt3/chambre2.jpg`,
      `${base}images/apartements/aprtmnt3/cuisine.jpg`,
      `${base}images/apartements/aprtmnt3/espaceRepas.jpg`,
      `${base}images/apartements/aprtmnt3/exterieur.jpg`,
      `${base}images/apartements/aprtmnt3/photoSupp.jpg`,
      `${base}images/apartements/aprtmnt3/salleDebain.jpg`,
      `${base}images/apartements/aprtmnt3/salon.jpg`
    ],
  },
  {
    id: 4,
    name: "L’Écrin Blanc 2BR Élégant",
    beds: 2,
    baths: 1,
    guests: 4,
    price: 95,
    img: `${base}images/apartements/aprtmnt4/photoSupp.jpg`,
    images :[
    `${base}images/apartements/aprtmnt4/bath.jpg`,
    `${base}images/apartements/aprtmnt4/chmabre.jpg`,
    `${base}images/apartements/aprtmnt4/chmabre2.jpg`,
    `${base}images/apartements/aprtmnt4/cuisine.jpg`,
    `${base}images/apartements/aprtmnt4/espChambre.jpg`,
    `${base}images/apartements/aprtmnt4/exteieuru.jpg`,
    `${base}images/apartements/aprtmnt4/photoSupp.jpg`,
    `${base}images/apartements/aprtmnt4/salleDebain.jpg`,
    `${base}images/apartements/aprtmnt4/salon.jpg`
  ],
  },
]

export const services = [
  { icon: "shield-check", title: "Check-in", subtitle: "Flexible" },
  { icon: "wifi", title: "Wi-Fi", subtitle: "Haut débit" },
  { icon: "sparkles", title: "Ménage", subtitle: "Professionnel" },
  { icon: "headset", title: "Assistance", subtitle: "Voyageurs 7j/7" },
  { icon: "calendar-clock", title: "Séjours", subtitle: "Courte et moyenne durée" },
  { icon: "user-check", title: "Accueil", subtitle: "Personnalisé" },
]

export const gallery = [
  `${base}images/apartements/aprtmnt4/photoSupp.jpg`,
    `${base}images/apartements/aprtmnt2/salon2.jpg`,

  `${base}images/apartements/aprtmnt1/Chambre1.jpg`,
  `${base}images/apartements/aprtmnt1/Chambre3.jpg`,
  `${base}images/apartements/aprtmnt1/Cuisine.jpg`,
  `${base}images/apartements/aprtmnt2/exterieur.jpg`,
  `${base}images/apartements/aprtmnt3/chambre2.jpg`,
  `${base}images/apartements/aprtmnt3/espaceRepas.jpg`,
  `${base}images/apartements/aprtmnt3/salon.jpg`,
  `${base}images/apartements/room-log5.jpg`,
]

export const testimonials = [
  {
    text: "Un séjour exceptionnel, appartement impeccable et service professionnel.",
    author: "Camille D.",
    rating: 5,
  },
  {
    text: "Très belle expérience, logement conforme aux photos et parfaitement situé.",
    author: "Marc L.",
    rating: 5,
  },
  {
    text: "Accueil chaleureux, ménage irréprochable, on reviendra sans hésiter.",
    author: "Sofia R.",
    rating: 5,
  },
  {
    text: "Vue splendide sur la Palmeraie, un vrai coup de cœur pour notre lune de miel.",
    author: "Youssef & Nadia",
    rating: 5,
  },
]

export const navLinks = [
  { label: "Accueil", href: "#accueil" },
  { label: "À propos", href: "#apropos" },
  { label: "Nos logements", href: "#logements" },
  { label: "Nos services", href: "#services" },
  { label: "Galerie", href: "#galerie" },
  { label: "Avis", href: "#avis" },
  { label: "Contact", href: "#contact" },
]