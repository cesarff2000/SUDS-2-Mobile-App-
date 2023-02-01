import { TransitionPresets } from '@react-navigation/stack';
import * as React from 'react';
import Colors from '../../Constants/Colors';

export const navigationRef = React.createRef();
export const type = React.createRef()
export const bookingType = React.createRef()
export const afterScheduleScreen = React.createRef()
export const WASHER = '2'
export const CUSTOMER = '3'
export const ON_DEMAND = '1'
export const SCHEDULED = '0'
export let dontShow = false

export function setTrue() {
  dontShow = true
}

export const navigate = (routeName, params) => {
  navigationRef.current?.navigate(routeName, params);
};

export const opedDrawer = () => {
  navigationRef.current?.openDrawer();
};

export const changeStack = stackName => {
  resetRoot(stackName);
};

const resetRoot = routeName => {
  navigationRef.current?.resetRoot({
    index: 0,
    routes: [{name: routeName}],
  });
};

export const defaultScreenOptions = {
  headerStyle: {backgroundColor: Colors.blue_color},
  headerTitleStyle: {color: 'white'},
  headerTitleAlign: 'center',
  headerTintColor: 'white',
  detachPreviousScreen : false,
  ...TransitionPresets.SlideFromRightIOS,
  // cardStyle: {backgroundColor: '#000'},
};

export const onStartAction = React.createRef()