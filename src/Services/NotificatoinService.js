import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { Linking } from 'react-native';
import React from 'react';
import { navigate, navigationRef, onStartAction } from '../Navigation/NavigationService';
import { Platform } from 'react-native';

export const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        
        
    }
}

export const appIsOpen = React.createRef()

export const initNotificatoins = () => {

    // import PushNotificationIOS from "@react-native-community/push-notification-ios";

    // import { Linking } from 'react-na tive'
    // import { ToastAndroid } from 'react-native'

    // Must be outside of any component LifeCycle (such as `componentDidMount`).
    PushNotification.configure({
        // (optional) Called when Token is generated (iOS and Android)
        onRegister: function (token) {
            
            
        },

        // // (required) Called when a remote is received or opened, or local notification is opened
        onNotification: function (notification) {
            // console.log('NOTIFICATION CLICK',appIsOpen.current, notification)
            // navigationRef.current.navigate('Creddit/Debit Card')
            // onStartAction.current = notification
            // onStartAction.current = {action : ()=>navigate('BOOKING DETAILS', { id: '67' })}
            // if(true){
            //     setTimeout(() => { 
            //         console.log('OPENING LINK')


            //      }, appIsOpen.current==true ? 1000 : 3000)
            // }


            // process the notification

            // (required) Called when a remote is received or opened, or local notification is opened
            // notification.finish(PushNotificationIOS.FetchResult.NoData);
        },

        // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
        onAction: function (notification) {
            
        },

        // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
        onRegistrationError: function (err) {
         
            
        },

        // IOS ONLY (optional): default: all - Permissions to register.
        permissions: {
            alert: true,
            badge: true,
            sound: true
        },

        // Should the initial notification be popped automatically
        // default: true
        popInitialNotification: true,

        /**
         * (optional) default: true
         * - Specified if permissions (ios) and token (android and ios) will requested or not,
         * - if not, you must call PushNotificationsHandler.requestPermissions() later
         * - if you are not using remote notification or do not have Firebase installed, use this:
         *     requestPermissions: Platform.OS === 'ios'
         */
        requestPermissions: true
    })

    if(Platform.OS == "ios") {
        PushNotificationIOS.addNotificationRequest({
            id: "sudschanelid",
            title: "title",
            body: "body Messagge",
            repeats: false,
          });
    } else {
        PushNotification.createChannel(
            {
                channelId: 'channel-id', // (required)
                channelName: 'Order Notification', // (required)
                channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
                playSound: false, // (optional) default: true
                soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
                importance: 4, // (optional) default: 4. Int value of the Android notification importance
                vibrate: true // (optional) default: true. Creates the default vibration patten if true.
            },
            created =>{}) // (optional) callback returns whether the channel was created, false means it already existed.
        
    }

}