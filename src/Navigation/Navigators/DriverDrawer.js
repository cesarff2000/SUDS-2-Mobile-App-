import React, { useContext } from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ScheduleList from '../../DriverScreen/ScheduleList';
import BookingHistory from '../../DriverScreen/BookingHistory';
import WelcomeScreen, { nav } from '../../DriverScreen/Welcome';
import Earning from '../../DriverScreen/Earning';
import ReviewRating from '../../DriverScreen/ReviewRating';
import DriverChangePassword from '../../DriverScreen/DriverChangePaasword';
import DriverHelp from '../../DriverScreen/DriverHelp';
import BankInfo from '../../DriverScreen/BankInfo';
import UpdateDocument from '../../DriverScreen/UpdateDocument';
import { navigate } from '../NavigationService';
import { AuthContext } from '../../Providers/AuthProvider';
import EditDtails from '../../DriverScreen/EditDetails';
import JobFinished from '../../DriverScreen/JobFinished';
import TermsConditions from '../../CommonScreen/TermsConditions';
import { Avatar } from 'react-native-elements';
import Colors from '../../../Constants/Colors';
import { partialProfileUrl } from '../../Providers';
import TripSwitch from '../../Components/TirpSwitch';
const Drawer = createDrawerNavigator();

const DriverDrawer = () => {
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
      initialRouteName="WELCOME"
      drawerStyle={{ backgroundColor: '#469' }}>
      <Drawer.Screen
        name="WELCOME"
        component={WelcomeScreen}
        options={{ drawerIcon: ({ color }) => <Icon color={color} iconSource={require('../../../Assets/home.png')} /> 
       }}
      />
      <Drawer.Screen
        name="SCHEDULE JOBS"
        component={ScheduleList}
        options={{ drawerIcon: ({ color }) => <Icon color={color} iconSource={require('../../../Assets/list.png')} /> }}
      />
      <Drawer.Screen
        name="BOOKING HISTORY"
        component={BookingHistory}
        options={{ drawerIcon: ({ color }) => <Icon color={color} iconSource={require('../../../Assets/list.png')} /> }}
      />
      <Drawer.Screen
        name="EARNING"
        component={Earning}
        options={{ drawerIcon: ({ color }) => <Icon color={color} iconSource={require('../../../Assets/money.png')} /> }}
      />
      <Drawer.Screen
        name="REVIEW & RATING"
        component={ReviewRating}
        options={{ drawerIcon: ({ color }) => <Icon color={color} iconSource={require('../../../Assets/review.png')} /> }}
      />
      
      <Drawer.Screen
        name="EDIT PKG DETAILS"

        component={EditDtails}
        options={{ drawerIcon: ({ color }) => <Icon color={color} iconSource={require('../../../Assets/document.png')} /> }}
      />
      <Drawer.Screen
        name="UPDATE DOCUMENT"
        component={UpdateDocument}
        options={{ drawerIcon: ({ color }) => <Icon color={color} iconSource={require('../../../Assets/uploaddocument.png')} /> }}
      />
      <Drawer.Screen
        name="CHANGE PASSWORD"
        component={DriverChangePassword}
        options={{ drawerIcon: ({ color }) => <Icon color={color} iconSource={require('../../../Assets/padlock.png')} /> }}
      />
      <Drawer.Screen
        name="HELP"
        component={DriverHelp}
        options={{ drawerIcon: ({ color }) => <Icon color={color} iconSource={require('../../../Assets/help.png')} /> }}
      />
      {/* <Drawer.Screen
        name="Job Finished"
        component={JobFinished}
        options={{drawerIcon: ({color}) => <Icon color={color} iconSource={require('../../../Assets/help.png')} />}}
      /> */}
    </Drawer.Navigator>
  );
};

const Icon = ({ color, size, focused, iconSource }) => <Image style={{ height: 28, width: 28, tintColor: color }} source={iconSource} />;

export default DriverDrawer;

const CustomDrawerContent = props => {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerProfile />
      <DrawerItemList {...props} />
      <Logout />
    </DrawerContentScrollView>
  );
};
const partialImageUrl = "http://suds-2-u.com/sudsadmin/public/profile/"

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
  const { userData } = useContext(AuthContext);
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        navigate('EDIT PROFILE');
        nav.current.toggleDrawer();
      }}>
      <View style={{ width: '100%', backgroundColor: 'orange', marginTop: 0, flexDirection: 'row', padding: 16, alignItems: 'center' }}>
        <Avatar
          size="large"
          rounded
          title={userData?.name ? userData.name.split(' ').slice(0, 2).map(n=>n[0].toUpperCase()).join('') : null}
          source={userData?.image ? { uri: partialProfileUrl + userData.image } : null}
          containerStyle={{ marginRight: 16, backgroundColor: Colors.blue_color }}
          activeOpacity={0.7}
        />
        <View>
          <Text style={{ color: 'white', fontSize: 18, paddingBottom: 6 }}>{userData.name}</Text>
          <Text style={{ fontWeight: 'bold' }}>Edit profile</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
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
