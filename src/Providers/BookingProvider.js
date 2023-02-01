import React, { useContext, useEffect, useReducer, useState } from 'react';
import { BASE_URL, callApi, callApi2, ERROR, LOADING } from '.';
import { AuthContext } from './AuthProvider';
import NetInfo from '@react-native-community/netinfo';
import Colors from '../../Constants/Colors';
import moment from 'moment';
import { AppState } from 'react-native';
import { WASHER } from '../Navigation/NavigationService';
import * as RNLocalize from "react-native-localize";
import { getCurrentPosition } from '../Services/LocationServices';
import { AppContext } from './AppProvider';
import { Alert } from 'react-native';

export const BookingContext = React.createContext();

export const WASH_PENDING = 0
export const WASHER_ACCEPTED = 1
export const WASHR_ON_THE_WAY = 2
export const WASHER_ARRIVED = 3
export const WASH_IN_PROGRESS = 4
export const WASH_COMPLETED = 5
export const WASH_REJECTED = 6
export const WASH_CANCELLED = 7

export const ACTIONS = {
  OnFail: 'onFail',
  OnInit: 'onInit',
  Start: 'Start',
  OnStartSuccess: 'onStartSuccess',
  LoadMore: 'LoadMore',
  OnLoadMoreSuccess: 'onLoadMoreSuccess',
  Refresh: 'Refresh',
  OnRefreshSuccess: 'onRefreshSuccess',
};

const initialState = {
  bookingHistory: [],
  loading: true,
  refreshing: false,
  type: ACTIONS.OnInit,
  hasLoadedAllItems: false,
  pagecount: 0,
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case ACTIONS.OnFail:
      return { ...state, loading: false, refreshing: false, type: ACTIONS.OnFail };
    case ACTIONS.OnInit:
      return initialState;
    case ACTIONS.Start:
      return { ...initialState, loading: true, type: ACTIONS.Start };
    case ACTIONS.OnStartSuccess:
      return {
        ...state,
        loading: false,
        bookingHistory: payload.bookingHistory,
        type: ACTIONS.OnStartSuccess,
        hasLoadedAllItems: payload.bookingHistory.length < 10,
      };
    case ACTIONS.LoadMore:
      return { ...state, pagecount: state.pagecount + 1, loading: true, type: ACTIONS.LoadMore };
    case ACTIONS.OnLoadMoreSuccess:
      return {
        ...state,
        loading: false,
        bookingHistory: [...state.bookingHistory, ...payload.bookingHistory],
        type: ACTIONS.OnLoadMoreSuccess,
        hasLoadedAllItems: payload.bookingHistory.length < 10,
      };
    case ACTIONS.Refresh:
      return { ...state, pagecount: 0, refreshing: true, type: ACTIONS.Refresh };
    case ACTIONS.OnRefreshSuccess:
      return {
        ...state,
        refreshing: false,
        bookingHistory: payload.bookingHistory,
        type: ACTIONS.OnRefreshSuccess,
        hasLoadedAllItems: payload.bookingHistory.length < 10,
      };
    default:
      return state;
  }
};

