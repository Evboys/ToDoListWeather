import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { fetchWeather } from '../weatherServices';

const MeteoScreen = () => {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        try {
            setError(''); 
            const data = await fetchWeather(city);
            setWeather(data);
            Keyboard.dismiss();
        } catch (err) {
            setWeather(null);
            setError(err.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bulletin météo</Text>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.input}
                    value={city}
                    onChangeText={(text) => setCity(text)}
                    placeholder="Entrez le nom d'une ville"
                />
                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                    <Icon name="magnify" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            {weather && (
                <View style={styles.weatherContainer}>
                    <Text style={styles.city}>{`Météo à ${city}`}</Text>
                    <View style={styles.weatherRow}>
                        <Icon name="thermometer" size={24} color="#ff6347" />
                        <Text style={styles.info}>Température : {weather.temperature}°C</Text>
                    </View>
                    <View style={styles.weatherRow}>
                        <Icon name="weather-partly-cloudy" size={24} color="#1e90ff" />
                        <Text style={styles.info}>Description : {weather.description}</Text>
                    </View>
                    <View style={styles.weatherRow}>
                        <Icon name="water-percent" size={24} color="#00bfff" />
                        <Text style={styles.info}>Humidité : {weather.humidity}%</Text>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        width: '100%',
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    searchButton: {
        backgroundColor: '#1e90ff',
        padding: 10,
        marginLeft: 10,
        borderRadius: 5,
    },
    error: {
        color: 'red',
        marginTop: 10,
    },
    weatherContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    city: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    weatherRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    info: {
        fontSize: 16,
        marginLeft: 10,
    },
});

export default MeteoScreen;
