import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, TouchableOpacity, FlatList, Alert } from 'react-native';
import Colors from '../../Constants/Colors';
import CheckBox from 'react-native-check-box';
import { bookingType, changeStack, navigate, ON_DEMAND } from '../Navigation/NavigationService';
import { useNavigation } from '@react-navigation/core';
import { BookingContext } from '../Providers/BookingProvider';

// const bigRigPackages = [
//   {
//     name: 'Bronze',
//     description: 'Truck Only',
//     price: '$99.00',
//   },
//   {
//     name: 'Silver',
//     description: 'Truck and Tractor',
//     price: '$199.00',
//   },
//   {
//     name: 'Gold',
//     description: 'Tractor and Trailor',
//     price: '$249.00',
//   },
// ];

const vaccumCementPackages = [
  {
    name: 'Bronze',
    price: '$125.00',
  },
  {
    name: 'Silver',
    price: '$175.00',
  },
  {
    name: 'Gold',
    description: 'Dot ready',
    price: '$225.00',
  },
];

const boxAndFleetPackages = [
  {
    name: 'Bronze',
    price: '$99.00',
  },
  {
    name: 'Silver',
    price: '$149.00',
  },
  {
    name: 'Gold',
    price: '$199.00',
  },
];

const tractorTrailorCategories = [
  {
    vehicleType: 'BIG RIGS',
    checked: false,
    category_id: 2,
    navigateTo: 'Packages',
    params: { packageParams: { category_id: '2', subcategory_id: '16' }, packageType: 'Big Rigs' },
  },
  {
    vehicleType: 'VACUM/CEMENT',
    checked: false,
    category_id: 2,
    navigateTo: 'Packages',
    params: { packageParams: { category_id: '2', subcategory_id: '17' }, packageType: 'Vaccum/Cement' },
  },
  {
    vehicleType: 'BOX & FLEET',
    checked: false,
    category_id: 2,
    navigateTo: 'Packages',
    params: { packageParams: { category_id: '2', subcategory_id: '28' }, packageType: 'Box & Fleet' },
  },
];
const boatCategories = [
  {
    checked: false,
    category_id: 3,
    vehicleType: 'BOATS UNDER 20 FEET',
    navigateTo: 'Packages',
    params: { packageParams: { category_id: '3', "subcategory_id": 20, }, packageType: 'Boats under 20 feet' },
  },
  {
    checked: false,
    category_id: 3,
    vehicleType: 'BOATS OVER 20 FEET',
    navigateTo: 'Packages',
    params: { packageParams: { category_id: '3', "subcategory_id": 21 }, packageType: 'Boats over 20 feet' },
  },
];
const motorcyclePackages = [
  {
    name: 'Bronze',
    price: '$25.00',
  },
  {
    name: 'Silver',
    price: '$35.00',
  },
  {
    name: 'Gold',
    price: '$45.00',
  },
];

const boatsOver20FeetPackages = [
  {
    name: 'Bronze',
    price: '$125.00',
  },
  {
    name: 'Silver',
    price: '$199.00',
  },
  {
    name: 'Gold',
    price: '$265.00',
  },
];

const boatsUnder20FeetPackages = [
  {
    name: 'Bronze',
    price: '$99.00',
  },
  {
    name: 'Silver',
    price: '$159.00',
  },
  {
    name: 'Gold',
    price: '$199.00',
  },
];



