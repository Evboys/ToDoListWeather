import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Keyboard } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import TodoList from '../components/TodoList';
import axios from 'axios';
import useNetworkStatus from '../hooks/useNetworkStatus';
import networkQueue from '../services/networkQueue';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';
import { scheduleNotification } from '../notificationsServices';
import Icon from 'react-native-vector-icons/FontAwesome';
import CompletedTasks from './CompletedTasks';
import { Alert } from 'react-native';
import MeteoScreen from './MeteoScreen';
import DateTimePicker from '@react-native-community/datetimepicker';

const TodoScreen = () => {
  const [newTache, setNewTache] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editImportance, setEditImportance] = useState('Moyenne');
  const [taches, setTaches] = useState([]);
  const [filter, setFilter] = useState('Toutes');
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { t } = useTranslation();
  const isConnected = useNetworkStatus();
  const navigation = useNavigation();
  const [executionDate, setExecutionDate] = useState(new Date());

  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isAddTaskVisible, setIsAddTaskVisible] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isTranslateVisible, setIsTranslateVisible] = useState(false);

  {/* Fonction pour envoyer les données vers l'API */ }
  const postData = async (data) => {
    try {
      const response = await axios.post('https://6787660dc4a42c9161068774.mockapi.io/api/todolist/taches', data);
      return response.data;
    }
    catch (error) {
      console.error('Erreur lors de l\'envoi :', error);
      throw error;
    }
  };

  {/* Fonction pour ajouter une tâche */ }
  const handleAddTodo = async () => {
    if (newTache.trim() === '') return;

    const newTask = {
      title: newTache,
      importance: editImportance,
      executionDate: executionDate.toISOString(),
      completed: false
    };

    if (isConnected) {
      try {
        setIsLoading(true);
        await postData(newTask);
        const updatedTasks = await fetchData();
        await scheduleNotification(executionDate, newTache);
        setTaches(updatedTasks);
        setNewTache('');
        setEditImportance('Moyenne');
        setExecutionDate(new Date());
        Keyboard.dismiss();
      }
      catch (error) {
        console.error('Erreur :', error);
        Alert.alert("Erreur", "Impossible d'ajouter la tâche. Veuillez réessayer.");
      }
      finally {
        setIsLoading(false);
      }
    } else {
      const offlineTask = {
        ...newTask,
        id: `offline_${Date.now()}`,
        isOffline: true
      };

      networkQueue.addToQueue({
        type: 'ADD',
        data: newTask
      });

      setTaches(prevTaches => [...prevTaches, offlineTask]);
      setNewTache('');
      setEditImportance('Moyenne');
      setExecutionDate(new Date());
      Keyboard.dismiss();
    }
  }


  {/* Fonction pour modifier une données de l'API */ }
  const putData = async (id, updatedTask) => {
    try {
      const response = await axios.put(`https://6787660dc4a42c9161068774.mockapi.io/api/todolist/taches/${id}`, updatedTask);
      return response.data;
    }
    catch (error) {
      console.error('Erreur lors de l\'envoi :', error);
      throw error;
    }
  };

  {/* Fonction pour modifier une tâche */ }
  const handleEditTodo = (id) => {
    const tache = taches.find((tache) => tache.id === id);
    setEditTaskId(id);
    setEditTitle(tache.title);
    setEditImportance(tache.importance);
  };


  {/* Fonction pour sauvegarder une tâche modifiée */ }
  const handleSaveTodo = async () => {
    if (!editTaskId) return; // Vérifie qu'une tâche est en cours d'édition

    const updatedTask = {
      title: editTitle,
      importance: editImportance,
    };


    if (isConnected) {
      try {
        setIsLoading(true);
        await putData(editTaskId, updatedTask);
        const updatedTasks = await fetchData();
        setTaches(updatedTasks);
        setEditTaskId(null);
        setEditTitle("");
        setEditImportance("Moyenne");
        Keyboard.dismiss();
      } catch (error) {
        console.error("Erreur lors de la sauvegarde de la tâche :", error);
        Alert.alert("Erreur", "Impossible de sauvegarder la tâche. Veuillez réessayer.");
      } finally {
        setIsLoading(false);
      }
    } else {
      networkQueue.addToQueue({
        type: 'UPDATE',
        id: editTaskId,
        data: updatedTask,
      });

      // Mettre à jour l'état local
      setTaches(prevTaches =>
        prevTaches.map(tache =>
          tache.id === editTaskId
            ? { ...tache, ...updatedTask }
            : tache
        )
      );
      setEditTaskId(null);
      setEditTitle('');
      setEditImportance('Moyenne');
      Keyboard.dismiss();
    }
  };


  {/* Fonction pour supprimer une données de l'API */ }
  const deleteData = async (id) => {
    try {
      const response = await axios.delete(`https://6787660dc4a42c9161068774.mockapi.io/api/todolist/taches/${id}`);
      return response.data;
    }
    catch (error) {
      console.error('Erreur lors de la suppression :', error);
      throw error;
    }
  };

  {/* Fonction pour supprimer une tâche */ }
  const handleDeleteTodo = async (id) => {
    if (isConnected) {
      try {
        setIsLoading(true);
        await deleteData(id);
        const updatedTasks = await fetchData();
        setTaches(updatedTasks);
      } catch (error) {
        console.error("Erreur lors de la suppression de la tâche :", error);
        Alert.alert("Erreur", "Impossible de supprimer la tâche. Veuillez réessayer.");
      } finally {
        setIsLoading(false);
      }
    } else {
      networkQueue.addToQueue({
        type: 'DELETE',
        id: id,
      });

      // Mettre à jour l'état local
      setTaches(prevTaches => prevTaches.filter(tache => tache.id !== id));
    }
  };

  {/* Fonction pour obtenir la couleur du sélecteur d'importance */ }
  const getPickerBackgroundColor = () => {
    switch (editImportance) {
      case 'Haute':
        return 'red';
      case 'Moyenne':
        return 'orange';
      case 'Basse':
        return '#28a745';
      default:
        return 'grey';
    }
  };

  {/* Filtrer les tâches en fonction de l'importance */ }
  const filteredTaches =
    filter === 'Toutes'
      ? taches.filter((tache) => !tache.completed)
      : taches.filter((tache) => !tache.completed && tache.importance === filter);

  {/* Fonction pour changer le filtre */ }
  const changeFilter = (importance) => {
    setFilter(importance);
  };


  {/* Fonction pour récupérer les tâches depuis l'API */ }
  const fetchData = async (page = 1, limit = 5) => {
    try {
      const response = await axios.get('https://6787660dc4a42c9161068774.mockapi.io/api/todolist/taches', {
        params: {
          page: page,
          limit: limit,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches :', error);
      throw error;
    }
  };

  {/* Charger les tâches au chargement de l'écran */ }

  useEffect(() => {
    loadMoreTasks();
  }, []);

  {/* Fonction pour charger plus de tâches */ }
  const loadMoreTasks = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const data = await fetchData(page, 5);
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setTaches((prevTaches) => [...prevTaches, ...data]);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des tâches :", error);
    } finally {
      setIsLoading(false);
    }
  };

  {/* Synchroniser les actions en attente lors de la restauration de la connexion */ }
  const syncOfflineActions = () => {
    if (isConnected) {
      console.log('Connexion restaurée, synchronisation des actions...');
      networkQueue.processQueue();
    }
  }
  useEffect(() => {
    syncOfflineActions();
  }, [isConnected]);

  const completed = async (id) => {
    const completedTask = { completed: true };

    if (isConnected) {
      try {
        await axios.put(`https://6787660dc4a42c9161068774.mockapi.io/api/todolist/taches/${id}`, completedTask);
        const updatedTasks = await fetchData();
        setTaches(updatedTasks);
        navigation.replace('CompletedTasks', { CompletedTasks: updatedTasks.filter((task) => task.completed) });
      } catch (error) {
        console.error("Erreur lors de la mise à jour de la tâche :", error);
      }
    } else {
      networkQueue.addToQueue({
        type: 'UPDATE',
        id,
        data: completedTask,
      });
    }
  };

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

      {/* Champ pour ajouter une nouvelle tâche */}
      <View style={styles.addTaskButtonContainer}>
        {/* Bouton pour afficher/masquer le champ d'ajout de tâche */}
        <TouchableOpacity onPress={() => setIsAddTaskVisible(!isAddTaskVisible)} style={styles.addTaskButton}>
          <Icon name="plus" size={30} color="#fff" />
        </TouchableOpacity>

        {/* Bouton pour afficher/masquer le filtre */}
        <TouchableOpacity onPress={() => setIsFilterVisible(!isFilterVisible)} style={styles.addTaskButton}>
          <Icon name="filter" size={30} color="#fff" />
        </TouchableOpacity>

        {/* Bouton pour afficher/masquer la traduction */}
        <TouchableOpacity onPress={() => setIsTranslateVisible(!isTranslateVisible)} style={styles.addTaskButton}>
          <Icon name="language" size={30} color="#fff" />
        </TouchableOpacity>

        {/* Bouton pour afficher la météo */}
        <TouchableOpacity onPress={() => navigation.navigate(MeteoScreen)} style={styles.addTaskButton}>
          <Icon name="cloud" size={30} color="#FFF" />
        </TouchableOpacity>
      </View>
      {
        isAddTaskVisible && (
          <>
            {/* Champ pour ajouter une nouvelle tâche */}
            <TextInput
              placeholder={t("Nouvelle tâche")}
              value={newTache}
              onChangeText={setNewTache}
              style={styles.input}
            />
            {/* Sélecteur pour l'importance de la tâche */}
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={editImportance}
                style={[styles.picker, { backgroundColor: getPickerBackgroundColor() }]}
                onValueChange={(itemValue) => setEditImportance(itemValue)}
              >
                <Picker.Item label={t("Haute")} value="Haute" />
                <Picker.Item label={t("Moyenne")} value="Moyenne" />
                <Picker.Item label={t("Basse")} value="Basse" />
              </Picker>
            </View>
            {/* Sélecteur pour la date d'exécution de la tâche */}
            <View style={styles.datePickerContainer}>
              <DateTimePicker
                style={styles.datePicker}
                value={executionDate}
                mode="datetime"
                display="default"
                onChange={(event, selectedDate) => {
                  const currentDate = selectedDate || executionDate;
                  setIsDatePickerVisible(false);
                  setExecutionDate(currentDate);
                }}
              />
            </View>


            {/* Bouton pour ajouter une tâche */}
            <TouchableOpacity onPress={handleAddTodo} style={styles.addButton}>
              <Text style={styles.buttonText}>{t("Ajouter")}</Text>
            </TouchableOpacity>
          </>
        )
      }

      {/* Modification d'une tâche */}
      {
        editTaskId && (
          <View style={styles.editContainer}>
            <TextInput
              placeholder={t("Modifier la tâche")}
              value={editTitle}
              onChangeText={setEditTitle}
              style={styles.input}
            />
            <TouchableOpacity onPress={handleSaveTodo} style={styles.saveButton}>
              <Text style={styles.buttonText}>{t("Sauvegarder")}</Text>
            </TouchableOpacity>
          </View>
        )
      }

      {
        isTranslateVisible && (
          <View>
            <LanguageSelector onPress={fetchData()} />
          </View>)
      }
      {/* Boutons pour filtrer les tâches */}


      {/* Afficher le filtre */}
      {
        isFilterVisible && (
          <View style={styles.filterButtonsContainer}>
            <Text style={styles.filterLabel}>{t("Filtrer les tâches")} :</Text>
            <View style={styles.buttonRow}>
              {/* Boutons de filtre */}
              <TouchableOpacity
                style={[styles.filterButton, filter === "Toutes" && styles.selectedButton]}
                onPress={() => changeFilter("Toutes")}
              >
                <Text style={styles.buttonText}>{t("Toutes")}</Text>
              </TouchableOpacity>
              {/* Boutons de filtre */}
              <TouchableOpacity
                style={[styles.filterButton, filter === "Haute" && styles.selectedButton]}
                onPress={() => changeFilter("Haute")}
              >
                <Text style={styles.buttonText}>{t("Haute")}</Text>
              </TouchableOpacity>
              {/* Boutons de filtre */}
              <TouchableOpacity
                style={[styles.filterButton, filter === "Moyenne" && styles.selectedButton]}
                onPress={() => changeFilter("Moyenne")}
              >
                <Text style={styles.buttonText}>{t("Moyenne")}</Text>
              </TouchableOpacity>
              {/* Boutons de filtre */}
              <TouchableOpacity
                style={[styles.filterButton, filter === "Basse" && styles.selectedButton]}
                onPress={() => changeFilter("Basse")}
              >
                <Text style={styles.buttonText}>{t("Basse")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )
      }

      {/* Liste des tâches */}
      <View style={styles.todoListContainer}>
        <TodoList
          taches={taches.filter((tache) => !tache.completed)}
          onEdit={handleEditTodo}
          onDelete={handleDeleteTodo}
          navigation={navigation}
          completed={completed}
          formatDate={formatDate}
        />
        {isLoading && <Text>{t("Chargement...")}</Text>}

        {!isLoading && hasMore && (
          <TouchableOpacity onPress={loadMoreTasks} style={styles.loadMoreButton}>
            <Text style={styles.buttonText}>{t("Charger plus")}</Text>
          </TouchableOpacity>
        )}

        {!hasMore && <Text style={styles.noMoreText}>{t("Toutes les tâches sont chargées")}</Text>}
      </View>
      {/* Bouton pour afficher les tâches complétées */}
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('CompletedTasks', {
            CompletedTasks: taches.filter((tache) => tache.completed), 
          })
        }
        style={styles.completedButton}
      >
        <Text style={styles.buttonText}>{t("Voir les tâches complétées")}</Text>
      </TouchableOpacity>

    </View >
  );
};

const styles = StyleSheet.create({
  addTaskButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  datePickerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 20,
  },
  datePicker: {
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  addTaskButton: {
    backgroundColor: '#007bff',
    borderRadius: 20,
    padding: 12,
  },
  container: {
    flex: 1,
    padding: 20,
    position: 'relative',
  },
  input: {
    marginBottom: 10,
    padding: 8,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  pickerContainer: {
    width: '100%',
    height: 50,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  picker: {
    width: '100%',
  },
  addButton: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#28a745',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  editContainer: {
    marginBottom: 20,
  },
  filterButtonsContainer: {
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  filterLabel: {
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  filterButton: {
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
    marginHorizontal: 5,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedButton: {
    backgroundColor: '#007BFF',
  },
  todoListContainer: {
    flex: 1,
  },
  loadMoreButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMoreText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#888',
  },
  completedButton: {
    marginTop: 20,
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#28a745',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },


});

export default TodoScreen;