const BookingProvider = ({ children }) => {
  const { setLoading } = useContext(AppContext);
  const { userData } = useContext(AuthContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [vehicles, setVehicles] = useState(LOADING)
  const [currentBooking, setCurrentBooking] = useState({})
  const [customer_id, setCustomerId] = useState()
  const [runningBooking, setRunningBooking] = useState()

  useEffect(() => {
    AppState.addEventListener("change", _handleAppStateChange);
    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = (nextAppState) => nextAppState == "active" ? syncCurrentRunningBooking() : null

  useEffect(() => console.log(JSON.stringify(currentBooking, null, 2)),)

  useEffect(() => { onStateChange(state) }, [state]);

  const onStateChange = async state => {
    console.log(state);
    if (state.type.includes('on')) return;
    let json = await callApi(userData?.role_as == 3 ? 'customerbookinghistory' : 'bookinghistory', userData.api_token, { user_id: userData.id, pagecount: state.pagecount });
    if (json) dispatch({ type: `on${state.type}Success`, payload: { bookingHistory: json.data } });
    else dispatch({ type: ACTIONS.OnFail });
  };

  const getSingleBookingDetails = async (booking_id, setState) => {
    console.log('RNLocalize', RNLocalize.getTimeZone());
    setState ? setState(LOADING) : setLoading(true)
    let json = await callApi('singlebookingdetails', userData.api_token, { booking_id: booking_id, time_zone: RNLocalize.getTimeZone() })
    console.log('singlebookingparam',{ booking_id: booking_id, time_zone: RNLocalize.getTimeZone() });
    setState ? setState(json?.data ? json.data : ERROR) : setLoading(false)
    console.log('json', json)
    // var data = json.data
    // data.vehicle = data.vehicle_type

    // data.vehicle_type = data.vehicledetails[0].category_id
    // console.log('====Data====', data)
    // setCurrentBooking(data)
    return JSON.parse(JSON.stringify(json))
  }

  const acceptJob = async booking_id => {
    let json = await callApi('accept_job', userData.api_token, { user_id: userData.id, booking_id })
    if (!json) return
    syncCurrentRunningBooking()
    return json
  }

  const rejectJob = async booking_id => {
    setLoading(true)
    let json = await callApi('reject_job', userData.api_token, { user_id: userData.id, booking_id })
    setLoading(false)
    return json
  }

  const finishedjob = async data => {
    console.log('finishedjob response',data);
    let json = await callApi('finishedjob', userData.api_token, { ...data, user_id: userData.id })
    console.log('json',json);
    if (!json) return
    syncCurrentRunningBooking()
    return json
  }

  const onMyWay = async (user_id, booking_id) => {
    let json = await callApi('onMyWay', userData.api_token, { washer_id: userData.id, user_id, booking_id })
    if (!json) return
    syncCurrentRunningBooking()
    return json
  }

  const startJob = async booking_id => {
    let json = await callApi('startjob', userData.api_token, { booking_id, time_zone: RNLocalize.getTimeZone() })
    if (!json) return
    syncCurrentRunningBooking()
    return json
  }

  const addMoreMinutes = async (booking_id, extra_time) => callApi('addMoreTime', userData.api_token, { booking_id, extra_time })

  const getMake = async (year) => customCallApi('make', userData.api_token, { year }, 'POST', 'Make')

  const getYear = async () => customCallApi('year', userData.api_token, {}, 'GET', 'Year')

  const getModel = async (make, year) => customCallApi('model', userData.api_token, { make, year }, 'POST', 'Model')

  const addNewVehicle = async data => callApi('addVehicle', userData.api_token, { ...data, user_id: userData.id, category_id: 1 })

  const getVendor = async () => callApi('vendorlist', userData.api_token, { latitude: userData.latitude, longitude: userData.longitude })

  const getAddOns = async () => await callApi('addOns', userData.api_token, { category_id: currentBooking.vehicle_type }, null, 'POST')

  const getNearByVendor = async (lat, long, status) => callApi('automaticallyShowVendor', userData.api_token, { lat, long, status })

  const applyCoupon = async data => await callApi('applycoupan', userData.api_token, { ...data, user_id: userData.id })

  const getPaymentIntent = async amount => await callApi('paymentorder', userData.api_token, { booking_id: 3, user_id: userData.id, amount })

  const getWasherLocation = async washer_id => await callApi('getWasherLocation', userData.api_token, { user_id: userData.id, washer_id })

  const getRewards = async (setState) => {
    setState(LOADING)
    let json = await await callApi('rewards', userData.api_token, { user_id: userData.id })
    if (json) return setState(json.data?.length)
    return setState(ERROR)
  }

  const updateLocation = async location => await callApi('liveTracking', userData.api_token, { user_id: userData.id, ...location })


  const getFinishedJobImage = async (setState) => {
    setState(LOADING)
    let json = await callApi('getFinishedJobImage', userData.api_token, { user_id: currentBooking.washer_id })
    if (json) {
      let images = []
      json.data.map(booking => Object.keys(booking).forEach(k => {
        if (k.includes("image")) images.push(json.url + '/' + booking[k])
      }))
      setState(images)
    } else setState(ERROR)
  }

  const getWasherReviews = async (state, setState) => {
    // if (!state?.reviews || state.reviews.length == 0) setState(LOADING)
    let json = await callApi('viwvendorreview', userData.api_token, { vendor_id: currentBooking.washer_id, pagecount: !state.pagecount ? 0 : state.pagecount + 1 })
    if (json) setState({ hasLoadedAllItems: json.data.length < 10, pagecount: (state.pagecount ? state.pagecount : 0) + 1, reviews: state.reviews ? [...state.reviews, ...json.data] : json.data })
    else setState(state.reviews?.length > 0 ? state : ERROR)
  }

  const saveBooking = async () => {
    let finalObject = { ...currentBooking }
    console.log('finalObject', finalObject)
    if (currentBooking.type == 0) {
      let date = new Date();
      finalObject = { ...finalObject, booking_date: moment(date).format('YYYY-MM-DD'), booking_time: date.toLocaleTimeString() }
    }
    console.log('FINAL BOOKING OBJECT', JSON.stringify(finalObject, null, 2))
    return await callApi2('savebooking', userData.api_token, { ...finalObject, user_id: userData.id })
  }


  const getVehicles = async () => {
    setVehicles(LOADING)
    let json = await callApi('viewVehicle', userData.api_token, { user_id: userData.id })
    if (json) setVehicles(json.data)
    else setVehicles(ERROR)
  }

  const addReview = async (data, onSuccess) => {
    setLoading(true)
    let json = await callApi('addReviewRating', userData.api_token, { user_id: userData.id, ...data })
    setLoading(false)
    if (!json) Alert.alert('Error', 'Something went wrong. Please try again.')
    else onSuccess()
  }

  const syncCurrentRunningBooking = async (user = userData) => {
    if (!user?.api_token) return
    let json = await callApi(user.role_as == WASHER ? 'runningjob' : 'customerrunningbooking', user.api_token, { user_id: user.id })
    if (!json) return setRunningBooking(undefined)
    else setRunningBooking(json.data)
  }

  const getNearByWasherLocations = async (onSuccess, onFailure) => {
    setLoading(true)
    const userLocation = (await getCurrentPosition()).coords
    let json = await callApi('get_washser', userData.api_token, { lat: userLocation.latitude, long: userLocation.longitude })
    setLoading(false)
    if (json) onSuccess(json.data, userLocation)
    else onFailure(userLocation)
  }


  const sendSMS = async (setLoading, onSuccess, to_id, message) => {
    console.log('data : ', { from_id: userData.id, to_id, message, type: "user" })
    setLoading(true)
    let json = await callApi('sendingSms', userData.api_token, { from_id: userData.id, to_id, message, type: "user" })
    if (json) onSuccess()
    setLoading(false)
  }

  const sendCALL = async (setLoading, onSuccess, to_id) => {
    setLoading(true)
    let json = await callApi('callingWasher', userData.api_token, { to_id: "+91" + to_id })
    if (json) onSuccess()
    setLoading(false)
  }

  // const sendSMSTWIL = async (setLoading, onSuccess, to_id, message) => {
  //   console.log('data : ', { from_id: userData.id, to_id, message })
  //   setLoading(true)
  //   let json = await callApi('getSms', userData.api_token, { from_id: washer_id.id, to_id, message })
  //   if (json) onSuccess()
  //   setLoading(false)
  // }


  const sendSMSTWIL = async (setLoading, onSuccess, to_id, message) => {
    console.log('sendSMSTWIL : ', { to_id: "+91" + to_id, message })
    setLoading(true)
    let json = await callApi('oneMessage', userData.api_token, { to_id: to_id, message: message })
    // if(typeof json == "string"){
    //   json = JSON.parse(json)
    // }
    if (json) onSuccess()
    setLoading(false)
  }

  // const sendSMSTWIL = async (setLoading, onSuccess ,to_id, message) => {
  //   console.log('sendSMSTWIL : ', { to_id:"+91"+to_id , message})
  //   setLoading(true)
  //   let json = await callApi('sms', userData.api_token,{ to_id:to_id , message })
  //   //console.log(json+" //////////////// SMS RESPONSE /////////////")
  //   if(typeof json == "string"){
  //     json = JSON.parse(json)
  //   }
  //   if (json) onSuccess()
  //   setLoading(false)
  // }


  const getWahserCalendar = async (setState, washer_id) => {
    if (!washer_id) return
    let json = await callApi('getWasherCalendar', userData.api_token, { washer_id })
    if (json) setState([json.data.booking_date])
  }

  const getExtraTimeFee = async (setState) => {
    let json = await callApi('extratime', userData.api_token, {}, null, 'GET')
    if (json) setState(json.data[0].price)
    else setState('Error')
    console.log("getExtraTimeFee,,", json);
  }

  const getServiceFee = async (setState) => {
    let json = await callApi('service', userData.api_token, {}, null, 'GET')
    if (json?.data?.price) setState(parseFloat(json.data.price))
    else setState('Error')
  }

  const cancelRequest = async (data, onSuccess) => {
    setLoading(true)
    let json = await callApi('cancelRequest', userData.api_token, { ...data, user_id: userData.id })
    if (json) onSuccess()
    setLoading(false)
  }

  const getWasherSchedule = async (data, setWasherScheduleData, setAvailableWasher) => {
    try {
      // setLoading(true)
     console.log("washerScheduleparams",data)
    let json = await callApi('getWasherSchedule', userData.api_token, { ...data })
    console.log("getWasherSchedulejson", json)

    if (JSON.stringify(json) && setWasherScheduleData) {
      let obj = json;
      console.log("obj..", obj)

      setWasherScheduleData(obj.data)
      setAvailableWasher(obj.available)
    }
    setLoading(false)
    return JSON.parse(JSON.stringify(json))
    } catch (error) {
      console.log('error',error)
    }
    
  }

  const washerUnavailableSet = async (data) => {
    setLoading(true)
    console.log("washerUnavailableSetdata....", data)
    let json = await callApi('washerUnavailableSet', userData.api_token, { ...data })
    console.log("washerUnavailableSet1", data)
    setLoading(false)
  }

  const getWasherUnavailable = async (data, setUnavailabletime) => {
    // setLoading(true)
    let json = await callApi2('getWasherUnavailable', userData.api_token, { date: data })
    console.log("washerUnavailableSet2", json.data)
    let i = []
    json.data.some((item, j) => {
      i.push(item["start_time"])
    })
    console.log("wash value i", i)
    console.log("washer value json",json )  
      setUnavailabletime(i)
     setLoading(false)
     return i;
  }

  // const getWasherUnavailable = async (data) => {
  //   setLoading(true)
  //   let json = await callApi2('getWasherUnavailable', userData.api_token, { date:data.unavailable_date })
  //   console.log("getWasherUnavailable2",data)   
  //   setLoading(false)
  // }

  return <BookingContext.Provider value={{
    state,
    dispatch,
    acceptJob,
    rejectJob,
    getSingleBookingDetails,
    finishedjob,
    onMyWay,
    addMoreMinutes,
    startJob,
    getVehicles,
    vehicles,
    getMake,
    getYear,
    getModel,
    addNewVehicle,
    getVendor,
    getNearByVendor,
    setCurrentBooking,
    currentBooking,
    getAddOns,
    applyCoupon,
    customer_id,
    setCustomerId,
    getPaymentIntent,
    saveBooking,
    getWasherLocation,
    getFinishedJobImage,
    getWasherReviews,
    runningBooking,
    syncCurrentRunningBooking,
    updateLocation,
    setRunningBooking,
    getRewards,
    getNearByWasherLocations,
    sendSMS,
    sendCALL,
    sendSMSTWIL,
    getWahserCalendar,
    getExtraTimeFee,
    getServiceFee,
    addReview,
    cancelRequest,
    getWasherSchedule,
    washerUnavailableSet,
    getWasherUnavailable
  }}>{children}</BookingContext.Provider>;
};


export default BookingProvider;

export const calculateTotalPriceNew = (booking, discountRate) => {
  
  let total = booking.reduce(
      (previousValue, currentValue) => {

        console.log('calculateTotalPriceNew_selectedAddOns', currentValue.selectedAddOns);
        let addonPrice = 0;
        if(currentValue.selectedAddOns && Array.isArray(currentValue.selectedAddOns)) {
          addonPrice = currentValue.selectedAddOns.reduce((prevAddonValue, currentAddonValue)=>{
            return parseFloat(prevAddonValue) + parseFloat(currentAddonValue.add_ons_price);
          }, 0)
        }
        console.log("calculateTotalPriceNew_addonPrice", addonPrice)
          return parseFloat(previousValue) + parseFloat(currentValue.price) + parseFloat(currentValue.extraTimeFee) + parseFloat(currentValue.serviceFee) + parseFloat(addonPrice);
      },
      0
    );

    const amount = booking.reduce(
      (previousValue, currentValue) => {
          return parseFloat(previousValue) + parseFloat(currentValue.price);
      },
      0
    );

  console.log("total new",total);
  console.log("amount new",amount);
  console.log("diacountRate",discountRate);
  if(discountRate>0) {
    total = total - (amount*discountRate);
  }
  return total;
}

export const calculateTotalPrice = (booking, fees, discountRate) => {
  console.log("booking",booking);
  console.log("fees",fees);
  console.log("discountRate",discountRate);
  let addOnsPrice = (
    booking?.selectedAddOns?.length == 0 ?
      0 : booking?.selectedAddOns?.map(addOn => parseFloat(addOn.add_ons_price)).reduce((p, c) => p + c)) || 0
  let packagePrice = (parseFloat(booking?.packageDetails?.price)) || 0
  let totalFees = fees.filter(fee => typeof fee == 'number').reduce((p, c) => p + c, 0)
  let total = addOnsPrice + packagePrice + totalFees
  console.log("total...",total);
  return total - (total * discountRate)
}

export const getWashStatus = (status) => {
  switch (status) {
    case WASH_PENDING: return { name: "Pending", color: 'orange', naviagteTo: 'BOOKING DETAILS' }
    case WASHER_ACCEPTED: return { name: "Accepted", color: 'orange', naviagteTo: 'BOOKING DETAILS' }
    case WASHR_ON_THE_WAY: return { name: "Washer on the way", color: 'orange', naviagteTo: 'On The Way' }
    case WASHER_ARRIVED: return { name: "Washer Arrived", color: 'orange', naviagteTo: 'On The Way' }
    case WASH_IN_PROGRESS: return { name: "In progress", color: 'orange', naviagteTo: 'Work In Progress' }
    case WASH_COMPLETED: return { name: "Success", color: Colors.green, naviagteTo: 'BOOKING DETAILS' }
    case WASH_REJECTED: return { name: "Failed", color: 'red', naviagteTo: 'BOOKING DETAILS' }
  }
}


const fakeCallApi = (subfix, AppKey, { pagecount }, onFalse, method = 'POST') => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // resolve({ data: Data.slice(pagecount * 10, (pagecount + 1) * 10) });
      resolve({ data: [] })
    }, 500);
  });
};

