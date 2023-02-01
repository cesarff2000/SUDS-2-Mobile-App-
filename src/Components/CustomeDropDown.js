// import React, {useEffect, useMemo, useRef, useState} from 'react';
// import {StyleSheet, Text, View} from 'react-native';
// import Colors from '../../Constants/Colors';
// import ModalDropdown from 'react-native-modal-dropdown';
// import {Controller} from 'react-hook-form';

// const CustomDropDown = ({items, control, fieldName, label, rules, errors, defaultValue}) => {
//   return (
//     <View>
//       <Controller
//         control={control}
//         render={({field: {onChange, onBlur, value}}) => (
//           <ModalDropdown
//             defaultValue={value?value.name:label}
//             style={{width: '100%', backgroundColor: 'white', padding: 17, marginTop: 8, borderRadius: 28}}
//             isFullWidth={true}
//             textStyle={{color: Colors.text_color, fontWeight: 'bold', fontSize: 16}}
//             options={items.map(item=>item.name)}
//             onSelect={(index, option) => onChange(items.find(item=>item.name==option))}
//             dropdownTextStyle={{color: Colors.text_color, fontWeight: 'bold', fontSize: 16, height: 51}}
//             dropdownStyle={[styles.dropDownStyle, {height: items.length < 5 ? 51 * items.length : 255}]}
//           />
//         )}
//         name={fieldName}
//         rules={rules}
//         defaultValue={defaultValue}
//       />
//       <Error error={errors[fieldName]} label={label} />
//     </View>
//   );
// };

// export default CustomDropDown;

// const Error = ({error, label}) => {
//   if (!error) return null;
//   const capitalizeFistLetter = string => string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
//   const errorText = useMemo(() => {
//     if (error.type == 'pattern') return `Please enter a valid ${label.toLowerCase()}`;
//     if (error.type == 'required') return `${capitalizeFistLetter(label)} is required`;
//   }, [error]);
//   return <Text style={{color: 'red'}}>{errorText}</Text>;
// };

// const styles = StyleSheet.create({
//   dropDownStyle: {
//     shadowColor: '#000',
//     shadowOffset: {width: 1, height: 1},
//     shadowOpacity: 1,
//     shadowRadius: 3.5,
//     elevation: 5,
//     borderRadius: 28,
//     overflow: 'hidden',
//   },
// });