const SelectVehicleType = ({ route }) => {
  const navigation = useNavigation();
  const [selectedType, setSelectedType] = useState();
  const { setCurrentBooking } = useContext(BookingContext)

  useEffect(() => { navigation.setOptions({ title: route.params?.title || 'Wash Type' }); return () => setCurrentBooking(cv => ({ ...cv, vehicle: undefined })) }, []);

  const [types, setTypes] = useState(
    route.params?.types
      ? route.params?.types
      : [
        {
          vehicleType: 'Car or Truck',
          category_id: 1,
          checked: false,
          navigateTo: 'Car or Truck',
        },
        {
          vehicleType: 'Tractor Trailors',
          category_id: 2,
          checked: false,
          navigateTo: 'Vehicle Categories',
          params: { types: tractorTrailorCategories, title: 'Tractor Trailors' },
        },
        {
          vehicleType: 'Boats ',
          category_id: 3,
          checked: false,
          navigateTo: 'Vehicle Categories',
          params: { types: boatCategories, title: 'Boats' },
        },
        {
          vehicleType: 'Motorcycles ',
          category_id: 4,
          checked: false,
          navigateTo: 'Packages',
          params: { packageParams: { category_id: '4' }, packageType: 'Motorcycle' },
        },

        {
          vehicleType: 'Rv s, Bus, M.H. ',
          category_id: 5,
          checked: false,
          navigateTo: 'RVs Bus M V',
        },
        {
          vehicleType: 'Heavy Equipment ',
          category_id: 6,
          checked: false,
          navigateTo: 'Heavy Equipment',
        },
        {
          vehicleType: 'Business Wash ',
          category_id: 7,
          checked: false,
          navigateTo: 'Business Wash',
        },
      ],
  );

  const onCheck = i => {
    setSelectedType(cv => (cv == i ? undefined : i));
    setTypes(items => {
      types[i].checked = true;
      items.splice(i, 1, { ...items[i], checked: !items[i].checked });
      return [...items];
    });
  };

  const onContinue = () => {
    if (selectedType == undefined) return Alert.alert('Select Type', 'Please select a vehicle type.');
    setCurrentBooking(cv => ({ ...cv, vehicle_type: types[selectedType].category_id }))
    if (types[selectedType].navigateTo == 'Packages') navigate(bookingType.current == ON_DEMAND ? 'Packages' : 'Select a Vendor', types[selectedType]?.params);
    else navigate(types[selectedType].navigateTo, types[selectedType]?.params);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.blue_color }}>
      <FlatList
        keyExtractor={item => item.vehicleType}
        style={{ width: '100%', backgroundColor: 'white' }} data={types}
        renderItem={({ item, index }) => <RenderItem item={item} onCheck={() => setSelectedType(cv => (cv == index ? undefined : index))} checked={selectedType == index} onPress={() => setCurrentBooking(cv => ({ ...cv, vehicle: item?.vehicleType }))} />}
        ItemSeparatorComponent={() => <View style={{ marginTop: -15 }} />} />
      <View style={{ alignItems: 'center', marginTop: 'auto' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity
            elevation={5}
            onPress={onContinue}
            style={styles.auth_btn}
            underlayColor="gray"
            activeOpacity={0.8}>
            <Text style={{ fontSize: 16, textAlign: 'center', color: Colors.buton_label, fontWeight: 'bold' }}>Continue</Text>
          </TouchableOpacity>

          <TouchableOpacity
            elevation={5}
            onPress={() => changeStack('CustomerHomeStack')}
            style={styles.auth_btn}
            underlayColor="gray"
            activeOpacity={0.8}>
            <Text style={{ fontSize: 16, textAlign: 'center', color: Colors.buton_label, fontWeight: 'bold' }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const RenderItem = ({ item, onCheck, checked, onPress }) => {
  const { setCurrentBooking } = useContext(BookingContext)
  const navigateTo = () => {
    if (item.navigateTo == 'Packages') return bookingType.current == ON_DEMAND ? 'Packages' : 'Select a Vendor';
    else return item.navigateTo;
  };

  const onItemPress = () => {
    onPress()
    setCurrentBooking(cv => ({ ...cv, vehicle_type: item.category_id, ...item.params }))
    navigate(navigateTo(), item.params)
  }

  return (
    <TouchableOpacity onPress={onItemPress} style={styles.card}>
      <Text style={{ fontSize: 16, color: '#000', fontWeight: 'bold' }}>{item.vehicleType}</Text>
      <CheckBox style={{}} onClick={onCheck} isChecked={checked} checkedImage={<Image source={require('../../Assets/icon/checked.png')} style={{ width: 22, height: 22, tintColor: Colors.blue_color }} />} unCheckedImage={<Image source={require('../../Assets/icon/unchecked.png')} style={{ width: 22, height: 22, tintColor: Colors.blue_color }} />} />
    </TouchableOpacity>
  );
};

export default SelectVehicleType;
const styles = StyleSheet.create({
  auth_btn: {
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: Colors.buttom_color,

    width: '50%',
    height: 65,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    alignItems: 'center',
    shadowColor: '#555',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3.5,
    borderRadius: 10,
    elevation: 5,
    margin: 15,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
