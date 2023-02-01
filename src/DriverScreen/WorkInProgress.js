import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native';
import { View, Image, Text ,TextInput ,Linking,RefreshControl} from 'react-native';
import Colors from '../../Constants/Colors';
import { Overlay, Icon } from 'react-native-elements';
import { BookingContext } from '../Providers/BookingProvider';
import LoadingView from '../Components/LoadingView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { bookingType, SCHEDULED } from '../Navigation/NavigationService';
import { AppContext } from '../Providers/AppProvider';
import {ACTIONS, RatingContext} from '../Providers/RatingProvider';

const WorkInProgress = ({ navigation, route }) => {
  const [deadline, setDeadline] = useState(route.params?.booking.totaltime * 1000);
  const [timeRemaining, setTimeRemaining] = useState(deadline - new Date().getTime())
  const [visible, setVisible] = useState(false);
   const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [booking_time, setBooking_time] = useState({});
  const { addMoreMinutes , sendCALL , sendSMSTWIL ,getSingleBookingDetails,getWasherScheduleData,getWasherSchedule} = useContext(BookingContext)
  const booking = useMemo(() => route.params?.booking, [route])
  const { time_zone } = useMemo(() => route.params, [])
  const [washerScheduleData, setWasherScheduleData] = useState([]);
  const [availableWasher, setAvailableWasher] = useState(true);
  const [localbooking, setLocalbooking] = useState();
    const {
    state: {refreshing},
    dispatch,
  } = useContext(RatingContext);


  useEffect(async() => {
    console.log('booking1......',route.params?.booking.totaltime)
    console.log("asrasdsad",route.params.booking.booking_date)
    let a = await getSingleBookingDetails(booking.booking_id);
    setBooking_time(a.data);
    console.log("a2..",a)

      AsyncStorage.getItem("washer_id").then(async (result) => {
        var data = {
          washer_id: JSON.parse(result),
          date: route.params.booking.booking_date  
        }
        setLoading(true);
        await getWasherSchedule(data, setWasherScheduleData, setAvailableWasher);
        setLoading(false);
      })
      AsyncStorage.getItem('multipledatastoreschedule').then(result => {
        let storedata = JSON.parse(result) || []
        setLocalbooking(storedata);
        console.log('res4',result)
    })
   
  },[])

  useEffect (()=>{
   
    if(firstupdate.current){
      firstupdate.current= false;
      return;   
    }
    // timer() 
     
  },[])

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const onAddMoreMinutes = async (seconds) => {
    setVisible(false)
    setLoading(true)
    let success = await addMoreMinutes(booking?.booking_id, seconds)
    setLoading(false)
    if (success) setDeadline(cv => cv + (seconds * 1000))
  }

  const firstupdate = useRef(true);

  // const timer = () => {
  //   // useEffect (()=>{
  //     //  window.location.reload(true);
  //   if (bookingType.current == SCHEDULED){  
  //     let a = 0;
  //     console.log("washerScheduleData2",washerScheduleData)
  //     washerScheduleData.map((r => { 
  //       console.log("washerScheduleData1..",r.timeset.time)
  //       a += Number(r.timeset.time)
  //     }))
  //     var time = booking_time.booking_time;
  //     const interval = setInterval(() => {      
  //       console.log("timer1", a);
  //       var hours = Number(time.match(/^(\d+)/)[1]);
  //       var minutes = Number(time.match(/:(\d+)/)[1]);
  //       var ampm = time.match(/\s(.*)$/)[1];
  //       if(ampm == "pm" && hours<12) hours = hours+12;
  //       if(ampm == "am" && hours==12) hours = hours-12;
  //       var sHours = hours.toString();
  //       var sMinutes = minutes.toString();
  //       if(hours<10) sHours = "0" + sHours;
  //       if(minutes<10) sMinutes = "0" + sMinutes;
  //       // alert(sHours + ":" + sMinutes);
  //       console.log("sHours",sHours)
        
  //       let res = (booking_time.booking_date)+"T"+sHours + ":" + sMinutes;
  //       let d = new Date(res);
  //       console.log("res",d.getHours())
  //       let hr=d.setHours(d.getHours()-5);
  //       hr=d.setMinutes(d.getMinutes() - 30 + a);
  //       setTimeRemaining(hr - new Date().getTime()) 
  //       console.log('hr..',a)
  //       console.log('d1..',hr - new Date().getTime())
  //     }, 1000);
  //     return () => clearInterval(interval);
  //   }
  //   else{
  //     let a = 0;
  //     console.log("washerScheduleData2",washerScheduleData)
  //     washerScheduleData.map((r => { 
  //       console.log("washerScheduleData13..",typeof r.timeset.time)
  //       a += Number(r.timeset.time)
  //       console.log("aa16",a)
  //     }))

  //     var time = booking_time.booking_time;
  //     const interval = setInterval(() => { 
  //       //  Alert.alert("hi") 
  //       console.log("timer1", a);
  //       var hours = Number(time.match(/^(\d+)/)[1]);
  //       var minutes = Number(time.match(/:(\d+)/)[1]);
  //       var AMPM = time.match(/\s(.*)$/)[1];
  //       if(AMPM == "PM" && hours<12) hours = hours+12;
  //       if(AMPM == "AM" && hours==12) hours = hours-12;
  //       var sHours = hours.toString();
  //       var sMinutes = minutes.toString();
  //       if(hours<10) sHours = "0" + sHours;
  //       if(minutes<10) sMinutes = "0" + sMinutes;
  //       // alert(sHours + ":" + sMinutes);
  //       console.log("sHours",sHours)      
  //       let res = (booking_time.booking_date)+"T"+sHours + ":" + sMinutes;
  //       let d = new Date(res);
  //       console.log("dd",d)
  //       console.log("res",d.getHours())      
  //       let hr=d.setHours(d.getHours()-5);    
  //       hr=d.setMinutes(d.getMinutes() - 30 + a);
        
  //       setTimeRemaining(hr - new Date().getTime())
  //       console.log('hr2..',hr)
  //       console.log('d12..',timeRemaining)
  //       // stopCounter()  
  //     }, 1000);
  //     // Alert.alert("hi") 
  //     return () => clearInterval(interval);
  //   }
  //   //return () => clearInterval(interval);
  // }
// ,[booking_time])
  
  return (
    <View style={styles.container}>
      <LoadingView containerStyle={{ height: '100%' }} loading={loading}>
      
      
      <View style={styles.detailContainer}>
        <Text style={{ fontWeight: 'bold', fontSize: 28 }}>${booking_time?.packageDetails ? booking_time.packageDetails?.price: ''}</Text>
        <View style={styles.rankContainer}>
          <Text style={{ color: 'white', paddingLeft: 6 }}>{booking_time?.packageDetails ? booking_time?.packageDetails?.name : ''}</Text>
          <Image style={{ tintColor: 'white', height: 22, width: 22 }} source={require('../../Assets/help.png')}></Image>
        </View>
        <Text style={{ fontWeight: 'bold' }}>Estimates wash duration {booking_time?.packageDetails ? booking_time?.packageDetails?.time : ''} mins</Text>
      </View>
        
        
        <View style={{ marginVertical: -8 }} />
        {booking.extraaddonsdetails &&
          booking.extraaddonsdetails.map((addOn, i) => {
            return (<View key={i} style={[styles.detailContainer, { flexDirection: 'row' }]}>
              <Text style={{ fontWeight: 'bold', }}>{addOn.add_ons_name}</Text>
              <Text style={{ fontWeight: 'bold', marginLeft: 16, color: Colors.dark_orange }}>${parseFloat(addOn?.add_ons_price).toFixed(2)}</Text>
              <Image style={{ height: 24, width: 24, tintColor: 'black', marginLeft: 'auto' }} source={require('../../Assets/icon/checked.png')}></Image>
            </View>)
          })
        }
        {/* <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        
          <LoadingView loading={loading}>
          <Text style={{ fontWeight: 'bold', fontSize: 110 }}>
              {parseMilllisecond(timeRemaining)}
              </Text>
            <View style={{ flexDirection: 'row', width: '55%', justifyContent: 'space-between' }}>
              <Text style={{ color: '#999' }}>Hours</Text>
              <Text style={{ color: '#999' }}>Minutes</Text>
            </View>
          </LoadingView>
        </View> */}
        
        {/* <View style={{ flex:1, alignItems:'center',justifyContent:'center'}}>
          <Text style={{ backgroundColor:'blue', color:'white', padding:15 ,width: 22}}>Call from User</Text>
        </View> */}

        {/* <View style={{ flexDirection: 'row'}}>
          <TouchableOpacity 
          onPress={() => sendCALL(setLoading,() => console.log('send'), booking.userdetails[0].mobile )}
          style={[styles.btns, { backgroundColor: Colors.blue_color , borderRadius: 20 , display:'flex' , alignItems:'center' , justifyContent:'space-between' , flexDirection:'row' , marginBottom:10 }]}>
            <Text style={styles.btnText}>Call To User</Text>
            <Image style={{ tintColor: 'white', height: 15, width: 15 }} source={require('../../Assets/help.png')}></Image>
          </TouchableOpacity>

          <TouchableOpacity 
          onPress={() => sendSMSTWIL(setLoading,() => console.log('send'), booking.userdetails[0].mobile )}
          style={[styles.btns, { backgroundColor: Colors.blue_color , borderRadius: 20 , display:'flex' , alignItems:'center' , justifyContent:'space-between' , flexDirection:'row' , marginBottom:10 }]}>
            <Text style={styles.btnText}>Sms To User</Text>
            <Image style={{ tintColor: 'white', height: 15, width: 15 }} source={require('../../Assets/help.png')}></Image>
          </TouchableOpacity>
        </View> */}
        
        {/* <View style={{
            borderWidth: 1,
            width: '95%', backgroundColor: '#fff', alignSelf: 'center',
            marginBottom: 10, shadowOpacity: 0.8, shadowColor: '#aaa', justifyContent: 'center', borderRadius: 15
          }}>
            <View style={{ width: '100%', height: 1, backgroundColor: '#aaa' }} />
            <View style={{ width: '100%', height: 1, backgroundColor: '#aaa' }} />
            <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
              <TouchableOpacity 
               onPress={() => Linking.openURL(`tel:${booking.userdetails[0].mobile}`)} 
             //onPress={() => sendCALL(setLoading,() => console.log('send'), booking.userdetails[0].mobile )}
              style={{ flexDirection: 'row', padding: 10, width: '100%' }}>
                <Image style={{ width: 20, height: 20, tintColor: '#0EFF74', }} source={require('./../../Assets/call.png')} />
                <Text style={{ padding: 4, marginLeft: 5, fontSize: 12 }}>CALL WASHER</Text>
              </TouchableOpacity>
              <View style={{ width: 1, height: 45, backgroundColor: '#aaa' }} />
            
            </View>
            <View style={{ width: '100%', height: 1, backgroundColor: '#aaa' }} />
            <View style={{ flexDirection: 'row', padding: 5, marginLeft: 10, alignItems: 'center' }}>
              <View style={{ backgroundColor: '#445F98', width: 25, height: 25, borderRadius: 5, justifyContent: 'center', alignItems: 'center', marginLeft: 0, margin: 7 }}>
                <Image style={{ width: 20, height: 20, tintColor: '#FFF', }} source={require('../../Assets/smartphone.png')} />
              </View>

              <TextInput
                style={[styles.auth_textInput,]}
                placeholder="Type your message"
                placeholderTextColor={Colors.text_color}
                value={message}
                onChangeText={setMessage}
                autoCapitalize='none' />
              <TouchableOpacity
                // onPress={() => sendSMS(setLoading, () => setMessage(''), booking.washer_id, message)}
                onPress={() => sendSMSTWIL(setLoading,() => console.log('send'), booking.userdetails[0].mobile)}
                >

                <Text style={{ color: '#445F98', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>SEND</Text>
              </TouchableOpacity>
            </View>
      </View> */}

        <View style={{ flexDirection: 'row', marginTop: 'auto' }}>
          <TouchableOpacity onPress={() => navigation.navigate('JOB FINISHED', { booking })} style={[styles.btns, { backgroundColor: Colors.blue_color }]}>
            <Text style={styles.btnText}>Job Finished</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={toggleOverlay} style={[styles.btns, { backgroundColor: Colors.dark_orange }]}>
            <Text style={styles.btnText}>Add More Minutes</Text>
          </TouchableOpacity> */}
        </View>
      </LoadingView>
      <Overlay overlayStyle={{ borderRadius: 10, alignSelf: 'stretch', margin: 50 }} animationType="fade" isVisible={visible} onBackdropPress={toggleOverlay}>
        <AddMoreMinutesOverlay onAdd={onAddMoreMinutes} />
      </Overlay>
    </View>
  );
};
export default WorkInProgress;

