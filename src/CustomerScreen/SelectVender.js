import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { StyleSheet, Text, View, Image, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { Rating } from 'react-native-elements';
import Colors from '../../Constants/Colors';
import LoadingView from '../Components/LoadingView';
import { changeStack, navigate } from '../Navigation/NavigationService';
import { LOADING, partialProfileUrl } from '../Providers';
import { BookingContext } from '../Providers/BookingProvider';

const SelectVendor = ({ route }) => {

    const { getVendor, setCurrentBooking } = useContext(BookingContext)
    const [fetching, setFetching] = useState(true)
    const [vendors, setVendors] = useState([])

    useEffect(() => getVendorList(), [])

    const getVendorList = async () => {
        setFetching(true)
        let json = await getVendor()
        
        setFetching(false)
        if (json?.data){
            var totaldata = json?.data;
            var newdata =  totaldata.sort((a, b) => parseFloat(a.id) - parseFloat(b.id) );
            var chekid = '';
            var newarray = [];
            for(ne of totaldata)
            {
                if(chekid != ne.id)
                {
                    chekid = ne.id;
                    newarray.push(ne);
                }
            }
            newdata =  newarray.sort((a, b) =>  parseFloat(b.rating)- parseFloat(a.rating)  );
            setVendors(newdata)
        } 
    }



    // const onVendrSelect = (item) => {
    //   navigate('Vender Profile', { ...route.params, packageParams: { vendor_id: item.id } })
    //   setCurrentBooking(cv => ({ ...cv, washer_id: item.id, washer_details: { ...item } }))
    // }

    const onVendrSelect = (item) => {
        AsyncStorage.setItem('current_vendor', JSON.stringify(item))
        navigate('Packages', { ...route.params, packageParams: { vendor_id: item.id } })
        setCurrentBooking(cv => ({ ...cv, washer_id: item.id, washer_details: { ...item } }))
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#eee' }}>
            <LoadingView fetching={fetching} fetchingColor={Colors.blue_color}>
                <FlatList
                    ListFooterComponent={() => <View style={{ height: Platform.OS == "ios" ? 90 : 60 }} />}
                    keyExtractor={(item, i) => i}
                    style={{ height: '100%' }}
                    data={vendors}
                    renderItem={({ item, index }) => <RenderItem item={item} index={index} route={route} onSelect={() => onVendrSelect(item)} />}
                    ItemSeparatorComponent={() => <View style={{ margin: -7.5 }} />} />
            </LoadingView>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', position: 'absolute', bottom: 0 }}>

                <TouchableOpacity
                    elevation={5}
                    onPress={() => changeStack('CustomerHomeStack')}
                    style={styles.auth_btn}
                    underlayColor="gray"
                    activeOpacity={0.8}>
                    <Text style={{ fontSize: 16, textAlign: 'center', color: Colors.buton_label, fontWeight: 'bold' }}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default SelectVendor

const RenderItem = ({ item, onSelect }) => {
    return (
        <TouchableOpacity style={[styles.card]} onPress={onSelect} >
            <Image style={{ width: '100%', height: 180, borderRadius: 5 }} source={{ uri: item.image ? partialProfileUrl + item.image : "https://i.pinimg.com/474x/cb/b4/15/cbb4158c9b17117a2b58fbbcdc99ab14.jpg" }} />
            <View style={{ flexDirection: 'row', marginTop: 15, justifyContent: 'space-evenly', alignSelf: 'flex-start', alignItems: 'center' }}>
                <Text style={{ marginRight: 15, fontSize: 18, color: '#555', fontWeight: 'bold' }}>{item.name}</Text>
                <Rating readonly startingValue={parseFloat(item.rating)} imageSize={20} />
            </View>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        shadowColor: '#555',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 3.5,
        borderRadius: 10,
        elevation: 5,
        margin: 15,
        padding: 15,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    auth_btn: {
        marginTop: 16,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: Colors.buttom_color,
        flex: 1,
        width: '100%',
        height: 60,
        justifyContent: 'center',
    },
})