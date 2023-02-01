import React, { useContext, useEffect, useState } from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList, } from '@react-navigation/drawer';
import { Image, StyleSheet, Text, View } from 'react-native';
import HomeScreen from '../../CustomerScreen/HomeScreen'
import Promotions from '../../CustomerScreen/Promotions'
import Payments from '../../CustomerScreen/Payments'
import HelpScreen from '../../CustomerScreen/HelpScreen'
import EditProfile from '../../CustomerScreen/EditProfile'
import Colors from '../../../Constants/Colors';
import OnDemand from '../../CustomerScreen/OnDemand';
import { AuthContext } from '../../Providers/AuthProvider';
import DriverChangePassword from '../../DriverScreen/DriverChangePaasword';
import WorkInProgress from '../../CustomerScreen/WorkInProgress'
import BookingConfirmed from '../../CustomerScreen/BookingConfirm';
import OnTheWay from '../../CustomerScreen/OnTheWay';
import SelectVendor from '../../CustomerScreen/SelectVender';
import BookingHistory from '../../CustomerScreen/BookingHistory';
import TermsConditions from '../../CommonScreen/TermsConditions';
import { ERROR, LOADING, partialProfileUrl } from '../../Providers';
import { getCurrentAddress } from '../../Services/LocationServices';
import { BookingContext } from '../../Providers/BookingProvider';
const Drawer = createDrawerNavigator();


const CustomerDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContentOptions={{
        contentContainerStyle: { paddingTop: 0 },
        inactiveTintColor: 'white',
        activeTintColor: 'white',
        labelStyle: styles.drawerLable,
        itemStyle: styles.drawerItem,
      }}
      drawerContent={CustomDrawerContent}
      initialRouteName="DASHBOARD"
      drawerStyle={{ backgroundColor: '#182245' }}>
      <Drawer.Screen
        name="DASHBOARD"
        component={HomeScreen}
        options={{ drawerIcon: ({ color }) => <Icon color={color} iconSource={require('../../../Assets/home.png')} /> }}
      />
      <Drawer.Screen
        name="Edit Profile"
        component={EditProfile}
        options={{ drawerIcon: ({ color }) => <Icon color={color} iconSource={require('../../../Assets/pencil.png')} /> }}
      />
      <Drawer.Screen
        name="Book Washer Now"
        component={OnDemand}
        options={{ drawerIcon: ({ color }) => <Icon color={color} iconSource={require('../../../Assets/car-steering-wheel.png')} /> }}
      />
      <Drawer.Screen
        name="Booking History"
        component={BookingHistory}
        options={{ drawerIcon: ({ color }) => <Icon color={color} iconSource={require('../../../Assets/document.png')} /> }}
      />
      <Drawer.Screen
        name="Payments"
        component={Payments}
        options={{ drawerIcon: ({ color }) => <Icon color={color} iconSource={require('../../../Assets/dollar-symbol.png')} /> }}
      />
      <Drawer.Screen
        name="Promotions"
        component={Promotions}
        options={{ drawerIcon: ({ color }) => <Icon color={color} iconSource={require('../../../Assets/coupon.png')} /> }}
      />
      <Drawer.Screen
        name="Change Password"
        component={DriverChangePassword}
        options={{ drawerIcon: ({ color }) => <Icon color={color} iconSource={require('../../../Assets/padlock.png')} /> }}
      />
      <Drawer.Screen
        name="Help"
        component={HelpScreen}
        options={{ drawerIcon: ({ color }) => <Icon color={color} iconSource={require('../../../Assets/help.png')} /> }}
      />
      <Drawer.Screen
        name="Terms and conditions"
        component={TermsConditions}
        options={{ drawerIcon: ({ color }) => <Icon color={color} iconSource={require('../../../Assets/help.png')} /> }}
      />
    </Drawer.Navigator>
  );
};

const Icon = ({ color, size, focused, iconSource }) => <Image style={{ height: 28, width: 28, tintColor: color }} source={iconSource} />;

export default CustomerDrawer;

const CustomDrawerContent = props => {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerProfile />
      <DrawerItemList {...props} />
      <Logout />
    </DrawerContentScrollView>
  );
};

const Logout = () => {
  const { logout } = useContext(AuthContext);
  return (
    <DrawerItem
      label="LOG OUT"
      labelStyle={[styles.drawerLable, { color: 'white' }]}
      style={styles.drawerItem}
      icon={() => <Icon color={'white'} iconSource={require('../../../Assets/logout.png')} />}
      onPress={logout}
    />
  );
};

const DrawerProfile = () => {
  const { userData } = useContext(AuthContext)
  const { getRewards } = useContext(BookingContext)
  const [currentLocation, setCurrentLocation] = useState('Loading...')
  const [rewards, setRewards] = useState(LOADING)

  useEffect(() => {
    getRewards(setRewards)
    getCurrentAddress().then(setCurrentLocation)
  }, [])

  const washes = ()=>{
    switch (rewards) {
      case LOADING: return 'Loading...'
      case ERROR: return 'Error'
      default:return rewards+' Washes'
    }
  }

  return (
    <View style={{ width: '100%', marginTop: 0, padding: 16, alignItems: 'center' }}>
      <View style={{ marginTop: 10, width: 90, height: 90, borderColor: '#fff', borderRadius: 10, borderWidth: 3, alignItems: 'center', alignSelf: 'center' }}>
        <Image style={{ width: 85, height: 85, alignItems: 'center', alignSelf: 'center', resizeMode: 'cover', borderRadius: 10 }} source={{ uri: userData?.image ? partialProfileUrl + userData.image : 'https://cdn2.vectorstock.com/i/1000x1000/34/76/default-placeholder-fitness-trainer-in-a-t-shirt-vector-20773476.jpg' }} />
      </View>
      <View style={{ alignItems: 'center' }}>
        <Text style={{ color: Colors.blue_color, fontSize: 18, paddingBottom: 6, marginTop: 10, fontWeight: 'bold' }}>{userData.name}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
          <Image style={{ width: 15, height: 15, alignItems: 'center', alignSelf: 'center', resizeMode: 'stretch', tintColor: '#F5BA05' }} source={require('../../../Assets/location.png')} />
          <Text numberOfLines={1} style={{ color: '#fff', textAlign: 'center', fontSize: 16 }}>{currentLocation}</Text>

        </View>
        <View style={{ width: 130, height: 35, backgroundColor: '#F5BA05', borderRadius: 20, marginTop: 10, justifyContent: 'center' }}>
          <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>{washes()}</Text>
        </View>
      </View>
    </View>
  )

};

const styles = StyleSheet.create({
  drawerItem: {
    borderTopColor: '#ffffff40',
    borderTopWidth: 1,
    marginVertical: 0,
    marginHorizontal: 0,
    borderRadius: 0,
  },

  drawerLable: {
    fontSize: 16,
  },
});
