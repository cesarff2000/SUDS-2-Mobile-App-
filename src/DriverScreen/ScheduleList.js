// React Native Calendar Picker using react-native-calendar-picker

import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, Image, Pressable } from 'react-native';
// import TimePicker from 'react-native-simple-time-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import CalendarPicker from 'react-native-calendar-picker';
import Colors from '../../Constants/Colors';
import { Icon } from 'react-native-elements';
import { afterScheduleScreen, changeStack } from '../Navigation/NavigationService';
import { BookingContext } from '../Providers/BookingProvider';
import moment from 'moment';
import { Modal } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Alert } from 'react-native';
import FastImage from 'react-native-fast-image'
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select';
// import { StyleSheet, Text, View } from "react-native";

const houtime = [{"ShowTime":"All day","time":"00:00","type":0,"status":0},{"ShowTime":"07:00 AM","time":"07:00","type":0,"status":0}, {"ShowTime":"07:30 AM","time":"07:30","type":0,"status":0}, {"ShowTime":"08:00 AM","time":"08:00","type":0,"status":0}, {"ShowTime":"08:30 AM","time":"08:30","type":0,"status":0}, {"ShowTime":"09:00 AM","time":"09:00","type":0,"status":0}, {"ShowTime":"09:30 AM","time":"09:30","type":0,"status":0}, {"ShowTime":"10:00 AM","time":"10:00","type":0,"status":0}, {"ShowTime":"10:30 AM","time":"10:30","type":0,"status":0}, {"ShowTime":"11:00 AM","time":"11:00","type":0,"status":0}, {"ShowTime":"11:30 AM","time":"11:30","type":0,"status":0}, {"ShowTime":"12:00 AM","time":"12:00","type":0,"status":0}, {"ShowTime":"12:30 AM","time":"12:30","type":0,"status":0}, {"ShowTime":"01:00 PM","time":"13:00","type":0,"status":0}, {"ShowTime":"01:30 PM","time":"13:30","type":0,"status":0}, {"ShowTime":"02:00 PM","time":"14:00","type":0,"status":0}, {"ShowTime":"02:30 PM","time":"14:30","type":0,"status":0}, {"ShowTime":"03:00 PM","time":"15:00","type":0,"status":0}, {"ShowTime":"03:30 PM","time":"15:30","type":0,"status":0}, {"ShowTime":"04:00 PM","time":"16:00","type":0,"status":0}, {"ShowTime":"04:30 PM","time":"16:30","type":0,"status":0}, {"ShowTime":"05:00 PM","time":"17:00","type":0,"status":0}, {"ShowTime":"05:30 PM","time":"17:30","type":0,"status":0}, {"ShowTime":"06:00 PM","time":"18:00","type":0,"status":0}, {"ShowTime":"06:30 PM","time":"18:30","type":0,"status":0}, {"ShowTime":"07:00 PM","time":"19:00","type":0,"status":0}]


