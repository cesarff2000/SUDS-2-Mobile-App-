import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import Colors from '../../Constants/Colors';
import CheckBox from 'react-native-check-box'

const TractorTrailors = ({ navigation }) => {
    const [types, setTypes] = useState([
        {
            category_name: 'BIG RIGS',
            checked: true,
        },
        {
            category_name: 'VACUM/CEMENT',
            checked: false,
        },
        {
            category_name: 'BOX & FLEET',
            checked: false,
        }
    ])

    const onCheck = (i) => {
        setTypes(items => {
            items.splice(i, 1, { ...items[i], checked: !items[i].checked })
            return [...items]
        });
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <FlatList
                keyExtractor={(item) => item.category_name}
                style={{ width: '100%' }}
                data={types}
                renderItem={({ item, index }) => <RenderItem item={item} onCheck={() => onCheck(index)} />}
                ItemSeparatorComponent={() => <View style={{ marginTop: -15 }} />}
            />
            <View style={{ alignItems: 'center', marginTop: 'auto' }}>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity
                        elevation={5}
                        onPress={() => { navigation.navigate('Select a Vender'); }}
                        style={styles.auth_btn}
                        underlayColor='gray'
                        activeOpacity={0.8}>
                        <Text style={{ fontSize: 16, textAlign: 'center', color: Colors.buton_label, fontWeight: 'bold' }}>Continue</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        elevation={5}
                        onPress={() => { navigation.navigate('Booking Review'); }}
                        style={styles.auth_btn}
                        underlayColor='gray'
                        activeOpacity={0.8}>
                        <Text style={{ fontSize: 16, textAlign: 'center', color: Colors.buton_label, fontWeight: 'bold' }}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const RenderItem = ({ item, onCheck }) => {
    return (
        <TouchableOpacity onPress={item.onPress} style={styles.card} >

            <Text style={{ fontSize: 16, color: '#000', fontWeight: 'bold' }}>{item.category_name}</Text>
            <CheckBox
                style={{}}
                onClick={onCheck}
                isChecked={item.checked}
                checkedImage={<Image source={require('../../Assets/icon/checked.png')} style={{ width: 22, height: 22, tintColor: Colors.blue_color }} />}
                unCheckedImage={<Image source={require('../../Assets/icon/unchecked.png')} style={{ width: 22, height: 22, tintColor: Colors.blue_color }} />}
            />
        </TouchableOpacity>
    )
}

export default TractorTrailors
const styles = StyleSheet.create({
    auth_btn: {

        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: Colors.buttom_color,

        width: '50%',
        height: 65,
        justifyContent: 'center',
    },
    card: {
        backgroundColor: '#fff',
        alignItems: 'center',
        shadowColor: '#555',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 3.5,
        borderRadius: 10,
        elevation: 5,
        margin: 15,
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
})


const Data = [
    {
        category_id: 1,
        category_name: 'BIG RIGS'
    }, {
        category_id: 2,
        category_name: 'VACUM/CEMENT'
    },
    {
        category_id: 3,
        category_name: 'BOX & FLEET'
    }
]