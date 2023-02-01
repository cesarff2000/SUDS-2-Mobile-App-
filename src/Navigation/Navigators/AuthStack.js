import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import UserTypeScreen from '../../CommonScreen/UserTypeScreen';
import {defaultScreenOptions} from '../NavigationService';
import ChooseScreen from '../../CommonScreen/ChooseScreen';
import LoginScreen from '../../CommonScreen/WasherLogin';
import CustomerLogin from '../../CommonScreen/CustomerLogin';
import CustomerSignUp from '../../CommonScreen/CustomerSignUp';
import SignUp from '../../CommonScreen/SignUp';
import OTPverification from '../../CommonScreen/OtpVerification';
import TermsConditions from '../../CommonScreen/TermsConditions';
import ForgotPassword from '../../CommonScreen/ForgotPassword';
import CompleteProfile from '../../DriverScreen/CompleteProfile';
import UpdateDocument from '../../DriverScreen/UpdateDocument';
import BackgroundCheck from '../../DriverScreen/BackgroundCheck';
import UploadDriverLicense from '../../DriverScreen/UploadDriverLicense';
import VehicleInsurance from '../../DriverScreen/VehicleInsurance';
import VehicleRegistration from '../../DriverScreen/VehicleRegistration';

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="userTypeScreen" mode="modal" screenOptions={defaultScreenOptions}>
      <Stack.Screen name="userTypeScreen" component={UserTypeScreen} options={{headerTitle: 'GET STARTED NOW'}} />
      <Stack.Screen name="chooseScreen" component={ChooseScreen} options={{headerTitle: 'GET STARTED NOW'}} />
      <Stack.Screen name="LOGIN" component={LoginScreen} />
      <Stack.Screen name="REGISTER" component={SignUp} />
      <Stack.Screen name=" LOGIN " component={CustomerLogin} />
      <Stack.Screen name=" REGISTER " component={CustomerSignUp} />
      <Stack.Screen name="ENTER OTP" component={OTPverification} />
      <Stack.Screen name="FORGOT PASSWORD" component={ForgotPassword} />
      <Stack.Screen name="COMPLETE PROFILE" component={CompleteProfile} initialParams={{authStack: true}}/>
      <Stack.Screen name="BACKGROUND CHECK" component={BackgroundCheck} />
      <Stack.Screen name="TERMS & CONDITIONS" component={TermsConditions} />
      <Stack.Screen name="UPDATE DOCUMENT" component={UpdateDocument} initialParams={{authStack: true}} />
      <Stack.Screen name="VEHICLE INSURANCE" component={VehicleInsurance} initialParams={{authStack: true}} />
      <Stack.Screen name="VEHICLE REGISTRATION" component={VehicleRegistration} initialParams={{authStack: true}} />
      <Stack.Screen name="UPLOAD DRIVING LICENSE" component={UploadDriverLicense} initialParams={{authStack: true}} />
    </Stack.Navigator>
  );
};

export default AuthStack;
