import React, {useContext, useState} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, ImageBackground} from 'react-native';

import {ScrollView} from 'react-native';
import CtaButton from '../Components/CtaButton';
import ControllerInput from '../Components/ControllerInput';
import {useForm} from 'react-hook-form';
import {getCurrentPosition} from '../Services/LocationServices';
import {AuthContext} from '../Providers/AuthProvider';
import LoadingView from '../Components/LoadingView';
const CustomersignUp = ({navigation}) => {
  const {customersignUp} = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();

  const fakeSubmit = () => {
    setLoading(true)
    setTimeout(()=>{
      navigation.navigate('ENTER OTP');
      setLoading(false)
    },2000)
  
  };

  const onSubmit = async data => {
    setLoading(true);
    const {latitude, longitude} = (await getCurrentPosition()).coords;
    if (latitude && longitude) {
      let otp = await customersignUp({latitude, longitude, ...data});
      if (otp) navigation.navigate('ENTER OTP', {otp});
    }
    setLoading(false);
  };
  
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
      }}>
      <View style={{flex: 1}}>
        <ScrollView>
          <ImageBackground style={{width: '100%', height: '100%', flex: 1}} fadeDuration={0} source={require('../../Assets/imageBG.png')}>
            <SafeAreaView />
            <LoadingView loading={loading}>
              <Image style={{width: '100%', height: 95, resizeMode: 'contain', marginTop: 30}} source={require('../../Assets/logo_icon.png')}></Image>
              <Image style={{width: '100%', height: 65, resizeMode: 'contain', marginTop: 5}} source={require('../../Assets/logo2.png')}></Image>
              <View style={{padding: 21, alignItems: 'center', justifyContent: 'flex-end', flex: 1}}>
                <Text style={{fontWeight: 'bold', marginTop: 5, color: '#fff', fontSize: 16, marginBottom: 8}}>Create an Account</Text>
                <View style={styles.inputs_container}>
                  <ControllerInput
                    label="FULL NAME"
                    iconSource={require(`../../Assets/icon/user.png`)}
                    control={control}
                    errors={errors}
                    rules={{required: true}}
                    fieldName="name"
                  />
                  <ControllerInput
                    label="EMAIL ADDRESS"
                    iconSource={require(`../../Assets/icon/email.png`)}
                    control={control}
                    errors={errors}
                    rules={{required: true, pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/}}
                    fieldName="email"
                    keyboardType="email-address"
                  />
                  <ControllerInput
                    label="MOBILE NUMBER"
                    iconSource={require(`../../Assets/icon/cell-phone.png`)}
                    control={control}
                    errors={errors}
                    rules={{required: true, pattern: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/}}
                    fieldName="mobile"
                    keyboardType="phone-pad"
                  />
                  <ControllerInput
                    label="PASSWORD"
                    iconSource={require(`../../Assets/icon/password.png`)}
                    control={control}
                    errors={errors}
                    rules={{required: true}}
                    fieldName="password"
                    secure
                  />
                  <CtaButton title="Continue" primary onPress={handleSubmit(onSubmit)} />
                </View>
                <TouchableOpacity
                  onPress={() => navigation.navigate('LOGIN')}
                  style={{marginTop: 10, marginBottom: 5}}
                  underlayColor="gray"
                  activeOpacity={0.8}>
                  <Text style={{textAlign: 'center', color: '#000', fontSize: 16}}>
                    Already have an account - <Text style={{color: '#4193F7', fontWeight: 'bold', fontSize: 16}}>Sign In</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </LoadingView>
          </ImageBackground>
        </ScrollView>
      </View>
    </View>
  );
};
export default CustomersignUp;
const styles = StyleSheet.create({
  inputs_container: {
    width: '96%',
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 3.5,
    borderRadius: 15,
    elevation: 5,
    paddingVertical: 16,
  },
});
