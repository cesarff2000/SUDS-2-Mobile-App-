import { useContext, useEffect, useState } from "react";
import messaging from "@react-native-firebase/messaging";
import PushNotification from "react-native-push-notification";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { AuthContext } from "../Providers/AuthProvider";
import { AppContext } from "../Providers/AppProvider";
import { CUSTOMER, WASHER } from "../Navigation/NavigationService";
import { NOTIFICATION_TYPES } from "../..";
import { useNavigation } from "@react-navigation/core";
import { Platform } from 'react-native';

const NotificationController = () => {
     const navigation = useNavigation();
     const { setNotificationPopup, setNewJobRequestId } = useContext(AppContext);
     const { userData } = useContext(AuthContext);
     PushNotification.configure({
          onNotification: (notification) =>
               notification.userInteraction
                    ? handleNotification(
                         notification,
                         notification.bigPictureUrl,
                         notification.data
                    )
                    : false,
     });

     useEffect(() => {
          messaging()
               .getInitialNotification()
               .then((remoteMessage) => {
                    let imageUrl = "";
                    if (remoteMessage?.notification?.android) {
                         imageUrl = remoteMessage.notification.android.imageUrl;
                    }
                    return handleNotification(
                         remoteMessage?.notification,
                         imageUrl,
                         remoteMessage?.data
                    )
               }
               );
          const unsubscribe = messaging().onMessage(createLocalNotification);
          return unsubscribe;
     }, []);

     const handleNotification = (notification, imageUrl, data) => {
          if (!notification) return;
          
          if (data?.type != undefined) {
               if (userData?.role_as == CUSTOMER) {
                    switch (data.type) {
                         case NOTIFICATION_TYPES.JOB_ACCEPTED:
                              return navigation.navigate("BOOKING DETAILS", {
                                   id: data.booking_id,
                              });
                         case NOTIFICATION_TYPES.WASHER_ON_THE_WAY:
                              return navigation.navigate("On The Way", {
                                   booking_id: data.booking_id,
                              });
                         case NOTIFICATION_TYPES.WASH_IN_PROGRESS:
                              return navigation.navigate("Work In Progress", {
                                   booking_id: data.booking_id,
                              });
                         case NOTIFICATION_TYPES.WASH_FINISHED:
                              return navigation.navigate("BOOKING DETAILS", {
                                   id: data.booking_id,
                              });
                         case NOTIFICATION_TYPES.JOB_REJECT:
                              return navigation.navigate("Booking History");
                         case NOTIFICATION_TYPES.COUPON:
                              return navigation.navigate("Promotions");  //  
                         case NOTIFICATION_TYPES.ADD_MORE_TIME:
                              return navigation.navigate("Work In Progress", {
                                   booking_id: data.booking_id,
                              });
                         default:
                              break;
                    }
               } else if (userData?.role_as == WASHER) {
                    switch (data.type) {
                         case NOTIFICATION_TYPES.NEW_ON_DEMAND_REQUEST:
                              return setNewJobRequestId(data.booking_id);
                         case NOTIFICATION_TYPES.NEW_SCHEDULED_REQUEST:
                              return navigation.navigate("BOOKING HISTORY");
                         case NOTIFICATION_TYPES.WASH_CANCEL:
                              return navigation.navigate("BOOKING HISTORY");
                         case NOTIFICATION_TYPES.EXPIRY_DOCUMENT:
                              return navigation.navigate("UpdateDocument");
                         case NOTIFICATION_TYPES.REVIEW_RATING:
                              return navigation.navigate("BOOKING DETAILS", {
                                   id: data.booking_id,
                              });
                         default:
                              break;
                    }
               }
          } else if (userData.api_token)
               return setNotificationPopup({
                    title: notification.title,
                    body: notification.body,
                    imageUrl,
               });
     };

     const createLocalNotification = (remoteMessage) => {
          console.log("remoteMessage PushNotification", remoteMessage);
          if (
               userData?.role_as == WASHER &&
               remoteMessage.data.type == NOTIFICATION_TYPES.NEW_ON_DEMAND_REQUEST
          )
          return setNewJobRequestId(remoteMessage.data.booking_id);
          if (Platform.OS == "ios") {
               PushNotificationIOS.addNotificationRequest({
                    id: "sudschanelid",
                    title: remoteMessage.notification.title,
                    body: remoteMessage.notification.body,
                    badge: 0,
                    repeats: false
                    
               });
          } else {

               let imageUrl = "";
               if (remoteMessage.notification.android) {
                    imageUrl = remoteMessage.notification.android.imageUrl;
               }

               PushNotification.localNotification({
                    channelId: "channel-id",
                    message: remoteMessage.notification.body,
                    body: remoteMessage.notification.body,
                    title: remoteMessage.notification.title,
                    bigPictureUrl: imageUrl,
                    smallIcon: imageUrl,
                    data: remoteMessage.data,
               });
          }
          if(remoteMessage.data.type=='2')
          {
               navigation.navigate('On The Way', { booking_id: remoteMessage.data.booking_id })
          }
     };

     return null;
};

export default NotificationController;
