import React, { useContext, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';

import Colors from '../../Constants/Colors';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { TextInput } from 'react-native';
import { Modal } from 'react-native';
import DatePicker from 'react-native-date-picker'
import moment from 'moment'
import { Alert } from 'react-native';
import { AuthContext } from '../Providers/AuthProvider';
import ListEmpty from '../Components/ListEmpty';
import { ActivityIndicator } from 'react-native';
import { ERROR, LOADING } from '../Providers';


const BackgroundCheck = ({ navigation, route }) => {

  const authStack = useMemo(() => true||route.params?.authStack)

  const [state, setState] = useState(null)

  const [dob, setDob] = useState()
  const [datePickerVisible, setDatePickerVisibility] = useState(false)

  const { submitBackgroundCheckData, getBackgroundData } = useContext(AuthContext)

  const { control, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = (data) => {
    if (!dob) return Alert.alert('Date of birth', 'Please insert your date of birth', [{ text: 'Ok', onPress: () => setDatePickerVisibility(true) }])
    submitBackgroundCheckData({ ...data, dob: moment(dob).format('YYYY-MM-DD') }, () => navigation.goBack())
  }

  useEffect(() => authStack ? null : getBackgroundData(setState, onGetSuccess), [])

  const onGetSuccess = (data) => {
    reset(data)
    setDob(new Date(data.dob))
  }

  switch (state) {
    case ERROR:
      return <ListEmpty emptyMsg="Something went wrong. Please try again." retry={() => getBackgroundData(setState, onGetSuccess)} />
    case LOADING:
      return <ActivityIndicator color={Colors.blue_color} size="large" style={{ justifyContent: 'flex-start', padding: 50 }} />
    default:
      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.blue_color }}>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1, padding: 20, backgroundColor: '#f5f5f5' }}>
            {datePickerVisible && <DateModal value={dob} confirm={setDob} dismiss={() => setDatePickerVisibility(false)} />}
            <View style={styles.section}>
              <Text style={styles.label}>First Name</Text>
              <Controller control={control} rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    onBlur={onBlur}
                    placeholderTextColor={'#999'}
                    style={styles.textInput}
                    placeholder="John"
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="first_name"
                defaultValue=""
                rules={{ required: true }}
              />
              <Error error={errors.first_name} fieldName="First Name" max={365} />
            </View>
            <View style={styles.section}>
              <Text style={styles.label}>Middle Name</Text>
              <Controller control={control} rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    onBlur={onBlur}
                    placeholderTextColor={'#999'}
                    style={styles.textInput}
                    placeholder="Stone"
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="middle_name"
                defaultValue=""
                rules={{ required: true }}
              />
              <Error error={errors.middle_name} fieldName="Middle Name" max={365} />
            </View>
            <View style={styles.section}>
              <Text style={styles.label}>Last Name</Text>
              <Controller control={control} rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    onBlur={onBlur}
                    placeholderTextColor={'#999'}
                    style={styles.textInput}
                    placeholder="Doe"
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="last_name"
                defaultValue=""
                rules={{ required: true }}
              />
              <Error error={errors.last_name} fieldName="Last Name" max={365} />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Date of birth</Text>
              <TouchableOpacity style={[styles.textInput, { height: 46, justifyContent: 'center' }]} onPress={() => setDatePickerVisibility(true)}>
                <Text style={{ fontSize: 16, color: dob ? 'black' : '#999' }}>{dob ? dob.toDateString() : '- - - - / - - / - -'}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Social Security Number</Text>
              <Controller control={control} rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    onBlur={onBlur}
                    placeholderTextColor={'#999'}
                    style={styles.textInput}
                    placeholder="Ex. 2131564564997897"
                    onChangeText={onChange}
                    value={value}
                    keyboardType="numeric"
                  />
                )}
                name="social_security_number"
                defaultValue=""
                rules={{ required: true }}
              />
              <Error error={errors.social_security_number} fieldName="Social Security Number" max={365} />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Driver License Number</Text>
              <Controller control={control} rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    onBlur={onBlur}
                    placeholderTextColor={'#999'}
                    style={styles.textInput}
                    placeholder="Ex. 684544"
                    onChangeText={onChange}
                    value={value}
                    keyboardType="numeric"
                  />
                )}
                name="drivers_license_number"
                defaultValue=""
                rules={{ required: true }}
              />
              <Error error={errors.drivers_license_number} fieldName="Driver License Number" max={365} />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>State Issuing The License</Text>
              <Controller control={control} rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    onBlur={onBlur}
                    placeholderTextColor={'#999'}
                    style={styles.textInput}
                    placeholder="Texas"
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="state_issuing_license"
                defaultValue=""
                rules={{ required: true }}
              />
              <Error error={errors.state_issuing_license} fieldName="State Issuing The License" max={365} />
            </View>

            <View style={{ height: 1, marginHorizontal: -20, backgroundColor: 'black', marginVertical: 20, opacity: .25 }} />

            <View style={styles.section}>
              <Text style={styles.label}>Present Street Address</Text>
              <Controller control={control} rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    onBlur={onBlur}
                    placeholderTextColor={'#999'}
                    style={styles.textInput}
                    placeholder="Ex. 8454 Cedarwood Ave. Cocoa, FL 32927"
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="present_street_address"
                defaultValue=""
                rules={{ required: true }}
              />
              <Error error={errors.present_street_address} fieldName="Present Street Address" max={365} />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>City / State / Zip</Text>
              <Controller control={control} rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    onBlur={onBlur}
                    placeholderTextColor={'#999'}
                    style={styles.textInput}
                    placeholder="Ex. Dallas, Texas, 1555201"
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="city_state_zip"
                defaultValue=""
                rules={{ required: true }}
              />
              <Error error={errors.city_state_zip} fieldName="City / State / Zip" max={365} />
            </View>

          </ScrollView>
          <TouchableOpacity onPress={handleSubmit(onSubmit)} style={{ marginTop: 'auto', backgroundColor: Colors.blue_color, padding: 20, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontWeight: 'bold', marginTop: 'auto', color: 'white', fontSize: 16 }} >SUBMIT</Text>
          </TouchableOpacity>
        </SafeAreaView>
      );
  }
};

