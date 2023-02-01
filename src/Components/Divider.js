import React from 'react';
import {Text, View} from 'react-native';

const Divider = ({color, style}) => <View style={[{width: '100%', height: 1, backgroundColor: color ? color : '#ffffff50'}, style]} />;

export default Divider;
