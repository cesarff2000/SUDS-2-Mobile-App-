/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { initNotificatoins, requestUserPermission } from './src/Services/NotificatoinService';
import 'react-native-reanimated';

export const NOTIFICATION_TYPES = {
    NEW_ON_DEMAND_REQUEST: "0",
    NEW_SCHEDULED_REQUEST: "1",
    JOB_ACCEPTED: "2",
    JOB_REJECT: "3",
    WASHER_ON_THE_WAY: "4",
    WASHER_ARRIVED: "5",
    WASH_IN_PROGRESS: "6",
    WASH_FINISHED: "7",
    WASH_CANCEL: "8",
    COUPON: "9",
    ADD_MORE_TIME: "10",
    EXPIRY_DOCUMENT: "11",
    REVIEW_RATING: "12"
}

import messaging from '@react-native-firebase/messaging';


// Register background handler
requestUserPermission();
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
});[]

AppRegistry.registerComponent(appName, () => App);
initNotificatoins()



import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";