let Data = [
  {
    userName: 'Donnie Smith',
    review: ` Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.`,
    rating: 4,
    userImage:
      'https://images.unsplash.com/photo-1520877880798-5ee004e3f11e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
    t: '29 july 2019',
    id: 1,
  },
  {
    userName: 'Donnie Smith',
    review: ` Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
    rating: 4,
    userImage:
      'https://images.unsplash.com/photo-1520877880798-5ee004e3f11e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
    t: '29 july 2019',
    id: 2,
  },
  {
    userName: 'Donnie Smith',
    review: ` Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
    rating: 4,
    userImage:
      'https://images.unsplash.com/photo-1520877880798-5ee004e3f11e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
    t: '29 july 2019',
    id: 3,
  },
  {
    userName: 'Donnie Smith',
    review: ` Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`,
    rating: 4,
    userImage:
      'https://images.unsplash.com/photo-1520877880798-5ee004e3f11e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
    t: '29 july 2019',
    id: 4,
  },
  {
    userName: 'Donnie Smith',
    review: ` Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
    rating: 4,
    userImage:
      'https://images.unsplash.com/photo-1520877880798-5ee004e3f11e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
    t: '29 july 2019',
    id: 5,
  },
  {
    userName: 'Donnie Smith',
    review: ` Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`,
    rating: 4,
    userImage:
      'https://images.unsplash.com/photo-1520877880798-5ee004e3f11e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
    t: '29 july 2019',
    id: 6,
  },
  {
    userName: 'Donnie Smith',
    review: ` Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`,
    rating: 4,
    userImage:
      'https://images.unsplash.com/photo-1520877880798-5ee004e3f11e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
    t: '29 july 2019',
    id: 7,
  },
  {
    userName: 'Donnie Smith',
    review: ` Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.`,
    rating: 4,
    userImage:
      'https://images.unsplash.com/photo-1520877880798-5ee004e3f11e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
    t: '29 july 2019',
    id: 11,
  },
  {
    userName: 'Donnie Smith',
    review: ` Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
    rating: 4,
    userImage:
      'https://images.unsplash.com/photo-1520877880798-5ee004e3f11e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
    t: '29 july 2019',
    id: 12,
  },
  {
    userName: 'Donnie Smith',
    review: ` Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
    rating: 4,
    userImage:
      'https://images.unsplash.com/photo-1520877880798-5ee004e3f11e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
    t: '29 july 2019',
    id: 13,
  },
  {
    userName: 'Donnie Smith',
    review: ` Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`,
    rating: 4,
    userImage:
      'https://images.unsplash.com/photo-1520877880798-5ee004e3f11e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
    t: '29 july 2019',
    id: 14,
  },
  {
    userName: 'Donnie Smith',
    review: ` Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
    rating: 4,
    userImage:
      'https://images.unsplash.com/photo-1520877880798-5ee004e3f11e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
    t: '29 july 2019',
    id: 15,
  },
  {
    userName: 'Donnie Smith',
    review: ` Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`,
    rating: 4,
    userImage:
      'https://images.unsplash.com/photo-1520877880798-5ee004e3f11e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
    t: '29 july 2019',
    id: 16,
  },
  {
    userName: 'Donnie Smith',
    review: ` Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`,
    rating: 4,
    userImage:
      'https://images.unsplash.com/photo-1520877880798-5ee004e3f11e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
    t: '29 july 2019',
    id: 17,
  },
];


