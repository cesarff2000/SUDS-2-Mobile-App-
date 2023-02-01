import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNetInfo } from '@react-native-community/netinfo';
import React, { useContext, useEffect, useState } from 'react';
import { FlatList, useWindowDimensions } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { Alert } from 'react-native';
import { StyleSheet, SafeAreaView, Text, View, Image, StatusBar, TouchableOpacity, TextInput, Button } from 'react-native';

import Colors from '../../Constants/Colors';
import ListEmpty from '../Components/ListEmpty';
import { ERROR, LOADING } from '../Providers';
import { AuthContext } from '../Providers/AuthProvider';
import { BookingContext } from '../Providers/BookingProvider';

export default Promotions = () => {

  const [promotions, setPromotions] = useState(LOADING)
  const netInfo = useNetInfo()
  const windowsDimensions = useWindowDimensions()

  const { getPromotions } = useContext(AuthContext)
  const { getRewards } = useContext(BookingContext)

  const [pendingCoupon, setPendingCoupon] = useState()

  const [rewards, setRewards] = useState(LOADING)

  useEffect(() => {
    getRewards(setRewards)
    getPromotions(setPromotions)
    AsyncStorage.getItem('pending_coupon').then(result => setPendingCoupon(JSON.parse(result)))
  }, [])

  const onApply = async (item) => {
    console.log(pendingCoupon)
    if (pendingCoupon) return Alert.alert("Apply coupon", "You already have a pending coupon on your next wash. You can't have morethan one.")
    Alert.alert('Apply coupon', 'This coupon will be applied on your next wash.', [{ text: 'Ok', onPress: async () => { await AsyncStorage.setItem('pending_coupon', JSON.stringify(item)); setPendingCoupon(item) } }, { text: 'Cancel' }])
  }

  const Item = ({ item }) => (
    <View style={{
      backgroundColor: '#fff', alignItems: 'center', marginHorizontal: 5, height: 60, padding: 5, justifyContent: 'center', marginTop: 10, marginBottom: 10, elevation: 5,
      borderRadius: 10, shadowOpacity: 0.3, shadowColor: '#000', shadowOffset: { width: 1, height: 1 },
    }}>
      <TouchableOpacity onPress={() => pendingCoupon?.id == item.id ? null : onApply(item)} style={{ flexDirection: 'row', justifyContent: 'space-between', width: '90%', }}>
        <Text style={{ fontSize: 17, fontWeight: 'bold' }}>{item.name}</Text>
        <Text style={{ color: pendingCoupon?.id == item.id ? 'orange' : Colors.blue_color }}>{pendingCoupon?.id == item.id ? 'Pending' : 'Apply'}</Text>
      </TouchableOpacity>
    </View>
  )

  const List = () => {
    switch (promotions) {
      case LOADING: return <ActivityIndicator style={{ padding: 50 }} color={Colors.blue_color} size="large" />
      case ERROR: return <ListEmpty opacity={0.5} color={Colors.blue_color} netInfo={netInfo} emptyMsg="No promotions at this time." />

      default: return (
        <FlatList
          ListHeaderComponent={() => <View style={{ height: 5 }} />}
          ListFooterComponent={() => <View style={{ height: 200 }} />}
          keyExtractor={item => item.id}
          data={promotions}
          style={{ width: '100%' }}
          renderItem={({ item }) => <Item item={item} />}
        />

      )
    }
  }

  const Rewards = () => {
    switch (rewards) {
      case LOADING: return <ActivityIndicator style={{ padding: 50 }} color={Colors.blue_color} size="large" />
      case ERROR: return (
        <>
          <View style={{ flexDirection: 'row', padding: 8 }}>
            {[...Array(0)].map((v, i) => <Image key={i} style={{ width: 25, height: 25, tintColor: Colors.blue_color, marginRight: 5, marginBottom: 8 }} source={require('../../Assets/star.png')} />)}

          </View>
          <Text style={{ fontSize: 22, color: '#aaa', textAlign: 'center' }}>You are ten wash away from your free car wash.</Text>
        </>

      )
      default: return (
        <>
          <View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', padding: 8 }}>
              {[...Array(rewards)].map((v, i) => <Image key={i} style={{ width: 25, height: 25, tintColor: Colors.blue_color, marginRight: 5, marginBottom: 8 }} source={require('../../Assets/star.png')} />)}

            </View>
            <Text style={{ fontSize: 22, color: '#aaa', textAlign: 'center' }}>{10 - rewards <= 3 ? 'Congrats! ' : ''}You are {10 - rewards} {10 - rewards == 1 ? 'wash' : 'washes'} away from your free car wash.Congratulations you have a free wash! Please check your email</Text>
          </View>
        </>

      )
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      <View style={{ flex: 1 }}>


        <StatusBar translucent backgroundColor='transparent' barStyle='light-content' />
        <View style={{ margin: 15 }}>
          <View style={{
            backgroundColor: '#fff', padding: 18, elevation: 5,
            borderRadius: 10, shadowOpacity: 0.3, shadowColor: '#000', shadowOffset: { width: 1, height: 1 },
          }}>
            <Rewards />
          </View>

          <Text style={{ color: '#aaa', fontSize: 20, marginBottom: 15, marginTop: 20, marginVertical: 15, textAlign: 'center', width: '100%' }}>Promo codes cannot be used together</Text>

          <View style={{ width: windowsDimensions.width, height: 1, backgroundColor: '#999', opacity: .5, zIndex: 20 }} />
          <List />

        </View>
      </View>
    </SafeAreaView>
  );
}

