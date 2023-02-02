import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, Text, View, Image, StatusBar, TouchableOpacity, TextInput, Button, FlatList, ImageBackground } from 'react-native';

import { Header, Icon, Avatar } from 'react-native-elements';
import Colors from '../../Constants/Colors';
import CheckBox from 'react-native-check-box'
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { BookingContext, calculateTotalPriceNew } from '../Providers/BookingProvider';
import { Alert } from 'react-native';
import { useConfirmSetupIntent, useStripe } from '@stripe/stripe-react-native';
import LoadingView from '../Components/LoadingView';
import { requestOneTimePayment, requestBillingAgreement } from 'react-native-paypal';
import { bookingType, changeStack, navigate, ON_DEMAND, SCHEDULED, type, WASHER } from '../Navigation/NavigationService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import { CheckBox } from 'react-native-elements'

const PAYMENT_METHOD = { PAY_WITH_PAYPAL: 1, PAY_WITH_STRIPE: 2, NONE_CHOOSEN: 3 }

const BookingReview = () => {
    const navigation = useNavigation()
    const [couponCode, setCouponCode] = useState('')
    const { currentBooking, applyCoupon, customer_id, saveBooking, getPaymentIntent, setCurrentBooking, getExtraTimeFee, getServiceFee } = useContext(BookingContext)
    const [loading, setLoading] = useState(false)
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [clientSecret, setClientSecret] = useState()
    const [paidWith, setPaidWith] = useState(PAYMENT_METHOD.NONE_CHOOSEN)
    const [extraTimeFee, setExtraTimeFee] = useState('Loading...')
    const [serviceFee, setServiceFee] = useState('Loading...')
    const [discountRate, setDiscountRate] = useState(0)
    const [pendingCoupon, setPendingCoupon] = useState()
    const [localbooking, setLocalbooking] = useState()
    console.log("localbooking...",localbooking);
    const [bookingTotal, setBookingTotal] = useState(0)
    const [coupencodeapply, setCouponCodeApply] = useState(0)

    useEffect(() => {

        AsyncStorage.getItem('pending_coupon').then(result => {

            let coupon = JSON.parse(result)
            if (!coupon) return
            setDiscountRate(parseFloat(coupon?.discount_amount) / 100)
            setPendingCoupon(coupon)
            setCouponCode(coupon.id)
            console.log('coupon1..', coupon)

        })

        AsyncStorage.getItem('currenctAction').then((result) => {
            if (JSON.parse(result) == "ON_DEMAND") {
                AsyncStorage.getItem('multipledatastore').then(result => {
                    let storedata = JSON.parse(result) || []
                    setLocalbooking(storedata);
                    let total = 0;
                    let coupen = 0;
                    storedata.some((data, i) => {
                        total += Number(data.price) + Number(data.serviceFee) + Number(data.extraTimeFee)
                        coupen += Number(data.price)
                        let addonPrice = 0;
                        if(data.selectedAddOns && Array.isArray(data.selectedAddOns)) {
                            console.log("data.selectedAddOns", data.selectedAddOns);
                            addonPrice = data.selectedAddOns.reduce((prevAddonValue, currentAddonValue)=>{
                                return parseFloat(prevAddonValue) + parseFloat(currentAddonValue.add_ons_price);
                              }, 0)
                              console.log("addonPrice", addonPrice);
                        }
                        total += addonPrice;
                    })

                    setBookingTotal(total);
                    setCouponCodeApply(coupen);
                    console.log('....ondemand10', data.price)

                    setCurrentBooking(cv => ({ ...cv, total: calculateTotalPriceNew(storedata, discountRate) }))
                    getExtraTimeFee(setExtraTimeFee)
                    getServiceFee(setServiceFee)
                })
            }
            else {
                AsyncStorage.getItem('multipledatastoreschedule').then(result => {
                    let storedata = JSON.parse(result) || []
                    setLocalbooking(storedata);
                    let total = 0;
                    storedata.some((data, i) => {
                        total += Number(data.price) + Number(data.serviceFee) + Number(data.extraTimeFee)
                        let addonPrice = 0;
                        if(data.selectedAddOns && Array.isArray(data.selectedAddOns)) {
                            console.log("data.selectedAddOns", data.selectedAddOns);
                            addonPrice = data.selectedAddOns.reduce((prevAddonValue, currentAddonValue)=>{
                                return parseFloat(prevAddonValue) + parseFloat(currentAddonValue.add_ons_price);
                              }, 0)
                              console.log("addonPrice", addonPrice);
                        }
                        total += addonPrice;
                    })
                    setCurrentBooking(cv => ({ ...cv, total: total }))
                    setBookingTotal(total);
                    console.log('....schedule', result)
                    setCurrentBooking(cv => ({ ...cv, total: calculateTotalPriceNew(storedata, discountRate) }))
                    getExtraTimeFee(setExtraTimeFee)
                    getServiceFee(setServiceFee)
                })
            }
        })
    }, []);

    const fetchPaymentSheetParams = async () => {
        setLoading(true)
        let json = await getPaymentIntent(Math.round((calculateTotalPriceNew(localbooking, discountRate) * 100) * 100) / 100)
        console.log('fetchPaymentSheetParams',json);
        setLoading(false)
        if (json) return json
    };

    const onReviewConfirm = async () => {  
        if (paidWith == PAYMENT_METHOD.NONE_CHOOSEN) return Alert.alert("Payment", "Please choose a payment method.")
        
        paidWith == PAYMENT_METHOD.PAY_WITH_STRIPE ? await openPaymentSheet() : await payViaPayPal()
        AsyncStorage.removeItem('multipledatastore')
    }

    const initializePaymentSheet = async () => {
        const {
            paymentIntent,
            ephemeralKey,
            customer,
        } = await fetchPaymentSheetParams();

        const { error } = await initPaymentSheet({
            customerId: customer,
            customerEphemeralKeySecret: ephemeralKey,
            paymentIntentClientSecret: paymentIntent,
        });
        console.log(customer)
        setClientSecret(paymentIntent)
        if (!error) {
            console.log(paymentIntent)
          }
    return;
    };

 
    const openPaymentSheet = async () => {
        const clientSecret = await initializePaymentSheet()
        await new Promise((resolve) => setTimeout(resolve,2500));
        const { error } = await presentPaymentSheet({ clientSecret });

        if (error) {
            Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
            onPaymentSuccess()
            AsyncStorage.removeItem('multipledatastore');

            AsyncStorage.removeItem('multipledatastoreschedule')

            AsyncStorage.removeItem('current_vendor')
        }
    };

    const onPaymentSuccess = async () => {
        setLoading(true)
        // Alert.alert('hdf')
        if (pendingCoupon) await onApplyCoupon()
        let json = await saveBooking()
        setLoading(false)
        console.log(JSON.stringify(currentBooking, null, 2))
        console.log('Booking review > . > . >', json)
        if (json) {
            AsyncStorage.removeItem('pending_coupon')
            changeStack('CustomerHomeStack')
            console.log('SAVE BOOKING RESPONSE =>', json)
            AsyncStorage.getItem('currenctAction').then((result) => {
                let res = JSON.parse(result);

                if (res == "SCHEDULED") return Alert.alert("Congrats!", "Your wash appointment has been booked, you will receive a notification once the washer has confirmed. Thank you for your business.")
                // if(bookingType.current==ON_DEMAND) return setTimeout(()=>navigate('NearByWasher', { booking_id: json.booking_id }),1000)
                if (res == "ON_DEMAND") return Alert.alert("Congrats!", "Your wash appointment has been booked, you will receive a notification once the washer has confirmed. Thank you for your business."), setTimeout(() => navigate('Near By Washers', { booking_id: json.booking_id }), 1000)
            })
            // if(bookingType.current==ON_DEMAND)
            // {
            // return Alert.alert("Congrats!", "Your wash appointment has been booked, you will receive a notification once the washer has confirmed. Thank you for your business.",setTimeout(()=>navigate('Near By Washers', { booking_id: json.booking_id }),1000));
            // } 
        }
    };

    const onApplyCoupon = async () => {
        if (couponCode.length == 0) return Alert.alert('Error', 'Please insert a coupon code first.')
        setLoading(true)
        let json = await applyCoupon({ coupan_code: couponCode, type: pendingCoupon ? undefined : 'apply-coupon' })
        console.log('JSON >>> ', json)
        if (json) {
            if (!pendingCoupon) Alert.alert('Success', `A discount of ${json.data.amount}% is added to your total payment.`)
            setDiscountRate(parseFloat(json.data.amount) / 100)
            setCurrentBooking(cv => ({ ...cv, coupan_code: couponCode }))
            console.log("totalbooking", bookingTotal, coupencodeapply, discountRate)
            setBookingTotal(bookingTotal - (coupencodeapply * json.data.amount / 100))
        }
        setLoading(false)
    }

    const payViaPayPal = async () => {
        setLoading(true)
        try {
            const res = await fetch('https://suds-2-u.com/BraintreePayments/main.php')
            let token = await res.text()
            console.log("Paypal client token", token)
            // For one time payments
            const value = await requestOneTimePayment(token,
                {
                    amount: calculateTotalPriceNew(localbooking, discountRate) + '', // required
                    currency: 'USD',
                    localeCode: 'en_US',
                    shippingAddressRequired: false,
                    userAction: 'commit', // display 'Pay Now' on the PayPal review page
                    intent: 'authorize',      // one of 'authorize', 'sale', 'order'. defaults to 'authorize'. see details here: https://developer.paypal.com/docs/api/payments/v1/#payment-create-request-body
                }
            )

            onPaymentSuccess()
            console.log(value)
        } catch (error) {
            Alert.alert("Error", "Something went wrong")
        } finally { setLoading(false) }
    }

    const onCancel = () => {
        console.log("bro code")
        changeStack('CustomerHomeStack')
        AsyncStorage.removeItem('multipledatastore')
    }

    const getdata = async () => {
        const result = await AsyncStorage.getItem('multipledatastore');
        console.log('multipledatastore..', result)
        return (<Divider />)
    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#004b00', }}>
            <ImageBackground style={{ width: '100%', height: '100%', flex: 1, }} source={require('../../Assets/bg_img.png')}>
                <LoadingView loading={loading}>
                    <ScrollView>
                        <View style={{ alignItems: 'center', width: '100%', padding: 21, paddingBottom: 81 }}>
                            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', }}>
                                <Text style={{ color: '#fff', fontSize: 16 }}>Wash Location</Text>
                                <Text onPress={() => navigation.navigate('OnDemandChangeLocation', { changeLocation: true })} style={{ alignItems: 'flex-end', color: '#e28c39', fontWeight: '500', fontSize: 16 }}>Change</Text>
                            </View>
                            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginTop: 7 }}>
                                <Text style={{ color: '#fff', fontSize: 16 }}>{currentBooking?.wash_location}</Text>
                            </View>
                            <Divider />

                            {localbooking?.map(data =>
                                <>
                                    {/* <Detail name={data.vehiclename + (data.name ? ' | ' + data.name : 0)} detail={'$' + parseFloat(data.price).toFixed(2)} /> */}

                                    <Detail name={data.vehiclename} detail={'$' + parseFloat(data.price).toFixed(2)} />
                                    
                                    {data.selectedAddOns?.map(data=> <Detail name={data.add_ons_name} key={data.id} detail={'$' + parseFloat(data.add_ons_price).toFixed(2)}/>)}

                                    <Detail name="Service" detail={typeof data.serviceFee == 'number' ? '$' + data.serviceFee.toFixed(2) : data.serviceFee} />

                                    <Detail name="Extra Minutes" detail={typeof data.extraTimeFee == 'number' ? '$' + data.extraTimeFee.toFixed(2) : data.extraTimeFee} />
                                    <Divider />
                                </>
                            )}


                            {discountRate != 0 && <Divider />}

                            {discountRate != 0 &&
                                <Detail
                                    name="Coupon discount"
                                    detail={
                                        (discountRate * 100) +
                                        "% | " +
                                        "-$" +
                                        (
                                            coupencodeapply
                                            *
                                            discountRate

                                        ).toFixed(2)
                                    } />
                            }

                            {/* <Detail name="Total" detail={'$' + calculateTotalPrice(currentBooking, [extraTimeFee, serviceFee], discountRate).toFixed(2)} /> */
                            }
                            <Detail name="Total" detail={'$' + bookingTotal.toFixed(2)} />

                            {discountRate == 0 && <Divider />}
                            {discountRate == 0 && <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginTop: 7 }}>
                                <TextInput
                                    style={[styles.auth_textInput,]}
                                    onChangeText={setCouponCode}
                                    value={couponCode}
                                    placeholder="Enter Coupon Code"
                                    placeholderTextColor={Colors.text_color}
                                    autoCapitalize='none' />
                                <TouchableOpacity onPress={onApplyCoupon} style={styles.add_btn}>
                                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>APPLY</Text>
                                </TouchableOpacity>
                            </View>}

                            <View style={{ width: '100%', height: 0.5, backgroundColor: '#aaa', marginVertical: 10 }} />
                            <TouchableOpacity onPress={() => setPaidWith(PAYMENT_METHOD.PAY_WITH_PAYPAL)} style={styles.payment_btn}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <View style={{ flexDirection: 'row', }}>
                                        <Image style={{ width: 35, height: 35, tintColor: Colors.blue_color, marginLeft: 15 }} source={require('../../Assets/icon/paypal-logo.png')} />
                                        <Text style={{ textAlign: 'center', fontWeight: 'bold', marginTop: 5, marginLeft: 5, fontSize: 16 }}>Pay via PayPal</Text>
                                    </View>
                                    <CheckBox
                                        style={{ padding: 10 }}
                                        onClick={() => setPaidWith(PAYMENT_METHOD.PAY_WITH_PAYPAL)}
                                        isChecked={PAYMENT_METHOD.PAY_WITH_PAYPAL == paidWith}
                                        checkedImage={<Image source={require('../../Assets/icon/checked.png')} style={{ width: 22, height: 22 }} />}
                                        unCheckedImage={<Image source={require('../../Assets/icon/unchecked.png')} style={{ width: 22, height: 22 }} />}
                                    />
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => setPaidWith(PAYMENT_METHOD.PAY_WITH_STRIPE)} style={styles.payment_btn}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <View style={{ flexDirection: 'row', }}>
                                        <Image style={{ width: 35, height: 35, tintColor: Colors.blue_color, marginLeft: 15 }} source={require('../../Assets/icon/credit-card.png')} />
                                        <Text style={{ textAlign: 'center', fontWeight: 'bold', marginTop: 5, marginLeft: 5, fontSize: 16 }}>Credit/Debit Card</Text>
                                    </View>
                                    <CheckBox
                                        style={{ padding: 10 }}
                                        onClick={() => setPaidWith(PAYMENT_METHOD.PAY_WITH_STRIPE)}
                                        isChecked={PAYMENT_METHOD.PAY_WITH_STRIPE == paidWith}
                                        checkedImage={<Image source={require('../../Assets/icon/checked.png')} style={{ width: 22, height: 22 }} />}
                                        unCheckedImage={<Image source={require('../../Assets/icon/unchecked.png')} style={{ width: 22, height: 22 }} />}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </LoadingView>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 'auto' }}>
                    <TouchableOpacity
                        elevation={5}
                        onPress={onReviewConfirm}
                        // onPress={() => { navigation.navigate('Booking Confirm'); }}
                        style={styles.auth_btn}
                        underlayColor='gray'
                        activeOpacity={0.8}>
                        <Text style={{ fontSize: 16, textAlign: 'center', color: Colors.buton_label, fontWeight: 'bold', opacity: paidWith == PAYMENT_METHOD.NONE_CHOOSEN ? 0.7 : 1 }}>REVIEW & CONFIRM</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        elevation={5}
                        onPress={onCancel}
                        style={[styles.auth_btn, { backgroundColor: Colors.blue_color }]}
                        underlayColor='gray'
                        activeOpacity={0.8}>
                        <Text style={{ fontSize: 16, textAlign: 'center', color: Colors.buton_label, fontWeight: 'bold', opacity: paidWith == PAYMENT_METHOD.NONE_CHOOSEN ? 0.7 : 1 }}>CANCEL</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
}

