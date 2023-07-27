import 'react-native-gesture-handler';
import React, { useContext, useEffect, useState } from 'react';
import { Platform, StatusBar, UIManager, View, Text, Image, useWindowDimensions } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import Navigation from './src/Navigation/Navigators/RootStack';
import { navigate, navigationRef, clickedNotification } from './src/Navigation/NavigationService';
import Providers from './src/Providers';
import messaging from '@react-native-firebase/messaging';
import { StripeProvider } from '@stripe/stripe-react-native';
import { Icon } from 'react-native-elements'
import LoadingView from './src/Components/LoadingView';
import { AppContext } from './src/Providers/AppProvider';
import { appIsOpen } from './src/Services/NotificatoinService';
import { Modal } from 'react-native';
import NotificationController from './src/Services/NotificationController';
import { TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native';
import NewJobModal from './src/Components/NewJobModal';
import 'react-native-reanimated';
import PushNotification from "react-native-push-notification";
import PushNotificationIOS from "@react-native-community/push-notification-ios";

// Icon.loadFont();

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

const config = {
    screens: {
        DriverHomeStack: 'booking/:booking_id',
        CustomerHomeStack: 'customer_booking/:booking_id'
    }
}

const linking = {
    prefixes: ['https://suds2u.com', 'suds2u://'],
    config
}

// async requestUserPermission() {
//   await messaging().requestPermission();
// }



class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    async requestUserPermission() {
        await messaging().requestPermission();
    }

    // async getToken() {
    //     const fcmToken = await firebase.messaging().getToken();

    //     console.log("++++++++fcmToken++++++++++++",fcmToken)
    //     if (fcmToken) {
    //         // user has a device token set it into store
    //         await AsyncStorage.setItem('fcmToken', fcmToken);
    //     }
    //     else {
    //         NotificationService.error(constant.error, 'Could not get the FCM token');
    //     }
    // }
    async componentDidMount() {
        appIsOpen.current = true; messaging().subscribeToTopic('sept27')

       

        PushNotification.configure({
            onRegister: function (token) {
                messaging().subscribeToTopic("all");
            },

            onNotification: function (notification) {
                if (notification.title != undefined && notification.message != undefined)
                    PushNotification.localNotification(notification);
                notification.finish(PushNotificationIOS.FetchResult.NoData);
            },
            onAction: function (notification) { },
            onRegistrationError: function (err) {
                NotificationService.error(constant.error, err.message);
            },
            senderID: 811732010301
            ,
            permissions: {
                alert: true,
                badge: true,
                sound: true,
            },
            popInitialNotification: true,
            requestPermissions: true,
        });

        this.requestUserPermission();

        messaging().setBackgroundMessageHandler(async remoteMessage => {
            //This handler is called when notification is delivered in the background.
            //Handle the background notification here
         
        });

    }
    render() {


        return (
            <StripeProvider
                publishableKey="pk_test_51HPbfHIIXgbKLxqKfUhDY6rYYt0eWtjosQzBXVD79ngGlVrRtIrhmsXtAlUDxtKHzaC96xK2LlpMZ7UgeXGNtrRX00nmDdOSGj"
            // urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
            // merchantIdentifier="merchant.com.{{YOUR_APP_NAME}}" // required for Apple Pay
            >
                <Providers>
                    <LoadingView />
                    <NavigationContainer linking={linking} ref={navigationRef}>
                        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
                        <NotificationPopup />
                        <NewJobModal />
                        <Navigation />
                    </NavigationContainer>
                </Providers>
            </StripeProvider>
        );
    }
};

export default App;


const NotificationPopup = () => {
    const windowDimensions = useWindowDimensions()
    const { notificationPopup, setNotificationPopup } = useContext(AppContext)

    return (
        <View >
            <Modal
                transparent={true}
                visible={notificationPopup ? true : false}
                hardwareAccelerated
                statusBarTranslucent
                animationType="fade">
                <TouchableOpacity activeOpacity={1} onPress={() => setNotificationPopup(false)} style={{ flex: 1, backgroundColor: "#00000080", alignItems: 'center', justifyContent: 'center' }} >
                    <TouchableOpacity activeOpacity={1} style={{ backgroundColor: 'white', borderRadius: 15, position: 'absolute', marginHorizontal: 20, overflow: 'hidden', maxHeight: windowDimensions.height * .70 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#e5e5e5', padding: 16, width: '100%' }}>
                            <Icon name="notifications" />
                            <Text style={{ fontSize: 16, paddingHorizontal: 16 }}>{notificationPopup.title}</Text>
                        </View>
                        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                            {notificationPopup.imageUrl && <Image style={{ height: 180, borderRadius: 10, marginTop: 16, marginHorizontal: 16 }} source={{ uri: notificationPopup.imageUrl }} />}
                            <Text style={{ padding: 16 }} >{notificationPopup.body}</Text>
                        </ScrollView>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </View>
    )
}