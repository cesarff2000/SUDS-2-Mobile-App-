import messaging from "@react-native-firebase/messaging";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
    }
}

export const GetFCMToken = async () => {
    // let fcmtoken = await AsyncStorage.getItem("fcmtoken");
    let fcmtoken = false;
    if (!fcmtoken) {
        try {
            const token = await messaging().getToken();
            if (token) {
                await AsyncStorage.setItem("fcmtoken", token);
            }
        } catch (error) {
            console.log("error in fcmToken", error);
        }
    }
}

export const initFCM = () => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      
    });

    // Check whether an initial notification is available
    messaging()
        .getInitialNotification()
        .then(remoteMessage => {
            if (remoteMessage) {
              
            }
        });

    messaging().onMessage(async remoteMessage => {
        Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
}