export default BookingReview

const Divider = () => <View style={{ width: '100%', height: 0.5, backgroundColor: '#aaa', marginVertical: 7 }} />

const Detail = ({ name, detail, higlightDetail }) => (
    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginTop: 7 }}>
        <Text numberOfLines={1} style={{ color: '#fff', fontSize: 16, flex: 1 }}>{name}</Text>
        <Text style={{ alignItems: 'flex-end', color: higlightDetail ? Colors.blue_color : '#fff' }}>{detail}</Text>
    </View>
)
const styles = StyleSheet.create({
    auth_textInput: {

        alignSelf: 'center',
        width: '60%',
        // borderWidth: 1,
        borderBottomWidth: 0,
        height: 40, fontSize: 16,
        color: Colors.text_color,
        marginTop: 5,
        backgroundColor: '#fff', padding: 5, borderRadius: 5

    },
    auth_btn: {

        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#e28c39',
        flex: 1,
        height: 60,
        justifyContent: 'center',
    },
    payment_btn: {
        marginTop: 7,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        width: '100%',
        height: 50,
        justifyContent: 'center',
    },
    add_btn: {

        backgroundColor: Colors.blue_color,
        alignItems: 'center',
        width: '33%',
        height: 40, marginTop: 5,
        justifyContent: 'center', borderRadius: 5
    },
})