const customCallApi = async (subfix, AppKey, params, method = 'POST', nameLable) => {
  console.log("CUSTOME CALL API")
  try {
    await checkConnection();
    let formData = new FormData()
    Object.entries(params).forEach(([key, value]) => formData.append(key, value))
    console.log(formData)
    let url = `${BASE_URL}${subfix}?`
    // let url = `${'https://suds-2-u.com/api/'}${subfix}?`
    let res = await fetch(url, {
      method: method,
      headers: { 'App-Key': AppKey, 'Content-Type': 'multipart/form-data' },
      body: method == 'GET' ? undefined : formData
    });
    let jsonResponse = JSON.parse(await res.text())
    let results = (jsonResponse.results ? jsonResponse.results : jsonResponse.data).map(r => { return { id: r.objectId, name: r[nameLable] } })

    return getUniques(results)
  } catch (error) {
    console.log(error);
  }
};

const checkConnection = async () => {
  let state = await NetInfo.fetch();
  if (!state.isConnected) {
    Alert.alert('Connection', 'You are not connected to the internet');
    throw 'Not connected';
  }
};

const getUniques = (results) => {
  let labels = [], newArr = []
  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    if (!labels.includes(r.name)) {
      newArr.push(r)
      labels.push(r.name)
    }
  }
  return { data: newArr }
}

