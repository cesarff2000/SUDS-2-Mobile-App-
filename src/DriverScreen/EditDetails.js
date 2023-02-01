import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet, SafeAreaView} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Colors from '../../Constants/Colors';
import { navigate } from '../Navigation/NavigationService';

const EditDtails = () => {
  return (
    <View style={{flex: 1, padding: 8}}>
      <SafeAreaView />
      <ScrollView>
        <Card packageType="Bronze" />
        <Card packageType="Silver" />
        <Card packageType="Gold" />
        <Card packageType="Diamond" />
        <Card packageType="Platinuim" />
      </ScrollView>
      <TouchableOpacity activeOpacity={0.8} style={{backgroundColor:Colors.blue_color, position:'absolute', padding:20, left:0, right:0, bottom:0, alignItems:'center'}}>
          <Text style={{fontSize:18, color:'white', fontWeight:'bold'}} >Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditDtails;

const Card = ({packageType}) => {
  return (
    <View style={styles.card}>
      <Text style={{fontWeight: 'bold', fontSize: 20}}>{packageType} Package</Text>
      <TouchableOpacity onPress={()=>navigate('PACKAGE DETAILS', {packageType})}>
        <Text style={{color: Colors.blue_color}}>Edit details</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    alignItems: 'center',
    shadowColor: '#999',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 3.5,
    borderRadius: 10,
    elevation: 5,
    margin: 8,
    flexDirection: 'row',
    padding: 18,
    justifyContent: 'space-between',
  },
});
