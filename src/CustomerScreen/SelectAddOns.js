import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, Detail, View, Image, Modal, Pressable, StatusBar, SafeAreaView, TouchableOpacity, TextInput, Button, FlatList, ImageBackground, Alert } from 'react-native';

import Colors from '../../Constants/Colors';
import CheckBox from 'react-native-check-box'
import { BookingContext, calculateTotalPrice } from '../Providers/BookingProvider';
import LoadingView from '../Components/LoadingView';
import { changeStack } from '../Navigation/NavigationService';
import { bookingType, ON_DEMAND, SCHEDULED } from '../Navigation/NavigationService';
import AsyncStorage from '@react-native-async-storage/async-storage';


const SelectAddOns = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [addOns, setAddOns] = useState([])
  const [fetching, setFetching] = useState(true)
  const [selectedAddOns, setSelectedAddOns] = useState([])
  const { getAddOns, setCurrentBooking, currentBooking, getExtraTimeFee, getServiceFee } = useContext(BookingContext)
  const [serviceFee, setServiceFee] = useState([]);
  const [extraTimeFee, setExtraTimeFee] = useState('Loading...')
  const [discountRate, setDiscountRate] = useState('Loading...')
  const [localbooking, setLocalbooking] = useState([])
  const Divider = () => <View style={{ width: '100%', height: 0.5, backgroundColor: '#aaa', marginVertical: 7 }} />
  useEffect(() => {

    getAddOnList();
    return () => setCurrentBooking(cv => ({ ...cv, extra_add_ons: undefined, selectedAddOns: undefined }))
  }, [])

  useEffect(() => {

    setCurrentBooking(cv => ({ ...cv, total: calculateTotalPrice(currentBooking, [extraTimeFee, serviceFee]) }))

    AsyncStorage.getItem('multipledatastoreschedule').then(result => {
      let storedata = JSON.parse(result) || []
      setLocalbooking(storedata);
      console.log('res3...', storedata)
    })
    //AsyncStorage.removeItem('multipledatastore')
  }, [])

  useEffect(() => {

    setCurrentBooking(cv => ({ ...cv, total: calculateTotalPrice(currentBooking, [extraTimeFee, serviceFee], discountRate) }))
    getExtraTimeFee(setExtraTimeFee)
    getServiceFee(setServiceFee)

  }, []);

  const storebookingdata = async (type) => {

    getExtraTimeFee(setExtraTimeFee)
    getServiceFee(setServiceFee)
    setCurrentBooking(cv => ({ ...cv, total: calculateTotalPrice(currentBooking, [extraTimeFee, serviceFee], discountRate) }))
    console.log("a2..", extraTimeFee)
    AsyncStorage.getItem('currenctAction').then((result) => {
      console.log('result..', result)
      if (JSON.parse(result) == "ON_DEMAND") {
        // AsyncStorage.removeItem('multipledatastore') 
        AsyncStorage.getItem('multipledatastore').then(result2 => {
          let storedata = JSON.parse(result2);
          console.log('multipledatastore...', storedata)
          if (!storedata || storedata == null) {
            console.log('if')
            AsyncStorage.setItem('multipledatastore', JSON.stringify([{
              serviceFee,
              extraTimeFee,
              selectedAddOns,
              name: currentBooking.packageDetails.name,
              vehiclename: currentBooking.vehicle,
              price: currentBooking.packageDetails.price

            }]))
          }
          else {
            if (storedata.length < 3) {

              let obj = {
                serviceFee,
                extraTimeFee,
                selectedAddOns,
                name: currentBooking.packageDetails.name,
                vehiclename: currentBooking.vehicle,
                price: currentBooking.packageDetails.price
              }
              storedata.push(obj);
              AsyncStorage.setItem('multipledatastore', JSON.stringify(storedata))
              console.log("ondemandmultipledatastore2new", storedata)
            }
            else if (type == 'yes') {
              Alert.alert("You can add only 3 vehicles")
            }

          }
          if (type == "yes" && (!storedata || storedata?.length < 3)) {
            navigation.navigate('Select Vehicle Type');
          }
          if (type == 'no') {
            navigation.navigate('Booking Review');
            setModalVisible(!modalVisible)
          }
        })
      }
      else {
        AsyncStorage.getItem('multipledatastoreschedule').then(result1 => {
          let storedata = JSON.parse(result1);
          console.log('multipledatastoreschedule...', storedata)
          if (!storedata || storedata == null) {
            console.log('if')
            AsyncStorage.setItem('multipledatastoreschedule', JSON.stringify([{
              serviceFee,
              extraTimeFee,
              selectedAddOns,
              name: currentBooking.packageDetails.name,
              vehiclename: currentBooking.vehicle,
              price: currentBooking.packageDetails.price
            }]))
          }
          else {
            if (storedata.length < 3) {

              let obj = {
                serviceFee,
                extraTimeFee,
                selectedAddOns,
                name: currentBooking.packageDetails.name,
                vehiclename: currentBooking.vehicle,
                price: currentBooking.packageDetails.price

              };

              storedata.push(obj);
              console.log('asdasd...', storedata)
              AsyncStorage.setItem('multipledatastoreschedule', JSON.stringify(storedata))
              console.log('storedatalength...', storedata)
            }
            else if (type == 'yes') {
              Alert.alert("You have added only 3 vehicle")
            }
          }
          if (type == "yes" && (!storedata || storedata?.length < 3)) {
            navigation.navigate('Select Vehicle Type');
          }
          if (type == 'no') {
            navigation.navigate('Vender Profile');
            setModalVisible(!modalVisible)
          }


        })
      }
    })
  }


  const getAddOnList = async () => {
    setFetching(true)
    let json = await getAddOns()
    setFetching(false)
    if (json?.data) setAddOns(json?.data)
  }

  const onSelect = (item) => {
    if (selectedAddOns.includes(item)) setSelectedAddOns(cv => cv.filter(v => v.id != item.id))
    else setSelectedAddOns(cv => [...cv, item])
  }


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.blue_color }}>
      <ImageBackground style={{ width: '100%', height: '100%', flex: 1, }} source={require('../../Assets/bg_img.png')}>
        <LoadingView fetching={fetching} containerStyle={{ height: '100%' }}>
          <View style={{ alignItems: 'center', width: '100%', }}>
            <View style={{ backgroundColor: '#e28c39', height: 60, width: '100%', justifyContent: 'center', paddingHorizontal: 20 }}>
              <Text style={{ fontSize: 17, color: '#fff', fontWeight: '700', textAlign: 'center' }}>Upgrade your packages with the following add-ons</Text>
              {/* <Text style={styles.titleStyle}>
         
         {localbooking?.map(data => 
           <Text style={{ display: 'block', justifyContent: 'center', flexWrap:'wrap' }}>
           
           {data.vehiclename}
           </Text>
           )}
         </Text> */}
            </View>
            <FlatList
              style={{ width: '100%', marginBottom: 180 }}
              showsVerticalScrollIndicator={false}
              data={addOns}
              renderItem={({ item, index }) => <RenderItem item={item} index={index} onSelect={() => onSelect(item)} isSelected={selectedAddOns.includes(item)} />}
              keyExtractor={(item, index) => index}
              ItemSeparatorComponent={() => <View style={{ margin: -5 }} />}
            />

          </View>

          <View style={{ position: 'absolute', bottom: 0, right: 0, left: 0, alignItems: 'center', marginTop: 10 }}>
            <View style={{ backgroundColor: '#e28c39', height: 60, width: '100%', justifyContent: 'center', paddingHorizontal: 20 }}>
              <Text style={{ fontSize: 17, color: '#fff', fontWeight: '700', textAlign: 'center' }}>Estimatess Wash Duration 30 Mins</Text>
              <Text style={{ fontSize: 17, color: '#fff', fontWeight: '700', textAlign: 'center' }}>Sub-Total:  ${selectedAddOns.length == 0 ? 0 : selectedAddOns.map(addOn => parseFloat(addOn.add_ons_price)).reduce((p, c) => p + c)}</Text>
            </View>
            <View style={{ flexDirection: 'row', }} >
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  Alert.alert("Modal has been closed.");
                  setModalVisible(!modalVisible);
                }}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalText}>Would you like to add an additional wash?</Text>
                    <View style={{ flexDirection: 'row', }} >
                      <Pressable
                        style={[styles.button, styles.buttonClose]}

                        //disabled={disabled} onPress={onPress} style={{ padding: 16, backgroundColor: color, flex: 1, borderRadius: 10, alignItems: 'center', opacity: disabled ? 0.5 : 1 }}
                        onPress={() => {
                          { storebookingdata('yes') }
                          if (selectedAddOns.length > 0) setCurrentBooking(cv => ({ ...cv, selectedAddOns, extra_add_ons: selectedAddOns.map(addOn => addOn.id).reduce((p, c) => p + ',' + c) }))
                        }}

                      >
                        <Text style={styles.textStyle}>Yes</Text>

                      </Pressable>
                      <Pressable
                        style={[styles.button, styles.buttonClose]}
                        // onPress={() => setModalVisible(!modalVisible)}

                        onPress={() => {
                          { storebookingdata('no') }
                          // setModalVisible(!modalVisible)
                          if (selectedAddOns.length > 0) setCurrentBooking(cv => ({ ...cv, selectedAddOns, extra_add_ons: selectedAddOns.map(addOn => addOn.id).reduce((p, c) => p + ',' + c) }))

                        }}
                      >
                        <Text style={styles.textStyle}>No</Text>
                      </Pressable>
                    </View>
                    {/* <TouchableOpacity
                    onPress={() => {
                      if(selectedAddOns.length>0) setCurrentBooking(cv=>({...cv,selectedAddOns, extra_add_ons:selectedAddOns.map(addOn=>addOn.id).reduce((p,c)=>p+','+c)}))
                      navigation.navigate('Vender Profile');
                      // if(selectedAddOns.length>0) setCurrentBooking(cv=>({...cv,selectedAddOns, extra_add_ons:selectedAddOns.map(addOn=>addOn.id).reduce((p,c)=>p+','+c)}))
                      // navigation.navigate('Vender Profile');
                    }}
                    style={styles.auth_btn}
                    activeOpacity={0.8}>
                    <Text style={{ fontSize: 16, textAlign: 'center', color: Colors.buton_label, fontWeight: 'bold' }}>No</Text>
                  </TouchableOpacity> */}
                  </View>
                </View>
              </Modal>
              <TouchableOpacity
                elevation={5}
                onPress={() => setModalVisible(true)}
                style={styles.auth_btn}
                underlayColor='gray'
                activeOpacity={0.8}>
                <Text style={{ fontSize: 16, textAlign: 'center', color: Colors.buton_label, fontWeight: 'bold' }}>CONFIRM ADD-ONS</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => changeStack('CustomerHomeStack')}
                style={styles.auth_btn}
                activeOpacity={0.8}>
                <Text style={{ fontSize: 16, textAlign: 'center', color: Colors.buton_label, fontWeight: 'bold' }}>CANCEL</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LoadingView>
      </ImageBackground>

    </SafeAreaView>
  );
}

