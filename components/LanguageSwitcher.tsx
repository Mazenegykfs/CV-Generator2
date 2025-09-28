
import React from 'react';
import type { Language } from '../types';

interface LanguageSwitcherProps {
    currentLanguage: Language;
    onLanguageChange: (lang: Language) => void;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ currentLanguage, onLanguageChange }) => {
    const baseClasses = "py-1 px-3 rounded-lg bg-white/30 backdrop-blur-sm text-sm font-semibold border border-white/40 hover:bg-white/50 transition-all shadow-md";
    const activeClasses = "bg-blue-800 text-white";
    
    return (
        <div className="fixed top-24 right-4 z-50">
            <div className="flex justify-center space-x-2">
                <button 
                    onClick={() => onLanguageChange('en')}
                    className={`${baseClasses} ${currentLanguage === 'en' ? activeClasses : ''}`}
                >
                    English
                </button>
                <button 
                    onClick={() => onLanguageChange('ar')}
                    className={`${baseClasses} ${currentLanguage === 'ar' ? activeClasses : ''}`}
                >
                    العربية
                </button>
            </div>
        </div>
    );
};
