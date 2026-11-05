import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scroller } from 'react-scroll';

import Navbar from '../../components/Navbar/Navbar';
import AuthModal from '../../components/AuthModal/AuthModal';

import Hero from '../../components/Hero/Hero';
import Features from '../../components/Features/Features';
import Apartment from '../../components/Apartments/Apartment';
import Services from '../../components/Services/Services';
import About from '../../components/About/About';
import Gallery from '../../components/Gallery/Gallery';
import Testimonials from '../../components/Testimonials/Testimonials';
import Contact from '../../components/Contact/Contact';

const Home = () => {
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    if (location.hash) {
      const target = location.hash.replace('#', '');
      scroller.scrollTo(target, {
        smooth: true,
        duration: 800,
        offset: -115,
      });
    }
  }, [location]);

  return (
    <>
      

      <main>
        <Hero />
        <Features />
        <Apartment />
        <Services />
        <About />
        <Gallery />
        <Testimonials />
        <Contact />
      </main>

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onLoginSuccess={(userData) => {
          setUser(userData);
          setIsAuthOpen(false);
        }}
      />
    </>
  );
};

export default Home;