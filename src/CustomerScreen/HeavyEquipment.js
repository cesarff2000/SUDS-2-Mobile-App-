import React, { useState } from 'react';
import { StyleSheet, Text, View, StatusBar, SafeAreaView, TouchableOpacity } from 'react-native';
import Colors from '../../Constants/Colors';
import RNPickerSelect from 'react-native-picker-select';
import { Alert } from 'react-native';
const RvBusMH = ({ navigation }) => {

  const [hours, setHours] = useState()

  const onNext = ()=>{
    if(!hours) return Alert.alert('Alert', 'Please select time in hour.')
    navigation.navigate('Heavy Equipments', {hours : parseFloat(hours)+1})
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar translucent backgroundColor='transparent' barStyle='dark-content' />
      <SafeAreaView />
      <View style={{ width: '100%', padding: 21 }}>

        <Text style={{ fontSize: 21, fontWeight: 'bold' }}>Heavy Equipments</Text>
        <Text style={{ marginTop: 10 }}>Heavy equipment is priced by the hour of use. Estimate the time needed.{'\n'}<Text style={{fontWeight : 'bold'}}>NOTE:</Text> This will be amended if additional time is needed.</Text>
        <Text style={{ fontSize: 18, marginTop: 15 }}>Flat hourly rate : $119</Text>

        <View style={{ width: '98%', padding: 13, marginTop: 25, height: 50, flexDirection: 'row', justifyContent: 'space-between', borderRadius: 25, borderWidth: 1 }}>
          <RNPickerSelect
            placeholder={{ label: 'Choose time in hour...', value: null, color: '#9EA0A4' }}
            style={{ viewContainer: { width: '100%', alignSelf: 'center', }, inputAndroid: { color: 'black' }, inputIOS: { color: 'black' }, modalViewBottom: { height: 200 } }}
            onValueChange={setHours}
            items={[...Array(23).keys()].map((v, i, arr) => { return { label:`${i+1} Hour${(i==0?'':'s')}`,value: i +'', key:i } })}
          />
        </View>
      </View>
      <View style={{ justifyContent: 'flex-end', flex: 1, alignItems: 'center', marginTop: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity
            elevation={5}
            onPress={onNext}
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
  }
})