/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { initNotificatoins } from './Services/NotificatoinService';

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

// import messaging from '@react-native-firebase/messaging';


// Register background handler
// messaging().setBackgroundMessageHandler(async remoteMessage => {
//     console.log('Message handled in the background!', remoteMessage);
//   });

AppRegistry.registerComponent(appName, () => App);

initNotificatoins()



import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";


// // Must be outside of any component LifeCycle (such as `componentDidMount`).
// PushNotification.configure({
//   // (optional) Called when Token is generated (iOS and Android)
//   onRegister: function (token) {
//     console.log("TOKEN:", token);
//   },

//   // (required) Called when a remote is received or opened, or local notification is opened
//   onNotification: function (notification) {
//     console.log("NOTIFICATION: - - - - - - - - - - ON PRESS", appIsOpen, notification);
//     // setTimeout(() => { 
//     //     console.log('OPENING LINK')
//     //     if(notification.data.type==NOTIFICATION_TYPES.NEW_ON_DEMAND_REQUEST || notification.data.type ==NOTIFICATION_TYPES.NEW_SCHEDULED_REQUEST){
//     //       Linking.openURL(`suds2u://booking/${notification.data.booking_id}`)
//     //     }

//     //  }, appIsOpen.current==true ? 100 : 3000)

//     // process the notification

//     // (required) Called when a remote is received or opened, or local notification is opened
//     notification.finish(PushNotificationIOS.FetchResult.NoData);
//   },

//   // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
//   onAction: function (notification) {
//     console.log("ACTION:", notification.action);
//     console.log("NOTIFICATION:", notification);

//     // process the action
//   },

//   // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
//   onRegistrationError: function(err) {
//     console.error(err.message, err);
//   },

//   // IOS ONLY (optional): default: all - Permissions to register.
//   permissions: {
//     alert: true,
//     badge: true,
//     sound: true,
//   },

//   // Should the initial notification be popped automatically
//   // default: true
//   popInitialNotification: true,

//   /**
//    * (optional) default: true
//    * - Specified if permissions (ios) and token (android and ios) will requested or not,
//    * - if not, you must call PushNotificationsHandler.requestPermissions() later
//    * - if you are not using remote notification or do not have Firebase installed, use this:
//    *     requestPermissions: Platform.OS === 'ios'
//    */
//   requestPermissions: true,
// });