import React, {useEffect, useMemo} from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {defaultScreenOptions} from '../NavigationService';
import {Image, TouchableOpacity} from 'react-native';
import DriverDrawer from './DriverDrawer';
import {useNavigation, useRoute} from '@react-navigation/core';
import OnJob from '../../DriverScreen/OnJob';
import JobFinished from '../../DriverScreen/JobFinished';

import AddNewVehicle from '../../CustomerScreen/AddNewVehicle';
import SelectPackage from '../../CustomerScreen/SelectPackage';
import AddCard from '../../CustomerScreen/AddCard';
import SelectAddOns from '../../CustomerScreen/SelectAddOns';
import BookingReview from '../../CustomerScreen/BookingReview';
import BookingDetail from '../../CustomerScreen/BookingDetail';
import BookingConfirm from '../../CustomerScreen/BookingConfirm';
import ScheduleBook from '../../CustomerScreen/ScheduleBook';
import OnTheWay from '../../CustomerScreen/OnTheWay';
import OnDemand from '../../CustomerScreen/OnDemand';
import WorkInProgress from '../../CustomerScreen/WorkInProgress';
import SelectTypeOfVehicle from '../../CustomerScreen/SelectTypeOfVehicle';
import SelectVender from '../../CustomerScreen/SelectVender';
import VendorProfile from '../../CustomerScreen/VenderProfile';
import RvsBusMH from '../../CustomerScreen/RvsBusMH';
import CarOrTruck from '../../CustomerScreen/CarOrTruck';
import BusinessWash from '../../CustomerScreen/BusinessWash';
import HeavyEquipment from '../../CustomerScreen/HeavyEquipment';
import MotorCycles from '../../CustomerScreen/MotorCycles';
import TractorTrailors from '../../CustomerScreen/TractorTrailors';
import Boats from '../../CustomerScreen/Boats';
import ReviewRating from '../../CustomerScreen/ReviewRating';
import { nav } from '../../CustomerScreen/HomeScreen';
import CustomerDrawer from './CustomerDrawer';
import SelectVehicleType from '../../CustomerScreen/SelectTypeOfVehicle';
import Packages from '../../CustomerScreen/Packages';
import ConfirmRvBusMH from '../../CustomerScreen/ConfirmRvMH';
import ConfirmHeavyEquipment from '../../CustomerScreen/ConfirmHeavyEquipment';
import ConfirmBusniesswash from '../../CustomerScreen/ConfirmBusinesswash';
import BookingDetails from '../../CustomerScreen/BookingDetail';
// src/CustomerScreen/BookingDetail.js
// import BookingDetails from '../../DriverScreen/BookingDetails';
import PayPal from '../../CustomerScreen/PayPal';
import WasherReviews from '../../CustomerScreen/WasherReviews';
import NearByWashers from '../../CustomerScreen/NearByWashers';
import MultiSelectVehicle from '../../CustomerScreen/MultiSelectVehicle';
import BookingHistory from '../../CustomerScreen/BookingHistory';
import { HeaderBackButton } from '@react-navigation/stack';

const Stack = createStackNavigator();

const CustomerHomeStack = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const title = useMemo(() => getActionFromState(navigation.dangerouslyGetState()), [route]);

  function getActionFromState(state) {
    let index = state?.routes[0]?.state?.routes[0]?.state?.index;
    return state?.routes[0]?.state?.routes[0]?.state?.routeNames[index];
  }
  return (
    <Stack.Navigator initialRouteName="DASHBOARD" mode="modal" screenOptions={defaultScreenOptions}>
      <Stack.Screen name="DASHBOARD" options={{headerLeft: () => <Icon navigation={nav.current} />, headerTitle: title}} component={CustomerDrawer} />
      <Stack.Screen name="Add New Vehicle" component={AddNewVehicle} />
      <Stack.Screen name="Select Package" component={SelectPackage} />
      <Stack.Screen name="Creddit/Debit Card" component={AddCard} />
      <Stack.Screen name="Select Add Ons" component={SelectAddOns} />
    
      <Stack.Screen name="Booking Review" component={BookingReview} options={{
          headerLeft: () => (
            <HeaderBackButton style={{height: 20, width: 20, color: 'white'}}
              onPress={() => {
                navigation.navigate('Select Vehicle Type');
                color="#fff"
              }}
            />
          ),
        }}/> 
      <Stack.Screen name="Booking Confirm" component={BookingConfirm} />
      <Stack.Screen name="Schedule Book" component={ScheduleBook} />
      <Stack.Screen name="Booking Detail" component={BookingDetail} />
      <Stack.Screen name="OnDemand" component={OnDemand} />
      <Stack.Screen name="OnDemandChangeLocation" component={OnDemand} options={{ ...TransitionPresets.ModalSlideFromBottomIOS, gestureEnabled: true, title : 'Change Location' }}/>
      <Stack.Screen name="On The Way" component={OnTheWay} />
      <Stack.Screen name="Work In Progress" component={WorkInProgress} />
      <Stack.Screen name="Select Type" component={SelectTypeOfVehicle} />
      <Stack.Screen name="Select a Vendor" component={SelectVender} />
      <Stack.Screen name="RVs Bus M V" component={RvsBusMH} />
      <Stack.Screen name="Vender Profile" component={VendorProfile} />
      <Stack.Screen name="Car or Truck" component={CarOrTruck} />
      <Stack.Screen name="Business Wash" component={BusinessWash} />
      <Stack.Screen name="Heavy Equipment" component={HeavyEquipment} />
      <Stack.Screen name="MotorCycles" component={MotorCycles} />
      <Stack.Screen name="Boats" component={Boats} />
      <Stack.Screen name="Tractor Trailors" component={TractorTrailors} />
      <Stack.Screen name="Review Rating" component={ReviewRating}  />
      {/* <Stack.Screen name="Select Vehicle Type" component={MultiSelectVehicle} /> */}
      <Stack.Screen name="Select Vehicle Type" component={SelectVehicleType} />
      <Stack.Screen name="Vehicle Categories" component={SelectVehicleType} />
      <Stack.Screen name="Packages" component={Packages} />
      <Stack.Screen name="Rv, Bus and Motor Home" component={ConfirmRvBusMH} />
      <Stack.Screen name="Heavy Equipments" component={ConfirmHeavyEquipment} />
      <Stack.Screen name=" Business wash " component={ConfirmBusniesswash} />
      <Stack.Screen name="BOOKING DETAILS" component={BookingDetails} />
      <Stack.Screen name="PAYPAL" component={PayPal} />
      <Stack.Screen name="Washer Reviews" component={WasherReviews} />
      <Stack.Screen name="Near By Washers" component={NearByWashers} />
      <Stack.Screen name="Booking History" component={BookingHistory} />

    </Stack.Navigator>
  );
};

const Icon = ({navigation}) => (
  <TouchableOpacity style={{padding: 10}} onPress={() => navigation.toggleDrawer()}>
    <Image style={{height: 20, width: 20, tintColor: 'white'}} source={require('../../../Assets/menu.png')} />
  </TouchableOpacity>
);


export default CustomerHomeStack;