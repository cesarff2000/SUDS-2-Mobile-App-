// React Native Calendar Picker using react-native-calendar-picker

import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, View, Text,StatusBar,TouchableOpacity,Image} from 'react-native';

// import CalendarPicker from 'react-native-calendar-picker';
import { Header, Icon, Avatar } from 'react-native-elements';
import Colors from '../../Constants/Colors';

  export default class Logout extends React.Component {
    static navigationOptions = {
      
        drawerLabel: 'Logout',
        drawerIcon: ({ tintColor }) => (
          <View>
          
      <Image  style={{width:23,height:25,tintColor:'#FFF'}} source={require('../../Assets/logout.png')}/> 
      </View>
        ),
      };
componentWillMount(){
  const { navigation } = this.props;
   navigation.navigate('AuthStack')   
}

    render() {
      const { navigation } = this.props;
  return (
    <View style={{flex:1,backgroundColor:'#fff'}}>

        {/* <StatusBar translucent backgroundColor='transparent' barStyle='dark-content' /> */}
                {/* <Header
                    statusBarProps={{ barStyle: 'light-content' }}
                    height={79}
                    containerStyle={{ elevation: 0, justifyContent: 'center', borderBottomWidth: 0 }}
                    backgroundColor={Colors.blue_color}
                    placement={"left"}
                    leftComponent={
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('SelectAddOns') }}>
                            <Image style={{ width: 25, height: 25, tintColor: '#fff', marginLeft: 10 }} source={require('../../Assets/back_arrow.png')} />
                        </TouchableOpacity>
                    }
                    centerComponent={
                        <Text style={{ width: '100%', color: '#fff', fontWeight: 'bold', fontSize: 18, textAlign: 'center', marginTop: 5, marginLeft: 0, height: 30 }}>SCHEDULE</Text>
                    }
                /> */}
     
     {/* <TouchableOpacity 
onPress={() => { navigation.navigate('AuthStack'); }}>
  <Text style={{textAlign:'center',fontSize:22}}>LOGOUT</Text>
     </TouchableOpacity> */}
<SafeAreaView style={{backgroundColor:'#e28c39'}}/>
    </View>
  );
};
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
 
    backgroundColor: Colors.blue_color,
  
  },
  textStyle: {
    marginTop: 10,backgroundColor:'#000',height:35,justifyContent:'center',alignItems:'center'
  },
  titleStyle: {
    textAlign: 'center',
    fontSize: 17,color:'#fff',
    padding:7
  },
  auth_btn: {

    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#e28c39',

    width: '100%',
    height: 40,
    justifyContent: 'center',
},
});