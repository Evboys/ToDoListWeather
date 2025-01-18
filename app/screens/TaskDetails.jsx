import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TaskDetails({ route }) {

    const { task } = route.params || {};

    if (!task) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Aucune tâche trouvée</Text>
            </View>
        );
    }

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, '0'); 
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear(); 

        const hours = String(date.getHours()).padStart(2, '0'); 
        const minutes = String(date.getMinutes()).padStart(2, '0'); 
        const seconds = String(date.getSeconds()).padStart(2, '0'); 

        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`; 
    };


    return (
        
        <View style={styles.container}>
            <Text style={styles.title}>Détails de la tâche</Text>
            <Text style={styles.taskTitle}>Titre : {task.title}</Text>
            <Text style={styles.taskImportance}>Importance : {task.importance}</Text>
            <Text>Date : {formatDate(task.executionDate)}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    taskTitle: {
        fontSize: 18,
        marginBottom: 10,
    },
    taskImportance: {
        fontSize: 14,
        color: 'gray',
    },
});

