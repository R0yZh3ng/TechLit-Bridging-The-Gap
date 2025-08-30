import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { logout } from '../utils/auth';
import { useLanguage } from '../contexts/LanguageContext';

function Navbar({ user }) {
  const { language, changeLanguage, t } = useLanguage();
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ];

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          <i className="fas fa-shield-alt"></i> ScamSense
        </Link>
        <ul className="nav-links">
          <li><Link to="/"><i className="fas fa-home"></i> {t('home')}</Link></li>
          <li><Link to="/learn"><i className="fas fa-book"></i> {t('learn')}</Link></li>
          <li><Link to="/practice"><i className="fas fa-dumbbell"></i> {t('practice')}</Link></li>
          <li><Link to="/call-test"><i className="fas fa-phone"></i> Call Test</Link></li>
          <li><Link to="/ai-examples"><i className="fas fa-robot"></i> AI Examples</Link></li>
          <li><Link to="/about"><i className="fas fa-info-circle"></i> {t('about')}</Link></li>
          <li className="language-selector" 
              onMouseEnter={() => setShowLanguageDropdown(true)}
              onMouseLeave={() => setShowLanguageDropdown(false)}>
            <button className="language-btn">
              <i className="fas fa-globe"></i> {language.toUpperCase()}
            </button>
            {showLanguageDropdown && (
              <div className="language-dropdown">
                {languages.map(lang => (
                  <button key={lang.code} onClick={() => {
                    changeLanguage(lang.code);
                    setShowLanguageDropdown(false);
                  }}>
                    {lang.flag} {lang.name}
                  </button>
                ))}
              </div>
            )}
          </li>
          {user && (
            <li>
              <span className="user-info">{user.email}</span>
              <button className="logout-btn" onClick={logout}>
                <i className="fas fa-sign-out-alt"></i> {t('logout')}
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;