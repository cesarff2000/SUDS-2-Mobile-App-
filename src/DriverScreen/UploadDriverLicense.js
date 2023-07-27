import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView } from "react-native";
import { Image, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import Colors from "../../Constants/Colors";
import ControllerInput from "../Components/ControllerInput";
import CustomInput from "../Components/CustomInput";
import LoadingView from "../Components/LoadingView";
import { AuthContext } from "../Providers/AuthProvider";
import { launchImageLibrary } from "react-native-image-picker";
import { Icon } from "react-native-elements";
import DatePicker from "react-native-date-picker";
import moment from "moment";
import { SafeAreaView } from "react-native";
import { Modal } from "react-native";

const partialImageUrl = "https://suds-2-u.com/public/document/";

const UploadDriverLicense = ({ navigation, route }) => {
    const { updateDrivingLicense, getDrivingLicenseDetails } = useContext(
        AuthContext
    );
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [selectedImage, setSelectedImage] = useState();

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const onSubmit = async (data) => {
        console.log(JSON.stringify(data, null, 2));
        setLoading(true);
        let success = await updateDrivingLicense({
            ...data,
            issued_on: moment(issuedOn).format("YYYY-MM-DD"),
            expiry_date: moment(expirationDate).format("YYYY-MM-DD"),
            image: selectedImage,
        });
        // if (success) await documentVerified()
        if (success)
            route.params?.authStack ? navigation.goBack() : navigation.goBack();
        setLoading(false);
    };

    useEffect(() => {
        if (route.params?.authStack) {
            setFetching(false);
            return;
        } // Dont try to get user license data if it is on the auth stack
        setFetching(true);
        getDrivingLicenseDetails()
            .then((json) => {
                setFetching(false);
                if (json?.data?.license_image)
                    setSelectedImage({ uri: partialImageUrl + json.data.license_image });
                if (json) {
                    setIssuedOn(new Date(json.data.issued_on));
                    setExpirationDate(new Date(json.data.expiry_date));
                    reset(json.data);
                }
            })
            .catch((e) => console.log("E", e));
    }, []);

    const imageSelectCallBack = (res) => {
        if (res.didCancel) return;
        console.log(res?.assets);
        setSelectedImage(res?.assets[0]);
    };

    const [issuedOn, setIssuedOn] = useState();
    const [issuedOnPickerVisible, setIssuedOnPickerVisibility] = useState(false);

    const [expirationDate, setExpirationDate] = useState();
    const [
        expirationDatePickerVisible,
        setExpirationDatePickerVisibility,
    ] = useState(false);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, backgroundColor: "white" }}
                keyboardShouldPersistTaps="handled"
            >
                {issuedOnPickerVisible && (
                    <DateModal
                        value={issuedOn}
                        confirm={setIssuedOn}
                        dismiss={() => setIssuedOnPickerVisibility(false)}
                    />
                )}
                {expirationDatePickerVisible && (
                    <DateModal
                        value={expirationDate}
                        confirm={setExpirationDate}
                        dismiss={() => setExpirationDatePickerVisibility(false)}
                    />
                )}
                <LoadingView
                    loading={loading}
                    fetchingColor={Colors.blue_color}
                    fetching={fetching}
                >
                    <View
                        style={{
                            height: 250,
                            width: "100%",
                            backgroundColor: "#eee",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        {selectedImage ? (
                            <View
                                style={{
                                    flex: 1,
                                    height: 250,
                                    width: "100%",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Image
                                    style={{ height: 250, width: "100%", resizeMode: "cover" }}
                                    source={
                                        selectedImage
                                            ? selectedImage
                                            : {
                                                uri:
                                                    "https://image.flaticon.com/icons/png/512/1655/1655290.png",
                                            }
                                    }
                                />
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={() => launchImageLibrary({}, imageSelectCallBack)}
                                    style={{
                                        borderRadius: 100,
                                        height: 150,
                                        width: 150,
                                        backgroundColor: "#00000050",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        position: "absolute",
                                        opacity: 0.8,
                                    }}
                                >
                                    <Icon color="white" size={50} name="autorenew" />
                                    <Text
                                        style={{
                                            color: "white",
                                            textAlign: "center",
                                            fontSize: 14,
                                        }}
                                    >
                                        Change the photo
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => launchImageLibrary({}, imageSelectCallBack)}
                                style={{
                                    borderRadius: 100,
                                    height: 150,
                                    width: 150,
                                    backgroundColor: "white",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    elevation: 10,
                                    shadowColor: "#555",
                                }}
                            >
                                <Icon color="#aaa" size={50} name="add" />
                                <Text
                                    style={{ color: "#aaa", textAlign: "center", fontSize: 14 }}
                                >
                                    Add a photo
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: "#FFF",
                            alignItems: "center",
                            paddingTop: 16,
                        }}
                    >
                        <ControllerInput
                            label="LICENSE NUMBER"
                            control={control}
                            errors={errors}
                            rules={{ required: true }}
                            fieldName="license_number"
                            keyboardType="numeric"
                        />
                        <ControllerInput
                            label="LICENSE CLASSIFICATION"
                            control={control}
                            errors={errors}
                            rules={{ required: true }}
                            fieldName="license_classification"
                        />
                        <View style={{ width: "90%", paddingHorizontal: 2 }}>
                            <Text
                                style={{
                                    color: "#999",
                                    textAlign: "left",
                                    width: "100%",
                                    marginTop: 4,
                                }}
                            >
                                ISSUED ON
                            </Text>
                            <TouchableOpacity
                                onPress={() => setIssuedOnPickerVisibility(true)}
                                style={{
                                    padding: 8,
                                    paddingHorizontal: 0,
                                    borderBottomWidth: 1,
                                    borderBottomColor: "#ddd",
                                }}
                            >
                                <Text
                                    style={{ fontSize: 16, color: issuedOn ? "black" : "#999" }}
                                >
                                    {issuedOn ? issuedOn.toDateString() : "- - - - / - - / - -"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: "90%", paddingHorizontal: 2 }}>
                            <Text
                                style={{
                                    color: "#999",
                                    textAlign: "left",
                                    width: "100%",
                                    marginTop: 4,
                                }}
                            >
                                EXPIRATION DATE
                            </Text>
                            <TouchableOpacity
                                onPress={() => setExpirationDatePickerVisibility(true)}
                                style={{
                                    padding: 8,
                                    paddingHorizontal: 0,
                                    borderBottomWidth: 1,
                                    borderBottomColor: "#ddd",
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 16,
                                        color: expirationDate ? "black" : "#999",
                                    }}
                                >
                                    {expirationDate
                                        ? expirationDate.toDateString()
                                        : "- - - - / - - / - -"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <CardBtn
                            onPress={handleSubmit(onSubmit)}
                            isFromAuthStack={route.params.authStack}
                            navigation={navigation}
                        />
                    </View>
                </LoadingView>
            </ScrollView>
        </SafeAreaView>
    );
};

export default UploadDriverLicense;
const CardBtn = ({ isFromAuthStack, onPress }) => (
    <TouchableOpacity
        onPress={onPress}
        style={[styles.card, { backgroundColor: Colors.blue_color, padding: 16 }]}
    >
        <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
            {"DONE"}
        </Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    card: {
        width: "90%",
        backgroundColor: "#fff",
        alignItems: "center",
        shadowColor: "#999",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 3.5,
        borderRadius: 3,
        elevation: 5,
        marginTop: 40,
        marginBottom: 12,
    },
});

