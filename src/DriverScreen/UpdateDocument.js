import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Colors from '../../Constants/Colors';
import ListEmpty from '../Components/ListEmpty';
import { ERROR, LOADING } from '../Providers';
import { AuthContext } from '../Providers/AuthProvider';

const UpdateDocument = ({ route }) => {

  const navigation = useNavigation()

  const [state, setState] = useState(LOADING)

  const { checkDocuments, documentVerified } = useContext(AuthContext)

  useEffect(() => navigation.addListener("focus", () => checkDocuments(setState)), [])

  switch (state) {
    case ERROR:
      return <ListEmpty emptyMsg="Something went wrong." retry={() => checkDocuments(setState)} />
    case LOADING:
      return <ActivityIndicator color={Colors.background_color} size="large" style={{ justifyContent: 'flex-start', padding: 50 }} />
    default: return (
      <View style={{ flex: 1, padding: 16 }}>
        <CardHead checked={state.drivinglicense} onPress={() => navigation.navigate('UPLOAD DRIVING LICENSE', { authStack: route.params?.authStack })} title="Step 1 : Driver License" />
        <CardHead checked={state.background} onPress={() => navigation.navigate('BACKGROUND CHECK', { authStack: !state.background })} title="Step 2 : Background Check" />
        <CardHead checked={state.vehicle_insurance} onPress={() => navigation.navigate('VEHICLE INSURANCE', { authStack: !state.vehicle_insurance })} title="Step 3 : Vehicle Insurance" />
        <CardHead checked={state.vehicle_registration} onPress={() => navigation.navigate('VEHICLE REGISTRATION', { authStack: !state.vehicle_registration })} title="Step 4 : Vehicle Registration" />
        {route.params?.authStack &&
          <TouchableOpacity onPress={() => documentVerified(() => navigation.navigate('TERMS & CONDITIONS'))} disabled={!Object.values(state).reduce((p, c) => p && c)} style={{ backgroundColor: Colors.blue_color, padding: 18, alignItems: 'center', justifyContent: 'center', marginTop: 'auto', borderRadius: 5, opacity: Object.values(state).reduce((p, c) => p && c) ? 1 : .5 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: 'white' }} >CONTINUE</Text>
          </TouchableOpacity>
        }
      </View>
    )
  }
};

export default UpdateDocument;


const CardHead = ({ title, onPress, checked }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ flexDirection: 'row', padding: 16, alignItems: 'center', justifyContent: 'space-between', width: '100%', ...styles.card }}>
      <Text style={{ color: '#777', fontSize: 22 }}>{title}</Text>
      <Image style={{ tintColor: checked ? Colors.dark_orange : '#ddd', width: 16, height: 16 }} source={require('../../Assets/icon/checked.png')} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    shadowColor: '#999',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 3.5,
    borderRadius: 3,
    elevation: 5,
    marginBottom: 12,
  },
});
