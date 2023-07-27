import React, { useContext, useEffect, useState, useMemo } from 'react';
import { StyleSheet, Text, Detail, View, Image, Modal, Pressable, StatusBar, SafeAreaView, TouchableOpacity, TextInput, Button, FlatList, ImageBackground, Alert } from 'react-native';
import { ERROR, LOADING, partialProfileUrl } from '../Providers';
import Colors from '../../Constants/Colors';
import CheckBox from 'react-native-check-box'
import { BookingContext, calculateTotalPrice } from '../Providers/BookingProvider';
import LoadingView from '../Components/LoadingView';
import { changeStack } from '../Navigation/NavigationService';
import { bookingType, ON_DEMAND, SCHEDULED } from '../Navigation/NavigationService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const NotificationList = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [addOns, setAddOns] = useState([])
    const [fetching, setFetching] = useState(true)
    const [selectedAddOns, setSelectedAddOns] = useState([])
    const { getAddOns,getNotificationList, setCurrentBooking, currentBooking, getExtraTimeFee, getServiceFee } = useContext(BookingContext)
    const [serviceFee, setServiceFee] = useState([]);
    const [extraTimeFee, setExtraTimeFee] = useState('Loading...')
    const [discountRate, setDiscountRate] = useState('Loading...')
    const [localbooking, setLocalbooking] = useState([])
    const Divider = () => <View style={{ width: '100%', height: 0.5, backgroundColor: '#aaa', marginVertical: 7 }} />
    useEffect(() => {
  
      getNotificationListfun();
    }, [])
    const getNotificationListfun = async () => {
        setFetching(true)
        let json = await getNotificationList()
        setFetching(false)
        if (json?.data)
        {
            let selectdata = json?.data;
            console.log(selectdata);
            setAddOns(selectdata)
        }
    }
  
    const onSelect = (item) => {
        if (selectedAddOns.includes(item)) setSelectedAddOns(cv => cv.filter(v => v.id != item.id))
        else setSelectedAddOns(cv => [...cv, item])
    }
    
    
    
  
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.blue_color }}>
            <ImageBackground style={{ width: '100%', height: '100%', flex: 1, }} source={require('../../Assets/bg_img.png')}>
                <LoadingView fetching={fetching} containerStyle={{ height: '100%' }}>
                    <View style={{ alignItems: 'center', width: '100%', }}>
                        <FlatList
                            style={{ width: '100%', marginBottom: 5 }}
                            showsVerticalScrollIndicator={false}
                            data={addOns}
                            renderItem={({ item }) => <Item item={item} navigation={navigation} />}
                            keyExtractor={(item, index) => index}
                        />
                    </View>
                </LoadingView>
            </ImageBackground>
        </SafeAreaView>
    );
}

export default NotificationList;
    const monmetget = (date)=>{     
        return moment(date).format("YYYY-MM-DD")
    }
    const Item = ({ item, navigation }) => {
        const washStatusObject = useMemo(() => getWashStatus(item.status), [item])
        const { getSingleBookingDetails } = useContext(BookingContext);
        //const { setLoading } = useContext(AppContext)
  
        const onPress = async () => {

            switch (item.status) {
                case 0:if (item.type == 1) return Alert.alert('Pending', 'Washer has not yet accepted your request.')
                else return navigation.navigate('Near By Washers', { booking_id: item.booking_id })
                case 6: return Alert.alert('Rejected', 'Washer rejected this job request')
                case 7: return Alert.alert('Cancelled', 'You cancelled this request.')
                case 8: return Alert.alert('Cancelled', 'Your request has been automatically cancelled due to a lack of response.')
                case 1: return navigation.navigate('BOOKING DETAILS', { id: item.booking_id })
                case 2: return navigation.navigate('On The Way', { booking_id: item.booking_id })
                case 4: return navigation.navigate('Work In Progress', { booking_id: item.booking_id });
                case 5: return navigation.navigate('BOOKING DETAILS', { id: item.booking_id });
                case null: return ;
                default:
                break;
            }
        }
  
        return (
            <TouchableOpacity style={{ padding: 6, flex: 1 ,backgroundColor:"#FFFFFF",margin:5,marginHorizontal:15}} onPress={onPress}>
                {/* <Text>{item.type}</Text> */}
                <View style={{ flexDirection: 'row' }}>
                    <Image style={{ height: 70, width: 70, marginRight: 10, padding: 10, borderRadius: 35 }} source={(item.image) ? { uri:  (item.image) } : require('../../Assets/icon/user.png')}/>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ marginHorizontal: 5, fontSize: 16, marginBottom: 2 }}>{item.title}</Text>
                            <Text style={{ marginHorizontal: 5, fontWeight: 'bold', color: Colors.blue_color }}>{item.message}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text numberOfLines={1} style={{ marginHorizontal: 5, color: getWashStatus(item.status).color, fontWeight: 'bold', textAlign: 'right' }}>{washStatusObject.name}</Text>
                            <Text style={{ marginHorizontal: 5, color: '#aaa', textAlign: 'right' }}>{monmetget(item.created_at)}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };
    const getWashStatus = (status) => {
        switch (status) {
            case 0: return { name: "Pending", color: 'orange', naviagteTo: 'BOOKING DETAILS' }
            case 1: return { name: "Accepted", color: 'orange', naviagteTo: 'BOOKING DETAILS' }
            case 2: return { name: "Washer on the way", color: 'orange', naviagteTo: 'On The Way' }
            case 3: return { name: "Washer Arrived", color: 'orange', naviagteTo: 'On The Way' }
            case 4: return { name: "In progress", color: 'orange', naviagteTo: 'Work In Progress' }
            case 5: return { name: "Success", color: Colors.green, naviagteTo: 'BOOKING DETAILS' }
            case 6: return { name: "Rejected", color: 'red', naviagteTo: 'BOOKING DETAILS' }
            case 7: return { name: "Cancelled", color: 'red', naviagteTo: 'BOOKING DETAILS' }
            case 8: return { name: "Cancelled", color: 'red', naviagteTo: 'BOOKING DETAILS' }
            case null: return { name: "", color: 'white', naviagteTo: 'Notification List' }
        }
    }


    const styles = StyleSheet.create({
        header: {
          padding: 15,
          backgroundColor: '#ffae00',
          flexDirection: 'row',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 1, height: 1 },
          shadowOpacity: 0.5,
          shadowRadius: 3.5,
          elevation: 15,
        },
      });