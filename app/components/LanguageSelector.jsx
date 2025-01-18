import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import useLanguage from '../hooks/useLanguage';

const LanguageSelector = () => {
    const { language, changeLanguage } = useLanguage();

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => changeLanguage('en')}
                style={[styles.button, language === 'en' && styles.selectedButton]}
            >
                <Text style={[styles.buttonText, language === 'en' && styles.selectedButtonText]}>
                    English
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => changeLanguage('fr')}
                style={[styles.button, language === 'fr' && styles.selectedButton]}
            >
                <Text style={[styles.buttonText, language === 'fr' && styles.selectedButtonText]}>
                    Français
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 20,
    },
    button: {
        marginHorizontal: 10,
        backgroundColor: '#fff',
        padding: 10,
        borderWidth: 1,
        borderColor: '#007BFF',
        borderRadius: 5,
    },
    selectedButton: {
        backgroundColor: '#007BFF',
    },
    buttonText: {
        color: '#007BFF',
        fontWeight: 'bold',
    },
    selectedButtonText: {
        color: '#fff', 
    },
});

export default LanguageSelector;
