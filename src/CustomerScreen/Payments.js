import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, Image, StatusBar, SafeAreaView, TouchableOpacity, TextInput, Button, ImageBackground, useWindowDimensions, TabBarIOSItem } from 'react-native';

import { Header, Icon, Avatar } from 'react-native-elements';
import Colors from '../../Constants/Colors';
import { navigate } from '../Navigation/NavigationService';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import { Modal } from 'react-native';
import { AuthContext } from '../Providers/AuthProvider';


const Payments = ({ navigation }) => {
  const [showCardVisible, setShowCardVisiblity] = useState(false)
  const [cardDetails, setCardDetails] = useState()
  const { addCard } = useContext(AuthContext)

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor={Colors.blue_color} barStyle="light-content" />
      <ImageBackground style={{ flex: 1 }} source={require('../../Assets/bg_img.png')}>

        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            elevation={5}
            onPress={() => navigate('PAYPAL')}
            style={styles.auth_btn}
            underlayColor="gray"
            activeOpacity={0.8}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flexDirection: 'row' }}>
                <Image style={{ width: 25, height: 25, tintColor: Colors.blue_color, marginHorizontal: 10 }} source={require('../../Assets/icon/paypal-logo.png')} />
                <Text style={{ fontSize: 15, color: '#000', fontWeight: 'bold', marginTop: 5 }}>PayPal</Text>
              </View>
              <View style={{ alignItems: 'flex-end', flex: 1 }}>
                <Image style={{ width: 19, height: 19, tintColor: '#aaa', marginHorizontal: 10, marginTop: 3 }} source={require('../../Assets/icon/right_back.png')} />
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            elevation={5}
            onPress={() => navigation.navigate('Creddit/Debit Card')}
            style={styles.auth_btn}
            underlayColor="gray"
            activeOpacity={0.8}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flexDirection: 'row' }}>
                <Image style={{ width: 25, height: 25, tintColor: Colors.blue_color, marginHorizontal: 10 }} source={require('../../Assets/icon/credit-card.png')} />
                <Text style={{ fontSize: 15, color: '#000', fontWeight: 'bold', marginTop: 5 }}>Credit/Debit Card</Text>
              </View>
              <View style={{ alignItems: 'flex-end', flex: 1 }}>
                <Image style={{ width: 19, height: 19, tintColor: '#aaa', marginHorizontal: 10, marginTop: 3 }} source={require('../../Assets/icon/right_back.png')} />
              </View>
            </View>
          </TouchableOpacity>
        </View>


        <TouchableOpacity
          elevation={5}
          onPress={() => setShowCardVisiblity(true)}
          style={styles.add_auth_btn}
          underlayColor="gray"
          activeOpacity={0.8}>
          <Text style={{ fontSize: 15, textAlign: 'center', color: '#fff', fontWeight: 'bold' }}>Add New Credit/Debit Card </Text>
        </TouchableOpacity>

        <Modal
          visible={showCardVisible}
          transparent={true}
          hardwareAccelerated
          statusBarTranslucent
          animationType="fade">
          <TouchableOpacity onPress={() => setShowCardVisiblity(false)} activeOpacity={1} style={{ flex: 1, backgroundColor: "#00000080", alignItems: 'center', justifyContent: 'center' }} >
            <TouchableOpacity activeOpacity={1} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', borderRadius: 15, position: 'absolute', left: 20, right: 20, zIndex: 20 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18, textAlign: 'center', margin: 20 }}>Add Card Info</Text>
              <CardField

                postalCodeEnabled={true}
                placeholder={{
                  number: '4242 4242 4242 4242',
                }}
                cardStyle={{
                  backgroundColor: '#00000010',
                  textColor: '#000000',
                }}
                style={{
                  margin: 0,
                  backgroundColor: '#00000010',
                  width: '100%',
                  height: 50,
                  marginTop: 0,

                }}
                onCardChange={setCardDetails}
                onFocus={(focusedField) => {
                  console.log('focusField', focusedField);
                }}
              />
              <TouchableOpacity onPress={() => addCard(cardDetails, () => setShowCardVisiblity(false))} style={{ backgroundColor: Colors.blue_color, padding: 16, justifyContent: 'center', alignItems: 'center', margin: 10, borderRadius: 10, width: useWindowDimensions().width - 60 }}>
                <Text style={{ fontWeight: 'bold', color: 'white', }}>
                  Done
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>


      </ImageBackground>
    </SafeAreaView>
  );
};

export default Payments

const styles = StyleSheet.create({
  auth_textInput: {
    alignSelf: 'center',
    width: '93%',
    // borderWidth: 1,
    borderBottomWidth: 1,
    height: 40,
    color: Colors.text_color,
    marginTop: 10,
  },
  auth_btn: {
    marginTop: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: Colors.text_white,
    borderRadius: 5,
    width: '90%',
    height: 50,
    justifyContent: 'center',
  },
  add_auth_btn: {
    marginTop: 'auto',
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: Colors.blue_color,
    borderRadius: 5,
    width: '100%',
    height: 70,
    justifyContent: 'center',
  },
});
