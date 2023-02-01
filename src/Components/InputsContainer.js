import React from 'react'
import { View, StyleSheet } from 'react-native'

const InputsContainer = ({children})=>(
    <View style={styles.container}>
        {children}
    </View>
)

export default InputsContainer

const styles = StyleSheet.create({
    container:{
        width: '85%',
        backgroundColor: '#fff',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {width: 1, height: 1},
        shadowOpacity: 0.2,
        shadowRadius: 3.5,
        borderRadius: 15,
        elevation: 5,
        padding: 16,
    }
})