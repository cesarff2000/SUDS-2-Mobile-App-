import React from 'react';
import {View, Image} from 'react-native';
import Colors from '../../Constants/Colors';

export default Rating = ({rating, size}) => {
  return (
    <View style={{flexDirection: 'row'}}>
      {[...Array(5)].map((v, i) => (
        <Image
          key={i}
          style={{
            marginLeft: 2,
            marginRight: 2,
            width: size ? size : 16,
            height: size ? size : 16,
            tintColor: Math.round(parseFloat(rating)) > i ? Colors.dark_orange : '#aaa',
          }}
          source={require('../../Assets/review.png')}
        />
      ))}
    </View>
  );
};
