import { useNetInfo } from '@react-native-community/netinfo';
import React, { useContext, useState, useEffect, useMemo } from 'react';
import { Alert } from 'react-native';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, SafeAreaView, RefreshControl, ActivityIndicator } from 'react-native';
import Colors from '../../Constants/Colors';
import ListEmpty from '../Components/ListEmpty';
import { ERROR, LOADING, partialProfileUrl } from '../Providers';
import { AppContext } from '../Providers/AppProvider';
import { ACTIONS, BookingContext, WASHER_ACCEPTED, WASHER_ARRIVED, WASHR_ON_THE_WAY, WASH_CANCELLED,WASH_AUTO_CANCELLED, WASH_COMPLETED, WASH_IN_PROGRESS, WASH_PENDING, WASH_REJECTED } from '../Providers/BookingProvider';

const BookingHistory = ({ navigation }) => {
    const netInfo = useNetInfo();
    const {
        state: { bookingHistory, loading, hasLoadedAllItems, refreshing, type },
        dispatch,Usercancelbooking,
        getRewards
    } = useContext(BookingContext);

    useEffect(() => { dispatch({ type: ACTIONS.Start }); getRewards(setRewards) }, []);
    const [rewards, setRewards] = useState(LOADING)

    const Rewards = () => {
        switch (rewards) {
            case LOADING: return <Text style={{ fontWeight: 'bold', fontSize: 16, color: 'white', textAlign: 'center' }}>Loading...</Text>
            case ERROR: return (
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16, color: 'white' }}>Error loading rewards.</Text>
                    <TouchableOpacity onPress={() => getRewards(setRewards)} style={{ padding: 5, backgroundColor: Colors.blue_color, borderRadius: 5, marginHorizontal: 10 }}>
                        <Text style={{ color: 'white', includeFontPadding: false }} >Retry</Text>
                    </TouchableOpacity>
                </View>
            )

            default: return (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: '#fff', margin: 6, marginTop: 10, fontSize: 16, fontWeight: '600' }}>Rewards</Text>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((v, i) => <Image key={i} style={{ width: 25, height: 25, marginTop: 5, tintColor: i < rewards ? Colors.blue_color : '#916832' }} source={require('../../Assets/drop.png')} />)}
                </View>
            )
        }
    }
    const oncancelfun = async (item) =>{
        let data ={
            booking_id:item.booking_id,
            user_id:item.user_id
        }
        await Usercancelbooking(data);
        dispatch({ type: ACTIONS.Start }); 
    }
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <SafeAreaView />
            <View style={{ width: '100%', height: 40, backgroundColor: '#e28c39', justifyContent: 'center' }}>
                <Rewards></Rewards>
            </View>
            <FlatList
                keyExtractor={item => item.booking_id}
                style={{ width: '100%', height: 200 }}
                showsVerticalScrollIndicator={false}
                data={bookingHistory}
                renderItem={({ item }) => <Item item={item} navigation={navigation} oncancelfun={oncancelfun}/>}
                ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#ddd' }} />}
                ListEmptyComponent={!loading && <ListEmpty retry={() => dispatch({ type: ACTIONS.Start })} netInfo={netInfo} emptyMsg="No Results Found" />}
                ListFooterComponent={(loading || (!hasLoadedAllItems && type !== ACTIONS.OnFail)) && ListFooter}
                onEndReached={!hasLoadedAllItems && (() => dispatch({ type: ACTIONS.LoadMore }))}
                onEndReachedThreshold={0.1}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => dispatch({ type: ACTIONS.Refresh })} />}
            />
        </View>
    );
};

