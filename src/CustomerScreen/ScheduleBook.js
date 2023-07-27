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


const houtime = [{"ShowTime":"07:00 AM","time":"07:00","type":0,"status":0}, {"ShowTime":"07:30 AM","time":"07:30","type":0,"status":0}, {"ShowTime":"08:00 AM","time":"08:00","type":0,"status":0}, {"ShowTime":"08:30 AM","time":"08:30","type":0,"status":0}, {"ShowTime":"09:00 AM","time":"09:00","type":0,"status":0}, {"ShowTime":"09:30 AM","time":"09:30","type":0,"status":0}, {"ShowTime":"10:00 AM","time":"10:00","type":0,"status":0}, {"ShowTime":"10:30 AM","time":"10:30","type":0,"status":0}, {"ShowTime":"11:00 AM","time":"11:00","type":0,"status":0}, {"ShowTime":"11:30 AM","time":"11:30","type":0,"status":0}, {"ShowTime":"12:00 AM","time":"12:00","type":0,"status":0}, {"ShowTime":"12:30 AM","time":"12:30","type":0,"status":0}, {"ShowTime":"01:00 PM","time":"13:00","type":0,"status":0}, {"ShowTime":"01:30 PM","time":"13:30","type":0,"status":0}, {"ShowTime":"02:00 PM","time":"14:00","type":0,"status":0}, {"ShowTime":"02:30 PM","time":"14:30","type":0,"status":0}, {"ShowTime":"03:00 PM","time":"15:00","type":0,"status":0}, {"ShowTime":"03:30 PM","time":"15:30","type":0,"status":0}, {"ShowTime":"04:00 PM","time":"16:00","type":0,"status":0}, {"ShowTime":"04:30 PM","time":"16:30","type":0,"status":0}, {"ShowTime":"05:00 PM","time":"17:00","type":0,"status":0}, {"ShowTime":"05:30 PM","time":"17:30","type":0,"status":0}, {"ShowTime":"06:00 PM","time":"18:00","type":0,"status":0}, {"ShowTime":"06:30 PM","time":"18:30","type":0,"status":0}, {"ShowTime":"07:00 PM","time":"19:00","type":0,"status":0}]


