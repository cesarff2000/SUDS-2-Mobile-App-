import React, { useState } from 'react';
import { StyleSheet, Text, View, StatusBar, SafeAreaView, TouchableOpacity } from 'react-native';
import Colors from '../../Constants/Colors';
import RNPickerSelect from 'react-native-picker-select';
const RvBusMH = ({ navigation }) => {

  const [length, setLength] = useState()

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <SafeAreaView />
      <View style={{ width: '100%', padding: 21 }}>

        <Text style={{ fontSize: 21, fontWeight: 'bold' }}>RV's, Bus, M.V.</Text>
        <Text style={{ marginTop: 10 }}>Pricing for all RV's, Buses, Mottorhomes are price at $6.00 per foot and are calculated below</Text>
        <Text style={{ fontSize: 18, marginTop: 15 }}>How many feet is your RV?</Text>

        <View style={{ width: '98%', padding: 13, marginTop: 25, height: 50, flexDirection: 'row', justifyContent: 'space-between', borderRadius: 25, borderWidth: 1 }}>
          <RNPickerSelect
            placeholder={{ label: 'Choose length in feet...', value: null, color: '#9EA0A4' }}
            style={{ viewContainer: { width: '100%', alignSelf: 'center', }, inputAndroid: { color: 'black' }, inputIOS: { color: 'black' }, modalViewBottom: { height: 200 } }}
            onValueChange={setLength}
            items={[...Array(13).keys()].map((v, i, arr) => { return { label: ((i + 3) * 5) + ' Feet', value: i + '' } })}
          />
        </View>
      </View>
      <View style={{ justifyContent: 'flex-end', flex: 1, alignItems: 'center', marginTop: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity
            elevation={5}
            onPress={() => { navigation.navigate('Rv, Bus and Motor Home', {length :((parseFloat(length) + 3) * 5)}); }}
            style={styles.auth_btn}
            underlayColor='gray'
            activeOpacity={0.8} >
            <Text style={{ fontSize: 16, textAlign: 'center', color: Colors.buton_label, fontWeight: 'bold' }}>Continue</Text>
          </TouchableOpacity>

          <TouchableOpacity
            elevation={5}
            onPress={() => { }}
            style={styles.auth_btn}
            underlayColor='gray'
            activeOpacity={0.8}>
            <Text style={{ fontSize: 16, textAlign: 'center', color: Colors.buton_label, fontWeight: 'bold' }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

}

export default RvBusMH

const styles = StyleSheet.create({
  auth_btn: {
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: Colors.buttom_color,
    width: '50%',
    height: 65,
    justifyContent: 'center',
  },
})