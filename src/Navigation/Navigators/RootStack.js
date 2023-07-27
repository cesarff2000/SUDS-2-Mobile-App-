import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import AuthStack from './AuthStack';
import DriverHomeStack from './DriverHomeStack';
import DriverDrawer from './DriverDrawer';
import CustomerHomeStack from './CustomerHomeStack';
import CustomerDrawer from './CustomerDrawer';
import Splash from '../../CommonScreen/Splash';

const Stack = createStackNavigator();

const RootStack = () => {
    return (
        <Stack.Navigator initialRouteName="SPLASH" headerMode="none" mode="modal" screenOptions={{ ...TransitionPresets.ModalSlideFromBottomIOS }}>
            <Stack.Screen name="SPLASH" options={{ headerShown: false, ...TransitionPresets.FadeFromBottomAndroid }} component={Splash} />
            <Stack.Screen name="AuthStack" component={AuthStack} />
            <Stack.Screen name="DriverHomeStack" component={DriverHomeStack} />
            <Stack.Screen name="CustomerHomeStack" component={CustomerHomeStack} />
        </Stack.Navigator>
    );
};

export default RootStack;
