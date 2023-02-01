
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image, StatusBar,SafeAreaView, TouchableOpacity, TextInput,Button,FlatList ,ImageBackground} from 'react-native';

import { Header, Icon, Avatar } from 'react-native-elements';
import Colors from '../../Constants/Colors';
import CheckBox from 'react-native-check-box'
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { CheckBox } from 'react-native-elements'
const BookWasherNow = () => {
  return(
    <Text>BROROBRO</Text>
  )
  }

  export default BookWasherNow
  
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
       
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: Colors.buttom_color,
    
        width: '50%',
        height: 65,
        justifyContent: 'center',
    },
    add_btn: {
      
      backgroundColor:'#e28c39',
  alignItems:'center',
      width: '45%',
      height: 40,
      justifyContent: 'center',borderRadius:20
  },
})