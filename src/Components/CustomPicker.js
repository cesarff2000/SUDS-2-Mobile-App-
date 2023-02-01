import React, {useMemo, useState} from 'react';
import {Controller} from 'react-hook-form';
import {ActivityIndicator, Modal, Text, View, FlatList, TouchableOpacity, StyleSheet, LayoutAnimation} from 'react-native';
import Colors from '../../Constants/Colors';

const CustomPicker = ({label, control, rules, errors, fieldName, asynFunction}) => {
  const [showList, setShowList] = useState(false);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  

  const onPress = async () => {
    setShowList(true);
    setLoading(true);
    let data = (await asynFunction())?.data;
    if (data) setList(data.reverse());
    else setShowList(false);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setLoading(false);
  };
  return (
    <View>
      <Controller
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <TouchableOpacity onPress={onPress} style={{width: '100%', padding: 16, backgroundColor: 'white', borderRadius: 30, marginTop: 8}}>
            <Text style={styles.text}>{value?.name ? value.name : label}</Text>
            {showList && <PickerList onSelect={item => onChange(item)} loading={loading} list={list} dismiss={() => setShowList(false)} />}
          </TouchableOpacity>
        )}
        name={fieldName}
        rules={rules}
      />
      <Error error={errors[fieldName]} label={label} />
    </View>
  );
};
const Error = ({error, label}) => {
  if (!error) return null;
  const capitalizeFistLetter = string => string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  const errorText = useMemo(() => {
    if (error.type == 'pattern') return `Please enter a valid ${label.toLowerCase()}`;
    if (error.type == 'required') return `${capitalizeFistLetter(label)} is required`;
  }, [error]);
  return <Text style={{color: 'red'}}>{errorText}</Text>;
};

const PickerList = ({dismiss, list, loading, onSelect}) => {
  const [endReached, setEndReached] = useState(false);
  return (
    <Modal animationType="fade" transparent={true} statusBarTranslucent={true}>
      <TouchableOpacity onPress={dismiss} style={styles.containerInModal}>
        <View style={{borderRadius: 25, backgroundColor: 'white', width: loading ? 'auto' : '100%', maxHeight: '70%'}}>
          {loading ? (
            <ActivityIndicator color={Colors.blue_color} style={{padding: 50}} size="large" />
          ) : (
            <View style={{width: '100%', maxHeight: '100%'}}>
              <FlatList
                data={list}
                style={{width: '100%', maxHeight: '100%'}}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{height: 2, width: '100%', backgroundColor: '#00000010'}} />}
                ListFooterComponent={!endReached && ListFooter}
                onEndReached={num => setEndReached(true)}
                renderItem={({item}) => <Item item={item} dismiss={dismiss} onSelect={onSelect} />}></FlatList>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const Item = ({item, onSelect, dismiss}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        onSelect(item);
        dismiss();
      }}
      style={{padding: 15}}>
      <Text style={styles.text}>{item.name}</Text>
    </TouchableOpacity>
  );
};

const ListFooter = () => (
  <View style={{flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'center', padding: 8}}>
    <ActivityIndicator color={Colors.blue_color} size="large" />
  </View>
);

export default CustomPicker;

const styles = StyleSheet.create({
  text: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },

  containerInModal: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    flex: 1,
    backgroundColor: '#00000050',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    padding: 20,
    right: 0,
  },
});
