import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { View, ImageBackground, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Colors from '../../Constants/Colors';
import ControllerInput from '../Components/ControllerInput';
import CtaButton from '../Components/CtaButton';
import CustomPicker from '../Components/CustomPicker';
import LoadingView from '../Components/LoadingView';
import { AuthContext } from '../Providers/AuthProvider';
import { launchImageLibrary } from 'react-native-image-picker';
import { partialProfileUrl } from '../Providers';
import { CheckBox } from 'react-native-elements';
import { Text } from 'react-native';

const EditProfile = ({ navigation, route }) => {
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm();
  const { completeProfile, getStates, getCities, getUserDetails } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [selectedImage, setSelectedImage] = useState()
  const [methodOfContact, setMethodOfContact] = useState('Phone')

  useEffect(() => {
    setFetching(true);
    getUserDetails()
      .then(json => {
        if (json) {
          const { data } = json;
          if (data.image) setSelectedImage({ uri: partialProfileUrl + data.image })
          reset({
            ...data,
            // country: { name: data.country_name, id: data.country },
            state: data.state_name ? { name: data.state_name, id: data.state } : undefined,
            city: data.city_name ? { name: data.city_name, id: data.city } : undefined,
            phone_number: data.mobile,
          });
          setMethodOfContact(data.preferred_method_of_contact)
        }
      })
      .finally(() => setFetching(false));
  }, []);

  const getStateList = async () => {
    return (await getStates(231));
  };

  const getCityList = async () => {
    const selectedStateId = getValues('state')?.id;
    if (selectedStateId) return await getCities(selectedStateId);
    else Alert.alert('Select state', 'Please select a state first');
  };

  const onSubmit = async data => {
    setLoading(true);
    let success = await completeProfile({ ...data, country: 231, state: data.state.id, city: data.city.id, image: selectedImage, preferred_method_of_contact: methodOfContact }, route.params?.authStack);
    setLoading(false);
    if (success) navigation.goBack();
  };

  const imageSelectCallBack = (res) => {
    if (res.didCancel) return
    console.log(res?.assets);
    setSelectedImage(res?.assets[0])
  }

  return (
    <ImageBackground style={styles.imgBg} source={require('../../Assets/bg_img.png')}>
      <ScrollView>
        <LoadingView loading={loading} fetching={fetching}>
          <View style={styles.header}>
            <TouchableOpacity onPressIn={() => launchImageLibrary({}, imageSelectCallBack)} style={{ borderColor: 'white', borderWidth: 4, padding: selectedImage ? 0 : 25, borderRadius: 15 }}>
              <Image style={{ width: selectedImage ? 100 : 50, height: selectedImage ? 100 : 50, borderRadius: selectedImage ? 11 : 0, resizeMode: 'cover' }} source={selectedImage ? selectedImage : require('../../Assets/icon/camera.png')} />
            </TouchableOpacity>
          </View>
          <View style={styles.container}>
            <ControllerInput
              control={control}
              errors={errors}
              rules={{ required: true, pattern: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/ }}
              fieldName="mobile"
              placeholder="Phone Number"
              keyboardType="phone-pad"
              curved
            />
            <View style={{ backgroundColor: 'white', borderRadius: 26, overflow: 'hidden', marginTop: 8 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 14, color: 'black', padding: 8, backgroundColor: '#eee', paddingHorizontal: 24 }} >Preferred Method of contact</Text>
              <View style={{ flexDirection: 'row', }} >
                <CheckBox
                  center
                  title='Phone'
                  checkedIcon='dot-circle-o'
                  uncheckedIcon='circle-o'
                  onPress={() => setMethodOfContact('Phone')}
                  checked={methodOfContact == 'Phone'}
                  containerStyle={styles.checkbocContaner}

                />
                <CheckBox
                  center
                  title='Email'
                  checkedIcon='dot-circle-o'
                  uncheckedIcon='circle-o'
                  onPress={() => setMethodOfContact('Email')}
                  checked={methodOfContact == 'Email'}
                  containerStyle={styles.checkbocContaner}
                />
                <CheckBox
                  center
                  title='SMS Text'
                  checkedIcon='dot-circle-o'
                  uncheckedIcon='circle-o'
                  onPress={() => setMethodOfContact('SMS Text')}
                  checked={methodOfContact == 'SMS Text'}
                  containerStyle={styles.checkbocContaner}
                />
              </View>
            </View>
            {/* <ControllerInput
              control={control}
              errors={errors}
              rules={{ required: true }}
              fieldName="preferred_method_of_contact"
              placeholder="Preferred Method Of Contact"
              curved
            /> */}
            <ControllerInput
              control={control}
              errors={errors}
              rules={{ required: true }}
              fieldName="complete_address"
              placeholder="Complete Address"
              curved
            />
            <CustomPicker asynFunction={getStateList} fieldName="state" rules={{ required: true }} control={control} errors={errors} label="State" />
            <CustomPicker asynFunction={getCityList} fieldName="city" rules={{ required: true }} control={control} errors={errors} label="City" />

            <CtaButton
              primary
              title={'Save'}
              onPress={handleSubmit(onSubmit)}
              style={{ width: '100%', marginTop: 8 }}
            />
          </View>
          <View style={{ height: 32 }} />
        </LoadingView>
      </ScrollView>
    </ImageBackground>
  );
};

export default EditProfile;

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
  header: {
    width: '100%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.blue_color,
  },
  checkbocContaner: {
    flex: 1,
    borderWidth: 0,
    backgroundColor: 'transparent',
    margin: 0,
    padding: 0,
    paddingVertical: 15
  }
});
