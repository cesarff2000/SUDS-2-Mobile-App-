import React from 'react';
import {StyleSheet, View, Image, ImageBackground} from 'react-native';
import CustomInput from '../Components/CustomInput';
import CtaButton from '../Components/CtaButton';
import CustomHeader from '../Components/CustomHeader';

export default class MyNotificationsScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }
  render() {
    const { navigation } = this.props;
    return (
      <View style={{flex: 1}}>
        {/* <CustomHeader title="CHANGE PASSWORD" onLeftButtonPress={() => this.props.navigation.openDrawer()} leftIconSource={require('../../Assets/menu.png')} /> */}
        <View style={{flex: 1}}>
          <ImageBackground style={{width: '100%', height: '100%', flex: 1, justifyContent:'space-evenly'}} source={require('../../Assets/imageBG.png')}>
            <Image style={{width:200, height:200, tintColor:'#fff', alignSelf:'center'}} source={require('../../Assets/padlock.png')}/>
            <View style={{justifyContent: 'flex-end',paddingBottom:100, paddingHorizontal: 21, alignItems: 'center'}}>
              <View style={styles.inputs_container}>
                <CustomInput secure label="OLD PASSWORD" iconSource={require(`../../Assets/icon/password.png`)} setState={({text}) => this.setState({password: text})} state={this.state.password} />
                <CustomInput secure label="NEW PASSWORD" iconSource={require(`../../Assets/icon/password.png`)} setState={({text}) => this.setState({password: text})} state={this.state.password} />
                <CustomInput secure label="CONFIRM PASSWORD" iconSource={require(`../../Assets/icon/password.png`)} setState={({text}) => this.setState({password: text})} state={this.state.password} />

                <CtaButton title="Submit" primary onPress={() => {}} />
              </View>
            </View>
          </ImageBackground>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputs_container: {
    width: '90%',
    paddingVertical: 16,
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 3.5,
    elevation:5,
    borderRadius: 15,
  },
});
