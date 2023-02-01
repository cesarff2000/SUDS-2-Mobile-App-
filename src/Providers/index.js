import React from "react";
import { Alert } from "react-native";
import AppProvider from "./AppProvider";
import AuthProvider from "./AuthProvider";
import BookingProvider from "./BookingProvider";
import RatingProvider from "./RatingProvider";
import NetInfo from "@react-native-community/netinfo";
import EarningProvider from "./EarningsProvider";
import PackageProvider from "./PackageProvider";

 //export const BASE_URL = 'https://dev.abserve.tech/api/';
export const BASE_URL = 'https://suds-2-u.com/api/';
//export const BASE_URL = "https://dev.abserve.tech/suds/api/";

//export const BASE_URL = "http://10.1.1.51/suds/api/";
export const ERROR = 45;
export const LOADING = 64;
export const EMPTY = 641;

// export const partialProfileUrl =
//   "https://dev.abserve.tech/public/profile/";
export const partialProfileUrl = "https://suds-2-u.com/public/profile/"
//export const partialProfileUrl =  "http://10.1.1.51/public/profile/";

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
    console.log("🚀 ~ file: index.js ~ line 51 ~ callApi ~ method", method);
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
    console.log("param", params);
    let url = `${BASE_URL}${subfix}?`;
    console.log("URL : ", url);
    console.log("AppKey : ", AppKey);
    let res = await fetch(url, {
      method: method,
      headers: { "App-Key": AppKey, "Content-Type": "multipart/form-data" },
      body: method == "GET" ? null : formData,
    });

    let text = await res.text();
    console.log(subfix, res.status, text.substring(0, 1000));

    let jsonResponse = JSON.parse(text);
    console.log(subfix, jsonResponse);
    if (jsonResponse.response == false) {
      if (onFalse) onFalse(jsonResponse);
      else if(jsonResponse.message) Alert.alert("Alert", jsonResponse.message);
    } else if (isEmptyResponse(jsonResponse))
      return { ...jsonResponse, empty: true };
    else if (res.status == 200 || res.status == 201) return jsonResponse;
    else return Alert.alert("Error", "Something went wrong. Please try again.");
  } catch (error) {
    console.log("FAIL", error);
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
  console.log("SAVE BOOKING PARAMS", params);
  try {
    await checkConnection();
    let url = `${BASE_URL}${subfix}?` + new URLSearchParams(params);
    console.log("URL : ", url);
    console.log("AppKey : ", AppKey);

    let res = await fetch(url, {
      method: method,
      headers: { "App-Key": AppKey, "Content-Type": "application/json" },
    });
    let text = await res.text();
    console.log("TEXT", text);
    let jsonResponse = JSON.parse(text);
    console.log("SAVE BOOKING JSON REPONSE", jsonResponse);
    if (jsonResponse.response) return jsonResponse;
    else Alert.alert("Alert", jsonResponse.message);
  } catch (error) {
    console.log("Savebooking error > ", error);
  }
};
