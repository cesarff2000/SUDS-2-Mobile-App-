import React, {useContext, useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {View, ImageBackground, StyleSheet, Alert} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import ControllerInput from '../Components/ControllerInput';
import CtaButton from '../Components/CtaButton';
import CustomPicker from '../Components/CustomPicker';
import LoadingView from '../Components/LoadingView';
import {AuthContext} from '../Providers/AuthProvider';

const routingNumbers = [
  {name: '1', id: 1},
  {name: '2', id: 2},
  {name: '3', id: 3},
  {name: '4', id: 4},
];

const asynFunction = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({data:routingNumbers});
    }, 2000);
  });
};

const BankInfo = () => {
  const {saveBankInfo, getBankInfo} = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    watch,
    formState: {errors},
  } = useForm();

  const onSubmit = async data => {
    console.log({...data, routing_number: data.routing_number.name});
    if (data.account_number !== data.confirm_account_number) Alert.alert('Account number', "Your account number doesn't match");
    else {
      setLoading(true);
      await saveBankInfo({...data, routing_number: data.routing_number.name});
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserBankDetails();
  }, []);

  const getUserBankDetails = async () => {
    setFetching(true);
    let json = await getBankInfo();
    setFetching(false);
    if (json?.response) {
      console.log(JSON.stringify(json.data));
      let savedRoutingNumber = routingNumbers.find(item => json.data.routing_number == item.name);
      reset({...json.data, routing_number: savedRoutingNumber, confirm_account_number: json.data.account_number});
    }
  };

  return (
    <ImageBackground style={styles.imgBg} source={require('../../Assets/bg_img.png')}>
      <LoadingView fetching={fetching} loading={loading}>
        <ScrollView style={styles.container}>
          <ControllerInput control={control} errors={errors} rules={{required: true}} fieldName="bank_name" placeholder="Bank Name" curved />
          <ControllerInput
            control={control}
            errors={errors}
            rules={{required: true}}
            fieldName="account_number"
            placeholder="Account Number"
            keyboardType="numeric"
            curved
          />
          <ControllerInput
            control={control}
            errors={errors}
            fieldName="confirm_account_number"
            placeholder="Confirm Account Number"
            keyboardType="numeric"
            curved
          />
          <CustomPicker
            asynFunction={asynFunction}
            fieldName="routing_number"
            rules={{required: true}}
            control={control}
            errors={errors}
            label="Routing Number"
          />
          <CtaButton onPress={handleSubmit(onSubmit)} primary title="Save" style={{width: '100%', marginTop: 8}} />
        </ScrollView>
      </LoadingView>
    </ImageBackground>
  );
};

export default BankInfo;

const styles = StyleSheet.create({
  imgBg: {
    flex: 1,
  },
  container: {
    width: '100%',
    height: '100%',
    paddingTop: 15,
    paddingHorizontal: 30,
  },
  text: {
    fontWeight: 'bold',
    padding: 18,
    fontSize: 16,
    width: '100%',
    borderRadius: 50,
    backgroundColor: 'white',
    marginTop: 8,
  },
});
