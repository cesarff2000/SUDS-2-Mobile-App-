// React Native Calendar Picker using react-native-calendar-picker

import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, Image } from 'react-native';
// import TimePicker from 'react-native-simple-time-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import CalendarPicker from 'react-native-calendar-picker';
import Colors from '../../Constants/Colors';
import { Icon } from 'react-native-elements';
import { afterScheduleScreen, changeStack } from '../Navigation/NavigationService';
import { BookingContext, calculateTotalPrice } from '../Providers/BookingProvider';
import moment from 'moment';
import { Modal } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Alert } from 'react-native';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';


const ScheduleBook = ({ navigation, route }) => {
  const { currentBooking, setCurrentBooking, getWahserCalendar, getWasherSchedule, getExtraTimeFee, getServiceFee } = useContext(BookingContext)

  const [timeSelected, setTimeSelected] = useState(false)
  const [localbooking, setLocalbooking] = useState()

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
  const onChange = (date, type) => {
    //function to handle the date change
    console.log('date..', moment(date).format('YYYY-MM-DD'), new Date(date).toLocaleTimeString())
    setDate(new Date(date))
    getWasherScheduleData(moment(date).format('YYYY-MM-DD'))

    // setShow(true)
  };

  const onDChange = (selectedDate) => {
    console.log("onDchange", selectedDate);
    const currentDate = selectedDate || date;
    // setShow(Platform.OS === 'ios');
    setShow(false);
    setTimeSelected(true)
    setDate(currentDate);
    showTimer()
  };
  const getItem = (name) => {

    Alert.alert(name);

  }

  const [buttonAEnabled, setButtonAEnabled] = useState(true);
  const [date, setDate] = useState(new Date(Date.now()));
  const [show, setShow] = useState(false);
  const [busyDays, setBusyDays] = useState([... new Array(new Date().getDate() - 1)].map((value, index) => new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + (index + 1)))
  const [washerScheduleData, setWasherScheduleData] = useState([]);
  const [availableWasher, setAvailableWasher] = useState(true);
  const [extraTimeFee, setExtraTimeFee] = useState('Loading...')
  const [serviceFee, setServiceFee] = useState('Loading...')

  useEffect(() => {
    // getWahserCalendar(setBusyDays, currentBooking?.washer_id)
    setCurrentBooking(cv => ({ ...cv, total: calculateTotalPrice(currentBooking, [extraTimeFee, serviceFee]) }))

    AsyncStorage.getItem('multipledatastoreschedule').then(result => {
      let storedata = JSON.parse(result) || []
      setLocalbooking(storedata);
      console.log('res1...', storedata)
    })


    getWasherScheduleData(moment(date).format('YYYY-MM-DD'))
    return () => afterScheduleScreen.current = null
  }, [])

  const getWasherScheduleData = async (date) => {
    var data = {
      washer_id: currentBooking?.washer_id,
      date: date
    }
    console.log("getWasherScheduleData1...", data)
    await getWasherSchedule(data, setWasherScheduleData, setAvailableWasher);
  }

  const onContinue = () => {
    if (!timeSelected) return Alert.alert('Select time', 'Please select time before you continue.')
    setCurrentBooking(cv => ({ ...cv, booking_date: moment(date).format('YYYY-MM-DD'), booking_time: date.toLocaleTimeString() }))
    if (afterScheduleScreen.current != null) navigation.navigate(afterScheduleScreen.current)
    else navigation.navigate('Booking Review', route.params)
  }



  const checkBooking = (val, unavailabletime) => {
    // setButtonAEnabled(false);
    console.log('washerScheduleData3...', washerScheduleData)
    if (availableWasher) {
      console.log("unavailabletime",unavailabletime)
      if (unavailabletime.length > 0 && unavailabletime.includes(val)) {
        return '#2596BE';
      }
      else if (washerScheduleData.length > 0 && washerScheduleData[0].time.includes(val)) {
        return '#c43636';
      }
      else {
        return 'white';
      }
    } 
    else {
      return '#2596BE';
    }
  }

  const showTimer = () => {
    var showModal = show ? false : true
    setShow(showModal)
  }

  return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
      {show && <DailySchedule dismiss={() => setShow(false)} item={show} date={date} onDChange={onDChange} checkBooking={checkBooking} />}
      <ScrollView style={{ backgroundColor: '#fff' }}>
        <View style={{ backgroundColor: '#e28c39' }}>
          <Text style={styles.titleStyle}>

            {localbooking?.map((data, i) =>
              <Text key={i}>
                {data.vehiclename}
              </Text>
            )}

          </Text>
        </View>
        <View>
          <CalendarPicker
            monthYearHeaderWrapperStyle={{ fontSize: 40, marginTop: 10, fontWeight: 'bold' }}
            startFromMonday={true}
            // allowRangeSelection={true}
            // allowBackwardRangeSelect={false}
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
            // disabledDates = {[new Date(2022,6,23)]}
            todayTextStyle={{
              backgroundColor: Colors.dark_orange, width: 30, height: 30, color: '#fff', fontWeight: 'bold',
              textAlign: 'center', paddingTop: 5,
            }}

            disabledDates={busyDays.map((day) => new Date(day))}
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
          <TouchableOpacity onPressIn={() => { showTimer() }} style={{ marginTop: 15, padding: 15, width: '85%', alignSelf: 'center', alignItems: 'center', borderRadius: 10, backgroundColor: '#f5f5f5', borderWidth: 1, borderColor: '#ccc', }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#555' }}>{timeSelected ? date.toLocaleTimeString() : 'Select Time'}</Text>
          </TouchableOpacity>

          {/* <Text style={{ textAlign: 'center', fontSize: 16, marginTop: 10, fontWeight: 'bold', color: Colors.blue_color }}>Total Hours: 2</Text> */}
        </View>
      </ScrollView>
      <View style={{ justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }}>
        <TouchableOpacity
          elevation={5}
          onPress={onContinue}
          style={styles.auth_btn}
          underlayColor='gray'
          activeOpacity={0.8}>
          <Text style={{ fontSize: 16, textAlign: 'center', color: Colors.buton_label, fontWeight: 'bold', marginTop: 3 }}>Continue</Text>
        </TouchableOpacity>

        <TouchableOpacity
          elevation={5}
          onPress={() => changeStack('CustomerHomeStack')}
          style={[styles.auth_btn, { backgroundColor: Colors.blue_color }]}
          underlayColor='gray'
          activeOpacity={0.8}>
          <Text style={{ fontSize: 16, textAlign: 'center', color: Colors.buton_label, fontWeight: 'bold', marginTop: 3 }}>Cancel</Text>

        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )

}

