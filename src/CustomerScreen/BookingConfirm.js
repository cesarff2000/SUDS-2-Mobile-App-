import React, { useContext } from 'react';
import { Alert } from 'react-native';
import { StyleSheet, Text, View, Image, TouchableOpacity,SafeAreaView } from 'react-native';
import Colors from '../../Constants/Colors';
import { afterScheduleScreen, bookingType, changeStack, ON_DEMAND } from '../Navigation/NavigationService';
import { BookingContext, calculateTotalPrice } from '../Providers/BookingProvider';

const BookingConfirmed = () => {
    const {currentBooking} = useContext(BookingContext)
    return ( 
        <SafeAreaView style={{ flex: 1, backgroundColor : 'orange' }}>
            <View style={{flex : 1, backgroundColor : 'white'}} >
            <View style={{ alignItems: 'center', width: '100%', padding: 21, flex: 1 }}>
                <Image style={{ width: 85, height: 85, tintColor: '#0AFF06', marginTop: 30 }} source={require('../../Assets/checkmark.png')} />
                <Text style={{ fontSize: 22, marginVertical: 10, fontWeight: 'bold', color: 'gray', marginTop: 30 }}>Booking Confirmed!</Text>
                <Text style={{ fontSize: 16, marginVertical: 1, fontWeight: 'bold', color: 'gray' }}>Your request has been Confirmed</Text>
                <Text style={{ fontSize: 16, marginVertical: 1, fontWeight: 'bold', color: 'gray', marginTop: 15 }}>Please find the trainer info. below</Text>
                <Text style={{ fontSize: 18, marginVertical: 1, fontWeight: 'bold', color: '#3743FE', marginTop: 25 }}>Total Payment: ${calculateTotalPrice(currentBooking).toFixed(2)}</Text>
            </View>

            <View style={{ flexDirection: 'row', marginBottom: 10, alignSelf: 'center' }}>
                <Image style={{ width: 25, height: 25, tintColor: '#24AE88', }} source={require('../../Assets/checkdark.png')} />
                <Text style={{ fontSize: 16, marginVertical: 1, fontWeight: 'bold', textAlign: 'center', marginLeft: 5 }}>Booking Confirmed</Text>
            </View>
            <View style={{ backgroundColor: '#fff', alignSelf: 'stretch', margin: 25, marginTop: 'auto', shadowOpacity: 0.8, elevation: 3, shadowColor: '#aaa', justifyContent: 'center', borderRadius: 5, borderColor: '#ccc', borderWidth: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, alignItems: 'center' }}>
                    <Text>Booking Date/Time : </Text>
                    <Text style={{ color: Colors.dark_orange, backgroundColor: '#000', padding: 4, paddingHorizontal: 8, borderRadius: 3 }}>{new Date(Date.now()).toLocaleString()}</Text>
                </View>
                <View style={{ width: '100%', height: 1, backgroundColor: '#ddd' }} />
                <View style={{ flexDirection: 'row', padding: 10 }}>
                    <Image style={{ width: 30, height: 30, borderRadius: 20 }} source={require('../../Assets/images.jpeg')} />
                    <Text style={{ padding: 4, marginLeft: 5, fontWeight: 'bold' }}>Donnie McC.</Text>
                </View>

                <View style={{ width: '100%', height: 1, backgroundColor: '#ddd' }} />
                <View style={{ flexDirection: 'row' }}>
                    {bookingType.current == ON_DEMAND && <TouchableOpacity style={{ padding: 10, flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Image style={{ width: 25, height: 25, tintColor: '#0EFF74', }} source={require('../../Assets/call.png')} />
                        <Text style={{ marginLeft: 5, fontSize: 12 }}>CALL WASHER</Text>
                    </TouchableOpacity>}
                    {bookingType.current == ON_DEMAND && <View style={{ width: 1, height: 'auto', backgroundColor: '#ddd' }} />}
                    <TouchableOpacity onPress={()=>Alert.alert('Cancel Request', 'Are you sure you want to cancel your request?', [{text : 'Yes'}, {text:'No'}])} style={{ padding: 10, flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Image style={{ width: 25, height: 25, tintColor: 'red', }} source={require('../../Assets/error.png')} />
                        <Text style={{ marginLeft: 5, fontSize: 12 }}>CANCEL REQUEST</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{ backgroundColor: 'red', justifyContent: 'flex-end', flexDirection: 'row' }}>
                <TouchableOpacity
                    elevation={5}
                    onPress={() => {afterScheduleScreen.current=null; changeStack('CustomerHomeStack')}}
                    style={styles.auth_btn}
                    underlayColor='gray'
                    activeOpacity={0.8}>
                    <Text style={{ fontSize: 16, textAlign: 'center', color: Colors.buton_label, fontWeight: 'bold' }}>Go to Home Screen</Text>
                </TouchableOpacity>
            </View>
            </View>
        </SafeAreaView>
    );
}

export default BookingConfirmed

const styles = StyleSheet.create({
    auth_btn: {
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: 'orange',
        width: '100%',
        height: 65,
        justifyContent: 'center',
    },
})