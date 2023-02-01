import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FlatList } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { Image } from 'react-native';
import { Text } from 'react-native';
import { View, ImageBackground, StyleSheet, Alert, ScrollView } from 'react-native';
import Colors from '../../Constants/Colors';
import ControllerInput from '../Components/ControllerInput';
import CtaButton from '../Components/CtaButton';
import CustomPicker from '../Components/CustomPicker';
import ListEmpty from '../Components/ListEmpty';
import LoadingView from '../Components/LoadingView';
import { EMPTY, ERROR, LOADING } from '../Providers';
import { AuthContext } from '../Providers/AuthProvider';

const AddCard = () => {

  const [state, setState] = useState(LOADING)

  const { getCardDetails } = useContext(AuthContext)

  useEffect(() => getCardDetails(setState), [])

  switch (state) {
    case ERROR:
      return <ListEmpty emptyMsg="Something went wrong." retry={() => getCardDetails(setState)} />
    case LOADING:
      return <ActivityIndicator color={Colors.background_color} size="large" style={{ justifyContent: 'flex-start', padding: 50 }} />
    case EMPTY:
      return <ListEmpty emptyMsg="You have not added any cards yet." retry={() => getCardDetails(setState)} />
    default:
      return (
        <FlatList contentContainerStyle={{flexGrow : 1}} data={state} renderItem={Card} keyExtractor={(item, index) => index} />
      )
  }
};

export default AddCard;

const Card = ({ item }) => (
  <View style={{ borderRadius: 20, margin: 20, marginBottom: 0, padding: 20, backgroundColor: Colors.blue_color, elevation: 15, shadowColor: '#000', overflow: 'hidden' }}>
    <View style={{ backgroundColor: 'black', position: 'absolute', top: 0, right: 0, height: 60, width: 100, borderBottomLeftRadius: 30, opacity: .15 }} />
    <View style={{ backgroundColor: '#00000010', position: 'absolute', bottom: 0, right: 0, left: 0, height: 80, opacity: 1, borderTopWidth: 1, borderTopColor: '#ffffff50' }} />
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>**** **** **** {item.last4}</Text>
      <Image resizeMode="contain" style={{ height: 20, width: 50 }} source={{ uri: 'https://pngpress.com/wp-content/uploads/2020/03/Visa-Logo-PNG-Image.png' }} />
    </View>

    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <View style={{ paddingTop: 65 }}>
        <Text style={{ color: 'white', fontSize: 16, opacity: .7 }}>EXPIRY MONTH</Text>
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>{item.expiryMonth}</Text>
      </View>
      <View style={{ paddingTop: 65 }}>
        <Text style={{ color: 'white', fontSize: 16, opacity: .7 }}>EXPIRY YEAR</Text>
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>{item.expiryYear}</Text>
      </View>
      <View style={{ paddingTop: 65 }}>
        <Text style={{ color: 'white', fontSize: 16, opacity: .7 }}>POSTAL CODE</Text>
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>{item.postalCode}</Text>
      </View>
    </View>

  </View>
)