import React from 'react';
import { StyleSheet, Text, View, Image, StatusBar, TouchableOpacity, TextInput, Button, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Header, Icon, Avatar } from 'react-native-elements';
import Colors from '../../Constants/Colors';
import { ScrollView } from 'react-native';

export default class MyNotificationsScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            licenceNo: '',
            licenceClassification: "",
            issuedOn: '',
            expiredDate: '',
            expire_year: '',
            cvv_no: '',
            password: "",
        }
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <StatusBar translucent backgroundColor='transparent' barStyle='dark-content' />
                <Header
                    statusBarProps={{ barStyle: 'light-content' }}
                    height={78}
                    containerStyle={{ elevation: 0, justifyContent: 'center', borderBottomWidth: 0 }}
                    backgroundColor={Colors.blue_color}
                    placement={"left"}
                    leftComponent={
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Image style={{ width: 25, height: 25, tintColor: '#fff', marginLeft: 10 }} source={require('../../Assets/back_arrow.png')} />

                        </TouchableOpacity>
                    }
                    centerComponent={
                        <Text style={{ width: '100%', color: '#fff', fontWeight: 'bold', fontSize: 18, textAlign: 'center', marginTop: 5, marginLeft: 0, height: 30 }}>UPLOAD DRIVING LICENCE</Text>
                    }
                />


                <ScrollView style={{ flex: 1 }}>
                    <SafeAreaView />
                    <View style={{ width: '100%', backgroundColor: '#DDD', height: 200 }}>


                        <View style={{ justifyContent: 'flex-end', flex: 1, marginVertical: 5 }}>
                            <TouchableOpacity>
                                <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '500', color: '#AAA' }}>TAKE A PHOTO</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ alignItems: 'center', padding: 15 }}>
                        <Text style={{ color: '#000', textAlign: 'left', width: '100%', marginLeft: 17, marginTop: 4, marginBottom: -8 }}>LICENCE NUMBER</Text>

                        <TextInput
                            style={[styles.auth_textInput,]}
                            onChangeText={(licenceNo) => this.setState({ licenceNo })}
                            value={this.state.licenceNo}

                            placeholderTextColor={Colors.text_color}
                            autoCapitalize='none' />
                        <Text style={{ color: '#000', textAlign: 'left', width: '100%', marginLeft: 17, marginTop: 4, marginBottom: -8 }}>LICENCE CLASSIFICATION</Text>

                        <TextInput
                            style={[styles.auth_textInput,]}
                            onChangeText={(licenceClassification) => this.setState({ licenceClassification })}
                            value={this.state.licenceClassification}

                            placeholderTextColor={Colors.text_color}
                            autoCapitalize='none' />
                        <Text style={{ color: '#000', textAlign: 'left', width: '100%', marginLeft: 17, marginTop: 4, marginBottom: -8 }}>ISSUED ON</Text>

                        <TextInput
                            style={[styles.auth_textInput,]}
                            onChangeText={(issuedOn) => this.setState({ issuedOn })}
                            value={this.state.issuedOn}

                            placeholderTextColor={Colors.text_color}
                            autoCapitalize='none' />
                        <Text style={{ color: '#000', textAlign: 'left', width: '100%', marginLeft: 17, marginTop: 4, marginBottom: -8 }}>EXPERED DATE</Text>

                        <TextInput
                            style={[styles.auth_textInput,]}
                            onChangeText={(expiredDate) => this.setState({ expiredDate })}
                            value={this.state.expiredDate}

                            placeholderTextColor={Colors.text_color}
                            autoCapitalize='none' />

                        <TouchableOpacity
                            elevation={5}
                            onPress={() => { this.props.navigation.navigate('CustomerApp'); }}
                            style={styles.auth_btn}
                            underlayColor='gray'
                            activeOpacity={0.8}
                        // disabled={this.state.disableBtn}
                        >
                            <Text style={{ fontSize: 16, textAlign: 'center', color: '#fff', fontWeight: 'bold' }}>CONTINUE </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <SafeAreaView />


            </View>
        );
    }
}

const styles = StyleSheet.create({
    auth_textInput: {

        alignSelf: 'center',
        width: '93%',
        marginLeft: -10,
        borderBottomWidth: 1,
        height: 50,
        color: '#000',
        fontSize: 16

    },
    short_textInput: {

        alignSelf: 'center',
        width: '46%',
        borderWidth: 1,
        backgroundColor: '#FFF',
        borderBottomWidth: 0,
        height: 50,
        color: '#000',
        borderRadius: 25, paddingLeft: 15,
        marginTop: 10,

    },
    auth_btn: {
        marginTop: 16,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: Colors.blue_color,
        borderRadius: 5,
        width: '90%',
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
    },
})