const parseMilllisecond = ms => {
  const zeroPad = (num, places) => String(num).padStart(places, '0');
  let hour = Math.floor(ms / 3600000);
  let minute = Math.floor((ms % 3600000) / 60000);
  let sec = ((ms % 60000) / 1000).toFixed(0);
  return `${zeroPad(hour, 2)}:${zeroPad(minute, 2)}:${zeroPad(sec, 2)}`;
};

const AddMoreMinutesOverlay = ({ onAdd }) => {
  const [minutes, setMinutes] = useState(10)
  return (<View>
    <Text style={{ fontWeight: 'bold', textAlign: 'center', fontSize: 20, paddingBottom: 5 }}>Add More Minutes</Text>
    <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'space-evenly' }}>
      <TouchableOpacity onPress={() => setMinutes(cv => cv + 5)} style={[styles.detailContainer, { flex: 1, marginHorizontal: 0, backgroundColor: '#f4f4f4' }]}>
        <Icon name="add" color='black' size={40} />
      </TouchableOpacity>
      <Text style={{ fontSize: 40, fontWeight: 'bold', paddingHorizontal: 30 }}>{minutes}</Text>
      <TouchableOpacity disabled={minutes == 5} onPress={() => setMinutes(cv => cv - 5)} style={[styles.detailContainer, { flex: 1, marginHorizontal: 0, backgroundColor: '#f4f4f4', opacity: minutes == 5 ? .25 : 1 }]}>
        <Icon name="remove" color='black' size={40} />
      </TouchableOpacity>
    </View>
    <TouchableOpacity onPress={() => onAdd(minutes * 60)} style={{ padding: 15, marginTop: 5, backgroundColor: Colors.blue_color, alignItems: 'center', borderRadius: 5 }}>
      <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Add</Text>
    </TouchableOpacity>
  </View>)
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: 8,
    // paddingTop: 8,
    position: 'relative',
  },
  detailContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#CCC',
    borderWidth: 1,
    padding: 15,
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankContainer: {
    padding: 8,
    backgroundColor: Colors.blue_color,
    width: '40%',
    flexDirection: 'row',
    borderRadius: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 10,
  },

  btns: {
    padding: 20,
    width: '100%',
    textAlign: 'center',
  },

  btnText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
