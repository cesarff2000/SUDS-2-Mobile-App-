import React from 'react';
import { Text, View, Image, SafeAreaView, ImageBackground } from 'react-native';
import CtaButton from '../Components/CtaButton';
import { CUSTOMER, type } from '../Navigation/NavigationService';
console.log('user type', global.usertype)
const ChooseScreen = ({ navigation }) => (

  <View style={{ flex: 1, flexDirection: 'column' }}>
    <View style={{ flex: 1 }}>
      <ImageBackground style={{ width: '100%', height: '100%', flex: 1 }} source={require('../../Assets/bg_img.png')}>
        <SafeAreaView />
        <View style={{ flex: 1, padding: 21 }}>
          <Image style={{ width: '100%', height: 95, resizeMode: 'contain', marginTop: 30 }} source={require('../../Assets/logo_icon.png')}></Image>
          <Image style={{ width: '100%', height: 65, resizeMode: 'contain', marginTop: 5 }} source={require('../../Assets/logo2.png')}></Image>
        </View>
        <View style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
          <Text style={{ color: '#fff', textAlign: 'center', marginBottom: 5, fontSize: 18, fontWeight: 'normal' }}>Hello Welcome to SUDS-2-U</Text>
          <Text style={{ color: '#fff', textAlign: 'center', marginBottom: 5, fontSize: 18, fontWeight: 'bold' }}>Get Started Now</Text>
          <View style={{ alignItems: 'center', width: '100%', marginBottom: 5, marginTop: 5, padding: 5 }}>
            <CtaButton primary title="Login" onPress={() => { (type.current == CUSTOMER) ? navigation.navigate('LOGIN') : (type.current == 2) ? navigation.navigate('LOGIN') : null }} />
            <CtaButton title="Create an Account" onPress={() => { (type.current == CUSTOMER) ? navigation.navigate('REGISTER') : navigation.navigate('REGISTER') }} />
          </View>
        </View>
        <SafeAreaView />
      </ImageBackground>
    </View>
  </View>
);
export default ChooseScreen;