const DateModal = ({ dismiss, confirm, value, initialDate }) => {
    const [date, setDate] = useState(value || initialDate || new Date());

    const onConfirm = () => {
        confirm(date);
        dismiss();
    };
    return (
        <View>
            <Modal
                transparent={true}
                hardwareAccelerated
                statusBarTranslucent
                animationType="fade"
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={dismiss}
                    style={{
                        flex: 1,
                        backgroundColor: "#00000080",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <View
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "white",
                            borderRadius: 15,
                            padding: 10,
                            position: "absolute",
                        }}
                    >
                        <DatePicker
                            androidVariant="nativeAndroid"
                            mode="date"
                            date={date}
                            onDateChange={setDate}
                            style={{ width: 250 }}
                        />
                        <View style={{ flexDirection: "row" }}>
                            <TouchableOpacity
                                onPress={dismiss}
                                style={{
                                    padding: 10,
                                    borderRadius: 5,
                                    flex: 1,
                                    borderWidth: 2,
                                    borderColor: Colors.privacypolicy_headingcolor + "50",
                                }}
                            >
                                <Text
                                    style={{
                                        // fontFamily: "Montserrat-SemiBold",
                                        textAlign: "center",
                                    }}
                                >
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                            <View style={{ width: 10 }} />
                            <TouchableOpacity
                                onPress={onConfirm}
                                style={{
                                    backgroundColor: Colors.blue_color,
                                    padding: 10,
                                    borderRadius: 5,
                                    flex: 1,
                                }}
                            >
                                <Text
                                    style={{
                                        // fontFamily: "Montserrat-SemiBold",
                                        textAlign: "center",
                                        color: "white",
                                    }}
                                >
                                    Confirm
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};
