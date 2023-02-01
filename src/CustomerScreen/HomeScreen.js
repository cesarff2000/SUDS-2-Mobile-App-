import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import Colors from '../../Constants/Colors';
import { ImageBackground } from 'react-native';
import { bookingType, ON_DEMAND, SCHEDULED } from '../Navigation/NavigationService';
import { AuthContext } from '../Providers/AuthProvider';
import { getCurrentAddress } from '../Services/LocationServices';
import { launchImageLibrary } from 'react-native-image-picker';
import { ERROR, LOADING, partialProfileUrl } from '../Providers';
import { AppContext } from '../Providers/AppProvider';
import LoadingView from '../Components/LoadingView';
import { BookingContext, WASHR_ON_THE_WAY, WASH_IN_PROGRESS } from '../Providers/BookingProvider';
import { ActivityIndicator } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import NotificationController from '../Services/NotificationController';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const nav = React.createRef(null);
export default HomeScreen = ({ navigation }) => {

const { userData, updateUserLocation, changeImage } = useContext(AuthContext)
  const { setLoading, setNewJobRequestId } = useContext(AppContext)
  const { runningBooking, getSingleBookingDetails, getRewards } = useContext(BookingContext)
  const [currentAddress, setCurrentAddress] = useState('Getting address...')
  const [rewards, setRewards] = useState(LOADING)

  useEffect(() => {
    // messaging().onNotificationOpenedApp((message) => console.log('notification opened', message))
    // console.log(runningBooking?.status, "RUNNING BOOKING STATUS")
    // switch (runningBooking?.status) {
    //   case WASHR_ON_THE_WAY:
    //     getBookingWithId(runningBooking.booking_id).then(booking => {
    //       if (booking) navigation.navigate('On The Way', { booking, onTheWay: true })
    //     })
    //     break;
    //   case WASH_IN_PROGRESS:
    //     getBookingWithId(runningBooking.booking_id).then(booking => {
    //       if (booking) navigation.navigate('Work In Progress', { booking });
    //     })
    //     break;
    //   default:
    //     break;
    // }
   // AsyncStorage.removeItem('multipledatastore')
    getRewards(setRewards)
  }, [])

  const getBookingWithId = async (id) => {
    setLoading(true);
    let json = await getSingleBookingDetails(id);
    setLoading(false);
    if (json?.data) return json.data
    else Alert.alert('Error', 'Something went wrong')
  }


  useEffect(() => {
    nav.current = navigation
    updateUserLocation()
    setTimeout(() => getCurrentAddress().then(setCurrentAddress), 2000)

    // return () => unsubscribe()
    // AsyncStorage.removeItem('multipledatastore')
  }, [])

  const imageCallBack = async (res) => {
    console.log(res)
    if (res.didCancel) return
    setLoading(true)
    await changeImage(res.assets[0])
    setLoading(false)
  }

  const Rewards = () => {
    switch (rewards) {
      case LOADING: return <ActivityIndicator color={Colors.blue_color} size="large" />
      case ERROR: return (
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16, color: 'white' }}>Error loading rewards.</Text>
          <TouchableOpacity onPress={() => getRewards(setRewards)} style={{ padding: 5, backgroundColor: Colors.blue_color, borderRadius: 5, marginHorizontal: 10 }}>
            <Text style={{ color: 'white', includeFontPadding: false }} >Retry</Text>
          </TouchableOpacity>
        </View>
      )

      default: return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: '#fff', margin: 6, marginTop: 10, fontSize: 16, fontWeight: 'bold' }}>Rewards : </Text>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((v, i) => <Image key={i} style={{ width: 25, height: 25, marginTop: 5, tintColor: i < rewards ? Colors.blue_color : '#916832' }} source={require('../../Assets/drop.png')} />)}
        </View>
      )
    }
  }

  const selectType= (type) =>{
    AsyncStorage.setItem('currenctAction',JSON.stringify(type));
    console.log(type)
    navigation.navigate('OnDemand', {
      bookingType: type == "ON_DEMAND" ? ON_DEMAND : SCHEDULED, 
      headerTitle: type == "ON_DEMAND" ? 'On Demand Services' : 'Schedule a Wash'
    })
  }

  return (
    <View style={{ flex: 1, }}>
      <LoadingView />
      <NotificationController />
      <View style={{ width: '100%', height: 40, backgroundColor: '#e28c39', justifyContent: 'center' }}>
        <Rewards></Rewards>
      </View>
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
                onPress={() => {selectType('ON_DEMAND')}}
                style={styles.auth_btn}
                underlayColor='gray'
                activeOpacity={0.8}>
                <Text style={{ fontSize: 17, textAlign: 'center', color: '#000', fontWeight: 'bold' }}>On-Demand</Text>
              </TouchableOpacity>

              <TouchableOpacity
                elevation={5}
                onPress={() => {selectType('SCHEDULED')}}
                style={styles.auth_btn}
                underlayColor='gray'
                activeOpacity={0.8} >
                <Text style={{ fontSize: 17, textAlign: 'center', color: '#000', fontWeight: 'bold' }}>Schedule</Text>
              </TouchableOpacity>

            </View>
          </ImageBackground>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  auth_textInput: {

    alignSelf: 'center',
    width: '93%',
    // borderWidth: 1,
    borderBottomWidth: 1,
    height: 40,
    color: Colors.text_color,
    marginTop: 10,

  },
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