const ScheduleBook = ({ navigation, route }) => {
    const { currentBooking, setCurrentBooking, getWahserCalendar, getnewwaherdataavilvle, getWasherSchedule, getExtraTimeFee, getServiceFee } = useContext(BookingContext)
    const [currentdate, setCurrentdate] = useState(0)
    const [timeSelected, setTimeSelected] = useState(false)
    const [isavilbeledate, setIsavilbeledate] = useState(false)
    const [localbooking, setLocalbooking] = useState();

    const [hourwetime,setHourwetime] = useState(houtime);
    const [daybooktime,setdaybooktime] = useState([]);

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
        let currentdate = moment(new Date()).format('YYYY-MM-DD');
        let choosedate = moment(date).format('YYYY-MM-DD');
        setTimeSelected(false);
        //function to handle the date change
        if(currentdate > choosedate)
        {
            Alert.alert('Valid date', 'Please select valid date.This date is older than today`s date')
        }
        else if(currentdate == choosedate)
        {
            setCurrentdate(0);
            setDate(new Date(date));
            checkholdatav(date); 
        }
        else{
            setCurrentdate(1);
            setDate(new Date(date));
            checkholdatav(date); 
        }

        
        // setShow(true)
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
        let senddata = "washer_id=" + currentBooking?.washer_id + "&date=" + moment(date).format('YYYY-MM-DD');
        
        getnewwaherdataavilvle(senddata).then(result => {
            console.log("=============result.data================",result)
            setIsavilbeledate(false)
            if (result.status == true) {
                const timelist = result.data;
                const newdata = [];
                var nretypeday = 0;
                for(let i=0; i < timelist.length;i++)
                { 
                    if(timelist[i].all_day=='1'){
                        nretypeday = 2;
                    }
                }
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
                addhourtimefun(newdata,nretypeday);
                
            }
            else{
                setHourwetime(houtime);
            }
        })

    }
   
    const addhourtimefun=(data,nretypeday)=>{
        let newtime = [];
        for(let i=0; i < houtime.length;i++)
        { 
            var type = nretypeday;
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
    const [pakegetime, setPakegetime] = useState('');
    const [busyDays, setBusyDays] = useState([... new Array(new Date().getDate() - 1)].map((value, index) => new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + (index + 1)))
    const [washerScheduleData, setWasherScheduleData] = useState([]);
    const [availableWasher, setAvailableWasher] = useState(true);
    const [extraTimeFee, setExtraTimeFee] = useState('Loading...')
    const [serviceFee, setServiceFee] = useState('Loading...')

    useEffect(() => {
        
        setCurrentBooking(cv => ({ ...cv, total: calculateTotalPrice(currentBooking, [extraTimeFee, serviceFee]) }))

        AsyncStorage.getItem('multipledatastoreschedule').then(result => {
            let storedata = JSON.parse(result) || []
            setLocalbooking(storedata);
            
        })
        AsyncStorage.getItem('Package_time').then(result => {
            let timeset = JSON.parse(result) || []
            setPakegetime(timeset);
        })
        getWasherScheduleData(moment(date).format('YYYY-MM-DD'))
        return () => afterScheduleScreen.current = null
    }, [])

    const getWasherScheduleData = async (date) => {
        var data = {
            washer_id: currentBooking?.washer_id,
            date: date
        }

        //await getWasherSchedule(data, setWasherScheduleData, setAvailableWasher);
    
    }

    const onContinue = () => {
        if (!timeSelected) return Alert.alert('Select time', 'Please select time before you continue.')
        setCurrentBooking(cv => ({ ...cv, booking_date: moment(date).format('YYYY-MM-DD'), booking_time: date.toLocaleTimeString() }))
        if (afterScheduleScreen.current != null) navigation.navigate(afterScheduleScreen.current)
        else navigation.navigate('Booking Review', route.params)
    }



    const checkBooking = (val, unavailabletime) => {
        
        setButtonAEnabled(false);
        if (unavailabletime) {
            if (unavailabletime.length > 0) {
                var newval = 2;
                for (let i = 0; i < unavailabletime.length; i++) {
                    if (unavailabletime[i] == "00:00") {
                        newval = 1;
                    }
                    else if (unavailabletime[i] == "" + val) {
                        newval = 1;
                    }
                }
                if (newval == 1) {
                    return '#2596BE';
                }
                else {
                    return 'white';
                }
            }
            else {
                return 'white';
            }
        }
        else {
            return 'white';
        }
    }

    const showTimer = () => {
        var showModal = show ? false : true
        setShow(showModal)
    }
     const changetimefor = (date) =>
    {
        let newdate =moment(date).format("h:mm a");
        return newdate 
    }
    return (
        <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
            {show && <DailySchedule dismiss={() => setShow(false)} item={show} date={date} hourwetime={hourwetime} onDChange={onDChange} checkBooking={checkBooking} pakegetime={pakegetime} currentdate={currentdate} daybooktime={daybooktime}/>}
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
                    {/* {
                        (isavilbeledate == false) ? (
                            
                        ) : (
                            <Text style={{ textAlign: 'center', fontSize: 16, marginTop: 10, fontWeight: 'bold', color: Colors.blue_color }}>Not available this day</Text>
                        )
                    } */}
                    <TouchableOpacity onPressIn={() => { showTimer() }} style={{ marginTop: 15, padding: 15, width: '85%', alignSelf: 'center', alignItems: 'center', borderRadius: 10, backgroundColor: '#f5f5f5', borderWidth: 1, borderColor: '#ccc', }}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#555' }}>{timeSelected ? changetimefor(date) : 'Select Time'}</Text>
                            </TouchableOpacity>
                </View>
            </ScrollView>
            <View style={{ justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }}>
                <TouchableOpacity
                    elevation={5}
                    onPress={() => changeStack('CustomerHomeStack')}
                    style={[styles.auth_btn, { backgroundColor: Colors.blue_color }]}
                    underlayColor='gray'
                    activeOpacity={0.8}>
                    <Text style={{ fontSize: 16, textAlign: 'center', color: Colors.buton_label, fontWeight: 'bold', marginTop: 3 }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    elevation={5}
                    onPress={onContinue}
                    style={styles.auth_btn}
                    underlayColor='gray'
                    activeOpacity={0.8}>
                    <Text style={{ fontSize: 16, textAlign: 'center', color: Colors.buton_label, fontWeight: 'bold', marginTop: 3 }}>Continue</Text>
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


const DailySchedule = ({ dismiss, item, date,hourwetime, onDChange, checkBooking,pakegetime,currentdate,daybooktime }) => {

    const { washerUnavailableSet, getWasherUnavailable } = useContext(BookingContext)
    const [fromtime, setFromtime] = useState("");
    const [totime, setTotime] = useState("");
    const [unavailabletime, setUnavailabletime] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const checktimeafterfour = (checktime,aplytime) =>{
        let newchecktime = checktime.replace(":", ".");
        let newaplytime = aplytime.replace(":", ".");
        if(Number(newchecktime) < Number(newaplytime))
        {
            return true;
        }
        else{
            return false;
        }
    }


    const onSelect = (index) => {
        var now = new Date();   
        now.setHours(now.getHours() + 4)
        // now.setHours(now.getHours())
        let currenttime = moment(now).format('HH:mm');
        let slottime = checkvaluefun(pakegetime,index.time,daybooktime);
        // if (index.type == '2') {
        //     Alert.alert('Washer is not available.')
        // }
       if (index.type == '1') {
            Alert.alert('Washer is Booked.')
        }
        else if(currentdate==0 && checktimeafterfour(currenttime+'',index.time+'') == false)
        {
            Alert.alert('Attention!','Available slots for booking will be open after 4 hours from the current time.')
        }
        else if(slottime==false){
            Alert.alert('This slot doesn`t have sufficent time as per choosen package.')
        }
        else if (index.type == '2') {
            index = index.time;
            index = index.split(/:/);
            date.setHours(parseInt(index[0]), parseInt(index[1]), 0, 0)
            
            onDChange(date)
           
        } 
        else if (index.type == '0') {
            index = index.time;
            index = index.split(/:/);
            date.setHours(parseInt(index[0]), parseInt(index[1]), 0, 0)
           

            onDChange(date)
           
        } 
    }
    const converttimetonumber = (time)=>{
        let checkstr = time.includes(":");
        if(checkstr==true)
        {
            return Number(time.replace(":", "."))
        }
        else{
            return Number(time)
        }
        
    }
   
    const convermintonumbertwo = (firsttime,secdtime)=>{

        let checkfirst = firsttime.includes(".");
        let firsttotaltime = 0;
        if(checkfirst==true)
        {
            let firstmin = Number(firsttime.split(".")[1]);
            let firsthr = Number(firsttime.split(".")[0])*60;
            firsttotaltime = firstmin+firsthr;
        }
        else{
            firsttotaltime = Number(firsttime.split(".")[0])*60;
        }


        let checksec = secdtime.includes(".");
        let sectotaltime = 0;
        if(checksec==true)
        {
            let secmin = Number(secdtime.split(".")[1]);
            let sechr = Number(secdtime.split(".")[0])*60;
            if(secmin > 0)
            {
                sectotaltime = 30+sechr;
            }
            else{
                sectotaltime = sechr;
            }
        }
        else{
            sectotaltime = Number(secdtime.split(".")[0])*60;
        }
        return firsttotaltime - sectotaltime

    }

    const checkvaluefun =  (stime,currenttim,listbizi) =>{
        let newcurrent = converttimetonumber(''+currenttim);
        let slottime = converttimetonumber(''+stime);
        let moreadd = [];
        if(listbizi.length > 0)
        {
            for(let i=0;i < listbizi.length;i++)
            {
               
                if(listbizi[i].type=='1')
                {
                    let checkcurrent = converttimetonumber(''+listbizi[i].time);
                    if(newcurrent < checkcurrent)
                    {
                        moreadd.push(checkcurrent); 
                    }
                }
                
            }
            if(moreadd.length > 0)
            {
                moreadd.sort(function(a, b){return a-b});
                let valuetotal = convermintonumbertwo(""+moreadd[0],""+newcurrent);
                if(valuetotal < slottime)
                {
                    return false;
                } 
                else
                {
                    return true;
                }
            }
            else{
                return true;
            }
        }
        else{
            return true;
        }
    }

  

   




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
                            data={hourwetime}
                            // data={[... new Array(48)]}
                            keyExtractor={(item, index) => index}
                            renderItem={({ item, index }) => <Hour item={item} index={index} select={onSelect}  />}
                            contentContainerStyle={{ padding: 10 }}
                            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                        />
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </View>
    )
}


const Hour = ({ item,select }) => (
    
    <TouchableOpacity onPress={() => select(item)} style={{ borderRadius: 10, borderWidth: 1.5, borderColor: '#ddd', padding: 15, alignItems: 'center', backgroundColor: item.type=='1'?'#c43636':item.type=='2'?'#2596BE' :'#FFFFFF' }} >
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: item.type=='0' ? 'black' : 'white' }} >
            {item.ShowTime}
        </Text>
    </TouchableOpacity>
)


