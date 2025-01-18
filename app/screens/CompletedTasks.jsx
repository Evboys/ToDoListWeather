import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import networkQueue from '../services/networkQueue';

const CompletedTasks = ({ route, navigation }) => {
    const { CompletedTasks = [] } = route.params || {};
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [localTasks, setLocalTasks] = useState(CompletedTasks);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
        });

        return () => unsubscribe();
    }, []);

    const undoCompleted = async (id) => {
        setIsLoading(true);
        const undoCompletedTask = { completed: false };

        if (isConnected) {
            try {
                await axios.put(`https://6787660dc4a42c9161068774.mockapi.io/api/todolist/taches/${id}`, undoCompletedTask);
                
                setLocalTasks(prevTasks => prevTasks.filter(task => task.id !== id));
                navigation.replace('TodoScreen');
            } catch (error) {
                console.error("Erreur lors de la mise à jour de la tâche :", error);
                Alert.alert("Erreur", "Impossible de mettre à jour la tâche. Veuillez réessayer.");
            } finally {
                setIsLoading(false);
            }
        } else {
            networkQueue.addToQueue({
                type: 'UPDATE',
                id: id,
                data: undoCompletedTask,
            });
            
            setLocalTasks(prevTasks => prevTasks.filter(task => task.id !== id));
            navigation.replace('TodoScreen');
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#FF5733" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Tâches Complétées</Text>
            {localTasks.length > 0 ? (
                <FlatList
                    data={localTasks}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.task}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.importance}>{item.importance}</Text>
                            <TouchableOpacity
                                style={styles.undoButton}
                                onPress={() => undoCompleted(item.id)}>
                                <Text style={styles.undoButtonText}>Pas Complétée</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            ) : (
                <Text style={styles.noTasks}>Aucune tâche complétée pour l'instant.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    task: {
        marginBottom: 10,
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    importance: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    noTasks: {
        textAlign: 'center',
        color: '#888',
        marginTop: 50,
    },
    undoButton: {
        marginTop: 8,
        padding: 10,
        backgroundColor: '#FF5733',
        borderRadius: 8,
        alignItems: 'center',
        elevation: 2,
    },
    undoButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default CompletedTasks;
