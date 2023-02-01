import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import Colors from '../../Constants/Colors';

const CtaButton = ({onPress, primary, title, style}) => {
  return (
    <TouchableOpacity
      elevation={5}
      onPress={onPress}
      style={[styles.btn, {backgroundColor: primary ? Colors.buttom_color : 'white'}, style]}
      underlayColor="gray"
      activeOpacity={0.8}
      // disabled={this.state.disableBtn}
    >
      <Text style={[styles.cta_button_text, {color: primary ? Colors.buton_label : '#333333'}]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CtaButton;

const styles = StyleSheet.create({
  btn: {
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 25,
    width: '90%',
    height: 50,
    justifyContent: 'center',
  },
  cta_button_text: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