export default BackgroundCheck;

const Error = ({ error, fieldName, max }) => {
  if (!error) return null
  const errorMessage = useMemo(() => {
    switch (error.type) {
      case 'pattern': return `Please insert a valid ${fieldName}.`
      case 'max': return `${max} is the maximum value for ${fieldName}`
      default: return `${fieldName} is required.`
    }
  }, [])
  return (
    <Text style={{ color: 'red', paddingBottom: 10, opacity: 0.5 }} >{errorMessage}</Text>
  )

}


const styles = StyleSheet.create({
  label: {
    // fontFamily: 'Montserrat-Bold',
    // fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    paddingBottom: 8,
    opacity: .50,
    letterSpacing: 1
  },
  section: {
    marginBottom: 10
  },
  textInput: {
    backgroundColor: 'white', 
    marginBottom: 10, 
    borderRadius: 10, 
    elevation: 5, 
    shadowColor: Colors.primary, 
    paddingHorizontal: 15, 
    // fontFamily: 'Montserrat-Regular', 
    color: 'black',
    height: 50
  }
})



const DateModal = ({ dismiss, confirm, value, initialDate }) => {
  const [date, setDate] = useState(value || initialDate || new Date())

  const onConfirm = () => {
    confirm(date)
    dismiss()
  }
  return (
    <View >
      <Modal
        transparent={true}
        hardwareAccelerated
        statusBarTranslucent
        animationType="fade">
        <TouchableOpacity activeOpacity={1} onPress={dismiss} style={{ flex: 1, backgroundColor: "#00000080", alignItems: 'center', justifyContent: 'center' }} >
          <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', borderRadius: 15, padding: 10, position: 'absolute' }}>
            <DatePicker
              androidVariant="nativeAndroid"
              mode="date"
              date={date}
              onDateChange={setDate}
              style={{ width: 250 }}
            />
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={dismiss} style={{ padding: 10, borderRadius: 5, flex: 1, borderWidth: 2, borderColor: Colors.privacypolicy_headingcolor + '50' }}>
                <Text style={{ 
                  // fontFamily: 'Montserrat-SemiBold', 
                  textAlign: 'center' }}>Cancel</Text>
              </TouchableOpacity>
              <View style={{ width: 10 }} />
              <TouchableOpacity onPress={onConfirm} style={{ backgroundColor: Colors.blue_color, padding: 10, borderRadius: 5, flex: 1 }}>
                <Text style={{ 
                  // fontFamily: 'Montserrat-SemiBold', 
                  textAlign: 'center', 
                  color: 'white' }}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}
