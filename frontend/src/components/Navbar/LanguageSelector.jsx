import { useState } from 'react';
import './LanguageSelector.css';

const LanguageSelector = () => {
  const [currentLang, setCurrentLang] = useState('FR');
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleLanguageChange = (lang) => {
    setCurrentLang(lang);
    setIsOpen(false);
  };

  return (
    <div className="language-selector-container  language-selector">
      <button className="language-trigger" onClick={toggleDropdown}>
  {currentLang}
  <svg 
    className={`arrow-icon ${isOpen ? 'open' : ''}`} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <polyline points="18 15 12 9 6 15"></polyline>
  </svg>
</button>

      {isOpen && (
        <ul className="language-dropdown">
          <li onClick={() => handleLanguageChange('FR')} className={currentLang === 'FR' ? 'active' : ''}>
            FR
          </li>
          <li onClick={() => handleLanguageChange('EN')} className={currentLang === 'EN' ? 'active' : ''}>
            EN
          </li>
          <li onClick={() => handleLanguageChange('ع')} className={currentLang === 'ع' ? 'active' : ''}>
            ع
          </li>
        </ul>
      )}
    </div>
  );
};

export default LanguageSelector;