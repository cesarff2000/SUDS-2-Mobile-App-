import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Image } from 'react-native';
import { Text, View, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../../Constants/Colors';
import ControllerInput from '../Components/ControllerInput';
import CtaButton from '../Components/CtaButton';
import Divider from '../Components/Divider';
import LoadingView from '../Components/LoadingView';
import Rating from '../Components/Rating';
import { BookingContext } from '../Providers/BookingProvider';

const PayPal = ({ route }) => {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const { control, handleSubmit, formState, } = useForm();

    const onSubmit = async data => {
        setLoading(true);
        console.log(data)
        setLoading(false);
    };

    return (
        <ImageBackground style={styles.imgBg} source={require('../../Assets/bg_img.png')}>
            <View style={styles.container}>
                <LoadingView loading={loading} fetching={fetching}>
                    <View style={{justifyContent : 'center', height : '100%', paddingBottom : 150}}>
                    <View style={{ width: 150, height: 150,backgroundColor: 'white', borderRadius: 120, alignSelf: 'center', padding : 20, alignItems : 'center', justifyContent : 'center' }}>
                        <Image style={{ width: 100, height: 100, tintColor: Colors.blue_color, marginHorizontal: 10 }}  resizeMode="cover" source={require('../../Assets/icon/paypal-logo.png')} />
                    </View>
                    <ControllerInput
                        control={control}
                        errors={formState.errors}
                        rules={{ required: true, pattern: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/ }}
                        fieldName="paypal_email"
                        placeholder="Enter paypal email address"
                        keyboardType="email-address"
                        curved
                    />
                    <CtaButton primary title="Save" style={{ backgroundColor: 'orange', width: '100%' }} />
                    </View>
                  
                </LoadingView>
            </View>
        </ImageBackground>
    );
};

export default PayPal;

const styles = StyleSheet.create({
    imgBg: {
        flex: 1,
    },
    container: {
        width: '100%',
        height: '100%',
        padding: 15,
    },
    text: {
        fontSize: 16,
        color: 'white',
        paddingVertical: 7,
    },
});
