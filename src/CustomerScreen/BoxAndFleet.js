import React from 'react';
import { StyleSheet, Text, View, SafeAreaView,Image, StatusBar, TouchableOpacity, TextInput,Button,FlatList ,ImageBackground} from 'react-native';

import { Header, Icon, Avatar } from 'react-native-elements';
import Colors from '../../Constants/Colors';
// import CheckBox from 'react-native-check-box'
// import { CheckBox } from 'react-native-elements'

export default class MyNotificationsScreen extends React.Component {
  
  

    constructor(props) {
      super(props);
      this.state = {
        isChecked:'',
        Data: [
        
          {
            name: 'Bronze ',
            date: '22 Jan',
            dueAmount: '500 Rs',
            content: 'Quickly embrace installed base architectures with lot of fun and activity users.',
            image: 'https://images.app.goo.gl/Y2UimVUej9emH5zV6',
            like: '25',
            comment: '50',
          },
          {
            name: 'Silver',
            date: '22 Jan',
            dueAmount: '500 Rs',
            content: 'Quickly embrace installed base architectures with lot of fun and activity users.',
            image: 'https://images.app.goo.gl/Y2UimVUej9emH5zV6',
            like: '25',
            comment: '50',
          },
          {
            name: 'Gold ',
            date: '22 Jan',
            dueAmount: '500 Rs',
            content: 'Quickly embrace installed base architectures with lot of fun and activity users.',
            image: 'https://images.app.goo.gl/Y2UimVUej9emH5zV6',
            like: '25',
            comment: '50',
          },
          {
            name: 'Platinum',
            date: '22 Jan',
            dueAmount: '500 Rs',
            content: 'Quickly embrace installed base architectures with lot of fun and activity users.',
            image: 'https://images.app.goo.gl/Y2UimVUej9emH5zV6',
            like: '25',
            comment: '50',
          },  {
            name: 'Dimand ',
            date: '22 Jan',
            dueAmount: '500 Rs',
            content: 'Quickly embrace installed base architectures with lot of fun and activity users.',
            image: 'https://images.app.goo.gl/Y2UimVUej9emH5zV6',
            like: '25',
            comment: '50',
          },
       
        ],
      }
    }
  

    renderItem = ({ item, index }) => (
      <View style={{flex:1}}>
      <View style={{ padding: 5 ,flex:1,margin:10,backgroundColor:'#fff',borderRadius:5,paddingVertical:10,justifyContent:'center',alignItems:'center',}}>
  <View style={{padding:5,alignItems:'center'}}>
<Text style={{fontSize:22,fontWeight:'bold',textAlign:'center'}}>$28.00</Text>
  <View style={{flexDirection:'row',marginTop:5,backgroundColor:Colors.blue_color,width:160,justifyContent:'center',alignItems:'center',height:35,borderRadius:15}}>
    <Text style={{marginHorizontal:5,fontSize:16,color:'#fff',fontWeight:'bold'}}>{item.name}</Text>

    <Image style={{ height: 20, width: 20, padding: 5, borderRadius: 10,tintColor:'#fff'}} source={require('../../Assets/help.png') } />

  </View>

    <Text style={{marginHorizontal:5,textAlign:'center',fontSize:16,fontWeight:'500',marginTop:5}}>Estimates Wash Duration 30 Mins</Text>
  </View>
  </View>
      </View>
    )
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
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('BookWasher_Now') }}>
                        <Image style={{ width: 25, height: 25, tintColor: '#fff', marginLeft: 10 }} source={require('../../Assets/back_arrow.png')} />
                 </TouchableOpacity> 
                    }
                  centerComponent={
                    <Text style={{ width: '100%', color: '#fff', fontWeight:'bold', fontSize:18,textAlign:'center',marginTop:5,marginLeft:0,height:30}}>SELECT PACKAGE</Text>
                }
                /> */}
                   <ImageBackground style={{width:'100%',height:'100%',flex:1, }} source={require('../../Assets/bg_img.png')}>
                <SafeAreaView/>
                <View style={{alignItems:'center',width:'100%',flex:1,height:'100%'}}> 
                <View style={{backgroundColor:'#e28c39',height:45,width:'100%',justifyContent:'center'}}>
                    <Text style={{fontSize:17,color:'#fff',fontWeight:'700',textAlign:'center'}}>Dodge Ram 3500 Truck (No Duallys)</Text>
                </View>
     
     <View style={{flex:1,height:'100%',width:'100%'}}>
       <FlatList
      
            style={{ flex:1,width:'100%',height:'100%'}}
            // showsVerticalScrollIndicator={false}
            data={this.state.Data}
            renderItem={this.renderItem}
          // ListEmptyComponent={this.ListEmpty}
          />
          
       
     
       <View style={{justifyContent:'flex-end',}}>
 
                        <TouchableOpacity
                            elevation={5}
                            onPress={() => {navigation.navigate('Select Add Ons'); }}
                            style={styles.auth_btn}
                            underlayColor='gray'
                            activeOpacity={0.8}
                        // disabled={this.state.disableBtn}
                        >
                            <Text style={{ fontSize: 16, textAlign: 'center', color: Colors.buton_label,fontWeight:'bold'}}>Next</Text>
                         
                        </TouchableOpacity>
                       
                        </View>  
                        </View>
                        </View>
       </ImageBackground>
        </View>
      );
    }
  }
  
  const styles = StyleSheet.create({
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
        marginTop: 16,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: Colors.buttom_color,
    
        width: '100%',
        height: 60,
        justifyContent: 'center',
    },
    add_btn: {
      
      backgroundColor:'#e28c39',
  alignItems:'center',
      width: '45%',
      height: 40,
      justifyContent: 'center',borderRadius:20
  },
})