import React, {useContext, useState} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, ImageBackground, KeyboardAvoidingView} from 'react-native';

import {ScrollView} from 'react-native';
import CtaButton from '../Components/CtaButton';
import ControllerInput from '../Components/ControllerInput';
import {useForm} from 'react-hook-form';
import {getCurrentPosition} from '../Services/LocationServices';
import {AuthContext} from '../Providers/AuthProvider';
import LoadingView from '../Components/LoadingView';
import { type, WASHER } from '../Navigation/NavigationService';
const SignUp = ({navigation}) => {
  const {signUp,customerSignUp} = useContext(AuthContext);
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
    console.log(data)
    const {latitude, longitude} = (await getCurrentPosition()).coords;
    if (latitude && longitude) {
      let dataForOtpScreen =  type.current==WASHER ? await signUp({latitude, longitude, ...data}) :  await customerSignUp({latitude, longitude, ...data}) 
      if (dataForOtpScreen) navigation.navigate('ENTER OTP', dataForOtpScreen);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
      }}>
         <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex: 1}}>
        <ScrollView keyboardShouldPersistTaps='handled'>
          <ImageBackground style={{width: '100%', height: '100%', flex: 1}} fadeDuration={0} source={require('../../Assets/imageBG.png')}>
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
                    rules={{
                      required: true, 
                      // pattern: (/^(91)?(\d{3})(\d{3})(\d{4})$/)
                      pattern: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
                    }}
                    fieldName="mobile"
                    keyboardType="phone-pad"
                  />
                  {/* <ControllerInput
                    label="COUNTRY CODE"
                    iconSource={require(`../../Assets/icon/flag.png`)}
                    control={control}
                    errors={errors}
                    rules={{
                      required: true, 
                      pattern: /^([0-9]{1,3})$/
                    }}
                    fieldName="country_code"
                    keyboardType="phone-pad"
                  /> */}
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
export default SignUp;
const styles = StyleSheet.create({
  inputs_container: {
    width: '96%',
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 3.5,
    borderRadius: 15,
    elevation: 5,
    paddingVertical: 16,
  },
});
