import { useState, useEffect } from 'react';
import i18n, { saveLanguageToStorage, loadLanguageFromStorage } from '../services/i18n';

const useLanguage = () => {
    const [language, setLanguage] = useState(i18n.language);

    useEffect(() => {
        loadLanguageFromStorage();
    }, []);

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        setLanguage(lang);
        saveLanguageToStorage(lang);
    };

    return { language, changeLanguage };
};

export default useLanguage;
