import React from 'react';
import { Text, View, Image, ImageBackground } from 'react-native';
import Colors from '../../Constants/Colors';

class DriverHelp extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <ImageBackground style={{ width: '100%', height: '100%', flex: 1 }} source={require('../../Assets/bg_img.png')}>
          <Image style={{ width: '100%', marginTop: 15, height: 70, resizeMode: 'contain' }} source={require('../../Assets/logo2.png')}></Image>
          <Image style={{ width: '100%', height: 140, resizeMode: 'contain', marginTop: 70 }} source={require('../../Assets/logo_icon.png')}></Image>
          <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <Text style={{ color: Colors.blue_color, fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>CONNECTS WITH US</Text>

            <Text style={{ color: Colors.text_white, fontSize: 17, fontWeight: 'bold', textAlign: 'center', marginTop: 10 }}>support@suds-2-u.com</Text>
            <Text style={{ color: Colors.text_white, fontSize: 17, fontWeight: 'bold', textAlign: 'center', marginTop: 10 }}>512-586-8786</Text>
          </View>
          <View style={{ justifyContent: 'flex-end', marginBottom: 20 }}>
            <Text style={{ color: Colors.text_white, fontSize: 15, fontWeight: '500', textAlign: 'center', marginTop: 10 }}>@ 2021 SUDS-2-U. All rights reserved</Text>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

export default DriverHelp

// const styles = StyleSheet.create({
//   icon: {
//     width: 24,
//     height: 24,
//   },
// });
