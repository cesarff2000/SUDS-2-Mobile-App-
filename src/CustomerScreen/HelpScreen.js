import React from 'react';
import { StyleSheet, Text, View, Image, StatusBar,SafeAreaView, TouchableOpacity, TextInput,Button ,ImageBackground} from 'react-native';

import { Header, Icon, Avatar } from 'react-native-elements';
import Colors from '../../Constants/Colors';

export default class MyNotificationsScreen extends React.Component {
    static navigationOptions = {
      
      drawerLabel: 'Help',
      drawerIcon: ({ tintColor }) => (
        <View>
        
    <Image  style={{width:25,height:25,tintColor:'#FFF'}} source={require('../../Assets/help.png')}/> 
    </View>
      ),
    };
  
    render() {
      const { navigation } = this.props;
      return (
        <View style={{flex:1}}>
                          <StatusBar translucent backgroundColor='transparent' barStyle='dark-content' />
                          {/* <Header
                    statusBarProps={{ barStyle: 'light-content' }}
                  height={79}
                    containerStyle={{ elevation: 0, justifyContent: 'center', borderBottomWidth: 0 }}
                    backgroundColor={Colors.blue_color}
                    placement={"left"}
                    leftComponent={
                      <TouchableOpacity  onPress={() => {this.props.navigation.openDrawer();}}>
                      <Image style={{width:25,height:25,tintColor:'#fff',marginTop:5}} source={require('../../Assets/menu.png')}/>

                 </TouchableOpacity> 
                    }
                  centerComponent={
                    <Text style={{ width: '100%', color: '#fff', fontWeight:'bold', fontSize:18,textAlign:'center',marginTop:5,marginLeft:0,height:30}}>HELP</Text>
                }
                /> */}
                                <ImageBackground style={{width:'100%',height:'100%',flex:1, }} source={require('../../Assets/bg_img.png')}>
                                <SafeAreaView/>
       
                <Image  style={{width:'100%',marginTop:15, height:70,resizeMode:'contain'}} source={require('../../Assets/logo2.png')}></Image>
                <Image  style={{width:'100%',height:140,resizeMode:'contain',marginTop:70}} source={require('../../Assets/logo_icon.png')}></Image>
              <View style={{alignItems:'center',justifyContent:'center',flex:1}}> 

              <Text style={{color:Colors.blue_color,fontSize:20,fontWeight:'bold',textAlign:'center',}}>CONNECTS WITH US</Text>
          
 
              <Text style={{color:Colors.text_white,fontSize:17,fontWeight:'bold',textAlign:'center',marginTop:10}}>support@suds-2-u.com</Text>
              <Text style={{color:Colors.text_white,fontSize:17,fontWeight:'bold',textAlign:'center',marginTop:10}}>512-586-8786</Text>
              </View>
              <View style={{justifyContent:'flex-end',marginBottom:20}}> 
              <Text style={{color:Colors.text_white,fontSize:15,fontWeight:'500',textAlign:'center',marginTop:10}}>@ 2021 SUDS-2-U. All rights reserved</Text>
            
              </View>
              <SafeAreaView/>
                </ImageBackground>
             
        </View>
      );
    }
  }
  
  // const styles = StyleSheet.create({
  //   icon: {
  //     width: 24,
  //     height: 24,
  //   },
  // });