export default SelectAddOns

const RenderItem = ({ item, index, onSelect, isSelected }) => (
  <TouchableOpacity onPress={onSelect} style={{ padding: 21, flex: 1, margin: 10, marginHorizontal: 18, backgroundColor: '#fff', borderRadius: 5, paddingVertical: 10, }}>
    <View style={{ flexDirection: 'row', marginTop: 5, justifyContent: 'space-evenly', flex: 1 }}>
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ marginHorizontal: 5, fontSize: 16, color: '#000', fontWeight: 'bold' }}>{item.add_ons_name} - </Text>
        <Text style={{ marginHorizontal: 5, fontSize: 16, color: '#e28c39', fontWeight: 'bold' }}>${parseFloat(item.add_ons_price).toFixed(2)}</Text>
      </View>
      <CheckBox
        style={{ padding: 0, alignItems: 'flex-end', flex: 1, marginRight: 15 }}
        onClick={onSelect}
        isChecked={isSelected}
        checkedImage={<Image source={require('../../Assets/icon/checked.png')} style={{ width: 22, height: 22 }} />}
        unCheckedImage={<Image source={require('../../Assets/icon/unchecked.png')} style={{ width: 22, height: 22 }} />}
      />
    </View>
  </TouchableOpacity>
)

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
    width: 200,
    color: "white",
    flex: 1,
    height: 60,
    justifyContent: 'center',
  },
  add_btn: {

    backgroundColor: '#e28c39',
    alignItems: 'center',
    width: '45%',
    height: 40,
    justifyContent: 'center', borderRadius: 20
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    width: 300,

  },
  button: {
    borderRadius: 8,
    padding: 7,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
    marginRight: 5
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    width: 50,
    height: 20
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20
  }
});