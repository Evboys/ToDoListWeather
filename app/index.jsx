import React, { Fragmen, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TodoScreen from "./screens/TodoScreen";
import TaskDetails from "./screens/TaskDetails";
import CompletedTasks from "./screens/CompletedTasks";
import MeteoScreen from "./screens/MeteoScreen";
import * as Notifications from 'expo-notifications';
import { configureNotifications } from './notificationsServices';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    configureNotifications();

    
    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification reçue :', notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('Réponse à la notification :', response);
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);
  return (

    <Stack.Navigator initialRouteName="TodoScreen">
      <Stack.Screen
        name="TodoScreen"
        component={TodoScreen}
        options={{ title: "Liste des Tâches" }}
      />
      <Stack.Screen
        name="TaskDetails"
        component={TaskDetails}
        options={{ title: "Détail de la Tâche" }}
      />
      <Stack.Screen
        name="CompletedTasks"
        component={CompletedTasks}
        options={{ title: "Tâches Complétées" }}
      />
      <Stack.Screen
        name="MeteoScreen"
        component={MeteoScreen}
        options={{ title: "Météo" }}
      />
    </Stack.Navigator>

  );
}
