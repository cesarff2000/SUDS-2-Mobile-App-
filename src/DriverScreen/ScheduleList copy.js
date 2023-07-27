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


const ScheduleList = ({ navigation, route, disabled }) => {
     const { currentBooking, setCurrentBooking, getWahserCalendar, getWasherSchedule, washerUnavailableSet } = useContext(BookingContext)
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

     const onChange = (date, type) => {
          setDate(new Date(date))
          setShow(true)
          getWasherScheduleData(moment(date).format('YYYY-MM-DD'))
     };

     const onChangeUnavailble = () => {
          setTimeout(() => {
               setModalVisible(true);
          }, 1000);
     };

     const onDChange = (selectedDate) => {
          const currentDate = selectedDate || date;
          if (selectedDate instanceof Date && typeof date.selectedDate === 'function') {
               setTimeSelected(true)
               setDate(selectedDate);
               showTimer()
          }

     };

     const timemodel = (name) => {
          Alert.alert(name);
     }

     useEffect(() => {
          getWasherScheduleData(moment(date).format('YYYY-MM-DD'))
          return () => afterScheduleScreen.current = null
     }, [])

     const getWasherScheduleData = async (date, extra) => {
          AsyncStorage.getItem("washer_id").then(async (result) => {

               console.log("I am call===============")
               var data = {
                    washer_id: JSON.parse(result),
                    date: date
               }
               await getWasherSchedule(data, setWasherScheduleData, setAvailableWasher);
          })
     }


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
                              onDChange={onDChange}
                              checkBooking={checkBooking}
                              setSelectedWasherTime={setSelectedWasherTime}
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

const DailySchedule = ({ dismiss, item, date, onDChange, checkBooking, setSelectedWasherTime }) => {
     const { washerUnavailableSet, getWasherUnavailable } = useContext(BookingContext)
     const [fromtime, setFromtime] = useState([]);
     const [totime, setTotime] = useState("");
     const [unavailableWasher, setUnAvailableWasher] = useState(true);
     const [unavailabletime, setUnavailabletime] = useState([]);
     const onSelect = (index, color) => {
          if (color == 'white') {
               setModalVisible(true);
               index = index.split(/:/);
          
               date.setHours(parseInt(index[0]), parseInt(index[1]), 0, 0);
               onDChange(date);
               setFromtime(index);
            
          } else if (color == '#c43636') {
               setModalVisible(false);
               Alert.alert('This slot is already booked. You can select the another slot.')
          } else if (color == '#2596BE') {
               Alert.alert('Washer is not available.')
          }

     }
     const [modalVisible, setModalVisible] = useState(false);

     let showheader = (item)=>{
          if(item=='00:00'){
               return "All day";
          }
          else{
               return item;
          }
     }
     const Hour = ({ item, index, selected, select, backgroundColor }) => (
          <TouchableOpacity onPress={() => { onSelect(item, backgroundColor); }} style={{ borderRadius: 10, borderWidth: 1.5, borderColor: '#ddd', padding: 15, alignItems: 'center', backgroundColor: backgroundColor }} >
               <Text style={{ fontSize: 16, fontWeight: 'bold', color: backgroundColor == 'white' ? 'black' : 'white' }} >
                    {showheader(item)}
               </Text>
          </TouchableOpacity>
     )

     useEffect(async () => {
          await getWasherUnavailable(new Date(date).toISOString().slice(0, 10), setUnavailabletime);
     }, [])
     const washerUnavailableSetData = async () => {
          AsyncStorage.getItem("washer_id").then(async (result) => {
               console.log(date);

               var dat = new Date(date).toISOString().slice(0, 10);
               var alldayty=0;
               if(fromtime[0]=="00")
               {
                   alldayty=1; 
               }
               let end_time = [...fromtime];
               end_time[1] = Number(end_time[1]) + 30;
               if (Number(end_time[1]) > 59) {
                    end_time[0] = Number(end_time[0]) + 1;
                    end_time[1] = "00";
               }
               end_time = end_time.join(":");
               
               var data = {
                    washer_id: JSON.parse(result),
                    unavailable_date: dat,
                    start_time: fromtime.join(":"),
                    all_day:alldayty,
                    end_time
               }
               if(alldayty==1)
               {
                    dismiss();
               }
               await washerUnavailableSet(data);
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
                                   data={["00:00","07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00"]}
                                   keyExtractor={(item, index) => index}
                                   renderItem={
                                        ({ item, index }) =>
                                             <Hour item={item} index={index} selected={index == date.getHours()}
                                                  backgroundColor={checkBooking(item, unavailabletime)} />
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
                                                  // setShow(true)
                                                  washerUnavailableSetData(moment(date).format('YYYY-MM-DD'))
                                                  //getWasherScheduleData(moment(date).format('YYYY-MM-DD'),"extra")
                                             }}
                                        >
                                             <Text style={styles.textStyle}>Yes</Text>
                                        </Pressable>

                                        <Pressable
                                             style={[styles.button, styles.buttonClose]}
                                             onPress={() => {
                                                  setModalVisible(false);
                                                  // washerUnavailableSetData()
                                                  //getWasherScheduleData(moment(date).format('YYYY-MM-DD'))
                                                  setSelectedWasherTime(true)
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
