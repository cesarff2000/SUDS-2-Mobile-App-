import React, { useContext, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View, StatusBar, SafeAreaView, TouchableOpacity } from 'react-native';
import Colors from '../../Constants/Colors';
import { bookingType, ON_DEMAND, afterScheduleScreen } from '../Navigation/NavigationService';
import { BookingContext } from '../Providers/BookingProvider';
const ConfirmBusniesswash = ({ navigation }) => {
    const { currentBooking,setCurrentBooking } = useContext(BookingContext)
    const area = useMemo(() => (parseFloat(currentBooking.length) * parseFloat(currentBooking.width)), [currentBooking])
    useEffect(() => {
        return () => {
            setCurrentBooking(cv => ({ ...cv, vehicle: undefined, packageDetails: undefined }))
            afterScheduleScreen.current = null
        }
    }, [])

    const onNext = () => {
        setCurrentBooking(cv => ({ ...cv, vehicle: "Business wash", packageDetails: { name: area.toFixed(1) + ' Sq. Feet', price: area * 0.15 } }))
        navigation.navigate(bookingType.current == ON_DEMAND ? 'Booking Review' : 'Select a Vendor');
        afterScheduleScreen.current = "Booking Review"
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <StatusBar translucent backgroundColor='transparent' barStyle='dark-content' />
            <SafeAreaView />
            <View style={{ width: '100%', padding: 21, alignItems: 'center' }}>

                <Text style={{ fontSize: 21, fontWeight: 'bold' }}>Business wash</Text>
                <Text style={{ fontSize: 21, padding: 10, textAlign: "center" }}>Area surface to be cleaned and washed</Text>
                <Text style={{ fontSize: 21 }}>Area : {area.toFixed(1)} SQ feet</Text>
                <Text style={{ fontSize: 21 }}>Price : $0.15 per square foot</Text>
                <View style={styles.card}>
                    <Text style={{ fontSize: 26, fontWeight: 'bold' }}>Total</Text>
                    <Text style={{ fontSize: 40, fontWeight: 'bold', color: Colors.blue_color }}>${(area * 0.15).toFixed(2)}</Text>
                </View>

            </View>
            <View style={{ justifyContent: 'flex-end', flex: 1, alignItems: 'center', marginTop: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity
                        elevation={5}
                        onPress={onNext}
                        style={styles.auth_btn}
                        underlayColor='gray'
                        activeOpacity={0.8} >
                        <Text style={{ fontSize: 16, textAlign: 'center', color: Colors.buton_label, fontWeight: 'bold' }}>Continue</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        elevation={5}
                        onPress={() => { }}
                        style={styles.auth_btn}
                        underlayColor='gray'
                        activeOpacity={0.8}>
                        <Text style={{ fontSize: 16, textAlign: 'center', color: Colors.buton_label, fontWeight: 'bold' }}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

export default ConfirmBusniesswash

const styles = StyleSheet.create({
    auth_btn: {
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: Colors.buttom_color,
        width: '50%',
        height: 65,
        justifyContent: 'center',
    },
    card: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e5e5e5',
        alignItems: 'center',
        shadowColor: '#555',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 3.5,
        borderRadius: 10,
        elevation: 5,
        margin: 30,
        padding: 8,
        justifyContent: 'space-between',
    },
})