const ScheduleList = ({ navigation, route, disabled }) => {
     const { currentBooking, setCurrentBooking, getWahserCalendar, getWasherSchedule, washerUnavailableSet,getnewwaherdataavilvle } = useContext(BookingContext)
     const [timeSelected, setTimeSelected] = useState(false)
     const [state, setState] = useState({
          isChecked: '',
          coupnecode: '',
          hours: 'Select Hours',
          minutes: 'Select Minutes',
          weekday: [
               'Mon',
               'Tue',
               'Wed',
               'Thur',
               'Fri',
               'Sat',
               'Sun'
          ],
          months: [
               'January',
               'Febraury',
               'March',
               'April',
               'May',
               'June',
               'July',
               'August',
               'September',
               'October',
               'November',
               'December',
          ]
     })
     const [buttonAEnabled, setButtonAEnabled] = useState(true);
     const [date, setDate] = useState(new Date(Date.now()));
     const [modalVisible, setModalVisible] = useState(false);
     const [show, setShow] = useState(false);
     const [selectedWasherTime, setSelectedWasherTime] = useState(false);
     const [busyDays, setBusyDays] = useState([... new Array(new Date().getDate() - 1)].map((value, index) => new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + (index + 1)))
     const [washerScheduleData, setWasherScheduleData] = useState([]);
     const [availableWasher, setAvailableWasher] = useState(true);
     const [hourwetime,setHourwetime] = useState(houtime);
     const [daybooktime,setdaybooktime] = useState([]);

     const onChange = (date, type) => {
          let currentdate = moment(new Date()).format('YYYY-MM-DD');
          let choosedate = moment(date).format('YYYY-MM-DD');
          if(currentdate > choosedate)
          {
              Alert.alert('Valid date', 'Please select valid date.This date is older than today`s date')
          }
          else if(currentdate == choosedate)
          {
               setDate(new Date(date))
               checkholdatav(date); 
          }
          else{
               setDate(new Date(date))
               checkholdatav(date); 
          }
          console.log("",new Date(date))
     };
     function timeConvert(n) {
          var num = n;
          var hours = (num / 60);
          hours = ''+hours;
          let firstmin = Number(hours.split(".")[1]);
          let firsthr = Number(hours.split(".")[0]);
          var firstminadd = '00';
          if(firstmin > 0)
          {
               firstminadd= '30';
          }
          return firsthr+":"+firstminadd;
     }
     const timedifransebitween = (pktime,starttime)=>{
          let firstmin = Number(starttime.split(":")[1]);
          let firsthr = Number(starttime.split(":")[0])*60;
          let totalstartmin = firstmin+firsthr;
          let timeduration = (Number(pktime)/30)-1;
          let addtime = totalstartmin;
          let newtimeadd = [];
          for(let i=0;i < timeduration;i++)
          {
              addtime+=30;
              let hrtime =  timeConvert(addtime);
              newtimeadd.push(hrtime);
          }
          return newtimeadd;
     }
     const checkholdatav = (date) => {
          AsyncStorage.getItem("washer_id").then(async (result) => {
               let senddata = "washer_id=" + JSON.parse(result) + "&date=" + moment(date).format('YYYY-MM-DD');
                    getnewwaherdataavilvle(senddata).then(result => {
                         console.log("dsfsdfsdf",result)
                    if (result.status == true) {
                         const timelist = result.data;
                         const newdata = [];
                         if(result.isAllday=='1')
                         {
                              let newtime = [];
                              for(let i=0; i < houtime.length;i++)
                              { 
                                   var type = 2;
                                   newtime.push({"ShowTime":houtime[i].ShowTime,"time":houtime[i].time,"type":type,"status":0})
                              }
                              setHourwetime(newtime); 
                              setShow(true);
                         }
                         else{
                              for(let i=0; i < timelist.length;i++)
                              {
                                   if(timelist[i].type=='1')
                                   {
                                        if(Number(timelist[i].package_time) > 30 )
                                        {
                                             newdata.push({"time":timelist[i].start_time,"type":'1',"status":0})
                                             let totaltimeadd = timedifransebitween(timelist[i].package_time,timelist[i].start_time);
                                             for(let i = 0;i < totaltimeadd.length;i++)
                                             {
                                                  newdata.push({"time":totaltimeadd[i],"type":'1',"status":0})
                                             }
                                        }
                                        else{
                                             newdata.push({"time":timelist[i].start_time,"type":'1',"status":0})
                                        }
                                   }
                                   else{
                                        newdata.push({"time":timelist[i].start_time,"type":'2',"status":0})
                                   }
                              }
                              setdaybooktime(newdata);
                              addhourtimefun(newdata);
                              setShow(true)
                                
                         }
                        
                    }
                    else{
                         setHourwetime(houtime);
                         setShow(true)
                    }
               })
          })
  
     }
      
    const addhourtimefun=(data)=>{
          let newtime = [];
          for(let i=0; i < houtime.length;i++)
          { 
               var type = 0;
               for(let j=0; j < data.length;j++)
               {
                    if(houtime[i].time==data[j].time)
                    {
                         type = data[j].type;
                    }
               }
               newtime.push({"ShowTime":houtime[i].ShowTime,"time":houtime[i].time,"type":type,"status":0})
          }
          setHourwetime(newtime);
     }

     

     const onDChange = (selectedDate) => {
          console.log("Select Time please ",selectedDate)
          console.log("Select date please ",date)
          setTimeSelected(selectedDate)
          showTimer()
     };

     const checkBooking = (val, unavailabletime) => {
          setButtonAEnabled(false);
          if (unavailabletime) {
              if(unavailabletime.length > 0)
              {
                    var newval = 2; 
                    for(let i=0;i<unavailabletime.length;i++)
                    {
                         if(unavailabletime[i] == "00:00")
                         {
                              newval = 1; 
                         }
                         else if(unavailabletime[i] == ""+val)
                         {
                              newval = 1; 
                         }
                    }
                    if(newval == 1)
                    {
                         return '#2596BE';
                    }
                    else{
                         return 'white';
                    }
              }
              else{
                  return 'white';  
              }
          }
          else {
               return 'white';
          }
     }
     const newdataload =() =>{
          
          setTimeout(() => {
               checkholdatav(date);
          }, 2000);
     }

     

     const showTimer = () => {
          
          var showModal = show ? true : true
          setShow(showModal)
     }

     return (
          <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
               {
                    show ?
                         <DailySchedule
                              dismiss={() => setShow(false)}
                              item={show}
                              date={date}
                              hourwetime={hourwetime}
                              onDChange={onDChange}
                              checkBooking={checkBooking}
                              newdataload={newdataload}
                              
                         /> :
                    <></>
               }
               <ScrollView style={{ backgroundColor: '#fff' }}>
                    <View style={{ backgroundColor: '#e28c39' }}>
                         <Text style={styles.titleStyle}>
                              {currentBooking.vehicle}
                         </Text>
                    </View>
                    <View>
                         <CalendarPicker
                              monthYearHeaderWrapperStyle={{ fontSize: 40, marginTop: 10, fontWeight: 'bold' }}
                              startFromMonday={true}
                              
                              onPressIn={(date) => {
                                
                                   //showTimer()
                              }}
                              minDate={new Date(2021, 1, 1)}
                              maxDate={new Date(2050, 6, 3)}
                              weekdays={state.weekday}
                              months={state.months}
                              previousTitle="<"
                              nextTitle=">"
                              previousTitleStyle={{ fontSize: 45, fontWeight: '100', color: '#AD4B00', width: 55, height: 55, marginBottom: -10, marginTop: -10, }}
                              nextTitleStyle={{ fontSize: 45, fontWeight: '100', color: '#AD4B00', height: 55, width: 55, marginBottom: -10, marginTop: -10, marginRight: -28 }}
                              todayBackgroundColor="#e6ffe6"
                              selectMonthTitle={{ color: 'red' }}
                              todayTextStyle={{
                                   backgroundColor: Colors.dark_orange, width: 30, height: 30, color: '#fff', fontWeight: 'bold',
                                   textAlign: 'center', paddingTop: 5,
                              }}
                              disabledDates={busyDays.map(day => new Date(day))}
                              disabledDatesTextStyle={{ padding: 5, color: '#bbb', borderRadius: 3 }}
                              selectedDayColor="#66ff33"
                              selectedDayStyle={{
                                   backgroundColor: Colors.dark_orange, width: 30, height: 30, color: '#fff', fontWeight: 'bold',
                                   textAlign: 'center', paddingTop: 5, borderRadius: 0
                              }}
                              selectedDayTextColor="#000000"
                              scaleFactor={350}
                              textStyle={{
                                   color: '#000000',
                                   fontSize: 15, fontWeight: 'bold'
                              }}
                              onDateChange={onChange}
                         />
                         <View style={styles.textStyle}>
                              <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', }}>
                                   Selected Date :
                              </Text>
                              <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', }}>
                                   {date?.toDateString()}
                              </Text>
                         </View>
                         {
                              selectedWasherTime ?
                                   <View style={styles.titleStyle}>
                                        {
                                             <FlatList
                                                  data={washerScheduleData}
                                                  keyExtractor={(item, index) => index}
                                                  renderItem={({ item, index }) =>
                                                       <Hour item={item} index={index}
                                                            // select={onSelect}
                                                            selected={index == date.getHours()}
                                                            backgroundColor={checkBooking(item)} />
                                                  }
                                                  contentContainerStyle={{ padding: 10 }}
                                                  ItemSeparatorComponent={() => <View style={{ height: 10 }} />} 
                                             /> 
                                        }
                                   </View> :
                                   <Text></Text>
                         }
                    </View>
               </ScrollView>
          </SafeAreaView>

     )
}

