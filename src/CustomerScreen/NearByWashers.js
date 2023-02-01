import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Colors from '../../Constants/Colors';
import { SafeAreaView } from 'react-native';
import { BookingContext } from '../Providers/BookingProvider'
import { partialProfileUrl } from '../Providers';
import { Alert } from 'react-native';
import { changeStack } from '../Navigation/NavigationService';
import { Avatar } from 'react-native-elements';
import { AuthContext } from '../Providers/AuthProvider';

export default NearbyWashers = ({ route }) => {
    const { getNearByWasherLocations, cancelRequest } = useContext(BookingContext)
    const { userData } = useContext(AuthContext)
    const [nearbyWashers, setNearbyWashers] = useState([])
    const { booking_id } = useMemo(() => route.params, [])

    const onCancelRequest = () => {
        return Alert.alert('Cancel Request', 'Are you sure you want to cancel?',
            [
                {
                    text: 'Ok',
                    onPress: () => cancelRequest({ amount: 0, booking_id }, () => changeStack('CustomerHomeStack'))
                }
            ]
        )
    }

    const mapRef = useRef(null)

    useEffect(() => {
        getNearByWasherLocations((washers, userLocation) => {
            console.log('userLocation..',userLocation)
            setNearbyWashers(washers)
            mapRef.current.animateCamera({ zoom: 15, pitch: 2, heading: 2, altitude: 2, center: { ...userLocation } }, { duration: 1000 })
        }, userLocation => mapRef.current.animateCamera({ zoom: 15, pitch: 2, heading: 2, altitude: 2, center: { ...userLocation } }, { duration: 1000 }))
    }, [])


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <MapView
                ref={mapRef}
                style={{ flex: 1, width: '100%' }}
                initialRegion={{
                    latitude: 29.744503,
                    longitude: -95.362809,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }} >

                {nearbyWashers.map((userData, i) =>
                    <Marker key={i}
                        title={userData.name}
                        coordinate={{ latitude: parseFloat(userData.latitude), longitude: parseFloat(userData.longitude) }}>
                        <Avatar
                            size="medium"
                            rounded
                            avatarStyle={{ borderWidth: 2, borderColor: Colors.blue_color }}
                            title={userData?.name ? userData.name.split(' ').slice(0, 2).map(n => n[0].toUpperCase()).join('') : null}
                            source={userData?.image ? { uri: partialProfileUrl + userData.image } : null}
                            containerStyle={{ marginRight: 16, backgroundColor: Colors.blue_color }}
                            activeOpacity={0.7}
                        />
                    </Marker>
                )}

                <Marker
                    title="You"
                    coordinate={{ latitude: parseFloat(userData.latitude), longitude: parseFloat(userData.longitude) }}>
                    <Avatar
                        size="medium"
                        rounded
                        avatarStyle={{ borderWidth: 2, borderColor: Colors.blue_color }}
                        title={userData?.name ? userData.name.split(' ').slice(0, 2).map(n => n[0].toUpperCase()).join('') : null}
                        source={userData?.image ? { uri: partialProfileUrl + userData.image } : null}
                        containerStyle={{ marginRight: 16, backgroundColor: Colors.blue_color }}
                        activeOpacity={0.7}
                    />
                </Marker>

            </MapView>
            <TouchableOpacity onPress={onCancelRequest} activeOpacity={.5} style={{ position: 'absolute', bottom: 10, right: 10, left: 10, backgroundColor: '#db4c42', elevation: 20, padding: 20, borderRadius: 5, elevation: 5, shadowColor: 'red' }}>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>Cancel Request</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )

}