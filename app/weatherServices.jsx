import axios from 'axios';

const API_KEY = '52da446fa67b4a980a04a5809b9ee1dd';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export const fetchWeather = async (city) => {
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                q: city,
                appid: API_KEY,
                units: 'metric',
                lang: 'fr',
            },
        });
        return {
            temperature: response.data.main.temp,
            description: response.data.weather[0].description,
            humidity: response.data.main.humidity,
        };
    } catch (error) {
        console.error('Erreur lors de la récupération des données météo:', error);
        throw new Error('Ville introuvable ou problème avec l\'API.');
    }
};
