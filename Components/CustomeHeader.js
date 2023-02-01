import React, { Component } from 'react';
import { View, Image, TouchableOpacity, StatusBar, StyleSheet ,Text} from 'react-native';
import { Header, Icon, Avatar } from 'react-native-elements';
import Colors from '../Constants/Colors';
// import Helper from '../Utils/helper';


// const perfectSize = create(PREDEF_RES.iphoneX.dp);
// const perfectSize = Helper.perfectSize;

class MoreHeader extends Component {
 
    render() {
        const { height, title, disableNotification, backEnable, onBackPress, navigation,disableShoppingCart } = this.props;
        return (
    <View style={{backgroundColor:Colors.background_color}}>
                <Header
                    statusBarProps={{ barStyle: 'dark-content' }}
                    barStyle="dark-content" // or directly
                    height={79}
                    containerStyle={{ elevation: 0, justifyContent: 'center', borderBottomWidth: 0 }}
                    backgroundColor={"transparent"}
                    placement={"left"}
                    leftComponent={
                       <TouchableOpacity   onPress={() => {} }>
                           <Image style={{width:25,height:25,tintColor:'#fff'}} source={require('../Assets/back_arrow.png')}/>

                     
                       </TouchableOpacity> 
                    }
                    // leftComponent={backEnable ? <Icon name='arrow-left' type="simple-line-icon" activeOpacity={1} iconStyle={{ padding: 10 }} containerStyle={{ padding: 10,marginLeft:12, }}   size={30}  /> : <Icon name='arrow-left' type="simple-line-icon" color='black' underlayColor='transparent' size={30} iconStyle={{ padding: 10,marginLeft:8, }} onPress={() => { 
                      
                      
                    //     if(onBackPress){
                      
                    //         navigation && this.props.navigation.goBack() 
                    //     }else{
                    //         // alert('f')
                    //         navigation && this.props.navigation.goBack() 
                    //     }
                        
                    // }} />}

                    // centerComponent={{text:title?title:'MORE', style: { width: '100%', color: '#FFF', fontFamily: Fonts.Font_Bold,fontWeight:'bold', fontSize:21,backgroundColor:'red',textAlign:'center'} }}
                    centerComponent={
                        // <Image style={{ width: '100%', height:40,marginLeft:-12,marginTop:5}} source={require('../../assets/fitrixSingle.jpg')} resizeMode='contain' />
                    <Text style={{ width: '100%', color: '#fff', fontWeight:'bold', fontSize:18,textAlign:'center',marginTop:5,marginLeft:0,height:30}}>{this.props.title}</Text>
                }
                   
                />
                {/* <View style={{ height: height ? height : 1,backgroundColor: '#ABABAB',opacity:1}} /> */}
                </View>
        )
    }
}
class DrawerHeader extends Component {
    static navigationOptions = {
        header: null,
      };
    render() {
        const { height, title, disableNotification, backEnable, onBackPress, navigation,disableShoppingCart } = this.props;
        return (
    <View style={{backgroundColor:Colors.background_color}}>
                <Header
                    statusBarProps={{ barStyle: 'dark-content' }}
                    barStyle="dark-content" // or directly
                    height={82}
                    containerStyle={{ elevation: 0, justifyContent: 'center', borderBottomWidth: 0 }}
                    backgroundColor={"transparent"}
                    placement={"left"}
                    leftComponent={
                       <TouchableOpacity  onPress={() => this.props.drawerOpen()}>
                           <Image style={{width:25,height:25,tintColor:'#fff'}} source={require('../Assets/menu.png')}/>

                     
                       </TouchableOpacity> 
                    }
                  centerComponent={
                        // <Image style={{ width: '100%', height:40,marginLeft:-12,marginTop:5}} source={require('../../assets/fitrixSingle.jpg')} resizeMode='contain' />
                    <Text style={{ width: '100%', color: '#fff', fontWeight:'bold', fontSize:18,textAlign:'center',marginTop:5,marginLeft:0,height:30}}>{this.props.title}</Text>
                }
                   
                />
                {/* <View style={{ height: height ? height : 1,backgroundColor: '#ABABAB',opacity:1}} /> */}
                </View>
        )
    }
}
export { MoreHeader,DrawerHeader}