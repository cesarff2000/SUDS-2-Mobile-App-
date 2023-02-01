import React, { useContext, useState } from 'react';
import { Text, View, Image, ImageBackground } from 'react-native';
import CtaButton from '../Components/CtaButton';
import InputsContainer from '../Components/InputsContainer';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../Providers/AuthProvider';
import { Alert } from 'react-native';
import LoadingView from '../Components/LoadingView';
import ControllerInput from '../Components/ControllerInput';

const ForgotPassword = ({navigation}) => {
  const [loading, setLoading] = useState()
  const { forgotPassword } = useContext(AuthContext)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ emailid }) => {
    console.log(emailid)
    setLoading(true)
    let success = await forgotPassword(emailid)
    setLoading(false)
    if (success) { 
      Alert.alert('Link sent', 'A link has been sent to your email. Please use it to create a new password.')
      navigation.goBack()
     }
  }
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
      }}>
      <LoadingView loading={loading} containerStyle={{ height: "100%" }}>
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <ImageBackground
            style={{ width: '100%', height: '100%', flex: 1, justifyContent: 'space-evenly', alignItems: 'center' }}
            source={require('../../Assets/imageBG.png')}>
            <Image style={{ width: 200, height: 200, tintColor: '#fff', alignSelf: 'center' }} source={require('../../Assets/padlock.png')} />
            <InputsContainer>
              <View style={{ width: '100%', padding: 7, alignItems: 'center', justifyContent: 'center', marginBottom: 15 }}>
                <Text style={{ fontWeight: 'bold', marginTop: 5, fontSize: 18 }}>Reset Your Password</Text>
                <Text style={{ textAlign: 'center', marginTop: 5, marginBottom: 5, color: '#999', lineHeight: 22 }}>
                  Please enter your username or email address you will receive a link to create a new password via email
                </Text>
                <View style={{ width: '94%', height: 1, backgroundColor: '#ddd', marginVertical: 5 }} />
              </View>

              <ControllerInput
                label="USER NAME or EMAIL"
                iconSource={require(`../../Assets/icon/email.png`)}
                control={control}
                errors={errors}
                rules={{ required: true, pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ }}
                fieldName="emailid"
                keyboardType="email-address"
              />
              <CtaButton onPress={handleSubmit(onSubmit)} primary title="Submit" />
            </InputsContainer>
          </ImageBackground>
        </View>
      </LoadingView>
    </View>
  );
}


export default ForgotPassword;
