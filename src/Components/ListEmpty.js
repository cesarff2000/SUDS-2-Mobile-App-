import { useNetInfo } from '@react-native-community/netinfo';
import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements/dist/icons/Icon';
import Colors from '../../Constants/Colors';

const ListEmpty = ({retry, emptyMsg, color='black', opacity=0.1}) => {
  const netInfo = useNetInfo()
  return (
    <View style={{alignItems: 'center', padding: 20}}>
      <Icon color={color} style={{opacity: opacity}} size={100} name={netInfo.isConnected!==false ? 'list-alt' : 'perm-scan-wifi'} />
      <Text style={{fontSize: 32, fontWeight: 'bold', opacity: opacity, color: color, textAlign : 'center'}}>
        {netInfo.isConnected!==false ? emptyMsg : 'No Internet Connection'}
      </Text>
      {retry && (
        <TouchableOpacity onPress={retry} style={{alignItems: 'center', paddingTop: 30}}>
          <Icon
            color={Colors.blue_color}
            style={{opacity: 0.8, borderRadius: 15, borderWidth: 2, borderColor: Colors.blue_color, backgroundColor: '#eee'}}
            size={50}
            name="replay"
          />
          <Text style={{fontSize: 16, opacity: 0.8, color: Colors.blue_color}}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ListEmpty;
