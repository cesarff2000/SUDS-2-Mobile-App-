import React, {useMemo} from 'react';
import {Controller} from 'react-hook-form';
import {StyleSheet, Text, View, Image, TextInput} from 'react-native';
import Colors from '../../Constants/Colors';

const ControllerInput = ({
  label,
  iconSource,
  control,
  placeholder,
  secure,
  fieldName,
  rules,
  errors,
  keyboardType,
  curved,
  containerStyle,
  defaultValue,
}) => {
  return (
    <View style={containerStyle}>
      {label && <Text style={styles.input_label}>{label}</Text>}

      <Controller
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <View style={{width: '95%', flexDirection: 'row'}}>
            <TextInput
              style={[curved ? curvedStyles.auth_textInput : styles.auth_textInput]}
              placeholder={placeholder}
              onBlur={onBlur}
              onChangeText={value => onChange(value)}
              value={value}
              placeholderTextColor={curved ? Colors.text_color : Colors.dark_gray}
              autoCapitalize="none"
              placeholder={placeholder}
              keyboardType={keyboardType}
              secureTextEntry={secure}
              defaultValue={defaultValue}
            />
            {iconSource && <Image source={iconSource} style={styles.input_icon} />}
          </View>
        )}
        name={fieldName}
        rules={rules}
        defaultValue=""
      />
      <Error error={errors[fieldName]} label={label ? label : placeholder} />
    </View>
  );
};

export default ControllerInput;

const Error = ({error, label}) => {
  if (!error) return null;
  const capitalizeFistLetter = string => string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  const errorText = useMemo(() => {
    if (error.type == 'pattern') return `Please enter a valid ${label.toLowerCase()}`;
    if (error.type == 'required') return `${capitalizeFistLetter(label)} is required`;
  }, [error]);
  return <Text style={{color: 'red'}}>{errorText}</Text>;
};

const styles = StyleSheet.create({
  auth_textInput: {
    alignSelf: 'center',
    width: '93%',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    height: 40,
    color: Colors.text_color,
    padding: 0,
    marginTop: 1,
    fontSize: 18,
    marginBottom: 3,
  },

  input_label: {
    color: '#999',
    textAlign: 'left',
    width: '100%',
    marginTop: 4,
    marginBottom: -8,
  },

  input_icon: {
    width: 21,
    height: 21,
    alignSelf: 'center',
    marginLeft: -22,
    tintColor: '#999',
  },
});

const curvedStyles = StyleSheet.create({
  auth_textInput: {
    alignSelf: 'center',
    width: '105%',
    fontSize: 16,
    borderBottomWidth: 0,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 45,
    color: '#000',
    marginTop: 8,
    fontWeight: 'bold',
  },
});