export default ScheduleBook

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blue_color,
  },
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
});

const DailySchedule = ({ dismiss, item, date, onDChange, checkBooking }) => {

  const { washerUnavailableSet, getWasherUnavailable } = useContext(BookingContext)
  const [fromtime, setFromtime] = useState("");
  const [totime, setTotime] = useState("");
  const [unavailabletime, setUnavailabletime] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const onSelect = (index, color) => {
    console.log("onSelect", index, color);
    if (color == 'white') {
      index = index.split(/:/);
      date.setHours(parseInt(index[0]), parseInt(index[1]), 0, 0)
      onDChange(date)
    } else if (color == '#c43636') {
      Alert.alert('This slot is already booked. You can select the another slot.')
    } else if (color == '#2596BE') {
      Alert.alert('Washer is not available.')
    }
  }

  useEffect(async () => {
    washerUnavailableSetData(moment(date).format('YYYY-MM-DD'))

    let end_time = fromtime.split(":");
    if (end_time[0] && end_time[1]) {
      await getWasherUnavailable(new Date(date).toISOString().slice(0, 10), setUnavailabletime);

    }
  }, [])

  const washerUnavailableSetData = async () => {
    AsyncStorage.getItem("washer_id").then(async (result) => {
      let end_time = fromtime.split(":");
      end_time[1] = Number(end_time[1]) + 30;
      if (Number(end_time[1]) > 59) {
        end_time[0] = Number(end_time[0]) + 1;
        end_time[1] = "00";
      }
      end_time = end_time.join(":");
      let dat = new Date(date).toISOString().slice(0, 10); 
      var data = {
        washer_id: JSON.parse(result),
        unavailable_date: dat,
        start_time: fromtime,
        end_time
      }
      console.log("id...", data)
      await washerUnavailableSet(data);
      await getWasherUnavailable(data.unavailable_date, setUnavailabletime);
      console.log("setUnavailabletime..", unavailabletime)
      if (washerScheduleData) {
        console.log("washerScheduleData..", washerScheduleData)
        if (washerScheduleData.length == 0) {
          let a = unavailable_date;
          let b = [...busyDays];
          setSelectedWasherTime(true)
        }
      }
    })
  }

  
  // const onSelect = (index, color) => {
  //   if (color == 'white') {
  //     setModalVisible(true);
  //     // index = index.split(/:/);
  //     // date.setHours(parseInt(index[0]), parseInt(index[1]), 0, 0)
  //     // // date.setHours(index,0,0,0)
  //     // onDChange(date)
  //     setFromtime(index);
  //     console.log("index",index)
  //   } else if (color == '#c43636') {
  //     setModalVisible(false);
  //     Alert.alert('This slot is already booked. You can select the another slot.')
  //   } else if (color == '#2596BE') {
  //     Alert.alert('Washer is not available.')
  //   }

  // }


  return (
    <View >
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
              data={["07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00"]}
              // data={[... new Array(48)]}
              keyExtractor={(item, index) => index}
              renderItem={({ item, index }) => <Hour item={item} index={index} select={onSelect} selected={index == date.getHours()} backgroundColor={checkBooking(item, unavailabletime)} />}
              contentContainerStyle={{ padding: 10 }}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}


const Hour = ({ item, index, selected, select, backgroundColor }) => (
  <TouchableOpacity onPress={() => select(item, backgroundColor)} style={{ borderRadius: 10, borderWidth: 1.5, borderColor: '#ddd', padding: 15, alignItems: 'center', backgroundColor: backgroundColor }} >
    {/* <TouchableOpacity onPress={()=>select(item)} style={{ borderRadius: 10, borderWidth: 1.5, borderColor: '#ddd', padding: 15, alignItems: 'center', backgroundColor : selected ?Colors.blue_color :'white' }} >
    
  </TouchableOpacity> */}
    {/* <Text style={{ fontSize: 16, fontWeight: 'bold', color : selected ? 'white' : 'black' }} > */}
    <Text style={{ fontSize: 16, fontWeight: 'bold', color: backgroundColor == 'white' ? 'black' : 'white' }} >
      {/* {index%12 == 0 ? '12' : index % 12}:00 {index > 11 ? 'PM' : 'AM'}  */}
      {item}
      {/* { index % 2 == 0  ? getTime(index, true) : getTime(index, false) } */}
    </Text>
  </TouchableOpacity>
)

// React Native Time Picker – To Pick the Time using Native Time Picker
// https://aboutreact.com/react-native-timepicker/

// import React in our code
// import React, {useState} from 'react';

// // import all the components we are going to use
// import {SafeAreaView, StyleSheet, Text, View} from 'react-native';

// //import TimePicker from the package we installed
// import TimePicker from 'react-native-simple-time-picker';

// const App = () => {
//   const [selectedHours, setSelectedHours] = useState(0);
//   const [selectedMinutes, setSelectedMinutes] = useState(0);

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.container}>
//         <Text style={styles.title}>
//           React Native Time Picker –
//           To Pick the Time using Native Time Picker
//         </Text>
//         <Text>
//           Selected Time: {selectedHours}:{selectedMinutes}
//         </Text>
//         <TimePicker
//           selectedHours={selectedHours}
//           //initial Hourse value
//           selectedMinutes={selectedMinutes}
//           //initial Minutes value
//           onChange={(hours, minutes) => {
//             setSelectedHours(hours);
//             setSelectedMinutes(minutes);
//           }}
//         />
//       </View>
//     </SafeAreaView>
//   );
// };

// export default App;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   title: {
//     textAlign: 'center',
//     fontSize: 20,
//     fontWeight: 'bold',
//     padding: 20,
//   },
// });

// import React, {useState} from 'react';
// import {View, Button, Platform} from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';

// const App = () => {
//   const [date, setDate] = useState(new Date(1598051730000));
//   const [mode, setMode] = useState('date');
//   const [show, setShow] = useState(false);

//   const onChange = (event, selectedDate) => {
//     const currentDate = selectedDate || date;
//     setShow(Platform.OS === 'ios');
//     setDate(currentDate);
//   };

//   const showMode = currentMode => {
//     setShow(true);
//     setMode(currentMode);
//   };



//   return (
//     <View>
//       <View>
//         <Button onPress={showDatepicker} title="Show date picker!" />
//       </View>
//       <View>
//         <Button onPress={showTimepicker} title="Show time picker!" />
//       </View>
//       {show && (
//         <DateTimePicker
//           testID="dateTimePicker"
//           timeZoneOffsetInMinutes={0}
//           value={date}
//           mode={'time'}
//           is24Hour={true}
//           display="default"
//           onChange={onChange}
//         />
//       )}
//     </View>
//   );
// };

// export default App;