export default ScheduleList

const styles = StyleSheet.create({

     textStyle: {
          marginTop: 10, backgroundColor: '#000', height: 55,
          justifyContent: 'center', alignItems: 'center',
          flexDirection: 'row'
     },
     titleStyle: {
          textAlign: 'center',
          fontSize: 17, color: '#fff',
          padding: 7, paddingVertical: 15, fontWeight: 'bold'
     },
     auth_btn: {
          backgroundColor: '#e28c39',
          alignItems: 'center',
          flex: 1,
          height: 60,
          justifyContent: 'center',
     },
     auth_textInput: {
          alignSelf: 'center',
          width: '93%',
          // borderWidth: 1,
          borderBottomWidth: 1,
          height: 40,
          color: Colors.text_color,
          marginTop: 10,
     },
     auth_btn: {

          paddingTop: 10,
          paddingBottom: 10,
          backgroundColor: Colors.buttom_color,
          width: 200,
          color: "white",
          flex: 1,
          height: 60,
          justifyContent: 'center',
     },
     add_btn: {

          backgroundColor: '#e28c39',
          alignItems: 'center',
          width: '45%',
          height: 40,
          justifyContent: 'center', borderRadius: 20
     },

     centeredView: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 22,
     },
     modalView: {
          margin: 20,
          backgroundColor: "white",
          borderRadius: 20,
          padding: 35,
          alignItems: "center",
          shadowColor: "#000",
          width: 300,

     },
     button: {
          borderRadius: 8,
          padding: 7,
          elevation: 2
     },
     buttonOpen: {
          backgroundColor: "#F194FF",
     },
     buttonClose: {
          backgroundColor: "#2196F3",
          marginRight: 5
     },
     textStyle: {
          color: "white",
          fontWeight: "bold",
          textAlign: "center",
          width: 50,
          height: 20
     },
     modalText: {
          marginBottom: 15,
          textAlign: "center",
          fontSize: 20
     }
});

