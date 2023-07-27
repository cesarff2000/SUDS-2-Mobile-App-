import React from "react";
import { Alert } from "react-native";
import AppProvider from "./AppProvider";
import AuthProvider from "./AuthProvider";
import BookingProvider from "./BookingProvider";
import RatingProvider from "./RatingProvider";
import NetInfo from "@react-native-community/netinfo";
import EarningProvider from "./EarningsProvider";
import PackageProvider from "./PackageProvider";
import AsyncStorage from '@react-native-async-storage/async-storage';


// export const BASE_URL = 'https://dev.codemeg.com/suds/api/';
export const BASE_URL = "https://suds-2-u.com/api/";


export const ERROR = 45;
export const LOADING = 64;
export const EMPTY = 641;


export const partialProfileUrl = "https://dev.codemeg.com/suds/public/profile/";
//export const partialProfileUrl = "https://suds-2-u.com/public/profile/";


export const partialDocumentUrl = "https://dev.codemeg.com/suds/public/document/";
//export const partialDocumentUrl = "https://suds-2-u.com/public/document/";


const AppKeyvalue = async () =>{
    await AsyncStorage.getItem('auth_Key').then(result => {
        console.log("4444",result,"++++44444444++++++____________")
        return result;
        
    })
}
const Providers = ({ children }) => {
    return (
        <AppProvider>
            <AuthProvider>
                <RatingProvider>
                    <EarningProvider>
                        <BookingProvider>
                            <PackageProvider>{children}</PackageProvider>
                        </BookingProvider>
                    </EarningProvider>
                </RatingProvider>
            </AuthProvider>
        </AppProvider>
    );
};

export default Providers;

export const callApi = async (
    subfix,
    AppKey,
    params,
    onFalse,
    method = "POST"
) => {
    try {
       

        await checkConnection();
       
        let formData = new FormData();
        Object.entries(params).forEach(([key, value]) =>
            key.includes("image")
                ? formData.append(
                    key,
                    value
                        ? { uri: value.uri, name: value.fileName, type: "image/jpeg" }
                        : undefined
                )
                : formData.append(key, value)
        );
      
        let url = `${BASE_URL}${subfix}?`;
        console.log(url);
        console.log(formData)
    
        let res = await fetch(url, {
            method: method,
            headers: { "App-Key": AppKey, "Content-Type": "multipart/form-data" },
            body: method == "GET" ? null : formData,
        });
        let text = await res.text();
        let jsonResponse = JSON.parse(text);
        if (jsonResponse.response == false) {
            if (onFalse) onFalse(jsonResponse);
            else if (jsonResponse.message) Alert.alert("Alert", jsonResponse.message);
        } else if (isEmptyResponse(jsonResponse))
            return { ...jsonResponse, empty: true };
        else if (res.status == 200 || res.status == 201) return jsonResponse;
        else return Alert.alert("Error", "Something went wrong. Please try again.");
    } catch (error) {
       
        Alert.alert("Error", "Something went wrong. Please try again.");
    }
};

const isEmptyResponse = (json) => {
    if (!json.data) return false;
    if (!json.error && Object.keys(json.data).length === 0) return true;
    return false;
};

const checkConnection = async () => {
    let state = await NetInfo.fetch();
    if (!state.isConnected) {
        Alert.alert("Connection", "You are not connected to the internet");
        throw "Not connected";
    }
};

export const callApi2 = async (
    subfix,
    AppKey,
    params,
    onFalse,
    method = "POST"
) => {
  
    try {
      

        await checkConnection();
        let url = `${BASE_URL}${subfix}?` + new URLSearchParams(params);
       
        let res = await fetch(url, {
            method: method,
            headers: { "App-Key": AppKey, "Content-Type": "application/json" },
        });
        let text = await res.text();

        let jsonResponse = JSON.parse(text);
     
        if (jsonResponse.response) return jsonResponse;
        else Alert.alert("Alert", jsonResponse.message);
    } catch (error) {
        
    }
};
