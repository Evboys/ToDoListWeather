import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

const TodoItem = ({ tache, onEdit, onDelete, navigation,completed,formatDate }) => {
    const {t} = useTranslation();
    
    return (
        <View style={styles.container}>
            {/* Affichage du titre de la tâche */}
            <Text style={styles.title}>{tache.title}</Text>
            <Text style={styles.date}>{formatDate(tache.executionDate)}</Text>

            {/* Affichage de la catégorie de la tâche */}
            <Text style={[styles.importance, { color: getCategoryColor(tache.importance) }]}>
                {t(`${tache.importance}`)}
            </Text>

            {/* Bouton Modifier */}
            <TouchableOpacity onPress={() => onEdit(tache.id)} style={styles.button}>
                <Text style={styles.buttonText}>{t("Modifier")}</Text>
            </TouchableOpacity>

            {/* Bouton Supprimer */}
            <TouchableOpacity onPress={() => onDelete(tache.id)} style={[styles.button, styles.deleteButton]}>
                <Text style={styles.buttonText}>{t("Supprimer")}</Text>
            </TouchableOpacity>

            {/* Bouton Compléter */}
            <TouchableOpacity onPress={() => completed(tache.id)} style={[styles.button, styles.completedButton]}>
                <Text style={styles.buttonText}>{t("Compléter")}</Text>
            </TouchableOpacity>

            {/* Bouton Détails - Navigation vers l'écran TaskDetails */}
            <TouchableOpacity onPress={() => navigation.navigate('TaskDetails', { task: tache })} style={styles.button}>
                <Text style={styles.buttonText}>{t("Détails")}</Text>
            </TouchableOpacity>
        </View >
    );
};


const getCategoryColor = (category) => {
    switch (category) {
        case 'Haute':
            return '#FF5733';  
        case 'Moyenne':
            return '#FFC300';  
        case 'Basse':
            return '#28a745';  
        default:
            return '#007BFF';  
    }
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        padding: 15,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#ddd',
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    date: {
        fontSize: 14,
        marginBottom: 10,
    },
    importance: {
        fontSize: 14,
        fontStyle: 'italic',
        marginBottom: 10,
    },
    button: {
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#007BFF',
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
    },
    deleteButton: {
        backgroundColor: '#FF5733', 
    },
    completedButton: {
        backgroundColor: '#28a745', 
    },
});

export default TodoItem;
