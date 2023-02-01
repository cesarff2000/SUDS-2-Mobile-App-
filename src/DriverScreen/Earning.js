import {useNetInfo} from '@react-native-community/netinfo';
import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image, FlatList, RefreshControl, ActivityIndicator} from 'react-native';
import {ButtonGroup} from 'react-native-elements/dist/buttons/ButtonGroup';
import Colors from '../../Constants/Colors';
import Divider from '../Components/Divider';
import ListEmpty from '../Components/ListEmpty';
import { partialProfileUrl } from '../Providers';
import {ACTIONS, EarningContext} from '../Providers/EarningsProvider';

const Earning = () => {
  const netInfo = useNetInfo();
  const {
    state: {data, loading, hasLoadedAllItems, refreshing, type, totalbooking, totaltime, totalamount},
    dispatch, setEType, onStateChange
  } = useContext(EarningContext);

  useEffect(() => dispatch({type: ACTIONS.Start}), []);

  useEffect(() => console.log(totalamount), [totalamount]);

  const [state, setState] = useState({
    selectedIndex: 0,
    data: [
      {earning: '24.5$', speed: '4h 32m', completed: 6},
      {earning: '154.5$', speed: '3h 5m', completed: 42},
    ],
  });

  const updateIndex = selectedIndex => {
    setState({...state, selectedIndex});
    setEType(selectedIndex)
    dispatch({type: `Start`})
    setTimeout(() => {
      onStateChange({data, loading, hasLoadedAllItems, refreshing, type, totalbooking, totaltime, totalamount})
    }, 10);
  };

  const buttons = ['Today', 'Weekly'];

  return (
    <View style={{flex: 1, backgroundColor: '#f8f8f8'}}>
      <View style={{flex: 1}}>
        <ButtonGroup
          onPress={updateIndex}
          selectedIndex={state.selectedIndex}
          buttons={buttons}
          containerStyle={{borderWidth: 0, marginTop: 0, marginLeft: 0, marginRight: 0, borderRadius: 0, backgroundColor: '#fff', height: 50}}
          buttonStyle={{}}
          innerBorderStyle={{width: 0}}
          selectedButtonStyle={{marginHorizontal: 5, marginTop: 4, borderBottomColor: 'orange', borderBottomWidth: 3, backgroundColor: '#fff'}}
          selectedTextStyle={{color: '#1F292D'}}
          textStyle={{color: '#8B9193', fontSize: 18}}
        />

        <View style={{paddingTop: 7, flex: 1}}>
          <View style={{ paddingHorizontal: 7}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', padding: 7}}>
            <Detail detail="My Earning" title={"$"+parseFloat(totalamount)?.toFixed(1)} color="#7DD948" />
            <Detail detail="Speed Time" title={totaltime+'m'} color={Colors.blue_color} />
            <Detail detail="Washes Completed" title={totalbooking} color="orange" />
          </View>
          <Text style={{marginTop: 25, marginHorizontal: 10, color: '#888', fontSize: 18}}>TODAY'S TRIP</Text>
          </View>
          <Divider color='#eee' />
          <View style={{flex: 1, paddingHorizontal: 7}}>
            <FlatList
              style={{width: '100%', flex: 1}}
              keyExtractor={(item, index) => index}
              showsVerticalScrollIndicator={false}
              data={data}
              renderItem={renderItem}
              ListEmptyComponent={!loading && <ListEmpty retry={() => dispatch({type: ACTIONS.Start})} netInfo={netInfo} emptyMsg="No Reports Yet" />}
              ListFooterComponent={(loading || (!hasLoadedAllItems && type !== ACTIONS.OnFail)) && ListFooter}
              onEndReached={!hasLoadedAllItems && (() => dispatch({type: ACTIONS.LoadMore}))}
              onEndReachedThreshold={0.1}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => dispatch({type: ACTIONS.Refresh})} />}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default Earning;
const renderItem = ({item, index}) => (
  <View style={styles.item}>
    <View style={{flexDirection: 'row'}}>
      <Image style={{width: 45, height: 45, borderRadius: 22}} source={{uri: partialProfileUrl + item.userdetails[0].image}} />
      <View style={{marginLeft: 10, width: '68%'}}>
        <Text numberOfLines={1} style={{marginTop: 3, fontWeight: 'bold'}}>
          {item.userdetails[0].name}
        </Text>
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
          <Image style={{width: 14, height: 14, tintColor: '#999'}} source={require('../../Assets/list.png')} />
          <Text style={{marginHorizontal: 3, color: '#999'}}>{item.booking_time}</Text>
        </View>
      </View>
      <View>
        <View style={{marginBottom: 5}}>
          <Text style={{fontSize: 16, color: '#999', textAlign: 'right'}}>${parseFloat(item?.total)?.toFixed(2)}</Text>
          <Text style={{fontSize: 12, color: '#777', textAlign: 'right'}}>Price</Text>
        </View>
      </View>
    </View>
  </View>
);

const ListFooter = () => (
  <View style={{flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'center', padding: 8}}>
    <ActivityIndicator color={Colors.blue_color} size="large" />
  </View>
);

const Detail = ({color, title, detail}) => (
  <View style={styles.detail}>
    <Text style={{color: color, fontSize: 24, textAlign: 'center', paddingTop: 16, paddingRight: 16, paddingLeft: 16}}>{title}</Text>
    <Text style={{color: '#777', fontSize: 10, textAlign: 'center', padding: 8}}>{detail}</Text>
  </View>
);

const styles = StyleSheet.create({
  item: {
    margin: 7,
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
    shadowColor: '#aaa',
    shadowOffset: {width: 0.5, height: 0.5},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    borderRadius: 5,
    elevation: 5,
  },

  detail: {
    width: '31%',
    backgroundColor: '#fff',
    borderRadius: 5,
    justifyContent: 'center',
    shadowOffset: {width: 1, height: 1},
    shadowColor: '#aaa',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
});
