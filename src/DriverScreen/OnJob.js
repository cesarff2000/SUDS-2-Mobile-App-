import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Text, View, Image, StyleSheet, ActivityIndicator ,TouchableOpacity,TextInput,Linking} from 'react-native';
import MapView from 'react-native-maps';
import CtaButton from '../Components/CtaButton';
import Colors from '../../Constants/Colors';
import MapViewDirections from 'react-native-maps-directions';
import { AuthContext } from '../Providers/AuthProvider';
import LoadingView from '../Components/LoadingView';
import { BookingContext, getWashStatus } from '../Providers/BookingProvider';
import { Avatar } from 'react-native-elements';
import { ERROR, LOADING, partialProfileUrl } from '../Providers';
import { AppContext, GOOGLE_MAPS_APIKEY } from '../Providers/AppProvider';
import ListEmpty from '../Components/ListEmpty';
import { useNetInfo } from '@react-native-community/netinfo';


const OnJob = ({ navigation, route }) => {
  const netInfo = useNetInfo()
  const [message, setMessage] = useState('')
  const [onTheWay, setOnTheWay] = useState(route.params?.onTheWay || false);
  const {setLoading} = useContext(AppContext)
  const { onMyWay, startJob, getSingleBookingDetails,sendCALL , sendSMSTWIL } = useContext(BookingContext)
  const { userData: { latitude, longitude } } = useContext(AuthContext);
  const { booking_id } = useMemo(() => route.params, [])
  const [booking, setBooking] = useState(LOADING)

  useEffect(() => getSingleBookingDetails(booking_id, setBooking), [])

  const onPress = async () => {
    setLoading(true)
    if (onTheWay) {
      let success = await startJob(booking_id)
      if (success) navigation.navigate('WORK IN PROGRESS', { booking });
    } else {
      let success = await onMyWay(booking?.userdetails[0]?.id, booking_id)
      if (success) setOnTheWay(true)
    }
    setLoading(false)
  };

  const getDistanceFromLatLonInKm = () => {
    var lat1 = latitude;
    var lon1 = longitude;
    var lat2 = booking?.wash_lat_lng.latitude
    var lon2 = booking?.wash_lat_lng.longitude
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d.toFixed(2);
  }
  
  const deg2rad = (deg) => {
    return deg * (Math.PI/180)
  }

  switch (booking) {
    case LOADING: return <ActivityIndicator size="large" color={Colors.blue_color} style={{alignSelf : 'center', height : '100%'}} />
    case ERROR: return <ListEmpty retry={() => getSingleBookingDetails(booking_id, setBooking)} opacity={0.5} color={Colors.blue_color} netInfo={netInfo} emptyMsg="Error loading request details." />

    default:  return (
      <View style={{ flex: 1, position: 'relative' }}>
        <MapView
          style={{ width: '100%', flex: 1 }}
          region={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          <MapViewDirections
            onReady={() => setLoading(false)}
            onError={() => setLoading(false)}
            strokeWidth={5}
            strokeColor={Colors.blue_color}
            origin={{ latitude, longitude }}
            destination={getWashCoordinates(booking)}
            apikey={GOOGLE_MAPS_APIKEY}
          />
          <MapView.Marker coordinate={{ latitude, longitude }} title={'Your location'} />
          <MapView.Marker
            coordinate={getWashCoordinates(booking)}
            title={'Customer location'}
          />
        </MapView>
  
        <View style={styles.jobDestination}>
          <Image
            style={{ height: 25, width: 25, marginRight: 10, padding: 10, alignSelf: 'center', tintColor: '#999' }}
            source={require('../../Assets/help.png')}
          />
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text style={{ marginHorizontal: 5, fontSize: 16, color: Colors.dark_orange }}>JOB DESTINATION</Text>
              <Text style={{ marginHorizontal: 5, fontSize: 16, color: '#444' }}>{booking?.wash_location}</Text>
            </View>
            <Image
              style={{ height: 25, width: 25, marginRight: 10, padding: 10, alignSelf: 'center', tintColor: '#444' }}
              source={require('../../Assets/location.png')}
            />
          </View>
        </View>

        <View style={{
            borderWidth: 1,
            width: '95%', backgroundColor: '#fff', alignSelf: 'center',
            marginBottom: 10, shadowOpacity: 0.8, shadowColor: '#aaa', justifyContent: 'center', borderRadius: 15
          }}>
            <View style={{ width: '100%', height: 1, backgroundColor: '#aaa' }} />
            <View style={{ width: '100%', height: 1, backgroundColor: '#aaa' }} />
            <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
              <TouchableOpacity 
               onPress={() => Linking.openURL(`tel:${booking.userdetails[0].mobile}`)} 
             //onPress={() => sendCALL(setLoading,() => console.log('send'), booking.userdetails[0].mobile )}
              style={{ flexDirection: 'row', padding: 10, width: '100%' }}>
                <Image style={{ width: 20, height: 20, tintColor: '#0EFF74', }} source={require('./../../Assets/call.png')} />
                <Text style={{ padding: 4, marginLeft: 5, fontSize: 12 }}>CALL USER</Text>
              </TouchableOpacity>
              <View style={{ width: 1, height: 45, backgroundColor: '#aaa' }} />
            
            </View>
            <View style={{ width: '100%', height: 1, backgroundColor: '#aaa' }} />
            <View style={{ flexDirection: 'row', padding: 5, marginLeft: 10, alignItems: 'center' }}>
              <View style={{ backgroundColor: '#445F98', width: 25, height: 25, borderRadius: 5, justifyContent: 'center', alignItems: 'center', marginLeft: 0, margin: 7 }}>
                <Image style={{ width: 20, height: 20, tintColor: '#FFF', }} source={require('../../Assets/smartphone.png')} />
              </View>

              <TextInput
                style={[styles.auth_textInput,]}
                placeholder="Type your message"
                placeholderTextColor={Colors.text_color}
                value={message}
                onChangeText={setMessage}
                autoCapitalize='none' />
              <TouchableOpacity
               onPress={() => sendSMSTWIL(setLoading, () => setMessage(''),booking.userdetails[0].mobile, message)}
               //onPress={() => sendSMSTWIL(setLoading, () => setMessage(''),booking.washer_id, message)}
               //onPress={() => sendSMSTWIL(setLoading, () => setMessage(''), booking.userdetails[0].mobile, message)}
                //onPress={() => sendSMSTWIL(setLoading,() => console.log('send'), booking.userdetails[0].mobile)}
                >
                <Text style={{ color: '#445F98', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>SEND</Text>
              </TouchableOpacity>
            </View>
      </View>

        <View style={{ backgroundColor: '#efefef', padding: 10 }}>
          <Text style={{ fontSize: 18, paddingBottom: 5 }}>CUSTOMER INFORMATION</Text>
          <View style={styles.customerDetails}>
            <Avatar
              size="medium"
              rounded
              title={booking?.userdetails[0]?.name ? booking?.userdetails[0].name.split(' ').slice(0, 2).map(n => n[0].toUpperCase()).join('') : null}
              source={booking?.userdetails[0]?.image ? { uri: partialProfileUrl + booking?.userdetails[0].image } : null}
              containerStyle={{ marginRight: 10, backgroundColor: Colors.blue_color }}
              activeOpacity={0.7}
            />
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{}}>
                <Text style={{ marginHorizontal: 5, fontSize: 16 }}>{booking?.userdetails[0].name}</Text>
                <View style={{ flex: 1, flexDirection: 'row', marginTop: 5 }}>
                  <Image style={{ width: 16, height: 16, tintColor: '#777' }} source={require('../../Assets/coupon.png')} />
                  <Text style={{ marginHorizontal: 3, color: '#999' }}>{booking.booking_time}</Text>
                </View>
              </View>
              <View style={{}}>
                <Text style={{ marginHorizontal: 5, fontWeight: 'bold', textAlign: 'right' }}>{getDistanceFromLatLonInKm()} Miles</Text>
                <Text style={{ marginHorizontal: 5, color: '#aaa', textAlign: 'right', marginTop: 5 }}>Distance</Text>
              </View>
            </View>
          </View>
          <CtaButton
            onPress={onPress}
            primary
            title={onTheWay ? 'ARRIVED & START JOB' : 'ON MY WAY'}
            style={{ borderRadius: 5, backgroundColor: onTheWay ? Colors.green : '#226', padding: 16, width: '100%' }}
          />
        </View>
      </View>
    );
  }
};

const getWashCoordinates = booking => ({ latitude: parseFloat(booking.wash_lat_lng.latitude), longitude: parseFloat(booking.wash_lat_lng.longitude) })



export default OnJob;

const styles = StyleSheet.create({
  customerDetails: {
    shadowOffset: { width: 1, height: 1 },
    shadowColor: '#777',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },

  jobDestination: {
    shadowOffset: { width: 1, height: 1 },
    shadowColor: '#333',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 10,
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
  },
});
