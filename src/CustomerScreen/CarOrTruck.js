import React, { useContext, useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    FlatList,
    ImageBackground,
} from "react-native";
import Colors from "../../Constants/Colors";
import CheckBox from "react-native-check-box";
import {
    bookingType,
    changeStack,
    ON_DEMAND,
} from "../Navigation/NavigationService";
import LoadingView from "../Components/LoadingView";
import { BookingContext } from "../Providers/BookingProvider";
import { ERROR, LOADING } from "../Providers";
import { ActivityIndicator } from "react-native";
import { Alert } from "react-native";
import { SafeAreaView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CarOrTruck = ({ navigation }) => {
    const {
        getVehicles,
        vehicles,
        setCurrentBooking,
        currentBooking,
    } = useContext(BookingContext);
    const selectState = useState();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        getVehicles();
        // AsyncStorage.removeItem('current_vendor');
    }, []);

    const onNext = async () => {
        if (!selectState[0])
            Alert.alert("Select Vehicle", "Please select a vehicle to continue.");
        else {
            setCurrentBooking((cv) => ({
                ...cv,
                vehicle_id: selectState[0]?.vehicle_id,
                vehicle: `${selectState[0].make} ${selectState[0].year} ${selectState[0].model}`,
            }));
            AsyncStorage.getItem('currenctAction').then((result) => {
                let res = JSON.parse(result)
              
                if (res == "ON_DEMAND") {
                    navigation.navigate("Packages", {
                        packageParams: { vendor_id: currentBooking?.washer_id },
                    });
                }
                else {
                    navigation.navigate("Select a Vendor")
                    // AsyncStorage.getItem('current_vendor').then(result => {
                    //     let vendor = JSON.parse(result);
                  
                    //     if (vendor == null) {
                    //         navigation.navigate("Select a Vendor")
                    //     }
                    //     else {
                    //         navigation.navigate('Packages', { packageParams: { vendor_id: vendor.id } })
                    //         setCurrentBooking(cv => ({ ...cv, washer_id: vendor.id, washer_details: { ...vendor } }))
                    //     }
                    // })
                };
            })
        }
    };

    const List = ({
        vehicles,
        retry,
        selectState: [selectedVehicle, setSelectedVehicle],
    }) => {
        switch (vehicles) {
            case ERROR:
                return (
                    <View style={{ padding: 20, alignItems: "center" }}>
                        <Text
                            style={{
                                opacity: 0.5,
                                color: "white",
                                fontSize: 20,
                                fontWeight: "bold",
                            }}
                        >
                            Error loading your vehicles
                        </Text>
                        <TouchableOpacity
                            onPress={retry}
                            style={{
                                backgroundColor: Colors.blue_color,
                                padding: 10,
                                borderRadius: 5,
                                margin: 10,
                            }}
                        >
                            <Text
                                style={{
                                    color: "white",
                                    fontSize: 16,
                                    fontWeight: "bold",
                                    marginHorizontal: 10,
                                }}
                            >
                                Retry
                            </Text>
                        </TouchableOpacity>
                    </View>
                );
            case LOADING:
                return (
                    <ActivityIndicator
                        size="large"
                        color={Colors.blue_color}
                        style={{ padding: 20 }}
                    />
                );
            default:
                return (
                   
                    <FlatList
                        keyExtractor={(item, index) => index}
                        style={{ width: "100%" }}
                        data={vehicles}
                        ItemSeparatorComponent={() => <View style={{ margin: -15 }} />}
                        ListFooterComponent={() => <View style={{ height: 200 }} />}
                        renderItem={({ item, index }) => (
                            <RenderItem
                                item={item}
                                onClick={() => {
                                    setSelectedVehicle(item);
                                }}
                                checked={selectedVehicle?.vehicle_id == item.vehicle_id}
                            />
                        )}
                    />
                );
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.blue_color }}>
            <ImageBackground
                style={{ width: "100%", height: "100%", flex: 1 }}
                source={require("../../Assets/bg_img.png")}
            >
                <LoadingView loading={loading}>
                    <View style={{ alignItems: "center", width: "100%" }}>
                        <List
                            vehicles={vehicles}
                            retry={getVehicles}
                            selectState={selectState}
                        />
                    </View>
                </LoadingView>
                <View
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        justifyContent: "flex-end",
                        flex: 1,
                        alignItems: "center",
                    }}
                >
                    <TouchableOpacity
                        elevation={5}
                        onPress={() => {
                            navigation.navigate("Add New Vehicle");
                        }}
                        style={styles.add_btn}
                        underlayColor="gray"
                        activeOpacity={0.8}
                    >
                        <Text
                            style={{
                                fontSize: 15,
                                textAlign: "center",
                                color: Colors.buton_label,
                            }}
                        >
                            + Add New Vehicle
                        </Text>
                    </TouchableOpacity>

                    <Text
                        style={{
                            color: "#fff",
                            fontSize: 17,
                            textAlign: "center",
                            marginHorizontal: 20,
                            marginVertical: 5,
                        }}
                    >
                        Pricing based on loacation{" "}
                    </Text>
                    <Text
                        style={{
                            color: "#fff",
                            fontSize: 17,
                            textAlign: "center",
                            marginHorizontal: 20,
                            marginVertical: 5,
                        }}
                    >
                        and vehicle make/model
                    </Text>

                    <View style={{ alignItems: "center", marginTop: "auto" }}>
                        <View
                            style={{ flexDirection: "row", justifyContent: "space-between" }}
                        >


                            <TouchableOpacity
                                elevation={5}
                                onPress={() => changeStack("CustomerHomeStack")}
                                style={styles.auth_btn}
                                underlayColor="gray"
                                activeOpacity={0.8}
                            >
                                <Text
                                    style={{
                                        fontSize: 16,
                                        textAlign: "center",
                                        color: Colors.buton_label,
                                        fontWeight: "bold",
                                    }}
                                >
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                elevation={5}
                                onPress={onNext}
                                style={styles.auth_btn}
                                underlayColor="gray"
                                activeOpacity={0.8}
                            >
                                <Text
                                    style={{
                                        fontSize: 16,
                                        textAlign: "center",
                                        color: Colors.buton_label,
                                        fontWeight: "bold",
                                    }}
                                >
                                    Next
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
};