export default BookingHistory;
const Item = ({ item, navigation,oncancelfun }) => {
    const washStatusObject = useMemo(() => getWashStatus(item.status), [item])
    const { getSingleBookingDetails } = useContext(BookingContext);
    const { setLoading } = useContext(AppContext)

    const onPress = async () => {
        switch (item.status) {
            case WASH_PENDING:
                if (item.type == 1) return Alert.alert('Pending', 'Washer has not yet accepted your request.')
                else return navigation.navigate('Near By Washers', { booking_id: item.booking_id })
            case WASH_REJECTED: return Alert.alert('Rejected', 'Washer rejected this job request')
            case WASH_CANCELLED: return Alert.alert('Cancelled!', 'You cancelled this request.')
            case WASH_AUTO_CANCELLED: return Alert.alert('Auto Cancellation!', 'This job request has been cancelled due to a scheduling conflict. Washer is booked, please select another time.')
            case WASHER_ACCEPTED: return navigation.navigate('BOOKING DETAILS', { id: item.booking_id })
            case WASHR_ON_THE_WAY: return navigation.navigate('On The Way', { booking_id: item.booking_id })
            case WASH_IN_PROGRESS: return navigation.navigate('Work In Progress', { booking_id: item.booking_id });
            case WASH_COMPLETED: return navigation.navigate('BOOKING DETAILS', { id: item.booking_id });
            default:
                break;
        }
    }

    
    return (
        <View style={{ padding: 16, flex: 1,position:"relative" }} >
            <TouchableOpacity onPress={onPress} style={{ flexDirection: 'row',width:"75%" }}>
                <Image style={{ height: 70, width: 70, marginRight: 10, padding: 10, borderRadius: 35 }} source={(item.userdetails[0]?.image || item.userdetails?.image) ? { uri: partialProfileUrl + (item.userdetails[0]?.image || item.userdetails?.image) } : require('../../Assets/icon/user.png')} />
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ marginHorizontal: 5, fontSize: 16, marginBottom: 2 }}>{(item.userdetails[0]?.name || item.userdetails?.name)}</Text>
                        <Text style={{ marginHorizontal: 5, fontWeight: 'bold', color: Colors.blue_color }}>{item.vehicledetails[0]?.model || item.vehicle_type}</Text>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                            <Image style={{ width: 16, height: 16, tintColor: '#777' }} source={require('../../Assets/location.png')} />
                            <Text style={{ marginHorizontal: 3, color: '#999' }}>{item.wash_location}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
            <View style={{ flex: 1,position:"absolute",top:15,right:10 }}>
                <Text numberOfLines={1} style={{ marginHorizontal: 5, color: getWashStatus(item.status).color, fontWeight: 'bold', textAlign: 'right' }}>{washStatusObject.name}</Text>
                <Text style={{ marginHorizontal: 5, color: '#aaa', textAlign: 'right' }}>{item.booking_date}</Text>
                {
                    (washStatusObject.name=="Pending")&&(
                        <TouchableOpacity onPress={()=>oncancelfun(item)} style={{padding:5,backgroundColor:"red",marginTop:10,borderRadius:5}}>
                            <Text style={{ color: "#ffffff", fontWeight: 'bold', textAlign: 'center' }}>Cancel</Text>
                        </TouchableOpacity>
                    )
                }
               
            </View>
        </View>
    );
};


const ListFooter = () => (
    <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'center', padding: 8 }}>
        <ActivityIndicator color={Colors.blue_color} size="large" />
    </View>
);
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


const getWashStatus = (status) => {
    switch (status) {
        case WASH_PENDING: return { name: "Pending", color: 'orange', naviagteTo: 'BOOKING DETAILS' }
        case WASHER_ACCEPTED: return { name: "Accepted", color: 'orange', naviagteTo: 'BOOKING DETAILS' }
        case WASHR_ON_THE_WAY: return { name: "Washer on the way", color: 'orange', naviagteTo: 'On The Way' }
        case WASHER_ARRIVED: return { name: "Washer Arrived", color: 'orange', naviagteTo: 'On The Way' }
        case WASH_IN_PROGRESS: return { name: "In progress", color: 'orange', naviagteTo: 'Work In Progress' }
        case WASH_COMPLETED: return { name: "Success", color: Colors.green, naviagteTo: 'BOOKING DETAILS' }
        case WASH_REJECTED: return { name: "Rejected", color: 'red', naviagteTo: 'BOOKING DETAILS' }
        case WASH_CANCELLED: return { name: "Cancelled", color: 'red', naviagteTo: 'BOOKING DETAILS' }
        case WASH_AUTO_CANCELLED: return { name: "Cancelled", color: 'red', naviagteTo: 'BOOKING DETAILS' }
    }
}