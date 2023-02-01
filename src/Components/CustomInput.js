import React from 'react';
import {StyleSheet, Text, View, Image, TextInput} from 'react-native';
import Colors from '../../Constants/Colors';

const CustomInput = ({label, iconSource, setState, state, placeholder, secure, noIcon}) => {
  return (
    <View>
      <Text style={styles.input_label}>{label}</Text>
      <View style={{width: '95%', flexDirection: 'row'}}>
        <TextInput style={[styles.auth_textInput]} placeholder={placeholder} secureTextEntry={secure} onChangeText={text => setState({text})} value={state} placeholderTextColor={Colors.dark_gray} autoCapitalize="none" />
        {!noIcon &&<Image source={iconSource} style={styles.input_icon} />}
      </View>
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  auth_textInput: {
    alignSelf: 'center',
    width: '93%',
    // borderWidth: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    height: 40,
    color: Colors.text_color,
    padding: 0,
    marginTop: 1,
    fontSize: 18,
    marginBottom:3
  },

  input_label: {
    color: '#999',
    textAlign: 'left',
    width: '100%',
    marginTop: 4,
    marginBottom: -8,
  },

  input_icon: {
    width: 21,
    height: 21,
    alignSelf: 'center',
    marginLeft: -22,
    tintColor: '#999',
  },
});
