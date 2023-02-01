import { useNavigation, useRoute } from '@react-navigation/core';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert } from 'react-native';
import { Text, View, TouchableOpacity, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import Colors from '../../Constants/Colors';
import LoadingView from '../Components/LoadingView';
import { PackageContext } from '../Providers/PackageProvider';

const PackgeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  useEffect(() => navigation.setOptions({ headerTitle: 'EDIT ' + route.params.packageType?.toUpperCase() + ' PACKAGE' }), []);

  const { updatePackageDetails, getPackageDetails } = useContext(PackageContext);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async data => {
    let formattedTime = formatTime(data.time/60)
    if (!formattedTime) return
    console.log({ ...data, type: route.params.packageType });
    setLoading(true);
    let success = await updatePackageDetails({ ...data, type: route.params.packageType, time: formattedTime });
    if (success) navigation.goBack();
    setLoading(false);
  };

  useEffect(() => {
    setFetching(true);
    getPackageDetails(route.params.packageType).then(json => {
      setFetching(false);
      if (json) reset({ ...json.data, time: parseInt(json.data.package_time.split(':')[0])+'' });
    });
  }, []);

  return (
    <View style={{ flex: 1, paddingHorizontal: 16, paddingBottom: 65 }}>
      <SafeAreaView />
      <LoadingView loading={loading} fetching={fetching} fetchingColor={Colors.blue_color}>
        <Text style={{ color: Colors.blue_color, fontSize: 24, fontWeight: 'bold', paddingBottom: 24, paddingTop: 40 }}>
          {route.params.packageType} Package
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <InputComponent keyboardType="number-pad" fieldName="price" rules={{ required: true }} control={control} errors={errors} label="Edit Price" />
          <View style={{ width: 50 }} />
          <InputComponent fieldName="time" rules={{ required: true }} control={control} errors={errors} label="Edit Time (Minutes)" keyboardType="number-pad" />
        </View>
        <View style={{ height: 300, paddingBottom: 30 }}>
          <InputComponent
            fieldName="description"
            rules={{ required: true }}
            control={control}
            errors={errors}
            label="Package Details"
            textInputStyle={{
              flex: 1,
              textAlignVertical: 'top',
              fontSize: 16,
            }}
          />
        </View>
      </LoadingView>
      <View style={styles.btnsContainer}>
        <Btn onPress={() => navigation.goBack()} title="Cancel" />
        <Btn onPress={handleSubmit(onSubmit)} title="Submit" />
      </View>
    </View>
  );
};

export default PackgeScreen;

const formatTime = (t) => {
  const zeroPad = (num, places) => String(num).padStart(places, '0');
  if (t > 24 || t < 1) return Alert.alert('Time', 'Please insert an appropriate amount of time.')
  else return zeroPad(t, 2) + ':00'
}

const InputComponent = ({ label, textInputStyle, keyboardType, fieldName, rules, control, errors }) => {
  return (
    <View style={{ flex: 1 }}>
      <Text style={{ paddingVertical: 10 }}>{label}</Text>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            onBlur={onBlur}
            onChangeText={value => onChange(value)}
            value={value}
            style={[{ borderWidth: 2, borderColor: '#555', borderRadius: 25, color: 'black', paddingHorizontal: 16, minHeight:50 }, textInputStyle]}
            keyboardType={keyboardType}
          />
        )}
        name={fieldName}
        rules={rules}
        defaultValue=""
      />
      <Error error={errors[fieldName]} label={label ? label : placeholder} />
    </View>
  );
};

const Btn = ({ title, onPress }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={{ flex: 1, alignItems: 'center', backgroundColor: Colors.blue_color, padding: 20 }}>
    <Text style={{ fontSize: 18, color: 'white', fontWeight: 'bold' }}>{title}</Text>
  </TouchableOpacity>
);

const Error = ({ error, label }) => {
  if (!error) return null;
  const capitalizeFistLetter = string => string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  const errorText = useMemo(() => {
    if (error.type == 'pattern') return `Please enter a valid ${label.toLowerCase()}`;
    if (error.type == 'required') return `${capitalizeFistLetter(label)} is required`;
  }, [error]);
  return <Text style={{ color: 'red' }}>{errorText}</Text>;
};

const styles = StyleSheet.create({
  btnsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    flexDirection: 'row',
  },
});