export default CarOrTruck;

const RenderItem = ({ item, onClick, checked }) => (
    <TouchableOpacity
        onPress={onClick}
        style={{
            padding: 10,
            flex: 1,
            margin: 20,
            backgroundColor: "#fff",
            borderRadius: 10,
            paddingVertical: 10,
        }}
    >
        <View style={{ flexDirection: "row" }}>
            <View
                style={{
                    overflow: "hidden",
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: "#00000030",
                }}
            >
                <Image
                    style={{
                        height: 60,
                        width: 60,
                        padding: 5,
                        resizeMode: item.image != "undefined" ? "cover" : "contain",
                    }}
                    source={
                        item.image != "undefined"
                            ? { uri: "https://suds-2-u.com/public/vehicle/" + item.image }
                            : require("../../Assets/car_default.png")
                    }
                />
            </View>

            <Text
                style={{ marginHorizontal: 5, fontSize: 18, flex: 1 }}
            >{`${item.make} ${item.year} ${item.model}`}</Text>
            <CheckBox
                style={{ padding: 5, alignSelf: "center", marginLeft: "auto" }}
                onClick={onClick}
                isChecked={checked}
                checkedImage={
                    <Image
                        source={require("../../Assets/icon/checked.png")}
                        style={{ width: 22, height: 22 }}
                    />
                }
                unCheckedImage={
                    <Image
                        source={require("../../Assets/icon/unchecked.png")}
                        style={{ width: 22, height: 22 }}
                    />
                }
            />
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    auth_textInput: {
        alignSelf: "center",
        width: "93%",
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
        flex: 1,
        width: "100%",
        height: 60,
        justifyContent: "center",
    },
    add_btn: {
        backgroundColor: "#e28c39",
        alignItems: "center",
        width: "45%",
        height: 40,
        justifyContent: "center",
        borderRadius: 20,
    },
});
