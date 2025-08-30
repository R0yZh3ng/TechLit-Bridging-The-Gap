import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');
  const [translations, setTranslations] = useState({
    home: 'Home',
    learn: 'Learn',
    practice: 'Practice',
    about: 'About',
    logout: 'Logout',
    fraud_detection_trainer: 'Fraud Detection Trainer',
    learn_to_identify: 'Learn to identify fraudulent emails and news articles with AI-powered analysis',
    text_analyzer: 'Text Analyzer',
    paste_suspicious: 'Paste suspicious text below for instant fraud analysis:',
    placeholder: 'Paste email or news text here...',
    analyze_button: 'Analyze for Fraud',
    analyzing: 'Analyzing...',
    practice_examples: 'Practice Examples'
  });

  const loadTranslations = async (lang) => {
    try {
      const response = await fetch(`/api/translations/${lang}`);
      if (response.ok) {
        const data = await response.json();
        setTranslations(prev => ({ ...prev, ...data }));
      } else {
        console.error('Failed to load translations:', response.status);
      }
    } catch (error) {
      console.error('Failed to load translations:', error);
    }
  };

  const changeLanguage = async (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    await loadTranslations(lang);
  };

  const t = (key) => translations[key] || key;

  useEffect(() => {
    if (language !== 'en') {
      loadTranslations(language);
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};