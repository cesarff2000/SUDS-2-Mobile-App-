import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import Colors from '../../Constants/Colors';

const LinkButton = ({onPress, style, title}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.btn, style]}
      underlayColor="gray"
      activeOpacity={0.8}
      // disabled={this.state.disableBtn}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

export default LinkButton;

const styles = StyleSheet.create({
  btn: {
    marginTop: 10,
    marginBottom: 10,
  },
  text: {
    fontSize: 15,
    textAlign: 'center',
    color: '#4193F7',
    fontWeight: 'bold',
  },
});
