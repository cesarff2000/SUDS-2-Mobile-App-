import React, {useContext, useEffect} from 'react';
import {Platform, StyleSheet, StatusBar, Text, View, Alert, ImageBackground, Image, ActivityIndicator} from 'react-native';
import {AuthContext} from '../Providers/AuthProvider';
import { BookingContext } from '../Providers/BookingProvider';

const Splash = ({navigation}) => {
  const {getAuthStatus} = useContext(AuthContext);
  const {syncCurrentRunningBooking} = useContext(BookingContext)
  useEffect(() =>  getAuthStatus(syncCurrentRunningBooking), []);
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ImageBackground style={{width: '100%', height: '100%', flex: 1}} source={require('../../Assets/bg_img.png')}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Image style={{width: '100%', height: 95, resizeMode: 'contain', marginTop: 30}} source={require('../../Assets/logo_icon.png')}></Image>
          <Image style={{width: '100%', height: 65, resizeMode: 'contain', marginTop: 5}} source={require('../../Assets/logo2.png')}></Image>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  headerStyle: {
    width: 150,
    height: 150,
  },
});
