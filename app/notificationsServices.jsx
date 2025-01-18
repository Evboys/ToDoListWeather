import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

export const configureNotifications = async () => {
    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.log('Permission de notification non accordée.');
            return;
        }
    } else {
        console.log('Les notifications push ne fonctionnent pas sur un émulateur.');
    }
};

export const scheduleNotification = async (executionDate, taskTitle) => {
    const triggerDate = new Date(executionDate); 
    await Notifications.scheduleNotificationAsync({
        content: {
            title: 'Rappel de tâche',
            body: `Il est temps d'exécuter la tâche : "${taskTitle}"`,
            data: { executionDate, taskTitle },
        },
        trigger: triggerDate, 
    });
};
