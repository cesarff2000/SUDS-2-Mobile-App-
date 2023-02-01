import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native';
import { View, Image, Text } from 'react-native';
import Colors from '../../Constants/Colors';
import ListEmpty from '../Components/ListEmpty';
import LoadingView from '../Components/LoadingView';
import { ERROR, LOADING } from '../Providers';
import { BookingContext } from '../Providers/BookingProvider';
import moment from 'moment';
import {changeStack } from '../Navigation/NavigationService';


const WorkInProgress = ({ navigation, route }) => {

    const [timeRemaining, setTimeRemaining] = useState(0)
    const [loading, setLoading] = useState(false);
    const [booking, setBooking] = useState()
    const { booking_id } = useMemo(() => route?.params, [route])
    const deadline = useMemo(() => getDeadline(booking), [booking])
    const { getSingleBookingDetails } = useContext(BookingContext)

    useEffect(() => {
        const interval = setInterval(() => setTimeRemaining(deadline - new Date().getTime()), 1000);
        return () => clearInterval(interval);
    }, [deadline]);


    useEffect(()=>getSingleBookingDetails(booking_id, setBooking),[])

    const RedirectDashboard = () =>{
        changeStack('CustomerHomeStack')
    }

    switch (booking) {
        case LOADING: return <ActivityIndicator style={{ padding: 50 }} color={Colors.blue_color} size="large" />
        case ERROR: return <ListEmpty retry={() => getSingleBookingDetails(booking_id, setBooking)} opacity={0.5} color={Colors.blue_color} netInfo={netInfo} emptyMsg="Error loading the booking." />

        default: return (
            <View style={styles.container}>
                <LoadingView containerStyle={{ height: '100%' }} loading={loading}>

                    <View style={{ alignItems: 'center', width: '100%', padding: 21 }}>
                        <Image style={{ width: 85, height: 85, tintColor: '#0AFF06', marginTop: 30 }} source={require('../../Assets/checkmark.png')} />
                        <Text style={{ fontSize: 22, marginVertical: 10, fontWeight: 'bold', color: 'gray', marginTop: 30 }}>Congratulation!</Text>
                        <Text style={{ fontSize: 16, marginVertical: 1, fontWeight: 'bold', color: 'gray' }}>Your service has started now!</Text>
                    </View>

                    {deadline && <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 18 , lineHeight:30 , textAlign:'center'}}>
                            {/* {parseMilllisecond(timeRemaining)} */}
                            "Thanks for using SUDS-2-U for your mobile wash needs! Please make sure your notifications for SUDS-2-U are on. We will notify you when your wash has been completed!"
                        </Text>
                        {/* <View style={{ flexDirection: 'row', width: '55%', justifyContent: 'space-between' }}>
                            <Text style={{ color: '#999' }}>Hours</Text>
                            <Text style={{ color: '#999' }}>Minutes</Text>
                        </View> */}
                    </View>}

                    <View style={{ width:"100%"}}>
                        <TouchableOpacity onPress={RedirectDashboard} style={[styles.btns, { backgroundColor: Colors.blue_color }]}>
                            <Text style={styles.btnText}>Go to Dashboard</Text>
                        </TouchableOpacity>
                        {/* <TouchableOpacity onPress={() => navigation.navigate('Select Add Ons')} style={[styles.btns, { backgroundColor: Colors.dark_orange }]}>
                            <Text style={styles.btnText}>+ Add Add-on</Text>
                        </TouchableOpacity> */}
                    </View>

                </LoadingView>
            </View>
        );
    }

};
export default WorkInProgress;

const parseMilllisecond = ms => {
    const zeroPad = (num, places) => String(num).padStart(places, '0');
    let hour = Math.floor(ms / 3600000);
    let minute = Math.floor((ms % 3600000) / 60000);
    return `${zeroPad(hour, 2)}:${zeroPad(Math.abs(minute), 2)}`;
};

const stringToms = string => {
    if (!string) return 0
    var time = "02 : 00";
    var array = time.split(":");
    var seconds = parseInt(array[0], 10) * 60 * 60 + parseInt(array[1], 10) * 60;
    return seconds * 1000
}

const getDeadline = (booking) => {
    if (!booking || typeof booking == 'number') return Date.now()
    // let start_time = new Date(booking?.start_time)
    let start_time = moment(booking?.start_time).valueOf()
    let extra_time = stringToms(booking?.extra_time)
    let package_time = stringToms(booking?.package_time)
    return start_time + extra_time + package_time
    // return start_time.getTime() + extra_time + package_time
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },

    btns: {
        padding: 20,
        width: '100%',
        textAlign: 'center',
    },

    btnText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});
