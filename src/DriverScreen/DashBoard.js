import React from 'react';
import { StyleSheet, Text, View, Image, StatusBar, TouchableOpacity, TextInput,Button ,FlatList} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Header, Icon, Avatar } from 'react-native-elements';
import Colors from '../../Constants/Colors';
import { ImageBackground } from 'react-native';
import { ScrollView } from 'react-native';

export default class MyNotificationsScreen extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            Data: [
                {
                  name: 'Simmy Rianabbb',
                  date: '22 Jan',
                  dueAmount:'500 Rs',
                  content: 'Quickly embrace installed base architectures with lot of fun and activity users.',
                  image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
                  like: '25',
                  comment: '50',
                },
                {
                  name: 'Simmy Riana',
                  date: '22 Jan',
                  dueAmount:'500 Rs',
                  content: 'Quickly embrace installed base architectures with lot of fun and activity users.',
                  image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
                  like: '25',
                  comment: '50',
                },
                {
                  name: 'David',
                  date: '22 Jan',
                  dueAmount:'500 Rs',
                  content: 'Quickly embrace installed base architectures with lot of fun and activity users.',
                  image: 'https://images.unsplash.com/photo-1520877880798-5ee004e3f11e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
                  like: '25',
                  comment: '50',
                },
                {
                  name: 'Natasha',
                  date: '24 Jan',
                  dueAmount:'500 Rs',
                  content: 'Quickly embrace installed base architectures with lot of fun and activity users.',
                  image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
                  like: '25',
                  comment: '50',
                },
                {
                    name: 'Simmy Rianabbb',
                    date: '22 Jan',
                    dueAmount:'500 Rs',
                    content: 'Quickly embrace installed base architectures with lot of fun and activity users.',
                    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
                    like: '25',
                    comment: '50',
                  },
                  {
                    name: 'Simmy Riana',
                    date: '22 Jan',
                    dueAmount:'500 Rs',
                    content: 'Quickly embrace installed base architectures with lot of fun and activity users.',
                    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
                    like: '25',
                    comment: '50',
                  },
                  {
                    name: 'David',
                    date: '22 Jan',
                    dueAmount:'500 Rs',
                    content: 'Quickly embrace installed base architectures with lot of fun and activity users.',
                    image: 'https://images.unsplash.com/photo-1520877880798-5ee004e3f11e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
                    like: '25',
                    comment: '50',
                  },
                  {
                    name: 'Natasha',
                    date: '24 Jan',
                    dueAmount:'500 Rs',
                    content: 'Quickly embrace installed base architectures with lot of fun and activity users.',
                    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
                    like: '25',
                    comment: '50',
                  },
              ],
            }
          }
    static navigationOptions = {
      
      drawerLabel: 'DashBoard',
      drawerIcon: ({ tintColor }) => (
        <View>
        
    <Image  style={{width:25,height:25,tintColor:'#FFF'}} source={require('../../Assets/home.png')}/> 
    </View>
      ),
    };
  
    renderItem = ({ item, index }) => (
        <View style={{padding:10}}>          
            <Image style={{ height: 110, width: 100, padding: 5, borderRadius: 10,borderColor:'#CCC',borderWidth:1 }} source={{ uri: item.image }} />
        </View>
    )
    

    render() {
      return (
        <View style={{flex:1}}>
                          <StatusBar translucent backgroundColor='transparent' barStyle='light-content' />
  
                          <Header
                    statusBarProps={{ barStyle: 'light-content' }}
                  height={82}
                    containerStyle={{ elevation: 0, justifyContent: 'center', borderBottomWidth: 0 }}
                    backgroundColor={Colors.blue_color}
                    placement={"left"}
                    leftComponent={
                       <TouchableOpacity  onPress={() => {this.props.navigation.openDrawer();}}>
                           <Image style={{width:25,height:25,tintColor:'#fff'}} source={require('../../Assets/menu.png')}/>

                      </TouchableOpacity> 
                    }
                  centerComponent={
                    <Text style={{ width: '100%', color: '#fff', fontWeight:'bold', fontSize:18,textAlign:'center',marginTop:5,marginLeft:0,height:30}}>DASHBOARD</Text>
                }
                />
              
       <View style={{flex:1}}>
         <ScrollView>
       <ImageBackground  blurRadius={5} style={{width:'100%',height:200,}} source={require('../../Assets/background.jpg')}>
       <SafeAreaView/>
<View style={{alignItems:'center',marginTop:5,}}>
<Text style={{color:'#fff',fontSize:22,fontWeight:'bold'}}>Michle Taylor</Text>
<Text style={{color:'#fff',fontSize:16,fontWeight:'700',marginTop:5}}>8753 Main Street, California,USA</Text>
<View style={{width:140,height:30,borderRadius:15,backgroundColor:'yellow',alignItems:'center',justifyContent:'center',marginTop:7}}>
    <Text style={{textAlign:'center',fontWeight:'bold'}}>Booking History</Text>
</View>
</View>
       </ImageBackground>
       <View style={{flexDirection:'row',justifyContent:'space-around'}}> 
      <View>
       <View style={{backgroundColor:'orange',width:40,height:40,borderRadius:20,justifyContent:'center',alignItems:'center',borderColor:'#fff',borderWidth:3,marginTop:-20}}>  
           <Text style={{color:'#fff',fontWeight:'bold'}}>126</Text>
       </View>
       <Text>Job Done</Text>
       </View>
       <View style={{width:90,height:90,borderRadius:45,justifyContent:'center',alignItems:'center',borderColor:'#fff',borderWidth:5,marginTop:-40,}} >
       <Image style={{width:85,height:85,borderRadius:40}} source={require('../../Assets/images.jpeg')}/>
       </View>
     <View>
       <View style={{backgroundColor:'orange',width:40,height:40,borderRadius:20,justifyContent:'center',alignItems:'center',borderColor:'#fff',borderWidth:3,marginTop:-20}}>  
           <Text style={{color:'#fff',fontWeight:'bold'}}>26</Text>
       </View>
       <Text>Review</Text>
       </View>
       </View>
       <View style={{alignItems:'center',width:'100%',}}> 
       <FlatList
       numColumns={3}
            style={{ }}
            showsVerticalScrollIndicator={false}
            data={this.state.Data}
            renderItem={this.renderItem}
          // ListEmptyComponent={this.ListEmpty}
          />
          
       
       </View>
       <SafeAreaView/>
       </ScrollView>
       </View>
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