import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Image, StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView,Alert } from 'react-native';
import Colors from '../../Constants/Colors';
import LoadingView from '../Components/LoadingView';
import { changeStack, dontShow, setTrue } from '../Navigation/NavigationService';
import { BookingContext } from '../Providers/BookingProvider';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const JobFinished = ({ route, navigation }) => {
  const { finishedjob,setRunningBooking } = useContext(BookingContext)
  const [loading, setLoading] = useState(false);
  const booking = useMemo(() => route.params?.booking, [route])
  const [images, setImages] = useState([])

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async data => {
    // console.log("onsubmit working", onSubmit);
    const params={};
    console.log("image", images);
    images.forEach((image, i)=>params['image'+(i===0?'' : i)]=image)
    params["comment"]="Done"
    console.log(data.comment,"comment");
    // console.log({ ...data, booking_id: booking.booking_id })
    if(images.length<4) return Alert.alert('Images', 'Please make sure to add 4 images related to that wash.')
    setLoading(true);
    console.log("camera pram", data);
    let json = await finishedjob({ ...params, booking_id: booking.booking_id,  })
    console.log('finishedjob',json);
    setLoading(false)
    if (json) {
      setTrue()
      setRunningBooking(undefined)
      changeStack('DriverHomeStack')
    }
  }

  useEffect(() => console.log(images.length), [images])

  const onImagePickerCallback = (res, fromCamera) => {
console.log('onImagePickerCallback',res, images);

    if (res.didCancel) return
    // if(images.length<3) fromCamera ? launchCamera({}, (res)=>onImagePickerCallback(res, true)) : launchImageLibrary({}, (res)=>onImagePickerCallback(res, false))
    setImages(cv => [...cv, ...res.assets])
  }

  return (
    <LoadingView loading={loading} containerStyle={{ height: '100%', backgroundColor: 'white' }}>
      <ScrollView style={{ height: '100%' }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.headerText}>Upload car wash images to share with our customer</Text>
          <View style={styles.imageContainer}>
            <Image style={{ width: 85, height: 85, tintColor: 'white' }} source={require('../../Assets/icon/camera.png')} />
          </View>
          <Text style={{ fontSize: 28, paddingBottom: 20, color: '#666' }}>Upload car images</Text>
          {images.length < 4 ?
            <Text style={{ textAlign: 'center', fontSize: 17, width: '65%', lineHeight: 32, color: '#666' }}>
              Please upload <Text style={{ color: 'green', fontWeight: 'bold', fontSize: 22 }}>{images.length == 0 ? '4' : 4 - images.length + ' more'}</Text> images of the car wash related to service.
          </Text>
            :
            <Text style={{ textAlign: 'center', fontSize: 17, width: '65%', lineHeight: 32, color: '#666' }}>{images.length} Photos Selected!</Text>
          }
          <View style={{ flexDirection: 'row', width: '100%', padding: 16 }}>
            <CustomButton disabled={images.length >= 4} onPress={() => launchCamera({
              maxWidth: 600,
            maxHeight: 600,
            videoQuality: "low"
            }, (res)=>onImagePickerCallback(res, true))} title="Camera" color={Colors.blue_color} />
            <View style={{ width: 16 }} />
            <CustomButton disabled={images.length >= 4} onPress={() => launchImageLibrary({
              maxWidth: 600,
            maxHeight: 600,
            videoQuality: "low"
            }, (res)=>onImagePickerCallback(res, false))} title="Gallery" color={Colors.dark_orange} />
          </View>
          <View style={{ width: '100%', paddingHorizontal: 16 }}>

            <Controller control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={{ height: 200, flexDirection: 'row' }}>
                  <TextInput
                    style={styles.textArea}
                    placeholder="Add comment"
                    onBlur={onBlur}
                    onChangeText={value => onChange(value)}
                    value={value}
                    placeholderTextColor="#999"
                  />
                </View>
              )}
              name={'comment'}
              rules={{ required: true }}
              defaultValue=""
            />
            <Error error={errors.comment} label={'Comment'} />
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity onPress={handleSubmit(onSubmit)} style={{ padding: 20, backgroundColor: Colors.dark_orange, width: '100%', alignItems: 'center' }}>
        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>JOB FINISHED</Text>
      </TouchableOpacity>
    </LoadingView>
  );
};

export default JobFinished;

const CustomButton = ({ title, color, onPress, disabled }) => (
  <TouchableOpacity disabled={disabled} onPress={onPress} style={{ padding: 16, backgroundColor: color, flex: 1, borderRadius: 10, alignItems: 'center', opacity: disabled ? 0.5 : 1 }}>
    <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{title}</Text>
  </TouchableOpacity>
);

const wait = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 2000)
  })
}

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
  headerText: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    lineHeight: 24,
    color: 'white',
    backgroundColor: Colors.dark_orange,
    fontSize: 18,
    textAlign: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 3.5,
    elevation: 15,
  },
  imageContainer: {
    alignSelf: 'center',
    marginTop: 75,
    marginBottom: 25,
    borderRadius: 100,
    width: 130,
    height: 130,
    backgroundColor: Colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textArea: {
    flex: 1,
    backgroundColor: '#eee',
    width: '100%',
    marginBottom: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    textAlignVertical: 'top',
    paddingHorizontal: 16,
    fontSize: 16,
    color : 'black'
  },
});
