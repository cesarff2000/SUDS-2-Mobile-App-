import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity, TextInput, Linking } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Colors from '../../Constants/Colors';
import { SafeAreaView } from 'react-native';
import MapViewDirections from 'react-native-maps-directions';
import LoadingView from '../Components/LoadingView';
import { BookingContext, WASHR_ON_THE_WAY, WASH_IN_PROGRESS, WASH_PENDING } from '../Providers/BookingProvider'
import { AuthContext } from '../Providers/AuthProvider'
import { ERROR, LOADING, partialProfileUrl } from '../Providers';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native';
import { changeStack } from '../Navigation/NavigationService';
import { Avatar } from 'react-native-elements';
import { GOOGLE_MAPS_APIKEY } from '../Providers/AppProvider';
import ListEmpty from '../Components/ListEmpty';
import { useNetInfo } from '@react-native-community/netinfo';


export default OnTheWay = ({ route }) => {
    const navigation = useNavigation()
    const netInfo = useNetInfo()
    const [loading, setLoading] = useState(true)
    const { getWasherLocation, getSingleBookingDetails, sendSMS, cancelRequest, sendCALL, sendSMSTWIL } = useContext(BookingContext)
    const { userData } = useContext(AuthContext)
    const [booking, setBooking] = useState(LOADING)
    const { booking_id } = useMemo(() => route?.params, [route])
    const [origin, setOrigin] = useState()
    const [washerLocation, setWasherLocation] = useState()
    const [message, setMessage] = useState('')

    useEffect(() => getSingleBookingDetails(booking_id, setBooking), [])

    useEffect(() => {
        if (booking == LOADING || booking_id == ERROR) return
        let interval = setInterval(function x() {
            if (booking?.booking_status === WASHR_ON_THE_WAY || !washerLocation) {
                getWasherLocation(booking.washer_id).then(json => {
                    if (json?.data[0]) {
                        if (!origin) setOrigin({ latitude: parseFloat(json?.data[0]?.latitude), longitude: parseFloat(json?.data[0]?.longitude) })
                        setWasherLocation(json?.data[0])
                    }
                })
            }
            return x;
        }(), 60000);
        // console.log(booking.userdetails)
        return () => clearInterval(interval)
    }, [booking])

    const onCancelRequest = () => {
        return Alert.alert('Cancel Request', 'Are you sure you want to cancel?',
            [
                {
                    text: 'Ok',
                    onPress: () => cancelRequest({ amount: 0, booking_id }, () => changeStack('CustomerHomeStack'))
                }
            ]
        )
    }

    switch (booking) {
        case LOADING: return <ActivityIndicator size="large" color={Colors.blue_color} style={{ alignSelf: 'center', height: '100%' }} />
        case ERROR: return <ListEmpty retry={() => getSingleBookingDetails(booking_id, setBooking)} opacity={0.5} color={Colors.blue_color} netInfo={netInfo} emptyMsg="Error loading request details." />

        default: return (
            <View style={{ flex: 1, position: 'relative' }}>
                <LoadingView loading={loading} />
                <MapView
                    style={{ width: '100%', flex: 1 }}
                    initialRegion={{
                        ...(origin ? origin : getWashCoordinates(booking)),
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    }} >

                    {origin && <MapViewDirections
                        onReady={() => setLoading(false)}
                        onError={() => setLoading(false)}
                        strokeWidth={5}
                        strokeColor={Colors.blue_color}
                        origin={getWashCoordinates(booking)}
                        destination={origin}
                        apikey={GOOGLE_MAPS_APIKEY}
                    />}

                    {washerLocation != undefined &&
                        <Marker
                            title="Washer"
                            coordinate={{ latitude: parseFloat(washerLocation.latitude), longitude: parseFloat(washerLocation.longitude) }}>
                            <CustomAvatar userData={booking?.userdetails[0]} />
                        </Marker>}

                    {origin != undefined &&
                        <Marker
                            title="You"
                            coordinate={getWashCoordinates(booking)}>
                            <CustomAvatar userData={userData} />
                        </Marker>
                    }
                </MapView>

                <View style={styles.jobDestination}>
                    <Text style={{ fontWeight: 'bold', color: 'orange', fontSize: 18 }} >JOB DESTINATION</Text>
                    <Text>{booking.wash_location}</Text>
                </View>

                <View style={{ backgroundColor: '#efefef', padding: 10, paddingBottom: 0 }}>
                    <View style={{ flexDirection: 'row', marginBottom: 10, alignSelf: 'center' }}>
                        <Image style={{ width: 25, height: 25, tintColor: '#24AE88', }} source={require('../../Assets/checkdark.png')} />
                        <Text style={{ fontSize: 16, marginVertical: 1, fontWeight: 'bold', textAlign: 'center', marginLeft: 5 }}>Booking Confirmed</Text>
                    </View>

                    <View style={{
                        borderWidth: 1, borderColor: '#ccc',
                        width: '95%', backgroundColor: '#fff', alignSelf: 'center',
                        marginBottom: 22, shadowOpacity: 0.8, shadowColor: '#aaa', justifyContent: 'center', borderRadius: 15
                    }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, alignItems: 'center' }}>
                            <Text numberOfLines={1} style={{ flex: 1 }} >{booking?.wash_location}</Text>
                            {/* <Text style={{ color: 'yellow', backgroundColor: '#000', padding: 4, fontWeight: 'bold', borderRadius: 5 }}> 0.5 min </Text> */}
                        </View>
                        <View style={{ width: '100%', height: 1, backgroundColor: '#aaa' }} />
                        <View style={{ flexDirection: 'row', padding: 10 }}>
                            <Image style={{ width: 40, height: 40, borderRadius: 20 }} source={booking?.userdetails[0]?.image ? { uri: partialProfileUrl + booking.userdetails[0].image } : require('../../Assets/icon/user.png')} />
                            <Text style={{ padding: 4, marginLeft: 5, fontWeight: 'bold', fontSize: 18, alignSelf: 'center' }}>{booking.userdetails[0]?.name}</Text>
                        </View>

                        <View style={{ width: '100%', height: 1, backgroundColor: '#aaa' }} />
                        <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
                            <TouchableOpacity
                                onPress={() => Linking.openURL(`tel:${booking.washerdetails[0].mobile}`)}
                                //onPress={() => sendCALL(setLoading,() => console.log('send'), booking.userdetails[0].mobile )}
                                style={{ flexDirection: 'row', padding: 10, width: '50%' }}>
                                <Image style={{ width: 20, height: 20, tintColor: '#0EFF74', }} source={require('../../Assets/call.png')} />
                                <Text style={{ padding: 4, marginLeft: 5, fontSize: 12 }}>CALL WASHER</Text>
                            </TouchableOpacity>
                            <View style={{ width: 1, height: 45, backgroundColor: '#aaa' }} />
                            <TouchableOpacity onPress={onCancelRequest} style={{ flexDirection: 'row', padding: 10, width: '50%' }}>
                                <Image style={{ width: 20, height: 20, tintColor: 'red', }} source={require('../../Assets/error.png')} />
                                <Text style={{ padding: 4, marginLeft: 5, fontSize: 12 }}>CANCEL REQUEST </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: '100%', height: 1, backgroundColor: '#aaa' }} />
                        <View style={{ flexDirection: 'row', padding: 5, marginLeft: 10, alignItems: 'center' }}>
                            <View style={{ backgroundColor: '#445F98', width: 45, height: 50, borderRadius: 5, justifyContent: 'center', alignItems: 'center', marginLeft: 0, margin: 7 }}>
                                <Image style={{ width: 40, height: 40, tintColor: '#FFF', }} source={require('../../Assets/smartphone.png')} />
                            </View>

                            <TextInput
                                style={[styles.auth_textInput,]}
                                placeholder="Type your message"
                                placeholderTextColor={Colors.text_color}
                                value={message}
                                onChangeText={setMessage}
                                autoCapitalize='none' />
                            <TouchableOpacity
                                onPress={() => sendSMS(setLoading, () => setMessage(''), booking.washer_id, message)}
                            //onPress={() => sendSMSTWIL(setLoading,() => console.log('send'), booking.washerdetails[0].mobile)}
                            >

                                <Text style={{ color: '#445F98', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>SEND</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* <View style={{ flexDirection: 'row'}}>
          <TouchableOpacity 
          onPress={() => sendCALL(setLoading,() => console.log('send'), booking.userdetails[0].mobile )}
          style={[styles.btns, { backgroundColor: Colors.blue_color , borderRadius: 20 , display:'flex' , alignItems:'center' , justifyContent:'space-between' , flexDirection:'row' , marginBottom:10 , padding:10}]}>
            <Text style={[styles.btnText, { color:'white' }]}>Call To Washer</Text>
            <Image style={{ tintColor: 'white', height: 15, width: 15 , marginLeft:20}} source={require('../../Assets/call.png')}></Image>
          </TouchableOpacity>

          <TouchableOpacity 
          onPress={() => sendSMSTWIL(setLoading,() => console.log('send'), booking.userdetails[0].mobile)}
          style={[styles.btns, { backgroundColor: Colors.blue_color , borderRadius: 20 , display:'flex' , alignItems:'center' , justifyContent:'space-between' , flexDirection:'row' , marginBottom:10 ,padding:10}]}>
            <Text style={[styles.btnText,{ color:'white'}]}>Sms To Washer</Text>
            <Image style={{ tintColor: 'white', height: 15, width: 15 }} source={require('../../Assets/help.png')}></Image>
          </TouchableOpacity>
        </View> */}

                </View>
                <SafeAreaView />
            </View>
        );
    }
}

const getWashCoordinates = booking => ({ latitude: parseFloat(booking.wash_lat_lng.latitude), longitude: parseFloat(booking.wash_lat_lng.longitude) })

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
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 4,
        padding: 5,
        paddingHorizontal: 15,
        position: 'absolute',
        top: 10,
        left: 10,
        right: 10,
    },
    auth_textInput: {

        alignSelf: 'center',
        width: '55%',
        // borderWidth: 1,
        marginLeft: 5,
        marginRight: 15,
        borderBottomWidth: 0,
        height: 40,
        color: Colors.text_color,
        marginTop: 5,

    },
});

const CustomAvatar = ({ userData }) => (
    <Avatar
        size="medium"
        rounded
        title={userData?.name ? userData.name.split(' ').slice(0, 2).map(n => n[0].toUpperCase()).join('') : null}
        source={userData?.image ? { uri: partialProfileUrl + userData.image } : null}
        containerStyle={{ marginRight: 16, backgroundColor: Colors.blue_color }}
        activeOpacity={0.7}
    />
)