const DailySchedule = ({ dismiss, item, date,hourwetime, onDChange, checkBooking,newdataload}) => {
     const { washerUnavailableSet, getWasherUnavailable } = useContext(BookingContext)
     const [fromtime, setFromtime] = useState([]);
     const [totime, setTotime] = useState("");
     const [unavailableWasher, setUnAvailableWasher] = useState(true);
     const [unavailabletime, setUnavailabletime] = useState([]);
     const onSelect = (index) => {
          if (index.type == '0') {
               setModalVisible(true);
               index = index.time;
               //index = index.split(/:/);
               onDChange(index);
               setFromtime(index);
          } else if(index.type == '1') {
               setModalVisible(false);
               Alert.alert('This slot is booked.')
          } else if (index.type == '2') {
               Alert.alert('You are not available in this slot')
          }
     }
     const [modalVisible, setModalVisible] = useState(false);

     
     const Hour = ({ item,onSelect }) => (
          <TouchableOpacity onPress={() => onSelect(item)} style={{ borderRadius: 10, borderWidth: 1.5, borderColor: '#ddd', padding: 15, alignItems: 'center', backgroundColor: item.type=='1'?'#c43636':item.type=='2'?'#2596BE' :'#FFFFFF' }} >
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: item.type=='0' ? 'black' : 'white' }} >
                  {item.ShowTime}
              </Text>
          </TouchableOpacity>
      )

    
     const washerUnavailableSetData = async () => {
          AsyncStorage.getItem("washer_id").then(async (result) => {
               var dat = new Date(date).toISOString().slice(0, 10);

               var alldayty=0;
               let fromtimeto = fromtime.split(/:/);

               if(fromtimeto[0]=="00")
               {
                   alldayty=1; 
               }
               let end_time = [...fromtimeto];
               end_time[1] = Number(end_time[1]) + 30;
               if (Number(end_time[1]) > 59) {
                    end_time[0] = Number(end_time[0]) + 1;
                    end_time[1] = "00";
               }
               end_time = end_time.join(":");
               
               var data = {
                    washer_id: JSON.parse(result),
                    unavailable_date: dat,
                    start_time: fromtimeto.join(":"),
                    all_day:alldayty,
                    end_time
               }
               await washerUnavailableSet(data);
               dismiss();
          })
     }
     return (
          <View>
               <Modal
                    transparent={true}
                    hardwareAccelerated
                    statusBarTranslucent
                    animationType="fade">
                    <TouchableOpacity activeOpacity={1} onPress={dismiss} style={{ flex: 1, backgroundColor: "#00000080", alignItems: 'center', justifyContent: 'center' }} >
                         <TouchableOpacity activeOpacity={1} style={{ backgroundColor: 'white', borderRadius: 20, position: 'absolute', marginHorizontal: 25, overflow: 'hidden', height: '80%' }}>
                              <View style={{ flexDirection: 'row', backgroundColor: '#ccc', padding: 16, width: 300, justifyContent: 'space-between' }}>
                                   <View style={{ flexDirection: 'row', display: 'flex', justifyContent: 'center', alignItems: 'center', width: 150 }}>
                                        <Icon name="calendar-today" />
                                        <Text style={{ fontSize: 16, paddingHorizontal: 10 }}>{date.toDateString()}</Text>
                                   </View>
                                   <View style={{ backgroundColor: '#ccc', padding: 10, width: 150 }}>
                                        <View style={{ width: '100%', flexDirection: 'row', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', paddingBottom: 4 }}>
                                             <FastImage tintColor="#c43636" source={require(`../../Assets/square.png`)} style={{ width: 20, height: 20, marginRight: 5 }} />
                                             <Text style={{ color: '#c43636', fontWeight: '800' }}>Booked</Text>
                                        </View>
                                        <View style={{ width: '100%', flexDirection: 'row', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', paddingBottom: 4 }}>
                                             <FastImage tintColor="white" source={require(`../../Assets/square.png`)} style={{ width: 20, height: 20, marginRight: 5 }} />
                                             <Text style={{ color: 'white', fontWeight: '800' }}>Avaliable</Text>
                                        </View>
                                        <View style={{ width: '100%', flexDirection: 'row', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', paddingBottom: 4 }}>
                                             <FastImage tintColor="#2596BE" source={require(`../../Assets/square.png`)} style={{ width: 20, height: 20, marginRight: 5 }} />
                                             <Text style={{ color: '#2596BE', fontWeight: '800' }}>Unavaliable</Text>
                                        </View>
                                   </View>
                              </View>
                              <FlatList
                                   data={hourwetime}
                                   keyExtractor={(item, index) => index}
                                   renderItem={
                                        ({ item, index }) =>
                                             <Hour item={item} index={index} onSelect={onSelect}/>
                                   }
                                   onPress={() => {
                                        setTimeout(() => {
                                             setModalVisible(true);
                                        }, 1000);

                                   }}
                                   contentContainerStyle={{ padding: 10 }}
                                   ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                              />

                         </TouchableOpacity>
                    </TouchableOpacity>

                    <Modal
                         animationType="slide"
                         transparent={true}
                         visible={modalVisible}
                         onRequestClose={() => {
                              Alert.alert("Modal has been closed.");
                              setModalVisible(!modalVisible);
                         }}
                    >
                         <View style={styles.centeredView}>
                              <View style={styles.modalView}>
                                   <Text style={styles.modalText}>Would you like to mark the Time as Unavailable?</Text>
                                   <Text style={styles.modalText}>Click Yes to UnAvail, No to continue</Text>
                                   <View style={{ flexDirection: 'row', }} >
                                        <Pressable
                                             style={[styles.button, styles.buttonClose]}
                                             onPress={() => {
                                                  setModalVisible(false);
                                                  washerUnavailableSetData(moment(date).format('YYYY-MM-DD'))
                                             }}
                                        >
                                             <Text style={styles.textStyle}>Yes</Text>
                                        </Pressable>

                                        <Pressable
                                             style={[styles.button, styles.buttonClose]}
                                             onPress={() => {
                                                  setModalVisible(false);
                                                 
                                             }}
                                        >
                                             <Text style={styles.textStyle}>No</Text>
                                        </Pressable>
                                   </View>
                              </View>
                         </View>
                    </Modal>
               </Modal>
               <View style={{ justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }}>

               </View>
          </View>
     )
}

const pickerSelectStyles = StyleSheet.create({
     centeredView: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 22
     },
     modalView: {
          margin: 20,
          backgroundColor: "white",
          borderRadius: 20,
          padding: 35,
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: {
               width: 0,
               height: 2
          },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5
     },
     button: {
          borderRadius: 20,
          padding: 10,
          elevation: 2
     },
     buttonOpen: {
          backgroundColor: "#F194FF",
     },
     buttonClose: {
          backgroundColor: "#2196F3",
     },
     textStyle: {
          color: "white",
          fontWeight: "bold",
          textAlign: "center"
     },
     modalText: {
          marginBottom: 15,
          textAlign: "center"
     },

     inputIOS: {
          fontSize: 16,
          paddingVertical: 12,
          paddingHorizontal: 10,
          borderWidth: 1,
          borderColor: 'gray',
          borderRadius: 4,
          color: 'black',
          paddingRight: 30 // to ensure the text is never behind the icon
     },
     inputAndroid: {
          fontSize: 16,
          paddingHorizontal: 10,
          paddingVertical: 8,
          borderWidth: 0.5,
          borderColor: 'purple',
          borderRadius: 8,
          color: 'black',
          paddingRight: 30 // to ensure the text is never behind the icon
     }
});
