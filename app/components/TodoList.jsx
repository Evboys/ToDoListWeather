import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import TodoItem from './TodoItem';  

const TodoList = ({ taches, onEdit, onDelete, navigation,completed,formatDate }) => {
    return (
        <View style={styles.container}>
            <FlatList
                data={taches}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TodoItem
                        tache={item}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        navigation={navigation}
                        completed={completed}  
                        formatDate={formatDate}
                    />
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 0,
    },
});

export default TodoList;
