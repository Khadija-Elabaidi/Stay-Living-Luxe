import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from "../components/Navbar/Navbar";
import Footer from '../components/Footer/Footer';
import AuthModal from '../components/AuthModal/AuthModal';
import { authService } from '../services/authService/AuthService'; 

const PublicLayout = () => {
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    const savedUser = authService.getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsAuthOpen(false);
  };

  return (
    <div className="public-layout">
      <Navbar 
        user={user} 
        onOpenAuth={() => setIsAuthOpen(true)} 
      />

      <main className="main-content">
        <Outlet context={{ user, setUser, setIsAuthOpen }} />
      </main>

      <Footer />

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default PublicLayout;