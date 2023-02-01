import { useNetInfo } from '@react-native-community/netinfo';
import React, { useContext, useState, useEffect, useMemo } from 'react';
import { Alert } from 'react-native';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, SafeAreaView, RefreshControl, ActivityIndicator } from 'react-native';
import Colors from '../../Constants/Colors';
import ListEmpty from '../Components/ListEmpty';
import LoadingView from '../Components/LoadingView';
import { partialProfileUrl } from '../Providers';
import { AppContext } from '../Providers/AppProvider';
import { ACTIONS, BookingContext, WASHER_ACCEPTED, WASHER_ARRIVED, WASHR_ON_THE_WAY, WASH_CANCELLED, WASH_COMPLETED, WASH_IN_PROGRESS, WASH_PENDING, WASH_REJECTED } from '../Providers/BookingProvider';


const BookingHistory = ({ navigation }) => {
  const netInfo = useNetInfo();
  const {setNewJobRequestId} = useContext(AppContext)
  const {
    state: { bookingHistory, loading, hasLoadedAllItems, refreshing, type },
    dispatch,
  } = useContext(BookingContext);

  useEffect(() => dispatch({ type: ACTIONS.Start }), []);


  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <SafeAreaView />
      <FlatList
        keyExtractor={item => item.booking_id}
        style={{ width: '100%', height: 200 }}
        showsVerticalScrollIndicator={false}
        data={bookingHistory}
        renderItem={({ item }) => <Item item={item} navigation={navigation} />}
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

const Item = ({ item, navigation }) => {
  const [loading, setLoading] = useState(false);
  const { getSingleBookingDetails} = useContext(BookingContext);
  const washStatusObject = useMemo(() => getWashStatus(item.status), [item])
  const {setNewJobRequestId} = useContext(AppContext)

  const onPress = async () => {
    switch (item.status) {
      case WASH_PENDING: return setNewJobRequestId(item.booking_id) 
      case WASH_REJECTED: return Alert.alert('Rejected', 'You rejected this job request')
      case WASH_CANCELLED: return Alert.alert('Cancelled', 'Request has been cancelled by the customer.')
      case WASHER_ACCEPTED: return navigation.navigate('ON JOB', { booking_id : item.booking_id })
      case WASHR_ON_THE_WAY: return navigation.navigate('ON JOB', { booking_id : item.booking_id, onTheWay: true })
      case WASH_IN_PROGRESS:
        booking = await getBookingWithId(item.booking_id)
        if (booking){
          console.log("asrasd",booking)
          navigation.navigate('WORK IN PROGRESS', { booking });
        }
        break;
      case WASH_COMPLETED:
        navigation.navigate('BOOKING DETAILS', { id: item.booking_id });
        break;
      default:
        break;
    }
  }

  const getBookingWithId = async (id) => {
    setLoading(true);
    let json = await getSingleBookingDetails(item.booking_id);
    setLoading(false);
    if (json?.data) return json.data
    else Alert.alert('Error', 'Something went wrong')
  }

  return (
    <TouchableOpacity style={{ padding: 16, flex: 1 }} onPress={onPress}>
      <View style={{ flexDirection: 'row' }}>
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
          <View style={{ flex: 1 }}>
            <Text numberOfLines={1} style={{ marginHorizontal: 5, color: getWashStatus(item.status).color, fontWeight: 'bold', textAlign: 'right' }}>
            {washStatusObject.name}
            </Text>
            <Text style={{ marginHorizontal: 5, color: '#aaa', textAlign: 'right' }}>{item.booking_date}</Text>
          </View>
        </View>
        
      </View>
    </TouchableOpacity>
  );
};

const ListFooter = () => (
  <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'center', padding: 8 }}>
    <ActivityIndicator color={Colors.blue_color} size="large" />
  </View>
);

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
    default: return { name: "Error", color: 'red', naviagteTo: ' ' }
  }
}