import { useNetInfo } from '@react-native-community/netinfo';
import React, {useContext, useEffect} from 'react';
import {ActivityIndicator, Modal, ScrollView, Text, View} from 'react-native';
import { AppContext } from '../Providers/AppProvider';
import ListEmpty from './ListEmpty';

const LoadingView = ({children, loading:contextLoading, fetching, loadingColor = 'white', fetchingColor = 'white', containerStyle, empty}) => {
  const {loading : appWideLoading} = useContext(AppContext)
  const netInfo = useNetInfo()
  return (
    <View>
      {fetching && <ActivityIndicator style={{padding: 50}} color={fetchingColor} size="large" />}
      {!empty && <View style={[{opacity: fetching ? 0 : 1}, containerStyle]}>{children}</View>}
      {(contextLoading || appWideLoading) && <Loading color={loadingColor} />}
      {empty && <ListEmpty opacity={0.5} color="white" netInfo={netInfo} emptyMsg="No Result Found" />}
    </View>
  );
};

export default LoadingView;

const Loading = ({color}) => (
  <Modal animationType="fade" statusBarTranslucent transparent={true}>
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        alignSelf: 'center',
        flex: 1,
        backgroundColor: '#00000075',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      }}>
      <ActivityIndicator size="large" style={{position: 'absolute', alignItems: 'center', justifyContent: 'center'}} color={color} />
    </View>
  </Modal>
);
