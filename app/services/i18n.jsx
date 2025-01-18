import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from '../locales/en.json';
import fr from '../locales/fr.json';

const LANGUAGE_STORAGE_KEY = 'app_language';

const resources = {
    en: { translation: en },
    fr: { translation: fr },
};


i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en', 
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export const loadLanguageFromStorage = async () => {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLanguage) {
        i18n.changeLanguage(savedLanguage);
    }
};

export const saveLanguageToStorage = async (language) => {
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
};

export default i18n;
