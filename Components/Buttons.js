import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { Button, ButtonGroup } from 'react-native-elements';

import Colors from '../Constants/Colors';


// const perfectSize = Helper.perfectSize;


class SubmitButton extends React.Component {
    render() {

        const { containerStyle, color, buttonStyle, textColor, disable, ...otherProps } = this.props

        return (
            <Button
                transparent
                containerStyle={[styles.auth_btn, ]}
                // onLongPress={backgroundColo='#fff'}
                buttonStyle={[disable ? styles.auth_btn : styles.auth_btn, buttonStyle]}
                // ViewComponent={LinearGradient}
                // // activeOpacity={1}
                // linearGradientProps={{
                //     colors: color?color:['#34d3fc', '#34d3fc'],
                //     start: { x: 0, y: 0.5 },
                //     end: { x: 1, y: 0.5 },
                //     backgroundColor: '#fff'

                // }}
                disabled={disable}
                titleProps={{numberOfLines:2}}
                disabledTitleStyle={{
                    fontSize: 18,                    color: textColor ? textColor : '#fff',
                  
                }}
                titleStyle={{
                    fontSize:18,
                    color: textColor ? textColor : '#fff',
                  
                }}
                {...otherProps}
            />
        );
    }
}

class SubmitButton2 extends React.Component {
    render() {

        const { containerStyle, color, buttonStyle, textColor, disable, ...otherProps } = this.props

        return (
            <Button
                transparent
                containerStyle={[styles.container, containerStyle]}
                // onLongPress={backgroundColo='#fff'}
                buttonStyle={[disable ? styles.inactiveButton : styles.activeButton, buttonStyle]}
                // ViewComponent={LinearGradient}
                // // activeOpacity={1}
                // linearGradientProps={{
                //     colors: color?color:['#34d3fc', '#34d3fc'],
                //     start: { x: 0, y: 0.5 },
                //     end: { x: 1, y: 0.5 },
                //     backgroundColor: '#fff'

                // }}
                disabled={disable}
                titleProps={{numberOfLines:2}}
                disabledTitleStyle={{
                    fontSize:18,
                    color: textColor ? textColor : '#fff',
                
                }}
                titleStyle={{
                    fontSize:18,
                    color: textColor ? textColor : '#fff',
                 
                }}
                {...otherProps}
            />
        );
    }
}
const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginTop: 15,
        marginBottom: 15,
        borderRadius: 25,
        overflow: 'hidden'
    },
    container2: {
        // width: '100%',
        flex: 1,
        marginTop: 20,
        marginBottom: 15
    },
    activeButton: {
        width: '100%',
        height: 50,
        borderRadius: 25,
        backgroundColor: '#23D2FF',
    },

    greenButton: {
        width: '100%',
        height: 50,
        borderRadius: 25,
        backgroundColor: '#0AD989',
    },

    inactiveButton: {
        width: '100%',
        height: 50,
        borderRadius: 25,
        // backgroundColor: '#ccc',
    },
    auth_btn: {
        marginTop: 16,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: Colors.buttom_color,
        borderRadius: 5,
        width: '100%',
        height: 50,
        justifyContent: 'center',
    },
})
export  { SubmitButton,SubmitButton2  }