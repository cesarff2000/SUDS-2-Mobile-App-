import React, {useContext, useState} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, ImageBackground} from 'react-native';

import {ScrollView,Alert} from 'react-native';
import CtaButton from '../Components/CtaButton';
import LinkButton from '../Components/LinkButton';
import InputsContainer from '../Components/InputsContainer';
import ControllerInput from '../Components/ControllerInput';
import { AuthContext } from '../Providers/AuthProvider';
import { useForm } from 'react-hook-form';
import LoadingView from '../Components/LoadingView';
import { changeStack } from '../Navigation/NavigationService';
const LoginScreen = ({navigation}) => {   
  const {login} = useContext(AuthContext);
  const [loading, setLoading] = useState(loading)

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();

  const onSubmit = async data => {
    setLoading(true)
    try {
    await login(data);
    setLoading(false)
    
  } catch (error) {
    console.log("Login Error", error)
    Alert.alert('Error', 'Something went wrong. Please try again.')
    
    setLoading(false)
    }
  };

  return (
    <View
      style={{
        flex: 1,
      }}>
      <View style={{flex: 1, backgroundColor: '#FFF'}}>
        <ImageBackground style={{width: '100%', flex: 1, height: '100%'}} fadeDuration={0} source={require('../../Assets/imageBG.png')}>
          <SafeAreaView />
          <LoadingView loading={loading}>
          <ScrollView keyboardShouldPersistTaps='handled'>
            <Image style={{width: '100%', height: 95, resizeMode: 'contain', marginTop: 30}}  fadeDuration={0} source={require('../../Assets/logo_icon.png')}></Image>
            <Image style={{width: '100%', height: 65, resizeMode: 'contain', marginTop: 5}}  fadeDuration={0} source={require('../../Assets/logo2.png')}></Image>
            <View style={{alignItems: 'center', flex: 1}}>
              <InputsContainer>
                <Text style={{fontWeight: 'bold', marginTop: 10}}>Hello</Text>
                <Text style={{padding: 5}}>Sign into your account</Text>

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
                  label="PASSWORD"
                  iconSource={require(`../../Assets/icon/password.png`)}
                  control={control}
                  errors={errors}
                  rules={{required: true}}
                  fieldName="password"
                  secure
                />

                <CtaButton title="Sign In" primary onPress={handleSubmit(onSubmit)} />
                {/* <CtaButton title="Sign In" primary onPress={()=>changeStack('CustomerHomeStack')} /> */}
                <LinkButton title="Forgot Your Password" onPress={() => navigation.navigate('FORGOT PASSWORD')} />
              </InputsContainer>
              <TouchableOpacity
                onPress={() => navigation.navigate('REGISTER')}
                style={{marginTop: 10, marginBottom: 5}}
                underlayColor="gray"
                activeOpacity={0.8}>
                <Text style={{fontSize: 14, textAlign: 'center', color: '#000', fontWeight: 'bold'}}>
                  Don't have an account <Text style={{color: '#4193F7', fontWeight: 'bold', fontSize: 16}}>Sign Up</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          </LoadingView>
        </ImageBackground>
      </View>
    </View>
  );
};

export default LoginScreen;
