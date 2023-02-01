import React, { useContext, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, TouchableOpacity, FlatList, Alert } from 'react-native';
import Colors from '../../Constants/Colors';
import { useNavigation } from '@react-navigation/core';
import { ImageBackground } from 'react-native';
import { bookingType, changeStack, navigate, ON_DEMAND } from '../Navigation/NavigationService';
import CheckBox from 'react-native-check-box'
import { PackageContext, PackagesMethod } from '../Providers/PackageProvider';
import LoadingView from '../Components/LoadingView';
import { BookingContext } from '../Providers/BookingProvider';
import { Modal } from 'react-native';

const DEFAULT_PACKAGE_PARAMS = 1

const Packages = ({ route }) => {
    const navigation = useNavigation()
    const { getPackages } = useContext(PackageContext)
    const { setCurrentBooking } = useContext(BookingContext)
    const [fetching, setFetching] = useState(true)
    const [packages, setPackages] = useState([])
    const [selectedPackage, setSelectedPackage] = useState()
    const packageType = useMemo(() => route.params?.packageType ? route.params?.packageType : 'Car or Turck', [route])
    const [focusedPackage, setFocusedPackage] = useState()
    // const packages = useMemo(() => route.params?.packages ? route.params.packages : defaultPackages, [route])
    const packageParams = useMemo(() => route.params?.packageParams ? route.params.packageParams : DEFAULT_PACKAGE_PARAMS, [route])

    const onNext = () => {
        if (selectedPackage == undefined) Alert.alert('Select Package', 'Please select a package to continue.')
        else {
            setCurrentBooking(cv => ({
                ...cv,
                package: packages[selectedPackage].package_id || packages[selectedPackage].id,
                packageDetails: { name: packages[selectedPackage].type || packages[selectedPackage].package_name, price: packages[selectedPackage].package_price || packages[selectedPackage].price }
            }))
            navigate('Select Add Ons')
        }
    }

    useEffect(() => { getPackageList(); return () => setCurrentBooking(cv => ({ ...cv, package: undefined, packageDetails: undefined })) }, [route])

    const getPackageList = async () => {
        if (!packageParams) return
        setFetching(true)
        let json = await getPackages(packageParams)
        setFetching(false)
        if (json?.data) {
            console.log(json?.data)
            setPackages(json.data)
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.blue_color }}>
            {focusedPackage && <DetailPopup dismiss={() => setFocusedPackage(false)} item={focusedPackage} />}
            <ImageBackground style={{ width: '100%', height: '100%', flex: 1, }} source={require('../../Assets/bg_img.png')}>
                <LoadingView fetching={fetching}>
                    <View style={{ padding: 10, backgroundColor: Colors.dark_orange, }}>
                        <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: 18 }}>{packageType}</Text>
                    </View>
                </LoadingView>
                <FlatList
                    keyExtractor={(item) => item.package_id || item.id}
                    style={{ width: '100%', }}
                    data={packages}
                    renderItem={({ item, index }) => <RenderItem item={item} onCheck={() => setSelectedPackage(cv => cv == index ? undefined : index)} checked={selectedPackage == index} focus={() => setFocusedPackage(item)} />}
                    ItemSeparatorComponent={() => <View style={{ marginTop: -10 }} />}
                />

                <View style={{ alignItems: 'center', marginTop: 'auto' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TouchableOpacity
                            elevation={5}
                            onPress={onNext}
                            style={styles.auth_btn}
                            underlayColor='gray'
                            activeOpacity={0.8}>
                            <Text style={{ fontSize: 16, textAlign: 'center', color: Colors.buton_label, fontWeight: 'bold' }}>Next</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            elevation={5}
                            onPress={() => changeStack('CustomerHomeStack')}
                            style={styles.auth_btn}
                            underlayColor='gray'
                            activeOpacity={0.8}>
                            <Text style={{ fontSize: 16, textAlign: 'center', color: Colors.buton_label, fontWeight: 'bold' }}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
}

const RenderItem = ({ item, onCheck, checked, focus }) => {
    return (
        <TouchableOpacity onPress={onCheck} activeOpacity={0.8} style={{ padding: 5, margin: 10, backgroundColor: '#fff', borderRadius: 5, paddingVertical: 10, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
            <View style={{ marginRight: 'auto', width: 30 }} />
            <View style={{ padding: 5, alignItems: 'center' }}>
                <Text style={{ fontSize: 22, fontWeight: 'bold', textAlign: 'center' }}>${parseFloat(item.package_price || item.price).toFixed(2)}</Text>
                <TouchableOpacity onPress={focus} style={{ flexDirection: 'row', marginTop: 5, backgroundColor: Colors.blue_color, justifyContent: 'center', alignItems: 'center', height: 35, borderRadius: 30, paddingHorizontal: 10 }}>
                    <Text style={{ marginHorizontal: 5, fontSize: 16, color: '#fff', fontWeight: 'bold' }}>{item.package_name || item.type}</Text>

                    <Image style={{ height: 20, width: 20, padding: 5, borderRadius: 10, tintColor: '#fff' }} source={require('../../Assets/help.png')} />

                </TouchableOpacity>

                {/* {(item.package_description || item.description) && <Text style={{ marginHorizontal: 5, textAlign: 'center', fontSize: 16, fontWeight: '500', marginTop: 5 }}>{item.package_description || item.description}</Text>} */}

            </View>
            <CheckBox
                style={{ padding: 5, marginLeft: 'auto' }}
                onClick={onCheck}
                isChecked={checked}
                checkedImage={<Image source={require('../../Assets/icon/checked.png')} style={{ width: 22, height: 22 }} />}
                unCheckedImage={<Image source={require('../../Assets/icon/unchecked.png')} style={{ width: 22, height: 22 }} />} />
        </TouchableOpacity>
    )
}

export default Packages
const styles = StyleSheet.create({
    auth_btn: {

        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: Colors.buttom_color,
        flex: 1,
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


const DetailPopup = ({ dismiss, item }) => {
    return (
        <View >
            <Modal
                transparent={true}
                hardwareAccelerated
                statusBarTranslucent
                animationType="fade">
                <TouchableOpacity activeOpacity={1} onPress={dismiss} style={{ flex: 1, backgroundColor: "#00000080", alignItems: 'center', justifyContent: 'center' }} >
                    <View style={{ backgroundColor: 'white', borderRadius: 15, position: 'absolute', marginHorizontal: 75, overflow: 'hidden' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#e5e5e5', padding: 16, width: '100%' }}>
                            <Image style={{ height: 20, width: 20, padding: 5, borderRadius: 10, tintColor: Colors.blue_color }} source={require('../../Assets/help.png')} />
                            <Text style={{ fontSize: 16, paddingHorizontal: 16 }}>{item.package_name || item.type}</Text>
                            <Text style={{ fontWeight: 'bold', fontSize: 16, marginLeft: 'auto' }}>${parseFloat(item.package_price || item.price).toFixed(2)}</Text>
                        </View>
                        <Text style={{ padding: 16 }} >{item.package_description || item.description}</Text>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    )
}
