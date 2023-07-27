import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { callApi, EMPTY, ERROR, LOADING } from '.';
import { changeStack, CUSTOMER, navigate, type, WASHER } from '../Navigation/NavigationService';
import messaging from '@react-native-firebase/messaging';
import { getCurrentPosition } from '../Services/LocationServices';
import { AppContext } from './AppProvider';

export const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState({});
    const [loginData, setLoginData] = useState({})
    const { setLoading } = useContext(AppContext)

    const getToken = async () => {
        // return 'random token'
        let fcmToken;
        const authStatus = await messaging().requestPermission();
        const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (enabled === true) {
          
            fcmToken = await messaging().getToken();
        }
        return fcmToken;
    }

    const updateUserLocation = async () => {
        try {
            const { latitude, longitude } = (await getCurrentPosition()).coords
            let json = await callApi('liveTracking', userData.api_token, { lat: latitude, long: longitude, user_id: userData.id });
            saveUserData('AUTH_DONE', { ...userData, latitude, longitude })
            setUserData(cv => ({ ...cv, latitude, longitude }))
        } catch (error) {
       
        }
    }

    const signUp = async signUpData => {
      
        setLoginData(signUpData)
        let json = await callApi('washregistration', 'ABCDEFGHIJK', { ...signUpData, device_token: await getToken() });
        if (!json) return;
        setUserData({ ...json.data, password: signUpData.password });
        return { otp: json.otp, id: json.data.id };
    };

    const customerSignUp = async signUpData => {
     
        setLoginData(signUpData)
        let json = await callApi('signup', 'ABCDEFGHIJK', { ...signUpData, device_token: await getToken() });
        if (!json) return;
        setUserData({ ...json.data, password: signUpData.password });
        return { otp: json.otp, id: json.data.id };
    };

    const login = async loginData => {
        setLoginData(loginData)
        setUserData(loginData)
        // changeStack('CustomerHomeStack')
        let json = await callApi(type.current == CUSTOMER ? 'customerlogin' : 'login', 'ABCDEFGHIJK', { ...loginData, device_token: await getToken(),device_type:"android" }, jsonResponse => {
           
            
            if (jsonResponse.data?.api_token){
                setUserData(jsonResponse.data)
            } 
            if (jsonResponse.api_token) setUserData(jsonResponse); // this makes sure to save the id and api-token in the userData state even if the response was false
            Alert.alert('Alert', jsonResponse.message, [
                {
                    text: 'Ok',
                    onPress: () => {
                        if (jsonResponse.upload_status == '0') navigate('UPDATE DOCUMENT', { authStack: true })
                        else if (jsonResponse.otp && jsonResponse.id) navigate('ENTER OTP', { otp: jsonResponse.otp });
                        else if (jsonResponse.message.toLowerCase().includes('terms')) navigate('TERMS & CONDITIONS', { loginData });
                    },
                },
            ]);
        });
        console.log("------------55555-------",json.data.api_token,"---------5555555-------------")
        if (!json) return;
        setUserData(json.data);
        AsyncStorage.setItem("auth_Key", JSON.stringify(json.data.api_token));
        AsyncStorage.setItem("washer_id", JSON.stringify(json.data.id));
        await saveUserData('AUTH_DONE', json.data);
        changeStack(json.data.role_as == WASHER ? 'DriverHomeStack' : 'CustomerHomeStack');
        return 'success';
    };

    const termsAndConditions = async () => {
        let json = await callApi('termCondition', userData.api_token, { id: userData.id });
        if (!json) return;
        let loginSuccess = await login(loginData);
        if (loginSuccess) return 'success';
    };

    const completeProfile = async (data, isFromAuthStack) => {
        let json = await callApi(type.current == WASHER ? 'save_complete_profile' : 'updateUserPofile', userData.api_token, { ...data, user_id: userData.id, hourly_rate: 0 });
        if (!json) return;
        let userDetailJson = await getUserDetails()
        if (!userDetailJson) return
       
        await saveUserData(isFromAuthStack ? 'UPDATE DOCUMENT' : 'AUTH_DONE', userDetailJson.data);
        setUserData(cv => ({ ...cv, ...userDetailJson.data }))
        return 'success';
    };

    const updateDrivingLicense = async (data, isFromAuthStack) => {
        let json = await callApi('update_drivinglicense', userData.api_token, { ...data, user_id: userData.id, term_condition: 0 });
        if (!json) return;
        await saveUserData(isFromAuthStack ? 'BACKGROUND CHECK' : 'AUTH_DONE');
        return 'success';
    };

    const setOnlineStatus = async status => await callApi('updatestatus', userData.api_token, { user_id: userData.id, status });

    const getOnlineStatus = async () => await callApi('useronlinestatus', userData.api_token, { user_id: userData.id });

    const saveAgreement = async () => await callApi('saveagree', userData.api_token, { user_id: userData.id });

    const getBackgroundCheckContent = async () => await callApi('backgroundcheck', userData.api_token, {}, null, 'GET');

    const getDrivingLicenseDetails = async () => await callApi('drivinglicensedetails', userData.api_token, { user_id: userData.id });

    const resendOtp = async () => await callApi('resentOtp', 'ABCDEFGHIJK', { email: loginData.email });

    const getUserDetails = async () => await callApi('userdetails', userData.api_token, { user_id: userData.id });

    const changePassword = async data => await callApi('change_password', userData.api_token, { ...data, user_id: userData.id });

    const saveBankInfo = async data => await callApi('save_bank_details', userData.api_token, { ...data, user_id: userData.id });

    const getBankInfo = async () => await callApi('get_bank_details', userData.api_token, { user_id: userData.id });

    const getCountries = async () => await callApi('get_country', userData.api_token, {}, null, 'GET');

    const getPromotions = async (setState) => {
        setState(LOADING)
        let json = await callApi('getPromotions', userData.api_token, { user_id: userData.id }, null, 'POST');
        if (json) setState(json.data)
        else return setState(ERROR)
    }
    const getStates = async country_id => await callApi('get_state', userData.api_token, { country_id });

    const getCities = async state_id => await callApi('get_city', userData.api_token, { state_id });

    const forgotPassword = async emailid => await callApi('forget_password', 'ABCDEFGHIJK', { emailid });

    const addCard = async (data, onSuccess) => {
        if (!data?.complete) return Alert.alert('Incomplete', 'Card not complete', [])
        setLoading(true)
        let success = await callApi('addCard', userData.api_token, { ...data, user_id: userData.id })
        setLoading(false)
        if (success) onSuccess()
    }

    const updateCard = async data => await callApi('updateCard', userData.api_token, { ...data, user_id: userData.id });

    const getCardDetails = async (setState) => {
        setState(LOADING)
        let json = await callApi('getCardDetails', userData.api_token, { user_id: userData.id })
        setState(json ? (json.data.length == 0 ? EMPTY : json.data) : ERROR)
    }

    const submitBackgroundCheckData = async (data, onSuccess) => {
        setLoading(true)
        let json = await callApi('addBackground', userData.api_token, { ...data, user_id: userData.id });
        setLoading(false)
        if (!json) return;
        return onSuccess()
    };

    const changeImage = async (image) => {
        let json = await callApi('userImage', userData.api_token, { user_id: userData.id, image })
        if (json) {
            setUserData(cv => ({ ...cv, image: image.uri }))
            let userDetailJson = await getUserDetails()
            if (!userDetailJson) return
            await saveUserData('AUTH_DONE', userDetailJson.data);
            setUserData(cv => ({ ...cv, ...userDetailJson.data }))
            return "success"
        }
    }

    const submitVehicleInsurance = async (data, onSuccess) => {
        setLoading(true)
        let json = await callApi('addVehicleInsurance', userData.api_token, { ...data, user_id: userData.id });
        setLoading(false)
        if (!json) Alert.alert('Error', 'Something went wrong. Please try again.')
        return onSuccess()
    };

    const submitVehicleRegistration = async (data, onSuccess) => {
        setLoading(true)
        let json = await callApi('addVehicleRegistration', userData.api_token, { ...data, user_id: userData.id });
        setLoading(false)
        if (!json) Alert.alert('Error', 'Something went wrong. Please try again.')
        return onSuccess()
    };

    const getBackgroundData = async (setState, onGetSuccess) => {
        setLoading(true)
        await wait()
        setLoading(false)
        let json = {
            data: {
                "user_id": 107,
                "first_name": "Jhon",
                "middle_name": "Stirn",
                "last_name": "Doe",
                "social_security_number": "8998648468",
                "drivers_license_number": "9864648568",
                "state_issuing_license": "Texas",
                "present_street_address": "Hdhcisvsjb",
                "city_state_zip": "Hxu Dee vdjdb",
                "dob": "2021-09-19"
            }
        }
        setState(json ? json.data : ERROR)
        if (json) onGetSuccess(json.data)
        if (!json) Alert.alert('Error', 'Something went wrong. Please try again.')
    };

    const getInsuranceDetail = async (setState, onGetSuccess) => {
        setLoading(true)
        await wait()
        setLoading(false)
        let json = { data: { name: 'john', carriers_name: 'Insurance name', policy_number: '220', image: 'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dmlld3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80', expiration_date: '2021-05-05' } }
        setState(json ? json.data : ERROR)
        if (json) onGetSuccess(json.data)
        if (!json) Alert.alert('Error', 'Something went wrong. Please try again.')
    };

    const getRegistrationDetail = async (setState, onGetSuccess) => {
        setLoading(true)
        await wait()
        setLoading(false)
        let json = { data: { name: 'john', issued_state: 'Texas', image: 'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dmlld3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80', exp_date: '2021-05-05' } }
        setState(json ? json.data : ERROR)
        if (json) onGetSuccess(json.data)
        if (!json) Alert.alert('Error', 'Something went wrong. Please try again.')
    };

    const checkDocuments = async (setState) => {
        setState(LOADING)
        let json = await callApi('checkDocument', userData.api_token, { user_id: userData.id })
        setState(json || ERROR)
    }

    const otpVerified = async () => {
        let json = await callApi('otpVerify', userData.api_token, { id: userData.id })
        if (json) setUserData(json.data)
        return json
    };

    const documentVerified = async (onSuccess) => {
        setLoading(true)
        let json = await callApi('documentVerify', userData.api_token, { id: userData.id })
        if (json) {
            onSuccess()
            setUserData(json.data)
        }
        setLoading(false)
        return json
    };


    const getAuthStatus = async (syncCurrentRunningBooking) => {
        let savedUserData = JSON.parse(await AsyncStorage.getItem('userData'));
        
        await syncCurrentRunningBooking(savedUserData)
        if (savedUserData) {
           
            setUserData(savedUserData);
            if (savedUserData.stage == 'AUTH_DONE') changeStack(savedUserData.role_as == WASHER ? 'DriverHomeStack' : 'CustomerHomeStack');
            else {
                changeStack('AuthStack');
                // setTimeout(() => navigate(savedUserData.stage), 100);
            }
        } else changeStack('AuthStack');
    };



    const saveUserData = async (stage, data = userData) => {
        let savedUserData = JSON.parse(await AsyncStorage.getItem('userData'));
        await AsyncStorage.setItem('userData', JSON.stringify({ ...savedUserData, ...data, stage }))
    }


    const logout = async () => {
        await AsyncStorage.clear();
        changeStack('AuthStack');
        setUserData({});
        messaging().deleteToken().then(() =>{})
    };

    const partialImageUrl = "https://suds-2-u.com/public/document/"

    return (
        <AuthContext.Provider
            value={{
                signUp,
                getAuthStatus,
                login,
                userData,
                termsAndConditions,
                saveUserData,
                completeProfile,
                saveBankInfo,
                getBankInfo,
                changePassword,
                logout,
                getCountries,
                getStates,
                getCities,
                getUserDetails,
                resendOtp,
                updateDrivingLicense,
                getDrivingLicenseDetails,
                getBackgroundCheckContent,
                saveAgreement,
                getOnlineStatus,
                setOnlineStatus,
                forgotPassword,
                otpVerified,
                documentVerified,
                customerSignUp,
                addCard,
                getCardDetails,
                updateCard,
                updateUserLocation,
                changeImage,
                getPromotions,
                submitBackgroundCheckData,
                checkDocuments,
                submitVehicleInsurance,
                submitVehicleRegistration,
                getRegistrationDetail,
                getInsuranceDetail,
                getBackgroundData
            }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;


const wait = (ms) => {
    return new Promise(resolve => setTimeout(() => resolve(), ms || 2000))
}

