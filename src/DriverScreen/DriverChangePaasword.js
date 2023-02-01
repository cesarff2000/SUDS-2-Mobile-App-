import React, {useContext, useState} from 'react';
import {StyleSheet, View, Image, ImageBackground, Alert, KeyboardAvoidingView} from 'react-native';
import CustomInput from '../Components/CustomInput';
import CtaButton from '../Components/CtaButton';
import LoadingView from '../Components/LoadingView';
import ControllerInput from '../Components/ControllerInput';
import {useForm} from 'react-hook-form';
import {AuthContext} from '../Providers/AuthProvider';
import { ScrollView } from 'react-native';
import { changeStack, type, WASHER } from '../Navigation/NavigationService';

const DriverChangePassword = () => {
  const {changePassword} = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm();

  const onSubmit = async data => {
    if (data.confirm_password != data.newpassword) return Alert.alert('Confirm password', "Your password doesn't match confirmation");
    console.log(data)
    setLoading(true);
    let success = await changePassword(data);
    setLoading(false);
    if(success) {
      Alert.alert('Success', 'Password changed successfully.', [{text :'Ok', onPress:()=>changeStack(type.current==WASHER ? 'DriverHomeStack' : 'CustomerHomeStack')}])
      reset()
    }
  };

  return (
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{flexGrow : 1, backgroundColor : 'white'}}>
        <ImageBackground
          style={{width: '100%', height: '100%', flex: 1, justifyContent: 'space-evenly', paddingTop : 20}}
          source={require('../../Assets/imageBG.png')}>
          <LoadingView loading={loading}>
            <Image style={{width: 200, height: 200, tintColor: '#fff', alignSelf: 'center', marginBottom:50}} source={require('../../Assets/padlock.png')} />
            <View style={{justifyContent: 'flex-end', padding: 21, alignItems: 'center'}}>
              <View style={styles.inputs_container}>
                <ControllerInput
                  label="OLD PASSWORD"
                  iconSource={require(`../../Assets/icon/password.png`)}
                  control={control}
                  errors={errors}
                  rules={{required: true}}
                  fieldName="old_password"
                  secure
                />
                <ControllerInput
                  label="NEW PASSWORD"
                  iconSource={require(`../../Assets/icon/password.png`)}
                  control={control}
                  errors={errors}
                  rules={{required: true}}
                  fieldName="newpassword"
                  secure
                />
                <ControllerInput
                  label="CONFIRM PASSWORD"
                  iconSource={require(`../../Assets/icon/password.png`)}
                  control={control}
                  errors={errors}
                  fieldName="confirm_password"
                  secure
                />
                <CtaButton title="Submit" primary onPress={handleSubmit(onSubmit)} />
              </View>
            </View>
          </LoadingView>
        </ImageBackground>
      </ScrollView>
  );
};
export default DriverChangePassword;
const styles = StyleSheet.create({
  inputs_container: {
    width: '90%',
    paddingVertical: 16,
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 3.5,
    elevation: 5,
    borderRadius: 15,
  },
});
