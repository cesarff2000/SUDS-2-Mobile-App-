import React, { useContext, useEffect, useMemo, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { defaultScreenOptions } from '../NavigationService';
import { Image, TouchableOpacity } from 'react-native';
import DriverDrawer from './DriverDrawer';
import { useNavigation, useRoute } from '@react-navigation/core';
import OnJob from '../../DriverScreen/OnJob';
import WorkInProgress from '../../DriverScreen/WorkInProgress';
import JobFinished from '../../DriverScreen/JobFinished';
import BookingDetails from '../../DriverScreen/BookingDetails';
import { nav } from '../../DriverScreen/Welcome';
import TripSwitch from '../../Components/TirpSwitch';
import UploadDriverLicense from '../../DriverScreen/UploadDriverLicense';
import CompleteProfile from '../../DriverScreen/CompleteProfile';
import PackgeScreen from '../../DriverScreen/PackageScreen';
import { AuthContext } from '../../Providers/AuthProvider';
import { Alert } from 'react-native';
import { BookingContext, WASHER_ACCEPTED, WASHR_ON_THE_WAY, WASH_COMPLETED, WASH_IN_PROGRESS, WASH_PENDING, WASH_REJECTED } from '../../Providers/BookingProvider';
import { AppContext } from '../../Providers/AppProvider';
import BackgroundCheck from '../../DriverScreen/BackgroundCheck';
import VehicleInsurance from '../../DriverScreen/VehicleInsurance';
import VehicleRegistration from '../../DriverScreen/VehicleRegistration';
import BookingHistory from '../../DriverScreen/BookingHistory';

const Stack = createStackNavigator();

const DriverHomeStack = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { getOnlineStatus } = useContext(AuthContext);
  const { setLoading } = useContext(AppContext)

  const title = useMemo(() => getActionFromState(navigation.dangerouslyGetState()), [route]);
  const [onlineStatus, setOnlineStatus] = useState()


  useEffect(() => getOnlineStatus().then(json => setOnlineStatus(json?.status)), [])

  // useEffect(() => handleBooking(route.params?.booking_id), [])

  function getActionFromState(state) {
    let index = state?.routes[0]?.state?.routes[0]?.state?.index;
    return state?.routes[0]?.state?.routes[0]?.state?.routeNames[index];
  }

  const { getSingleBookingDetails, acceptJob, rejectJob, dispatch } = useContext(BookingContext);
  const [modalVisible, setModalVisibility] = useState(false);
  const [newJobBooking, setNewJobBooking] = useState();

  const accept = async () => {
    setModalVisibility(false);
    setLoading(true);
    let success = await acceptJob(newJobBooking?.booking_id);
    setLoading(false);
    if (success) {
      dispatch({ type: ACTIONS.Start })
      navigation.navigate('ON JOB', { booking: newJobBooking })
    }
  };

  const hide = async () => {
    setLoading(true);
    let json = await rejectJob(newJobBooking.booking_id);
    setLoading(false);
    if (json) dispatch({ type: ACTIONS.Start })
    setModalVisibility(false);
  };

  const handleBooking = async (id) => {
    if (!id) return
    setLoading(true);
    let booking = (await getSingleBookingDetails(id))?.data;
    setLoading(false);
    if (!booking) return Alert('Error', 'Error getting the booking')
    switch (booking.booking_status) {
      case WASH_PENDING:
        setNewJobBooking(booking);
        setModalVisibility(true);
        break;
      case WASH_REJECTED: return Alert.alert('Rejected', 'You rejected this job request')
      case WASHER_ACCEPTED:
        if (booking) navigation.navigate('ON JOB', { booking })
        break;
      case WASHR_ON_THE_WAY:
        if (booking) navigation.navigate('ON JOB', { booking, onTheWay: true })
        break;
      case WASH_IN_PROGRESS:
        if (booking) navigation.navigate('WORK IN PROGRESS', { booking });
        break;
      case WASH_COMPLETED:
        navigation.navigate('BOOKING DETAILS', { id });
        break;
      default:
        break;
    }
  }

  return (
    <Stack.Navigator initialRouteName="WELCOME" mode="modal" screenOptions={defaultScreenOptions}>
      <Stack.Screen
        name="WELCOME"
        options={{ headerLeft: () => <Icon navigation={nav.current} />, headerTitle: title, 
        headerRight: () => <TripSwitch status={onlineStatus} headerTitle={title}/>
        }}
        component={DriverDrawer}
      />
      
      <Stack.Screen name="ON JOB" component={OnJob} />
      <Stack.Screen name="WORK IN PROGRESS" component={WorkInProgress} />
      <Stack.Screen name="JOB FINISHED" component={JobFinished} />
      <Stack.Screen name="BOOKING DETAILS" component={BookingDetails} />
      <Stack.Screen name="UPLOAD DRIVING LICENSE" component={UploadDriverLicense} initialParams={{ authStack: false }} />
      <Stack.Screen name="EDIT PROFILE" component={CompleteProfile} />
      <Stack.Screen name="BACKGROUND CHECK" component={BackgroundCheck} />
      <Stack.Screen name="VEHICLE INSURANCE" component={VehicleInsurance} />
      <Stack.Screen name="VEHICLE REGISTRATION" component={VehicleRegistration} />
      <Stack.Screen name="PACKAGE DETAILS" component={PackgeScreen} />
      <Stack.Screen name="BOOKING HISTORY" component={BookingHistory} />
    </Stack.Navigator>
  );
};

const Icon = ({ navigation }) => (
  <TouchableOpacity style={{ padding: 10 }} onPress={() => navigation.toggleDrawer()}>
    <Image style={{ height: 20, width: 20, tintColor: 'white' }} source={require('../../../Assets/menu.png')} />
  </TouchableOpacity>
);

export default DriverHomeStack;
