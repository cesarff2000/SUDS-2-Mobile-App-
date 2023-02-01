import React, { useState, useEffect, useContext, useRef } from 'react';
import { Text, View, Image } from 'react-native';
import MapView from 'react-native-maps';
import NewJobModal from '../Components/NewJobModal';
import { AuthContext } from '../Providers/AuthProvider';
import messaging from '@react-native-firebase/messaging';
import LoadingView from '../Components/LoadingView';
import { AppContext } from '../Providers/AppProvider';
import { BookingContext, WASHR_ON_THE_WAY, WASH_IN_PROGRESS , WASH_PENDING } from '../Providers/BookingProvider';
import { dontShow, onStartAction } from '../Navigation/NavigationService';
import { getCurrentAddress, subscribeLocation } from '../Services/LocationServices';
import { ImageBackground } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native';
import { partialProfileUrl } from '../Providers';
import { launchImageLibrary } from 'react-native-image-picker';
import { AppState } from 'react-native';
import { NOTIFICATION_TYPES } from '../..';
import PushNotification from 'react-native-push-notification';
import NotificationController from '../Services/NotificationController';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const nav = React.createRef(null);

const WelcomeScreen = ({ navigation , item }) => {
  const [modalVisible, setModalVisibility] = useState(false);
  const [newJobBooking, setNewJobBooking] = useState();
  const [loading, setLoading] = useState(false);
  const [currentAddress, setCurrentAddress] = useState('Getting address...');
  const { getSingleBookingDetails, acceptJob, rejectJob, runningBooking, updateLocation } = useContext(BookingContext);
  const {setNewJobRequestId} = useContext(AppContext)
  const {
    userData: { latitude, longitude },
    userData,
    updateUserLocation,
    changeImage
  } = useContext(AuthContext);

  useEffect(() => {
    
    let unsubscribe
    if (runningBooking?.status === WASHR_ON_THE_WAY) {
      unsubscribe = subscribeLocation(updateLocation)
    } else unsubscribe ? unsubscribe() : null

    return () => unsubscribe ? unsubscribe() : null

  }, [runningBooking])

  useEffect(() => {
    setTimeout(() => getCurrentAddress().then(setCurrentAddress), 2000)
    console.log(runningBooking, "RUNNING BOOKING STATUS")
    AsyncStorage.getItem('washer_id').then(result => {
      let data = JSON.parse(result);
      switch (runningBooking?.status) {
      case WASH_PENDING: 
        if(data == runningBooking.washer_id){
          return setNewJobRequestId(runningBooking.booking_id)
        }
        break;
      case WASHR_ON_THE_WAY: return navigation.navigate('ON JOB', { booking_id : runningBooking.booking_id, onTheWay: true })
      case WASH_IN_PROGRESS:
        getBookingWithId(runningBooking.booking_id).then(booking => {
          if (booking) navigation.navigate('WORK IN PROGRESS', { booking });
        })
        break;
        default:
        break;
    }
    })
  }, [])

  const getBookingWithId = async (id) => {
    setLoading(true);
    let json = await getSingleBookingDetails(id);
    setLoading(false);
    if (json?.data) return json.data
    else Alert.alert('Error', 'Something went wrong')
  }

  useEffect(() => {
    nav.current = navigation;
    updateUserLocation()
  }, []);

  const imageCallBack = async (res) => {
    console.log(res)
    if (res.didCancel) return
    setLoading(true)
    await changeImage(res.assets[0])
    setLoading(false)
  }

  return (
    <View style={{ flex: 1 }}>
       <NotificationController />
       {/* <NewJobModal /> */}
      <ImageBackground style={{ width: '100%', height: '100%', flex: 1 }} source={{ uri: userData.image ? partialProfileUrl + userData.image : 'https://cdn2.vectorstock.com/i/1000x1000/34/76/default-placeholder-fitness-trainer-in-a-t-shirt-vector-20773476.jpg' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 21 }}>
          <TouchableOpacity onPress={() => launchImageLibrary({}, imageCallBack)} style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: '#e23a53', alignItems: 'center', justifyContent: 'center' }}>
            <Image style={{ width: 25, height: 25, tintColor: '#fff', marginTop: 5, margin: 2 }} source={require('../../Assets/pencil.png')} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, justifyContent: 'flex-end', }}>
          <ImageBackground style={{ width: '100%', height: 170, alignItems: 'center', marginBottom: -1 }} source={require('../../Assets/shape.png')} >

            <Text style={{ color: '#fff', marginTop: 20, fontWeight: '900' }}> <Text style={{ textAlign: 'center', color: '#fff', marginTop: 10, fontSize: 16 }}>Welcome, </Text><Text style={{ fontSize: 20, fontWeight: 'bold' }}>{userData.name}</Text></Text>

            <View style={{ flexDirection: 'row', marginTop: 5, justifyContent: 'center' }}>
            <Text numberOfLines={1} style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', flex: 1, paddingHorizontal: 20 }}><Image style={{ width: 17, height: 17, tintColor: '#fff', }} source={require('../../Assets/location.png')} />{currentAddress}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 5, justifyContent: 'center', width: '100%', }}>
              <TouchableOpacity
                elevation={5}
                onPress={() => navigation.navigate('BOOKING HISTORY')}
                style={styles.auth_btn}
                underlayColor='gray'
                activeOpacity={0.8}>
                <Text style={{ fontSize: 17, textAlign: 'center', color: '#000', fontWeight: 'bold' }}>Bookings</Text>
              </TouchableOpacity>

              <TouchableOpacity
                elevation={5}
                onPress={() => navigation.navigate('EARNING')}
                style={styles.auth_btn}
                underlayColor='gray'
                activeOpacity={0.8} >
                <Text style={{ fontSize: 17, textAlign: 'center', color: '#000', fontWeight: 'bold' }}>Earnings</Text>
              </TouchableOpacity>

            </View>
          </ImageBackground>
        </View>
      </ImageBackground>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  auth_btn: {
    marginTop: 16,
    padding: 10,
    paddingBottom: 10,
    backgroundColor: '#f5c946',
    borderRadius: 10,
    width: '35%',
    height: 50,
    justifyContent: 'center',
    margin: 5
  },
})
